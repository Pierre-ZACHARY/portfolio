import {Layout} from "../stories/components/Portfolio/Layout/Layout";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SignUpScreen} from "../stories/components/Portfolio/Other/Auth/SignUpScreen";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {getAuth, onAuthStateChanged} from "@firebase/auth";
import Head from "next/head";
import {useTranslation} from "next-i18next";


export default function Signup() {
    const router = useRouter();
    const {t} = useTranslation();

    useEffect(()=>{
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) router.push("/profile");
        });
        return ()=>{
            unsub();
        }
    }, []);
    return (
        <>
            <Head>
                <title>{t("authentification:signUp")}</title>
            </Head>
            <Layout>
                <SignUpScreen onLogin={undefined}/>
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