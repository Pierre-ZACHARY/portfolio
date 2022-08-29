import {Header} from "./Header/header";
import {Chatbot} from "./Chatbot/chatbot";
import Head from "next/head";


export const Layout = (props: any) => {
    return (
        <>
            <Head>
                <title>Pierre Zachary</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
            </Head>
            <div className={props.className}>
                <main style={{paddingTop: props.paddingTop ?? "2em" }}>
                    {props.children}
                </main>
                <Chatbot/>
                <Header content="Content" home={props.home ?? false} postId={props.postId} className={props.headerClassName ?? null}/>
            </div>
        </>
    )
}