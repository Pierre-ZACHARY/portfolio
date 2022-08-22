import {DocumentData, DocumentReference, DocumentSnapshot} from "@firebase/firestore";

export default class UserInfo{
    username: string;
    avatarUrl: string;
    ref: DocumentReference<DocumentData>;

    constructor(doc: DocumentSnapshot<DocumentData>) {
        this.username = doc.data()!.username ?? "Username";
        this.avatarUrl = doc.data()!.avatarUrl;
        this.ref = doc.ref;
    }
}