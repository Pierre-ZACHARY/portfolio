import Date from "../stories/components/NextjsExample/Date/date";
import {
    collection,
    DocumentData,
    DocumentReference,
    onSnapshot,
    QueryDocumentSnapshot,
    doc, setDoc
} from "@firebase/firestore";
import {db} from "../pages/_app";
import {getAuth} from "@firebase/auth";
import {remark} from "remark";
import html from "remark-html";


interface Attachments{
    id: string,
    parent: Comment | undefined,
    url: string
}

interface UpvoteHashMap{
    [uid: string]: number,
}

export class Comment{
    attachments: Attachments[];
    avatar: string;
    datetime: Date;
    id: string;
    contentMk: string;
    contentHtml: string;
    upvotes: UpvoteHashMap;
    replies: Comment[];
    username: string;
    userid: string;
    totalUpvotes: number;
    docRef: DocumentReference;
    onUpdated: Map<number, Function>;

    constructor(snap: QueryDocumentSnapshot<DocumentData>, ){
        this.attachments = [];
        this.replies = [];
        this.id = snap.id;
        this.onUpdated = new Map<number, Function>();
        this.avatar = "";
        this.contentMk = snap.data().content;
        this.contentHtml = "";
        remark().use(html).process(this.contentMk).then((contentHtml)=>{
            this.contentHtml = contentHtml.toString();
            if(this.onUpdated) this.onUpdated.forEach((f)=>f());
        })
        this.username = "";
        this.userid = snap.data().userid;
        this.datetime = snap.data().datetime.toDate();
        this.upvotes = {};
        this.totalUpvotes = 0;
        this.docRef = snap.ref;
        onSnapshot(collection(snap.ref, "replies"), (collection) => {
            this.replies = [];
            collection.docs.forEach((doc) => {
                this.replies.push(new Comment(doc));
            });
            this.onUpdated.forEach((v, k)=>v());
        });
        onSnapshot(collection(snap.ref, "attachments"), (collection) => {
            this.attachments = [];
            collection.docs.forEach((doc) => {
                this.attachments.push({url: doc.data().url, id: doc.id, parent: this});
            });
            this.onUpdated.forEach((v, k)=>v());
        });
        onSnapshot(collection(snap.ref, "upvotes"), (collection) => {
            this.upvotes = {};
            let total = 0;
            collection.docs.forEach((doc) => {
                this.upvotes[doc.id] = doc.data().value
                total+=doc.data().value;
            });
            this.totalUpvotes = total;
            this.onUpdated.forEach((v, k)=>v());
        });
        onSnapshot(doc(db, "users", this.userid), (doc) => {
            if(doc && doc.data()){
                this.avatar = doc.data()!.avatarUrl;
                this.username = doc.data()!.username;
                this.onUpdated.forEach((v, k)=>v());
            }
        });
    }

    currentUserVote(value: number, callback: Function | undefined = undefined){
        const auth = getAuth();
        if(auth.currentUser){
            const uid = auth.currentUser.uid;
            const upvoteRef = doc(this.docRef, "upvotes", uid);
            setDoc(upvoteRef, {
                value: value
            }).then(
                ()=>{
                    if(callback) callback(value);
                }
            )
        }
    }

    subscribe(callback: Function): Function{
        let id = this.onUpdated.size
        this.onUpdated.set(id, callback);
        return ()=>{this.onUpdated.delete(id)}
    }

    currentUserValue(): number{
        const auth = getAuth();
        if(auth.currentUser){
            const uid = auth.currentUser.uid;
            return this.upvotes[uid] ?? 0;
        }
        return 0
    }
}