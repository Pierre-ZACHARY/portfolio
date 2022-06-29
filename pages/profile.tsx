import useSWR from 'swr';
import Head from "next/head";

export default function Profile() {
    const {data, error} = useSWR('/api/hello',  (apiURL: string) => fetch(apiURL).then(res => res.json()));
    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;
    return (
        <>
        <Head>
            <title>Profile</title>
        </Head>
        <div>hello {data.name} !</div>
        </>
    );
}
