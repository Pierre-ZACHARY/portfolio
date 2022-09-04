import {Layout} from "../../../components/Portfolio/Layout/Layout";
import styles from "./Index.module.css"
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import Image from "next/image";
import profile from "../../../../public/profile.jpg";

import {
    executeHeaderSectionAction,
    headerSectionAction
} from "../../../components/Portfolio/Layout/Header/HeaderSection/headerSectionAction";
import {Scrolldown} from "../../../components/Portfolio/Index/ScollDown/scrolldown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faQuoteLeft, faQuoteRight} from "@fortawesome/free-solid-svg-icons";
import {Blogslider, BlogsliderProps} from "../../../components/Portfolio/Index/BlogSlider/blogslider";
import { motion } from "framer-motion";
import { getDimensions } from "lib/utils";
import {DisplayShop} from "../../../components/Portfolio/Shop/DisplayShop/DisplayShop";


// const eye = "M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z"
// const info = "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"
// const free = "M568.2 336.3c-13.12-17.81-38.14-21.66-55.93-8.469l-119.7 88.17h-120.6c-8.748 0-15.1-7.25-15.1-15.99c0-8.75 7.25-16 15.1-16h78.25c15.1 0 30.75-10.88 33.37-26.62c3.25-20-12.12-37.38-31.62-37.38H191.1c-26.1 0-53.12 9.25-74.12 26.25l-46.5 37.74L15.1 383.1C7.251 383.1 0 391.3 0 400v95.98C0 504.8 7.251 512 15.1 512h346.1c22.03 0 43.92-7.188 61.7-20.27l135.1-99.52C577.5 379.1 581.3 354.1 568.2 336.3zM279.3 175C271.7 173.9 261.7 170.3 252.9 167.1L248 165.4C235.5 160.1 221.8 167.5 217.4 179.1s2.121 26.2 14.59 30.64l4.655 1.656c8.486 3.061 17.88 6.095 27.39 8.312V232c0 13.25 10.73 24 23.98 24s24-10.75 24-24V221.6c25.27-5.723 42.88-21.85 46.1-45.72c8.688-50.05-38.89-63.66-64.42-70.95L288.4 103.1C262.1 95.64 263.6 92.42 264.3 88.31c1.156-6.766 15.3-10.06 32.21-7.391c4.938 .7813 11.37 2.547 19.65 5.422c12.53 4.281 26.21-2.312 30.52-14.84s-2.309-26.19-14.84-30.53c-7.602-2.627-13.92-4.358-19.82-5.721V24c0-13.25-10.75-24-24-24s-23.98 10.75-23.98 24v10.52C238.8 40.23 221.1 56.25 216.1 80.13C208.4 129.6 256.7 143.8 274.9 149.2l6.498 1.875c31.66 9.062 31.15 11.89 30.34 16.64C310.6 174.5 296.5 177.8 279.3 175z"
// const contact = "M263.4 16.12C198.2 14.06 136.2 38.14 89.31 83.67C42.03 129.5 16 191.2 16 257.2c0 118.6 87.89 221.1 204.5 238.5C221.7 495.9 222.8 496 224 496c11.69 0 21.92-8.547 23.7-20.45c1.953-13.11-7.078-25.33-20.19-27.28C134.3 434.3 64 352.2 64 257.2c0-52.94 20.86-102.3 58.73-139.1c37.53-36.41 86.25-55.83 139.2-54.03C364.5 67.2 448 157.9 448 266.3v19.05c0 24.45-19.73 44.36-44 44.36S360 309.8 360 285.3V168.7c0-13.25-10.75-23.1-24-23.1c-11.92 0-21.38 8.855-23.24 20.25C294.4 151.9 272.2 144 248 144c-61.75 0-112 50.25-112 111.1s50.25 111.1 112 111.1c30.75 0 58.62-12.48 78.88-32.62c16.41 25.4 44.77 42.32 77.12 42.32c50.73 0 92-41.44 92-92.36V266.3C496 132.2 391.6 19.1 263.4 16.12zM248 320c-35.3 0-64-28.7-64-63.1c0-35.29 28.7-63.1 64-63.1s64 28.7 64 63.1C312 291.3 283.3 320 248 320z"
// const paths = [eye, info, free, contact];



export interface IndexProps{
    blogPosts: BlogsliderProps
}


interface IndexState{
    mounted: boolean
}



