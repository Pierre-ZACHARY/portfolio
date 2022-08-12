import Layout from "../../stories/components/NextjsExample/Layout/layout";
import {getAllPostIds, getPostData} from "../../lib/posts";
import Head from "next/head";
import Date from '../../stories/components/NextjsExample/Date/date';
import utilStyles from "/styles/utils.module.css";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export default function Post({ postData }: any) {
    // console.log(postData);

    // const router = useRouter();
    // const { offset = 0 } = router.query

    // console.log(offset)

    const {t} = useTranslation();


    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article className={utilStyles.article}>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}

export const getStaticPaths = async ({ locales }: {locales: string[]}) => {
    // Return a list of possible value for id
    const paths = locales.map((locale) => {
        const localeIds = getAllPostIds(locale);

        return localeIds.map((path) =>{
            return {
                params: {id: path.params.id},
                locale
            }
        });
    }).flat();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ locale, params }: any) {
    // Fetch necessary data for the blog post using params.id
    const postData = await getPostData(params.id, locale);

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
            postData,
        },
    };
}