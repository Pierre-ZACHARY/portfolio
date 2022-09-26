import {getAllPostIds, getPostData, getSortedPostsData} from "../../lib/posts";
import Head from "next/head";
import Date from '../../stories/components/NextjsExample/Date/date';
import utilStyles from "/styles/utils.module.css";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faChevronDown, faChevronRight, faCircle} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import {Comment} from "lib/Comment";
import {getDimensions, useEffectOnce} from "lib/utils";
import Link from "next/link";
import {motion} from "framer-motion";
import PostLayout from "../../stories/components/NextjsExample/PostLayout/postlayout";
import {
    addDoc,
    collection,
    doc,
    DocumentData, DocumentReference,
    getDocs, onSnapshot,
    QueryDocumentSnapshot,
    setDoc,
    SnapshotOptions
} from "@firebase/firestore";
import {app, db} from "../_app";
import {runTransaction} from "@firebase/firestore";
import firebase from "firebase/compat";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;
import {Blogslider} from "../../stories/components/Portfolio/Index/BlogSlider/blogslider";
import {DisplayComments} from "../../stories/components/Portfolio/Posts/DisplayComments/DisplayComments";
import { Layout } from "stories/components/Portfolio/NewLayout/Layout";
import sass from "./blogpost.module.sass";

interface PostDb{
    id: string,
    views: number
}

const PostDbConverter: FirestoreDataConverter<PostDb> = {
    toFirestore: (postDb: PostDb) => {
        return {...postDb}
    },
    // @ts-ignore
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions): PostDb => {
        const data = snapshot.data(options);
        return {id: data.id, views: data.views}
    }
}

async function updateViews(id: string): Promise<number | void> {
    const docRef = doc(db, "posts", id);

    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef);
            if (!sfDoc.exists()) {
                console.log("Document does not exist !");
                try {
                    await setDoc(docRef, {
                        id: id,
                        views: 0
                    });
                    console.log("Document written with ID: ", id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
            else{
                const newViews = sfDoc.data().views + 1;
                transaction.update(docRef, { views: newViews });
                // console.log("Transaction successfully committed!");
                return newViews;
            }
        });
    } catch (e) {
        console.log("Transaction failed: ", e);
    }
}

