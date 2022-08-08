import {Header} from "./Header/header";
import {Chatbot} from "./Chatbot/chatbot";


export const Layout = (props: any) => {
    return (
        <>
            <main>
                {props.children}
            </main>
            <Chatbot/>
            <Header content="Content"/>

        </>
    )
}