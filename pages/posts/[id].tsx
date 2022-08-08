import Layout from "../../stories/components/NextjsExample/Layout/layout";
import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";
import Date from '../../stories/components/NextjsExample/Date/date';
import utilStyles from "/styles/utils.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../../stories/components/NextjsExample/Layout/layout.module.css";
import Link from "next/link";

export default function Post({ postData }: any) {
    console.log(postData);
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <nav className={utilStyles.margin}>
                <div className={styles.backToHome}>
                    <Link href="/#third">
                        <a>← Back to home</a>
                    </Link>
                </div>
                <div style={{position: "relative", width: "100%", height: "100%", minHeight: "300px"}}>
                    <motion.img layoutId={postData.id+"-img"} src={postData.thumbnailUrl} alt="post thumbnail"/>
                </div>
            </nav>
            <article className={utilStyles.article}>
                <motion.h1 layoutId={postData.id} className={utilStyles.headingXl}>{postData.title}</motion.h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}

export async function getStaticPaths() {
    // Return a list of possible value for id
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }: any) {
    // Fetch necessary data for the blog post using params.id
    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    };
}