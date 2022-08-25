import Date from "../stories/components/NextjsExample/Date/date";
import {
    collection,
    DocumentData,
    DocumentReference,
    onSnapshot,
    QueryDocumentSnapshot,
    doc
} from "@firebase/firestore";
import {db} from "../pages/_app";


interface Attachments{
    id: string,
    parent: Comment | undefined,
    url: string
}


export class Comment{
    attachments: Attachments[];
    avatar: string;
    datetime: Date;
    id: string;
    content: string;
    upvotes: number;
    replies: Comment[];
    username: string;
    userid: string;
    ref: DocumentReference;
    constructor(snap: QueryDocumentSnapshot<DocumentData>){
        this.attachments = [];
        this.replies = [];
        this.id = snap.id;
        this.avatar = "";
        this.content = snap.data().content;
        this.username = "";
        this.userid = snap.data().userid;
        this.datetime = snap.data().datetime.toDate();
        this.upvotes = snap.data().upvotes;
        this.ref = snap.ref;
        onSnapshot(collection(snap.ref, "replies"), (collection) => {
            this.replies = [];
            collection.docs.forEach((doc) => {
                this.replies.push(new Comment(doc));
            });
        });
        onSnapshot(collection(snap.ref, "attachments"), (collection) => {
            this.attachments = [];
            collection.docs.forEach((doc) => {
                this.attachments.push({url: doc.data().url, id: doc.id, parent: this});
            });
        });
        onSnapshot(doc(db, "users", this.userid), (doc) => {
            if(doc && doc.data()){
                this.avatar = doc.data()!.avatarUrl;
                this.username = doc.data()!.username;
            }
        });
    }
}