export const Index = ({blogPosts = {content: [{
        id: "dadza",
        title: "Bonjour",
        date: "2020-01-01",
        descriptionHtml: "adfzaf",
        lastupdated: true,
        viewCount: 0,
        mostViewed: false
    }]}}: IndexProps) => {
    const { t } = useTranslation();
    const [state, setState] = useState<IndexState>({mounted: false});
    const selected_index: number = useAppSelector(state => state.headerSection.selected);
    const dispatch = useAppDispatch();
    const Skills = useRef(null);
    const Blog = useRef(null);
    const Shop = useRef(null);
    const Introduction = useRef(null);
    const Contact = useRef(null);

    const sectionRefs = [
        { section: 0, ref: Introduction },
        { section: 1, ref: Skills },
        { section: 2, ref: Blog },
        { section: 3, ref: Shop },
        { section: 4, ref: Contact },
    ]

    let previousSection = useRef<number | undefined>(undefined);



    const setScreenHeight = () => {
        let elem = document.getElementById(styles["mobilePresentation"])!;
        if(parseInt(elem.style.height) > window.innerHeight) elem.setAttribute("style", "height:"+window.innerHeight+"px;");
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 75;

            const selected = sectionRefs.find(({ section, ref }) => {
                const ele = ref.current;
                if (ele) {
                    const { offsetBottom, offsetTop } = getDimensions(ele);
                    return scrollPosition > offsetTop && scrollPosition < offsetBottom;
                }
            });


            if ( selected && (!previousSection.current || selected.section != previousSection.current)) {
                previousSection.current = selected.section;
                executeHeaderSectionAction(dispatch, headerSectionAction.Select, selected.section);
            }
        };
       setScreenHeight();
       window.addEventListener("resize", setScreenHeight);
       handleScroll();
       window.addEventListener("scroll", handleScroll);


        return () => {
            window.removeEventListener("scroll", handleScroll); // this event listener is removed after the new route loads
            window.removeEventListener("resize", setScreenHeight);
        }
    }, []);


    if(state.mounted){
        if(selected_index != 0){
            document.getElementById("header-name")?.classList.add(styles.showHeaderName);
        }
        else{
            document.getElementById("header-name")?.classList.remove(styles.showHeaderName);
        }
    }



    return (
        <>
            <Layout home paddingTop={0}>
                <div className={styles.home} id="first" ref={Introduction}>
                    <div className={styles.screen} style={{paddingTop: 0}}>
                        <div id={styles["mobilePresentation"]}>
                            <Image id="profilePicture" src={profile} alt="Profile Picture" width="100%" height="100%" quality={"100"}/>
                            <h1 style={{marginTop: 20}}>Pierre Zachary</h1>
                            <a href="/cv.pdf" target="_blank"><button><FontAwesomeIcon icon={faDownload}/>  {t("index:downloadCv")}</button></a>
                            <Scrolldown/>
                        </div>
                    </div>
                    <div className={styles.screen}>
                        <div className={styles.presentationContainer}>
                            <motion.h2 initial={{ opacity: 0, y: -50 }} viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }} transition={{duration: 1, delay: 0.3}}>{t("index:Welcome")} <span>👋</span> <span dangerouslySetInnerHTML={{ __html: t("index:IntroHtml") }}/> </motion.h2>
                            <motion.h2 initial={{ opacity: 0, y: -50 }} viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }} transition={{duration: 1, delay: 0.3}} dangerouslySetInnerHTML={{__html: t("index:Intro2Html")}}></motion.h2>
                            <motion.h2 initial={{ opacity: 0, y: -50 }} viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }} transition={{duration: 1, delay: 0.3}} dangerouslySetInnerHTML={{__html: t("index:Intro3Html")}}></motion.h2>
                        </div>
                    </div>
                </div>
                <div className={styles.screen} id="second" ref={Skills}>
                    <h1>{t("header:section2")}</h1>
                </div>
                <div className={styles.screen} id="third" ref={Blog} style={{minHeight: "unset"}}>
                    <h1>{t("header:section3")}</h1>
                    <Blogslider content={blogPosts.content}/>
                </div>
                <div className={styles.screen} id="fourth" ref={Shop}>
                    <h1>{t("header:section4")}</h1>
                    <DisplayShop/>
                </div>
                <div className={styles.screen} id="fifth" ref={Contact}>
                    <h1>{t("header:section5")}</h1>
                </div>
            </Layout>
        </>
    )
}