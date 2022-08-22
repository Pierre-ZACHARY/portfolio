import {LoginScreen} from "../stories/components/Portfolio/Other/Auth/LoginScreen";
import {Layout} from "../stories/components/Portfolio/Layout/Layout";
import {getPostData, getSortedPostsData} from "../lib/posts";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";


export default function login() {
    return (
        <>
            <Layout>
                <LoginScreen onSignUp={undefined}/>
            </Layout>
        </>
    )
}

export async function getStaticProps({ locale }: any) {
    // Fetch necessary data for the blog post using params.id
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'chatbot', 'authentification'])),
        },
    };
}