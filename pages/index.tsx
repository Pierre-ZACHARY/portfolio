import {Home} from "../stories/screens/NextHome/NextHome";
import {getSortedPostsData} from "../lib/posts";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import { Index } from "../stories/screens/Portfolio/Index/Index";
import {LayoutGroup} from "framer-motion";
import {ThemeSwitch, TranslationSwitch} from "../stories/components/Portfolio/Layout/Header/IconSwitch/IconSwitch";
import Head from "next/head";

export default function IndexPage({ allPostsData}: any) {
    return (
        <>
            <Head>
                <title>Pierre Zachary</title>
            </Head>
            <Index blogPosts={{content: allPostsData}}/>
        </>
    )
}

export async function getStaticProps({ locale }: any) {
    const allPostsData = await getSortedPostsData(locale);
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'index', 'chatbot', 'authentification', 'shop'])),
            allPostsData,
        },
        revalidate: 1800, // In seconds
    };
}