export default function Post({allPostsData, postData }: any) {
    const {t} = useTranslation();

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [viewCount, setViewCount] = useState<number>(0);
    const [openSummary, setOpenSummary] = useState<boolean>(false)

    useEffect(()=>{
        const unsub = onSnapshot(doc(db, "posts", postData.id), (doc) => {
            // console.log("Current data: ", doc.data());
            setViewCount(doc.data()?.views);
        });
        return ()=>unsub()
    }, [])
    const handleScroll = () => {
        const scrollPosition = window.scrollY+100;
        const nodeList = document.querySelectorAll("#Summary h1, #Summary h2, #Summary h3, #otherPosts h1, #comments h1");
        if(nodeList && nodeList.length){
            let prev = 0;
            for(let i = 0; i<nodeList.length; i++){
                const { offsetBottom, offsetTop } = getDimensions(nodeList[i]);
                if(scrollPosition < offsetTop) break
                else prev=i
            }
            setCurrentIndex(prev);
        }

    }

    useEffect(()=>{
        const nodeList = document.getElementById("Summary")!.querySelectorAll("h1, h2, h3, h4, h5, h6");
        for(let i = 0; i<nodeList!.length; i++){
            nodeList[i]!.setAttribute("id", i.toString())
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    useEffectOnce(()=>{
        updateViews(postData.id).then();
    });

    const onClickScrollTo = (index: number) =>{
        const y = document.getElementById("Summary")!.querySelectorAll("h1, h2, h3")[index].getBoundingClientRect().y + window.scrollY - 100;
        window.scrollTo({top: y, behavior: 'smooth'})
    }


    return (

        <Layout selected={"blog"}>
            <Head>
                <title>{postData.title}</title>
                <meta
                    name="description"
                    content={postData.description}
                />
            </Head>
            <div className={utilStyles.deskPadding} >
                <motion.nav layoutScroll className={utilStyles.nav}>
                    <ul>
                        {postData.titles.map(({heading, content}:{heading: string, content: string}, index: number)=>{
                            return <li key={index} className={[heading == "h1" ? utilStyles.mainHeading : utilStyles.subHeading, currentIndex == index ? utilStyles.currentHeading : null].join(" ")}>
                                {currentIndex == index ? <motion.div layout={"position"} layoutId={"arrow"} style={{position: "absolute", left: "-20px"}}><FontAwesomeIcon style={{color: "var(--secondary-color)"}} icon={faArrowRight}/></motion.div> : null}

                                <a onClick={()=>onClickScrollTo(index)}>{content}</a>
                            </li>
                        })}
                        {allPostsData.length>0 && <li className={currentIndex == postData.titles.length ? utilStyles.currentHeading : ""}>
                            <a href={"#otherPosts"}>
                                {currentIndex == postData.titles.length ?
                                    <motion.div layout={"position"} layoutId={"arrow"}
                                                style={{position: "absolute", left: "-20px"}}><FontAwesomeIcon
                                        style={{color: "var(--secondary-color)"}} icon={faArrowRight}/>
                                    </motion.div> : null}
                                {t("common:otherPosts")}
                            </a>
                        </li>}
                        <li className={currentIndex == postData.titles.length+1 ? utilStyles.currentHeading : ""}>
                            <a href={"#comments"}>
                                {currentIndex == postData.titles.length+1 ? <motion.div layout={"position"} layoutId={"arrow"} style={{position: "absolute", left: "-20px"}}><FontAwesomeIcon style={{color: "var(--secondary-color)"}} icon={faArrowRight}/></motion.div> : null}
                                {t("common:comments")}
                            </a>
                        </li>
                    </ul>
                </motion.nav>
                <article className={utilStyles.article}>

                    <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                    <div className={utilStyles.lightText}>
                        <Date dateString={postData.date} />
                        <p>{t("common:viewCount")} : {viewCount} 👀</p>
                    </div>
                    <div className={sass.mobileSass}>
                        <div className={sass.summaryTitle} onClick={()=>setOpenSummary(!openSummary)}>
                            <h2>{t("common:summary")}...</h2>
                            <FontAwesomeIcon icon={openSummary ? faChevronDown : faChevronRight}/>
                        </div>
                        {openSummary && <ul>
                            {postData.titles.map(({
                                                      heading,
                                                      content
                                                  }: { heading: string, content: string }, index: number) => {
                                return <li key={index}
                                           className={[heading == "h1" ? utilStyles.mainHeading : utilStyles.subHeading, currentIndex == index ? utilStyles.currentHeading : null].join(" ")}>
                                    <a onClick={() => onClickScrollTo(index)}>{content}</a>
                                </li>
                            })}
                            {allPostsData.length>0 && <li className={currentIndex == postData.titles.length ? utilStyles.currentHeading : ""}>
                                <a href={"#otherPosts"}>
                                    {t("common:otherPosts")}
                                </a>
                            </li>}
                            <li className={currentIndex == postData.titles.length+1 ? utilStyles.currentHeading : ""}>
                                <a href={"#comments"}>
                                    {t("common:comments")}
                                </a>
                            </li>
                        </ul>}
                    </div>
                    <div id={"Summary"} dangerouslySetInnerHTML={{ __html: postData.contentHtml }}/>
                    <Link href={"/"}><a className={utilStyles.backToHome}>← {t("common:backToHome")}</a></Link>

                    {allPostsData.length>0 && <><div id={"otherPosts"}><h1>{t("common:otherPosts")} :</h1></div>
                        <div id={"BlogSlider"}>
                        <Blogslider content={allPostsData} />
                        </div></>}
                    <div id={"comments"}><h1>{t("common:comments")} :</h1></div>
                    <DisplayComments postId={postData.id}/>
                </article>
            </div>

        </Layout>
    );
}

export const getStaticPaths = async ({ locales }: {locales: string[]}) => {
    // Return a list of possible value for id
    const paths = locales.map((locale) => {
        const localeIds = getAllPostIds(locale);
        return localeIds.map((path) =>{
            return {
                params: {id: path.params.id},
                locale
            }
        });
    }).flat();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ locale, params }: any) {
    // Fetch necessary data for the blog post using params.id
    const postData = await getPostData(params.id, locale);
    const allPostsData = (await getSortedPostsData(locale)).filter(f => f.id !== params.id);


    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'shop', 'chatbot', 'authentification'])),
            postData,
            allPostsData,
        },
        revalidate: 1800, // In seconds
    };
}

