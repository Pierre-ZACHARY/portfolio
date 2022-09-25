import styles from "./Layout.module.sass"
import Head from "next/head";
import {AnimatePresence, LayoutGroup, motion} from "framer-motion";
import Link from "next/link";
import {AuthWidget} from "../Other/Auth/AuthWidget";
import {ThemeSwitch, TranslationSwitch} from "../Layout/Header/IconSwitch/IconSwitch";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faChevronDown, faBars, faXmark} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import { Suspense } from 'react'
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import {setAnimateLine} from "./LayoutReducer";
import InnerHeightCSSVariable from "../Utils/InnerHeightCSSVariable";

const CartWidget = dynamic(() => import("../Shop/CartWidget/CartWidget"), {
    suspense: true,
})

const Chatbot = dynamic(() => import("../Layout/Chatbot/chatbot"), {
    suspense: true,
})

export const Layout = (props: any) => {
    const dispatch = useAppDispatch()
    const [scroll, setScroll] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(()=>{
        const handleScroll = () => {setScroll(window.scrollY)}
        window.addEventListener("scroll", handleScroll)
        return ()=>window.removeEventListener("scroll", handleScroll)
    }, [])

    const [pageFullyLoaded, setPageFullyLoaded] = useState<boolean>(false);

    function handlePageLoad() {
        setPageFullyLoaded(true)
    }
    useEffect(()=>{
        if (document.readyState === "complete") {
            handlePageLoad();
        }else{
            window.addEventListener("load", handlePageLoad);
            return ()=>window.removeEventListener("load", handlePageLoad);
        }}, [])

    const animateLine = useAppSelector(state => state.layout.animateLine);
    const initialLine = useAppSelector(state => state.layout.initialLine);

    useEffect(()=>{if(props.selected){
        switch(props.selected){
            case "blog":
                dispatch(setAnimateLine({x:0, width: 96}))
                break;
            case "shop":
                dispatch(setAnimateLine({x: 233, width: 98}))
                break;
            case "about":
                dispatch(setAnimateLine({x: 105, width: 126}))
                break;
        }
    }}, [props.selected])


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
                <motion.header layoutScroll={true}  className={(scroll>0 ? styles.showShadow : "")+" "+(menuOpen ? styles.menuOpen : "")} style={{position: "fixed", top: 0, left: 0}}>

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
                                        {/*TODO j'arrive pas à utiliser framer sur la ligne ??? Elle revient toujours tout en haut quand je change de page ( pourtant y'a bien layoutscroll ) */}
                                    </div>
                                    <div className={props.selected=="about" ? styles.selected : ""}>
                                        <Link href={"/"}>
                                            <a>About </a>
                                        </Link>
                                    </div>
                                    <div className={props.selected=="shop" ? styles.selected : ""}>
                                        <Link href={"/shop"}>
                                            <a>Shop</a>
                                        </Link>
                                    </div>
                                    <motion.span transition={{
                                                        x: { duration: 0.3 },
                                                        width: { duration: 0.3 },
                                                        layout: { duration: 0.3 }
                                                    }}
                                                 animate={animateLine}
                                                 initial={initialLine}
                                                 className={styles.selectedLine}/>

                        </section>
                    </nav>
                    <button className={styles.mobileShow} onClick={()=>{setMenuOpen(!menuOpen)}}><FontAwesomeIcon icon={menuOpen ? faXmark : faBars}/></button>
                </motion.header>
                <main>
                    <InnerHeightCSSVariable>
                        {props.children}
                    </InnerHeightCSSVariable>
                </main>
                <motion.div layoutScroll className={styles.fixedWidget}>
                    {pageFullyLoaded &&
                        <><Suspense fallback={``}>
                            <CartWidget/>
                        </Suspense>
                        <Suspense fallback={""}>
                        <Chatbot/>
                        </Suspense></>
                    }

                </motion.div>
            </div>
        </>
    )
}