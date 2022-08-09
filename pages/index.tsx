import {Home} from "../stories/screens/NextHome/NextHome";
import {getSortedPostsData} from "../lib/posts";
import {TranslationSwitch} from "../stories/components/Portfolio/Layout/Header/TranslationSwitch/translationswitch";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import { Index } from "../stories/screens/Portfolio/Index/Index";

export default function IndexPage({ allPostsData}: any) {
    console.log(allPostsData);
    return (
        <>
            <Index blogPosts={{content: allPostsData}}/>
        </>
    )
}

export async function getStaticProps({ locale }: any) {
    const allPostsData = await getSortedPostsData();
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'index', 'chatbot'])),
            allPostsData,
        },
    };
}