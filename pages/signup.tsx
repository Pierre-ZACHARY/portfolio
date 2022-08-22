import {Layout} from "../stories/components/Portfolio/Layout/Layout";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SignUpScreen} from "../stories/components/Portfolio/Other/Auth/SignUpScreen";


export default function signup() {
    return (
        <>
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