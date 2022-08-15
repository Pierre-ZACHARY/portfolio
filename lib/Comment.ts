import Date from "../stories/components/NextjsExample/Date/date";
import {collection, DocumentData, DocumentReference, onSnapshot, QueryDocumentSnapshot} from "@firebase/firestore";


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
    ref: DocumentReference;
    constructor(doc: QueryDocumentSnapshot<DocumentData>){
        this.attachments = [];
        this.replies = [];
        this.id = doc.id;
        this.avatar = doc.data().avatar;
        this.content = doc.data().content;
        this.username = doc.data().username;
        this.datetime = doc.data().datetime.toDate();
        this.upvotes = doc.data().upvotes;
        this.ref = doc.ref;
        onSnapshot(collection(doc.ref, "replies"), (collection) => {
            this.replies = [];
            collection.docs.forEach((doc) => {
                this.replies.push(new Comment(doc));
            });
        });
        onSnapshot(collection(doc.ref, "attachments"), (collection) => {
            this.attachments = [];
            collection.docs.forEach((doc) => {
                this.attachments.push({url: doc.data().url, id: doc.id, parent: this});
            });
        });
    }
}