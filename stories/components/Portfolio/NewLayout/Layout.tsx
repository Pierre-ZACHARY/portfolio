import styles from "./Layout.module.sass"
import Head from "next/head";
import {CartWidget} from "../Shop/CartWidget/CartWidget";
import {Chatbot} from "../Layout/Chatbot/chatbot";
import {motion} from "framer-motion";
import Link from "next/link";
import {AuthWidget} from "../Other/Auth/AuthWidget";
import {ThemeSwitch, TranslationSwitch} from "../Layout/Header/IconSwitch/IconSwitch";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faChevronDown, faBars, faXmark} from "@fortawesome/free-solid-svg-icons";

export const Layout = (props: any) => {

    const [scroll, setScroll] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(()=>{
        const handleScroll = () => {setScroll(window.scrollY)}
        window.addEventListener("scroll", handleScroll)
        return ()=>window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <Head>
                <title>Pierre Zachary</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
                <meta
                    name="description"
                    content="This is my personal websites for demonstration purposes"
                />
            </Head>
            <div className={props.className+" "+styles.main}>
                <motion.header style={{position: "fixed"}} layout layoutScroll className={(scroll>0 ? styles.showShadow : "")+" "+(menuOpen ? styles.menuOpen : "")}>
                    <nav>
                        <section className={styles.widgets}>
                            <AuthWidget/>
                            <ThemeSwitch/>
                            <TranslationSwitch/>
                        </section>
                        <section className={styles.links}>
                            <div className={props.selected=="blog" ? styles.selected : ""}>
                                <Link href={"/blog"}>
                                    <a>Blog </a>
                                </Link>
                                {props.selected=="blog" && <motion.div layout layoutId={"headerLine"} className={styles.selectedLine}/>}
                            </div>
                            <div className={props.selected=="about" ? styles.selected : ""}>
                                <Link href={"/"}>
                                    <a>About </a>
                                </Link>
                                {props.selected=="about" && <motion.div layout layoutId={"headerLine"} className={styles.selectedLine}/>}
                            </div>
                            <div className={props.selected=="shop" ? styles.selected : ""}>
                                <Link href={"/shop"}>
                                    <a>Shop</a>
                                </Link>
                                {props.selected=="shop" && <motion.div layout layoutId={"headerLine"} className={styles.selectedLine}/>}
                            </div>
                        </section>
                    </nav>
                    <button className={styles.mobileShow} onClick={()=>{setMenuOpen(!menuOpen)}}><FontAwesomeIcon icon={menuOpen ? faXmark : faBars}/></button>
                </motion.header>
                <main>
                    {props.children}
                </main>
                <motion.div layoutScroll className={styles.fixedWidget}>
                    {/*<CartWidget/>*/}
                    {/*<Chatbot/>*/}
                </motion.div>
            </div>
        </>
    )
}