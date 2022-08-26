import {doc, DocumentData, DocumentReference, DocumentSnapshot, setDoc} from "@firebase/firestore";
import {getAuth, User} from "@firebase/auth";
import {db} from "../pages/_app";
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from "@firebase/storage";
import axios, {Axios, AxiosResponse} from "axios";

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

export const createUserInfo = (user: User) => {

    setDoc(doc(db, "users", user.uid), {
        username: user.displayName ?? (user.email?.split("@")[0] ?? "User"),
        avatarUrl: null,
    }).then((response) =>{
        const auth = getAuth();
        if(!auth.currentUser) return;
        if(user.photoURL){
            axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
            axios({
                method: 'get',
                url: user.photoURL, // blob url eg. blob:http://127.0.0.1:8000/e89c5d87-a634-4540-974c-30dc476825cc
                responseType: 'blob'
            }).then(function(response1: AxiosResponse<Blob>){
                const blob = response1.data;
                const storage = getStorage();
                const storageRef = ref(storage, 'avatar/'+user.uid+"avatar."+blob.type.replaceAll("image/", ""));
                const metadata = {
                    contentType: blob.type,
                    uid: auth.currentUser?.uid,
                    date: new Date().toUTCString()
                };
                const task = uploadBytes(storageRef, blob, metadata);

                task.then(
                    ()=>{
                        getDownloadURL(storageRef).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            setDoc(doc(db, "users", user.uid), {
                                avatarUrl: downloadURL,
                            }, {merge: true}).then((response1) =>{
                                console.log(response1);
                            }).catch( (error)=>{
                                console.log(error);
                            });
                        });

                    }
                );

            });
        }
    }).catch( (error)=>{
        console.log(error);
    });
}