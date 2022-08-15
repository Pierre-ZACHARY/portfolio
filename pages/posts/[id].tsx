import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";
import Date from '../../stories/components/NextjsExample/Date/date';
import utilStyles from "/styles/utils.module.css";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faCircle} from "@fortawesome/free-solid-svg-icons";
import styles from "../../stories/components/NextjsExample/PostLayout/postlayout.module.css";
import {useEffect, useRef, useState} from "react";
import {getDimensions, useEffectOnce} from "lib/utils";
import Link from "next/link";
import {motion} from "framer-motion";
import PostLayout from "../../stories/components/NextjsExample/PostLayout/postlayout";
import {
    addDoc,
    collection,
    doc,
    DocumentData,
    getDocs,
    QueryDocumentSnapshot,
    setDoc,
    SnapshotOptions
} from "@firebase/firestore";
import {app, db} from "../_app";
import {runTransaction} from "@firebase/firestore";
import firebase from "firebase/compat";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

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

export default function Post({ postData }: any) {
    const {t} = useTranslation();

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleScroll = () => {
        const scrollPosition = window.scrollY+150;
        const nodeList = document.getElementById("mdContent")!.querySelectorAll("h1, h2, h3, h4, h5, h6");
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
        const nodeList = document.getElementById("mdContent")!.querySelectorAll("h1, h2, h3, h4, h5, h6");
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
        document.getElementById("mdContent")!.querySelectorAll("h1, h2, h3, h4, h5, h6")[index].scrollIntoView()
    }


    return (
        <PostLayout postId={postData.id}>
            <div className={utilStyles.deskPadding}>
                <motion.nav layoutScroll className={utilStyles.nav}>
                    <ul>
                        {postData.titles.map(({heading, content}:{heading: string, content: string}, index: number)=>{
                            return <li key={index} className={[heading == "h1" ? utilStyles.mainHeading : utilStyles.subHeading, currentIndex == index ? utilStyles.currentHeading : null].join(" ")}>
                                {currentIndex == index ? <motion.div layout={"position"} layoutId={"arrow"} style={{position: "absolute", left: "-20px"}}><FontAwesomeIcon style={{color: "var(--secondary-color)"}} icon={faArrowRight}/></motion.div> : null}

                                <a onClick={()=>onClickScrollTo(index)}>{content}</a>
                            </li>
                        })}
                    </ul>
                </motion.nav>
                <Head>
                    <title>{postData.title}</title>
                    <meta
                        name="description"
                        content={postData.description}
                    />
                </Head>
                <article className={utilStyles.article}>
                    <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                    <div className={utilStyles.lightText}>
                        <Date dateString={postData.date} />
                    </div>
                    <div id={"mdContent"} dangerouslySetInnerHTML={{ __html: postData.contentHtml }}/>
                    <Link href={"/"}><a className={styles.backToHome}>← Retour</a></Link>
                </article>
            </div>

        </PostLayout>
    );
}

export const getStaticPaths = async ({ locales }: {locales: string[]}) => {
    // Return a list of possible value for id
    const idArray: string[] = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        idArray.push(doc.id);
    });
    const addList: string[] = [];
    const paths = locales.map((locale) => {
        const localeIds = getAllPostIds(locale);

        return localeIds.map((path) =>{
            if(path.params.id in idArray){
                // On retire les documents déjà existant dans firebase
                addList.push(path.params.id);
            }
            return {
                params: {id: path.params.id},
                locale
            }
        });
    }).flat();
    for(let i = 0; i<addList.length; i++){
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                id: addList[i],
                view: 0
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ locale, params }: any) {
    // Fetch necessary data for the blog post using params.id
    const postData = await getPostData(params.id, locale);

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header'])),
            postData,
        },
    };
}

