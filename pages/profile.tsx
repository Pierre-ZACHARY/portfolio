import useSWR from 'swr';
import Head from "next/head";
import {Layout} from "../stories/components/Portfolio/Layout/Layout";
import {LoginScreen} from "../stories/components/Portfolio/Other/Auth/LoginScreen";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {ProfilScreen} from "../stories/components/Portfolio/Other/Auth/ProfilScreen";
import {getAuth, onAuthStateChanged} from "@firebase/auth";
import {useEffect} from "react";
import {useRouter} from "next/router";

export default function Profile() {
    const router = useRouter();
    const auth = getAuth();

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) router.push("/login");
        });
        return ()=>{
            unsub();
        }
    }, [auth, router]);

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <Layout>
                <ProfilScreen/>
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