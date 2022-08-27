import {Comment} from "lib/Comment";
import Image from "next/image";
import styles from "./CommentComponent.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faReply, faStar} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "next-i18next";
import {useEffect, useRef, useState} from "react";
import {getAuth, User} from "@firebase/auth";
import {deletedAvatar} from "../../Other/Auth/ProfilScreen";
import {collection, CollectionReference} from "@firebase/firestore";
import {useEffectOnce} from "../../../../../lib/utils";
import {NaturalImageFixedHeight} from "../../../../../lib/utils-components";

interface CommentComponentProps{
    comment: Comment,
    level: number,
    onReply: (arg0: { repliesRef: CollectionReference, commentId: string })=>void
}
export const CommentComponent = ({comment, level = 0, onReply }: CommentComponentProps) => {

    const auth = getAuth();
    const [user, setUser] = useState<User | null>(null)
    const [lastRender, setRenderDate] = useState<Date>(new Date)
    useEffect(()=>{const unsub = auth.onAuthStateChanged((authState)=>{setUser(authState)}); return ()=>unsub()}, [auth])
    const {t} = useTranslation();
    useEffectOnce(()=>{const unsub = comment.subscribe(()=> {
        setRenderDate(new Date())
    }); return ()=>unsub()})

    let voteValue = comment.currentUserValue();

    return (
        <>
            <div id={comment.id} className={[styles.commentContainer, level>0 ? styles.reply : null].join(" ") }>
                <section className={styles.infoSection}>
                    <div>
                        <Image src={comment.avatar != "" ? comment.avatar : deletedAvatar} height={30} width={30} alt={"avatar"}/>
                        <h3>{comment.username} <span>#{comment.id}</span></h3>
                    </div>
                    <p>{comment.datetime.toUTCString()}</p>
                </section>
                <section>
                    <div dangerouslySetInnerHTML={{__html: comment.contentHtml}}/>
                </section>
                <section className={styles.attachments}>
                    <ul>
                    {comment.attachments.map((attachment) =>{
                        return (<li key={attachment.id}>
                            <a href={attachment.url} rel="noreferrer" target={"_blank"}>
                                <NaturalImageFixedHeight props={{alt: "attachment", src:attachment.url}} fixedHeight={100}/>
                            </a></li>)
                    })}
                    </ul>
                </section>
                <section className={styles.actions}>

                    <button disabled={!user} onClick={()=>onReply({repliesRef: collection(comment.docRef, "replies"), commentId: comment.id})}><FontAwesomeIcon icon={faReply}/> {t("common:reply")}</button>
                    <h4>{comment.totalUpvotes} <FontAwesomeIcon icon={faStar} style={{color: "#fdd843"}}/></h4>
                    <div>
                        <button disabled={!user} onClick={()=>comment.currentUserVote(voteValue == 1 ? 0 : 1, ()=>{setRenderDate(new Date())})} className={[voteValue === 1 ? styles.currentValue : null].join(" ")} ><FontAwesomeIcon icon={faArrowUp}/></button>
                        <button disabled={!user} onClick={()=>comment.currentUserVote(voteValue == -1 ? 0 : -1, ()=>{setRenderDate(new Date())})} className={[voteValue === -1 ? styles.currentValue : null].join(" ")}><FontAwesomeIcon icon={faArrowDown}/></button>
                    </div>
                </section>
                <section className={styles.replies}>
                    <ul>
                        {comment.replies.map((rep)=>{
                            return(<li key={rep.id}><p>↳</p><CommentComponent comment={rep} level={level+1} onReply={onReply}/></li>)
                        })}
                    </ul>
                </section>
            </div>
        </>
    )
}