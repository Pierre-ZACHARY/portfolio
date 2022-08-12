import {Home} from "../stories/screens/NextHome/NextHome";
import {getSortedPostsData} from "../lib/posts";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import { Index } from "../stories/screens/Portfolio/Index/Index";
import {LayoutGroup} from "framer-motion";
import {ThemeSwitch, TranslationSwitch} from "../stories/components/Portfolio/Layout/Header/IconSwitch/IconSwitch";

export default function IndexPage({ allPostsData}: any) {
    return (
        <>
            <Index blogPosts={{content: allPostsData}}/>

        </>
    )
}

export async function getStaticProps({ locale }: any) {
    const allPostsData = await getSortedPostsData(locale);
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'index', 'chatbot'])),
            allPostsData,
        },
    };
}