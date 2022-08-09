import Layout from "../../stories/components/NextjsExample/Layout/layout";
import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";
import Date from '../../stories/components/NextjsExample/Date/date';
import utilStyles from "/styles/utils.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../../stories/components/NextjsExample/Layout/layout.module.css";
import Link from "next/link";
import {useRouter} from "next/router";

export default function Post({ postData }: any) {
    console.log(postData);

    const router = useRouter();
    const { offset = 0 } = router.query

    console.log(offset)

    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article className={utilStyles.article}>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
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