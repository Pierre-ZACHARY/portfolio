import {BlogSlideI} from "../stories/components/Portfolio/Index/BlogSlider/blogslider";
import {useTranslation} from "next-i18next";
import {Layout} from "../stories/components/Portfolio/NewLayout/Layout";
import styles from "../styles/blog.module.sass";
import {Blogcard} from "../stories/components/Portfolio/Index/BlogCard/blogcard";
import {getSortedPostsData} from "../lib/posts";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {DisplayShop} from "../stories/components/Portfolio/Shop/DisplayShop/DisplayShop";

export default function Shop({blogPosts}: { blogPosts: BlogSlideI[] }) {

    const {t} = useTranslation();


    return <Layout selected={"shop"}>
        <div className={styles.main}>
            <h1>{t("header:section4")}</h1>
            <DisplayShop />
        </div>
    </Layout>
}

export async function getStaticProps({ locale }: any) {

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'shop', 'chatbot', 'authentification', 'index'])),
        },
        // revalidate: 1800, // In seconds
    };
}