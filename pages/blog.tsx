import {getPostData, getSortedPostsData} from "../lib/posts";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import styles from "/styles/blog.module.sass";
import {BlogSlideI, Blogslider, BlogsliderProps} from "../stories/components/Portfolio/Index/BlogSlider/blogslider";
import {useTranslation} from "next-i18next";
import {Layout} from "../stories/components/Portfolio/NewLayout/Layout";
import {Blogcard} from "../stories/components/Portfolio/Index/BlogCard/blogcard";


export default function Blog({blogPosts}: { blogPosts: BlogSlideI[] }) {

    const {t} = useTranslation();




    return <Layout selected={"blog"}>
        <div className={styles.main}>
            <h1>{t("header:section3")}</h1>
            <div className={styles.cardContainer}>
                {blogPosts.map((b)=><Blogcard key={b.id} cardtitle={b.title} descriptionHtml={b.descriptionHtml} mostviewed={b.mostViewed} lastupdated={b.lastupdated} datestringiso={b.date} id={b.id}/>)}
            </div>
        </div>
    </Layout>
}

export async function getStaticProps({ locale }: any) {
    const blogPosts = await getSortedPostsData(locale);

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'shop', 'chatbot', 'authentification', 'index'])),
            blogPosts,
        },
        // revalidate: 1800, // In seconds
    };
}