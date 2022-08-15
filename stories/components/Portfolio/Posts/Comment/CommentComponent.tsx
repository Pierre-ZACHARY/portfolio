import {Comment} from "lib/Comment";
import Image from "next/image";
import styles from "./CommentComponent.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faReply, faStar} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "next-i18next";
import {useRef} from "react";

interface CommentComponentProps{
    comment: Comment,
    level: number
}
export const CommentComponent = ({comment, level = 0 }: CommentComponentProps) => {


    const {t} = useTranslation();

    return (
        <>
            <div id={comment.id} className={[styles.commentContainer, level>0 ? styles.reply : null].join(" ") }>
                <section className={styles.infoSection}>
                    <div>
                        <img src={comment.avatar} height={30} width={30}/>
                        <h3>{comment.username} <span>#{comment.id}</span></h3>
                    </div>
                    <p>{comment.datetime.toUTCString()}</p>
                </section>
                <section>
                    <p>{comment.content}</p>
                </section>
                <section className={styles.attachments}>
                    <ul>
                    {comment.attachments.map((attachment) =>{
                        return (<li key={attachment.id}><a href={attachment.url} target={"_blank"}><img src={attachment.url} height={100}/></a></li>)
                    })}
                    </ul>
                </section>
                <section className={styles.actions}>

                    <button><FontAwesomeIcon icon={faReply}/> {t("common:reply")}</button>
                    <h4>{comment.upvotes} <FontAwesomeIcon icon={faStar} style={{color: "#fdd843"}}/></h4>
                    <button><FontAwesomeIcon icon={faArrowUp}/></button>
                    <button><FontAwesomeIcon icon={faArrowDown}/></button>
                </section>
                <section className={styles.replies}>
                    <ul>
                        {comment.replies.map((rep)=>{
                            return(<li key={rep.id}><p>↳</p><CommentComponent comment={rep} level={level+1}/></li>)
                        })}
                    </ul>
                </section>
            </div>
        </>
    )
}