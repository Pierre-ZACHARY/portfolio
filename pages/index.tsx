import {Home} from "../stories/screens/NextHome/NextHome";
import {getSortedPostsData} from "../lib/posts";
import {TranslationSwitch} from "../stories/components/Portfolio/Index/Header/TranslationSwitch/translationswitch";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

export default function Index({ allPostsData}: any) {

    return (
        <>
            <TranslationSwitch/>
        </>
    )
}

export async function getStaticProps({ locale }: any) {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header'])),
            allPostsData,
        },
    };
}