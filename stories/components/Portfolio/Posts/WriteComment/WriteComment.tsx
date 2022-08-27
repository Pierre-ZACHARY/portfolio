import styles from "./WriteComment.module.sass"
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {remark} from "remark";
import html from "remark-html";
import {getAuth, User} from "@firebase/auth";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faArrowUpRightFromSquare, faBold, faUnderline, faStrikethrough, faItalic, faPaperPlane, faImage} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import { motion } from "framer-motion";
import {addDoc, collection, CollectionReference, DocumentData, setDoc} from "@firebase/firestore";
import Image from "next/image";
import {NaturalImageFixedHeight} from "../../../../../lib/utils-components";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "@firebase/storage";

export const WriteComment = ({commentsRef = undefined, onSend=undefined}: {commentsRef: CollectionReference<DocumentData> | undefined, onSend: Function | undefined}) => {

    const router = useRouter();
    const auth = getAuth();
    const {t} = useTranslation();
    const textAreaRef = useRef(null);
    const [user, setUser] = useState<User | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [attachments, setAttachments] = useState<string[]>([]);
    const [sendDisabled, setSendDisabled] = useState<boolean>(false);
    useEffect(()=>{const unsub=auth.onAuthStateChanged((user)=>setUser(user)); return ()=>unsub()}, [auth])
    const [commentHtml, setContentHtml] = useState("");
    const previewMD = (mk: string) =>{remark().use(html).process(mk).then((res)=>setContentHtml(res.toString()))}
    const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>)=>{previewMD(e.target.value)}

    const handleTextFormating = (beforeToken: string, afterToken: string) => {
        if(textAreaRef.current){
            const ta = (textAreaRef.current as HTMLTextAreaElement);
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            ta.value = ta.value.substring(0, start) + beforeToken + ta.value.substring(start, end) + afterToken + ta.value.substring(end, ta.value.length);
            previewMD(ta.value);
        }
    };

    const onSendComment = ()=>{
        if(textAreaRef.current){
            const ta = (textAreaRef.current as HTMLTextAreaElement);
            if(ta.value.length && user && commentsRef){
                setSendDisabled(true);
                addDoc(commentsRef, {
                    userid: user.uid,
                    content: ta.value,
                    datetime: new Date()
                }).then(
                    (res)=> {
                        if(attachments.length){
                            attachments.forEach((url)=>{
                                addDoc(collection(res, "attachments"), {url: url}).then(()=>{
                                    setAttachments([]);
                                }).catch((error)=>alert(error));
                            });
                        }
                        ta.value = "";
                        setContentHtml("");
                        setSendDisabled(false);
                        if(onSend) onSend();
                    }
                ).catch(
                    (error)=>{
                        alert(error.message);
                        setSendDisabled(false)
                    }
                )

            }
        }
    }

    const uploadFile = async (file: File) => {
        const storage = getStorage();
        const auth = getAuth();
        if(!auth.currentUser) return;
        const storageRef = ref(storage, 'attachments/'+auth.currentUser.uid+"/"+file.name);
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
                    setAttachments([...attachments, downloadURL]);
                    setProgress(0);
                });
            }
        );

    };


    const style = { "--image-upload-progress": progress+"%" } as React.CSSProperties;

    return (
        <>
            <div className={styles.mainContainer} style={style}>
                <div className={styles.markdownPreview} dangerouslySetInnerHTML={{__html: commentHtml}}/>
                <div className={styles.displayAttachments}>
                    {attachments.map((url, k)=><NaturalImageFixedHeight key={k} props={{src: url, alt: "attachment"}} fixedHeight={100}/>)}
                </div>
                <div className={styles.textArea}><textarea ref={textAreaRef} onChange={(e) => handleTyping(e)}></textarea></div>
                <div className={styles.buttonsLine}>
                    <div className={styles.textFormatting}>
                        <motion.button initial={{y: 15, opacity: 0.4}} viewport={{once: true}} whileInView={{ opacity: 1, y: 0 }} onClick={()=>handleTextFormating("**", "**")}><FontAwesomeIcon icon={faBold}/></motion.button>
                        <motion.button initial={{y: 15, opacity: 0.4}} viewport={{once: true}} whileInView={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} onClick={()=>handleTextFormating("*", "*")}><FontAwesomeIcon icon={faItalic}/></motion.button>
                        <motion.button initial={{y: 15, opacity: 0.4}} viewport={{once: true}} whileInView={{ opacity: 1, y: 0 }} transition={{delay: 0.4}} onClick={()=>handleTextFormating("~~", "~~")}><FontAwesomeIcon icon={faStrikethrough}/></motion.button>
                        <motion.button initial={{y: 15, opacity: 0.4}} viewport={{once: true}} whileInView={{ opacity: 1, y: 0 }} transition={{delay: 0.6}} onClick={()=>handleTextFormating("__", "__")}><FontAwesomeIcon icon={faUnderline}/></motion.button>
                        <motion.button style={{backgroundImage: "linear-gradient(0deg, var(--primary-color) 0 var(--image-upload-progress), var(--background-highlight) var(--image-upload-progress) )"}} initial={{y: 15, opacity: 0.4}} viewport={{once: true}} whileInView={{ opacity: 1, y: 0 }} transition={{delay: 0.8}}>
                            <label htmlFor={"uploadFile"}>
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
                                    alert("Please select a valid image");
                                    return;
                                }

                                uploadFile(file).then(()=>{});
                            }}/>
                            <FontAwesomeIcon icon={faImage}/>
                            </label>
                        </motion.button>
                    </div>
                    <button disabled={sendDisabled} onClick={()=>onSendComment()}>{t("common:Send")} <FontAwesomeIcon icon={faPaperPlane}/></button>
                </div>
                {!user ?
                    <div className={styles.youMustLoggin}>
                        <Link href={"/login?onSignIn="+router.asPath}><a>{t("authentification:youMustLoginToComment")} <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a></Link>
                    </div> : null}
            </div>

        </>
    )
}