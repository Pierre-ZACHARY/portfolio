import {Comment} from "lib/Comment";
import {useEffect, useRef, useState} from "react";
import {collection, CollectionReference, DocumentData, onSnapshot} from "@firebase/firestore";
import {db} from "../../../../../pages/_app";
import {CommentComponent} from "../Comment/CommentComponent";
import styles from "./DisplayComments.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "next-i18next";
import {WriteComment} from "../WriteComment/WriteComment";

interface DisplayCommentsProps{
    postId: string
}

export const DisplayComments = ({postId}: DisplayCommentsProps) => {
    const [ascending, setAscending] = useState(false);
    const [orderBy, setOrderBy] = useState("date");
    const [maxDisplayed, setMaxDisplayed] = useState(3);
    const [replyTo, setReplyTo] = useState<{ repliesRef: CollectionReference, commentId: string }>({repliesRef: collection(db, "posts", postId, "comments"), commentId: "/"});

    const {t} = useTranslation();
    const [commentsDistant, setCommentsDistant] = useState<Comment[]>([]);


    useEffect(()=>{
        const unsub = onSnapshot(collection(db, "posts", postId, "comments"), (collection) => {
            let comments: Comment[] = [];
            collection.docs.forEach((doc)=>{
                comments.push(new Comment(doc));
            });
            setCommentsDistant(comments);
        });

        return () => {
            unsub();
        }
    }, [postId]);

    let comments = commentsDistant.sort((a: Comment, b: Comment) => {
        switch(orderBy){
            case "date":
                return a.datetime > b.datetime ? 1 : -1;
            case "fav":
                return a.totalUpvotes > b.totalUpvotes ? 1 : -1;
        }
        return 0;
    });

    if(!ascending) comments = comments.reverse();

    return (
        <>
            <section className={styles.writeCommentSection} id={"writeCommentSection"}>
                <h3>{t("common:sendAComment")}</h3>
                {replyTo.commentId != "/" ? <p>{t("common:answerTo")} #{replyTo.commentId}</p> : null}
                <WriteComment commentsRef={replyTo.repliesRef} onSend={()=>setReplyTo({repliesRef: collection(db, "posts", postId, "comments"), commentId: "/"})}/>
            </section>
            <section className={styles.sortingSection}>
                <h4>{t("common:sortby")} : </h4>
                <select onChange={(val) => {setOrderBy(val.target.value)}}>
                    <option value={"date"}>{t("common:orderByDate")}</option>
                    <option value={"fav"}>{t("common:mostFav")}</option>
                </select>
                <button className={styles.button} onClick={()=>{setAscending(!ascending)}}>
                    {ascending ? <FontAwesomeIcon icon={faSortUp}/> : <FontAwesomeIcon icon={faSortDown}/>}
                </button>
            </section>

            <ul className={styles.commentsContainer}>
            {
                comments.slice(0, maxDisplayed).map((comm) => {
                    return (<li key={comm.id}><CommentComponent comment={comm} level={0} onReply={(colRef: { repliesRef: CollectionReference, commentId: string }) => {
                        setReplyTo(colRef)
                        document.getElementById("writeCommentSection")?.scrollIntoView();
                    }}/></li>)
                })
            }
            </ul>

            {maxDisplayed < comments.length ? <div style={{display: "flex"}}><button style={{margin: "10px auto"}} onClick={()=>setMaxDisplayed(maxDisplayed+3)}>{t("common:showMore")}</button></div> : null}
        </>
    )
}