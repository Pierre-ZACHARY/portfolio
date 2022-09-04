import {HeaderSection} from "./HeaderSection/headerSection";
import styles from "./header.module.css"
import Link from "next/link";
import {useEffect, useState} from "react";
import { Squash as Hamburger } from 'hamburger-react'
import {useTranslation} from "react-i18next";
import {ThemeSwitch, TranslationSwitch} from "./IconSwitch/IconSwitch";
import {LayoutGroup, motion} from "framer-motion";
import { HeaderSectionV2 } from "./HeaderSection/HeaderSectionV2";
import {AuthWidget} from "../../Other/Auth/AuthWidget";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";
import {doc, onSnapshot} from "@firebase/firestore";
import {db} from "../../../../../pages/_app";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;

interface HeaderProps{
    content: string,
    home: boolean,
    postId: string | undefined,
    className: string | null
}

export const Header = ({content, home,  postId = undefined, className = null}: HeaderProps) => {
    const { t } = useTranslation();

    const [state, setState] = useState({scroll: 0, burgerActive: false});
    const [viewCount, setViewCount] = useState<number>(0);

    const handleScroll = () => {
        setState({...state, scroll: window.scrollY});
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        let unsub : Unsubscribe | undefined = undefined;
        if(postId){
            unsub = onSnapshot(doc(db, "posts", postId), (doc) => {
                // console.log("Current data: ", doc.data());
                setViewCount(doc.data()?.views);
            });
        }
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if(unsub) unsub();
        }
    }, [postId]);

    let toggleButton = () => {
        setState({...state, burgerActive: !state.burgerActive});
    }
//
    return (
        <>

            <motion.div layoutScroll className={[styles.navcontainer, className, state.scroll>0 ? styles.notOnTop : styles.onTop, home? styles.home : null].join(" ")}>
                <nav className={styles.navBar}>
                    {home ? <Link href="/">
                        <a className={styles.logoLink} id="header-name">
                            <h2 className={styles.logo}>Pierre <strong style={{
                                color: "var(--secondary-color)",
                                backgroundColor: "var(--background-color)"
                            }}>ZACHARY</strong></h2>
                        </a>
                    </Link> : <Link href={"/"}><a>
                        <button style={{
                                height: "34px",
                                padding: "0 20px",
                                borderRadius: "9px",
                                margin: 0,
                                backgroundColor: "var(--background-highlight)",
                                color: "var(--secondary-color)"}}>
                                    <span style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "baseline",
                                        fontSize: "var(--font-small)"
                                    }}>
                                        <FontAwesomeIcon icon={faHome}/> Home
                                    </span>
                        </button>
                        </a>
                    </Link>}
                    <div className={styles.columnContainer}>
                        <section className={styles.firstRow}>
                            <LayoutGroup id="desktop-icons-switchs">
                                {viewCount>0 ? <motion.p layout={"position"} title={t("common:viewCount")} style={{fontSize: "var(--font-small)", margin: "auto 5px", color: "var(--primary)"}}>{viewCount} 👀</motion.p> : null }
                                <AuthWidget/>
                                <ThemeSwitch/>
                                <TranslationSwitch/>
                            </LayoutGroup>
                        </section>
                        {home ? <section className={styles.secondRow}>
                            <HeaderSectionV2 keyList={["first", "second", "third", "fourth", "fifth"]}/>
                        </section> : null}
                        { home ? <section className={[styles.mobileRow, state.burgerActive? styles.mBurgerActive : styles.mBurger].join(" ")}>
                            <Hamburger rounded
                                       toggled={state.burgerActive}
                                       toggle={()=>toggleButton()}/>
                        </section> : null}
                    </div>
                </nav>
            </motion.div>
            { home && (<div className={[state.burgerActive? styles.mobileMenuDisplay : styles.mobileMenuHide, styles.mobileMenuContainer].join(" ")}>
                <Link href="#first"><a><h3>{t("header:section1")}</h3></a></Link>
                <Link href="#second"><a><h3>{t("header:section2")}</h3></a></Link>
                <Link href="#third"><a><h3>{t("header:section3")}</h3></a></Link>
                <Link href="#fourth"><a><h3>{t("header:section4")}</h3></a></Link>
                <Link href="#fifth"><a><h3>{t("header:section5")}</h3></a></Link>
                <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "nowrap", overflowX: "scroll"}}>
                    <LayoutGroup  id="mobile-icons-switchs">
                        <AuthWidget/>
                        <TranslationSwitch/>
                        <ThemeSwitch/>
                    </LayoutGroup>
                </div>
            </div>)}
        </>)
}