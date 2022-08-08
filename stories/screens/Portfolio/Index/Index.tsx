import {Layout} from "../../../components/Portfolio/Layout/Layout";
import styles from "./Index.module.css"
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../../../../redux/hooks";
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

const getDimensions = (ele:any) => {
    const { height } = ele.getBoundingClientRect();
    const offsetTop = ele.offsetTop;
    const offsetBottom = offsetTop + height;

    return {
        height,
        offsetTop,
        offsetBottom,
    };
};

export interface IndexProps{
    blogPosts: BlogsliderProps
}


interface IndexState{
    section: number | undefined
}

export const Index = ({blogPosts = {content: [{
        id: "dadza",
        title: "Bonjour",
        date: "2020-01-01",
        thumbnailUrl: "",
        lastupdated: true,
    }]}}: IndexProps) => {
    const { t } = useTranslation();
    const [state, setState] = useState<IndexState>({section: undefined});
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



            if (selected && selected.section !== state.section) {
                setState({...state, section: selected.section});
                if(selected.section!=0){
                    document.getElementById("header-name")!.classList.add(styles.showHeaderName);
                }
                else{
                    document.getElementById("header-name")!.classList.remove(styles.showHeaderName);
                }
                executeHeaderSectionAction(dispatch, headerSectionAction.Select, selected.section);
            } else if (!selected && state.section) {
                setState({...state, section: undefined});
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [state.section]);

    return (
        <>
            <Layout>
                <div className={styles.home} id="first" ref={Introduction}>
                    <div className={styles.screen} >
                        <Image id="profilePicture" src={profile} alt="Profile Picture"/>
                        <h1 style={{marginTop: 20}}>Pierre Zachary</h1>
                        <a href="/cv.pdf" target="_blank"><button><FontAwesomeIcon icon={faDownload}/>  {t("index:downloadCv")}</button></a>
                        <Scrolldown/>

                    </div>
                    <div className={styles.screen}>
                        <div className={styles.presentationContainer}>
                            <p id="presentation">
                                Bonjour et bienvenue sur mon site ! Je m'appelle Pierre Zachary, j'ai 21 ans et je suis en dernière année d'études d'informatique, <strong>spécialisé dans le développement cross-platforme, la performance et la sécurité</strong>. J'ai créé ce site pour montrer une partie de mes compétences et vous informer des autres. N'hésitez pas à me <strong>contacter par mail ou via le widget de chat</strong> en direct présent en bas à droite de votre écran.
                            </p>
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
                </div>
                <div className={styles.screen} id="fifth" ref={Contact}>
                    <h1>{t("header:section5")}</h1>
                </div>
            </Layout>
        </>
    )
}