import useSWR from 'swr';

export default function Profile() {
    const {data, error} = useSWR('/api/hello',  (apiURL: string) => fetch(apiURL).then(res => res.json()));
    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;
    return <div>hello {data.name} !</div>;
}
