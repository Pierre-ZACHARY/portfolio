import React, {FormEvent, useEffect, useRef, useState} from "react";
import {useEffectOnce} from "../../../../../lib/utils";
import {
    getAuth,
    onAuthStateChanged,
    updateProfile,
    User,
    signOut,
    reauthenticateWithCredential,
    EmailAuthProvider,
    ProviderId, updatePassword, updateEmail, deleteUser, AuthCredential, OAuthCredential
} from "@firebase/auth";
import styles from "./ProfilScreen.module.sass"
import {motion, PanInfo} from "framer-motion";
import {useTranslation} from "next-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft, faCheck,
    faChevronRight, faLock, faLockOpen,
    faPencil,
    faPenToSquare, faSpinner,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import {DocumentData, DocumentReference, onSnapshot, doc, DocumentSnapshot, setDoc} from "@firebase/firestore";
import {db} from "../../../../../pages/_app";
import Image from "next/image";
import axios, { AxiosRequestConfig } from "axios";
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from "@firebase/storage";
import UserInfo from "../../../../../lib/UserInfo";
import handleGoogleSignIn from "../../../../../lib/handleGoogleSignIn";

const avatar: string[] = [
    "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTE2.jpg?alt=media&token=e5ddc175-a895-4116-b325-cc3e2364cca2",
    "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTE3.jpg?alt=media&token=636d08d5-5ffa-468c-8134-e2533e69a458",
    "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTE5.jpg?alt=media&token=3f9cf0e0-bafa-4d7c-b135-3d65b0ea2ad6",
    "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTEx.jpg?alt=media&token=b4fadd1f-b862-4774-aae2-29b18b258c4e",
    "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTEz.jpg?alt=media&token=888bb603-c90b-4f3a-aa5c-d5980940ff65",
    "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTIy.jpg?alt=media&token=aee83786-9b6c-4caa-8b19-d7a16b9dcfc2",
    "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTIx.jpg?alt=media&token=21e67942-e97d-4356-95f5-fdc562e51e40"
]


enum SignOutState {
    Inactive,
    WaitConfirm,
    Confirmed,
}


