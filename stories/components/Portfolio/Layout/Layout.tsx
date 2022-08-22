import {Header} from "./Header/header";
import {Chatbot} from "./Chatbot/chatbot";


export const Layout = (props: any) => {
    return (
        <>
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