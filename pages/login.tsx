import {LoginScreen} from "../stories/components/Portfolio/Other/Auth/LoginScreen";
import {Layout} from "../stories/components/Portfolio/Layout/Layout";
import {getPostData, getSortedPostsData} from "../lib/posts";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {getAuth, onAuthStateChanged} from "@firebase/auth";
import Head from "next/head";
import {useTranslation} from "next-i18next";


export default function Login() {
    const router = useRouter();
    const {t} = useTranslation();
    const { onSignIn } = router.query;


    useEffect(()=>{
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) router.push(onSignIn? onSignIn.toString() : "/profile");
        });
        return ()=>{
            unsub();
        }
    }, [router]);





    return (
        <>
            <Head>
                <title>{t("authentification:loginScreenTitle")}</title>
            </Head>
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
            ...(await serverSideTranslations(locale, ['common', 'header', 'chatbot', 'shop', 'authentification'])),
        },
    };
}