export const ProfilScreen = () => {

    const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
    const [user, setUser] = useState<User | null>(null);
    const [editUsername, setEditUsername] = useState(false);
    const [dangerZoneOpen, setDangerZoneOpen] = useState(false);
    const [editAvatar, setEditAvatar] = useState(false);
    const [editMail, setEditMail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingChange, setLoadingChange] = useState({current: 0, total: 0});
    const [signOutState, setSignOutState] = useState<SignOutState>(SignOutState.Inactive);
    const auth = getAuth();
    const {t} = useTranslation();
    const currentPassInputRef = useRef<HTMLInputElement | null>(null);
    const newPassInputRef = useRef<HTMLInputElement | null>(null);
    const newEmailInputRef = useRef<HTMLInputElement | null>(null);



    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot)=>{
                    if(snapshot.data()){
                        // UserInfo exist
                        setUserInfo(new UserInfo(snapshot));
                    }
                    else{
                        // No UserInfo Yet
                        console.log("no userinfo yet");
                        console.log(user.email);
                        setDoc(doc(db, "users", user.uid), {
                            username: user.displayName ?? (user.email?.split("@")[0] ?? "User"),
                            avatarUrl: user.photoURL,
                        }).then((ref) =>{
                            console.log(ref);
                        }).catch( (error)=>{
                            console.log(error);
                        });
                    }
                });
                return () => {
                    unsub();
                }
            } else {
                // User is signed out
                // ...
                setUserInfo(undefined);
            }
        });
        return () =>{
            unsub();
        }
    }, [auth]);

    const onSignOutClick = () => {
        switch (signOutState) {
            case SignOutState.Inactive:
                setSignOutState(SignOutState.WaitConfirm);
                break;
            case SignOutState.WaitConfirm:
                console.log("ici2");
                break;
            case SignOutState.Confirmed:
                handleSignOut();
                break;
        }
    }

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });

    }

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) =>{
        if(info.offset.x > 100){
            setSignOutState(SignOutState.Confirmed);
            setTimeout(()=>{
                handleSignOut();
            }, 3000);
        }
    }

    const uploadFile = async (file: File) => {
        const storage = getStorage();
        const auth = getAuth();
        if(!auth.currentUser || !userInfo) return;
        const storageRef = ref(storage, 'avatar/'+file.name);
        const metadata = {
            contentType: file.type,
            uid: auth.currentUser?.uid,
            date: new Date().toUTCString()
        };
        // 'file' comes from the Blob or File API
        const task = uploadBytesResumable(storageRef, file, metadata);

        task.on('state_changed',
            (snapshot: any) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error: any) => {
                // Handle unsuccessful uploads
                alert(error);
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(task.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setDoc(userInfo!.ref, {username: userInfo.username, avatarUrl: downloadURL});
                    setProgress(0);
                    setEditAvatar(false);
                });
            }
        );
        // self-host only
        // try {
        //     let formData = new FormData();
        //     formData.append("media", file);
        //
        //     const options: AxiosRequestConfig = {
        //         headers: { "Content-Type": "multipart/form-data" },
        //         onUploadProgress: (progressEvent: any) => {
        //             const { loaded, total } = progressEvent;
        //
        //             // Calculate the progress percentage
        //             const percentage = (loaded * 100) / total;
        //             setProgress(percentage);
        //         },
        //     };
        //
        //     const {
        //         data: { data },
        //     } = await axios.post<{
        //         data: {
        //             url: string | string[];
        //         };
        //     }>("/api/upload", formData, options);
        //
        //     console.log("File was uploaded successfylly:", data);
        // } catch (e: any) {
        //     console.error(e);
        //     const error =
        //         e.response && e.response.data
        //             ? e.response.data.error
        //             : "Sorry! something went wrong.";
        //     alert(error);
        // }
    };

    const selectAvatar = (index: number) => {
        if(!userInfo) return;
        setDoc(userInfo!.ref, {username: userInfo.username, avatarUrl: avatar[index]}).then();
        setEditAvatar(false);
    }

    const style = { "--progress": progress+"%" } as React.CSSProperties;

    const handleDangerEdit = () => {
        const mdp = currentPassInputRef.current!.value;
        const user = auth.currentUser;
        setLoadingChange({current: 0, total: 1});
        if(user && mdp){
            reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email!, mdp)).then(() => {
                // User re-authenticated.
                setWrongPassword(false);
                let loading = loadingChange.total;
                if(editPassword && newPassInputRef.current!.value.length){
                    loading += 1;
                    updatePassword(user, newPassInputRef.current!.value).then(() => {
                        // Update successful.
                        setEditPassword(false);
                        setLoadingChange({current: loadingChange.current+1, total: loadingChange.total});
                    }).catch((error) => {
                        // An error ocurred
                        // ...
                        alert(error);
                    });
                }
                if(editMail && newEmailInputRef.current!.value.length){
                    loading += 1;
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newEmailInputRef.current!.value)) alert(t("authentification:emailInvalid"));
                    else{
                        updateEmail(user, newEmailInputRef.current!.value).then(() => {
                            // Email updated!
                            // ...
                            setEditMail(false);
                            setLoadingChange({current: loadingChange.current+1, total: loadingChange.total});
                        }).catch((error) => {
                            // An error occurred
                            // ...
                            alert(error);
                        });
                    }
                }
                setLoadingChange({current: loadingChange.current+1, total: loading});

            }).catch((error) => {
                // An error ocurred
                // ...
                setLoadingChange({current: loadingChange.current+1, total: loadingChange.total});
                setWrongPassword(true);
            });
        }
    }

    const handleDeleteAccount = () => {
        const user = auth.currentUser;

        if(user){
            let credential: AuthCredential | null = null;
            switch(user.providerData[0].providerId){
                case "password":
                    const mdp = currentPassInputRef.current!.value;
                    credential = EmailAuthProvider.credential(user.email!, mdp);
                    break;
                default:
                    const resp = confirm(t("authentification:relogToDelete"))
                    if(resp){
                        handleGoogleSignIn().then((cred: OAuthCredential | null)=>{
                            if(!cred){
                                return;
                            }
                            credential=cred;
                            console.log(cred);
                        })
                    }
            }
            reauthenticateWithCredential(user, credential!).then(() => {
                setWrongPassword(false);
                if(confirm(t("authentification:areYouSure"))){
                    setDoc(userInfo!.ref, {username: "Deleted User", avatarUrl: "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/496450-conception-d-39-icone-d-39-utilisateurs-gratuit-vectoriel.jpg?alt=media&token=d2e50ed0-0cde-48a7-b083-0b120f48ce66"}).then(()=>{
                        deleteUser(user).then(() => {
                        // User deleted.
                    }).catch((error) => {
                        // An error ocurred
                        // ...
                        alert(error);
                    });});

                }
                else{
                    console.log("don't delete")
                }
            }).catch(
                (error)=>{setWrongPassword(true)}
            )
    }}

    function handleChangeUsername(e: React.FocusEvent<HTMLInputElement> | FormEvent<HTMLInputElement>) {
        setDoc(userInfo!.ref, {
            username: (e.target as HTMLInputElement).value ?? "Username",
            avatarUrl: userInfo?.avatarUrl
        }).then().catch(
            (e) => console.log(e)
        );
        setEditUsername(false);
    }

    function DefaultPage(): any {
        return (
            <>
                {userInfo ?
                <div className={styles.avatarContainer} onClick={()=>setEditAvatar(true)}>
                    <Image src={userInfo?.avatarUrl ?? avatar[0]} alt={"Avatar"} layout={"fill"} objectFit={"contain"} priority/>
                    <div className={styles.editPencil}><FontAwesomeIcon icon={faPencil}/></div>
                </div> : null}
                {userInfo?.username ?
                    (!editUsername ?
                        (<h1>{userInfo?.username}<FontAwesomeIcon icon={faPenToSquare} onClick={() => setEditUsername(true)}/></h1>) :
                        (<div className={styles.editUsername}>
                            <input type="text"
                                   defaultValue={userInfo?.username ?? ""}
                                   onSubmit={(e)=>handleChangeUsername(e)}
                                   onBlur={(e)=> {
                                       handleChangeUsername(e);
                                   }}/>
                            <FontAwesomeIcon icon={faPenToSquare} onClick={() => setEditUsername(false)}/>
                        </div>)
                    ) : null
                }
                <button onBlur={() => setSignOutState(SignOutState.Inactive)}
                        className={[styles.btnDanger, signOutState == SignOutState.WaitConfirm ? styles.btnDangerWaitConfirm : null].join(" ")}
                        onClick={() => onSignOutClick()}>
                    {{
                        [SignOutState.Inactive]: t("authentification:signOut"),
                        [SignOutState.WaitConfirm]:
                            <div className={styles.dragContainer}>
                                <motion.div drag={"x"} onDragEnd={(event, info) => handleDrag(event, info)}
                                            dragSnapToOrigin dragConstraints={{left: 0, right: 118}}
                                            className={styles.drag}><FontAwesomeIcon icon={faChevronRight}/>
                                </motion.div>
                                <div className={styles.placeholder}><p>Confirm</p></div>
                            </div>,
                        [SignOutState.Confirmed]: t("authentification:goodbye"),
                    }[signOutState]}
                </button>
                <div className={[styles.dangerZone, dangerZoneOpen ? styles.open : null].join(" ")}>
                    <div className={styles.dangerZoneTitleSection}><h2><FontAwesomeIcon icon={faTriangleExclamation}/> {t("authentification:dangerZone")}</h2><FontAwesomeIcon onClick={()=>setDangerZoneOpen(!dangerZoneOpen)} icon={dangerZoneOpen ? faLockOpen : faLock}/></div>
                    <div className={styles.separator}></div>
                    {dangerZoneOpen ? (<>
                        {user?.providerData[0].providerId == "password" ? (<><div className={styles.inputLine}>
                            <input ref={newEmailInputRef} defaultValue={user?.email!} disabled={!editMail}/>
                            <input type={"checkbox"} onChange={(e) => setEditMail(e.target.checked)}
                                   checked={editMail}/>
                        </div>
                            <div className={styles.inputLine}>
                                <input type={"password"} ref={newPassInputRef} placeholder={"Change Password"} disabled={!editPassword}/>
                                <input type={"checkbox"} onChange={(e)=>setEditPassword(e.target.checked)} checked={editPassword}/>
                            </div>
                            <div className={styles.separator}></div>
                        {wrongPassword ? <p>{t("authentification:wrongPassword")}</p> : null}
                            <div className={styles.inputLine}>
                                <input type={"password"} ref={currentPassInputRef} placeholder={"Current Password"} />
                            </div></>) : null}
                            <div className={styles.inputLine}>
                                <a onClick={()=>handleDeleteAccount()}>Delete your account</a>
                            </div>
                            <button onClick={()=>handleDangerEdit()}>{loadingChange.current<loadingChange.total && loadingChange.total>0 ? <FontAwesomeIcon icon={faSpinner} className={"fa-spin"}/> : ( loadingChange.total>0 ? <FontAwesomeIcon icon={faCheck}/> : null)} {t("authentification:validate")}</button>
                        </>) : null}
                </div>
            </>
        );
    }

    function EditAvatar(): any {
        return (
            <div className={styles.editAvatarContainer}>
                <section>
                    <label htmlFor={"uploadFile"}
                           className={styles.uploadFile}
                           onDragOver={(e)=>{e.preventDefault()}}
                           onDragEnter={(e)=>{ // @ts-ignore
                               e.target.classList!.add(styles.dragging) ; e.preventDefault()}}
                           onDragLeave={(e)=>{ // @ts-ignore
                               e.target.classList!.remove(styles.dragging)}}
                           onDrop={(ev)=>{
                               // Prevent default behavior (Prevent file from being opened)
                               ev.preventDefault();
                               console.log('File(s) dropped');
                               // @ts-ignore

                               if(ev.dataTransfer.files.length>1){
                                   alert("Only one image allowed")
                               }
                               else if(ev.dataTransfer.files.length==1){
                                   if(ev.dataTransfer.files[0].type.startsWith('image')){
                                       uploadFile(ev.dataTransfer.files[0]).then((t)=>{
                                           console.log(t);
                                       }).catch((e)=>{
                                           alert(e);
                                       })
                                   }
                                   else{
                                       alert("This is not an image file");
                                   }
                               }

                           }
                           }>
                        <input type={"file"} id="uploadFile" style={{display: "none"}} onChange={(e)=>{
                            const fileInput = e.target;
                            if (!fileInput.files) {
                                alert("No file was chosen");
                                return;
                            }

                            if (!fileInput.files || fileInput.files.length === 0) {
                                alert("Files list is empty");
                                return;
                            }

                            const file = fileInput.files[0];

                            /** File validation */
                            if (!file.type.startsWith("image")) {
                                alert("Please select a valide image");
                                return;
                            }

                            uploadFile(file).then((t)=>{
                                console.log(t);
                            }).catch((e)=>{
                                alert(e);
                            })
                        }
                        }/>
                        <p>{progress >0 ? t("authentification:inProgress") : t("authentification:uploadFile")}</p>
                        <div className={styles.progressContainer} style={style}><div></div></div>
                    </label>
                </section>
                <section>
                    <h1>{t("authentification:chooseBetweenAvatar")} :</h1>
                    <div className={styles.chooseAvatar}>
                        <div>
                            <div>
                                {avatar.map((url, i) => {
                                    return (<div key={i} onClick={()=>selectAvatar(i)}>
                                        <Image  src={url} width={50} height={50} alt={"avatar"}/></div>)
                                })}
                            </div>
                        </div>
                        <p>Avatars by Vecteezy</p>
                    </div>
                </section>
                <button onClick={()=>setEditAvatar(false)}><FontAwesomeIcon icon={faArrowLeft}/> Go Back</button>
            </div>
        )
    }


    return (
        <>
            <div className={styles.main}>
                {!editAvatar ? <DefaultPage/> : <EditAvatar/>}
            </div>
        </>
    )
}

