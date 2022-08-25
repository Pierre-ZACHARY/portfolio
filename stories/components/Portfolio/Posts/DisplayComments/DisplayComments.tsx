import {Comment} from "lib/Comment";
import {useEffect, useRef, useState} from "react";
import {collection, onSnapshot} from "@firebase/firestore";
import {db} from "../../../../../pages/_app";
import {CommentComponent} from "../Comment/CommentComponent";
import styles from "./DisplayComments.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "next-i18next";

interface DisplayCommentsProps{
    postId: string
}

export const DisplayComments = ({postId}: DisplayCommentsProps) => {
    const [ascending, setAscending] = useState(false);
    const [orderBy, setOrderBy] = useState("date");

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
                return a.upvotes > b.upvotes ? 1 : -1;
        }
        return 0;
    });

    if(!ascending) comments = comments.reverse();

    return (
        <>
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
                comments.map((comm) => {
                    return (<li key={comm.id}><CommentComponent comment={comm} level={0}/></li>)
                })
            }
            </ul>
        </>
    )
}