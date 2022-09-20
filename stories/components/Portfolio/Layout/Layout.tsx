import {Header} from "./Header/header";
import Chatbot from "./Chatbot/chatbot";
import Head from "next/head";
import CartWidget from "../Shop/CartWidget/CartWidget";
import styles from "./Layout.module.sass"
import { motion } from "framer-motion";

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
                <motion.div layoutScroll className={styles.fixedWidget}>
                    <CartWidget/>
                    <Chatbot/>
                </motion.div>
                <Header content="Content" home={props.home ?? false} postId={props.postId} className={props.headerClassName ?? null}/>
            </div>
        </>
    )
}