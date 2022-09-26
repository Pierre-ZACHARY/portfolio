import styles from "./Hero.module.sass"
import Image from "next/image";
import {AnimatePresence, motion } from "framer-motion";
import { Suspense } from 'react'
const Spline = dynamic(() => import('@splinetool/react-spline'), {
    suspense: true,
})
import {useEffect, useRef, useState} from "react";
import {Application} from "@splinetool/runtime";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {useMorph, useMorphList } from 'react-morph';
import {useTranslation} from "next-i18next";
import Link from "next/link";
import LoadAfterInteractive from "../../Utils/LoadAfterInteractive";
import LoadWhenVisible from "../../Utils/LoadWhenVisible";
import dynamic from "next/dynamic";

let current_to: NodeJS.Timeout | null = null;

export default function Hero(){

    const {t} = useTranslation();

    const firstRow = t("index:firstRow")
    const secondRow = t("index:secondRow")
    const featuresString = t("index:features")
    const features = featuresString.split(";")
    const [selected, setSelected] = useState(2)
    const [feature, setFeatures] = useState(0)
    const splineRef = useRef<Application | null>(null);
    useEffect(()=>{
        current_to = setTimeout(()=>setSelected((selected+1)%3), 4000);
        if(splineRef.current){
            splineRef.current?.findObjectByName("Rectangle "+selected)?.emitEvent("mouseDown")
        }
    }, [selected])
    useEffect(()=>{
        setTimeout(()=>setFeatures((feature+1)%features.length), 4000)
    }, [feature])
    useEffect(()=>{
        if(splineRef.current){
         if(window.screen.width <= 768){
             splineRef.current?.findObjectByName("MobileZoom")?.emitEvent("mouseDown")
         }
         else{
             splineRef.current?.findObjectByName("DesktopZoom")?.emitEvent("mouseDown")
         }
     }
    }, [splineRef.current])
    function select(i: number){
        if(current_to) clearTimeout(current_to);
        setSelected(i);
    }


    return <div className={styles.main}>
        <div className={styles.arrowScrollForMore}>
            <p>{t("index:scrollForMore")}</p>
            <motion.div initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{ease: "easeInOut", repeat: Infinity, duration: 2}}><FontAwesomeIcon icon={faArrowDown}/></motion.div>

        </div>
        <div className={styles.presentation}>

            <div className={styles.line+" "+styles.profile}>
                <Image alt={"profile-picture"} src={"/profile.jpg"} width={40} height={40} className={styles.profilePicture}/>
                <h3>Pierre Zachary</h3>
            </div>
            <div className={styles.line}>
                <h1>{t("index:Welcome")}</h1>
                <motion.div className={styles.emoji} initial={{rotateZ: 0}} animate={{rotateZ: [0, 45, -45, 45, -45, 0]}} transition={{delay: 1, rotateZ: {duration: 1.4}}}><span>👋</span></motion.div>
                {firstRow.split(" ").map((t)=><h1 key={t}>{t}</h1>)}
            </div>
            <p>➡️ {t("index:intro")}</p>

            <div className={styles.line}>
                <h2>{secondRow}</h2>

                <h2 id={styles["h2Colored"+feature%4]} className={styles.feature}><FontAwesomeIcon icon={faArrowRight}/> {features[feature]}</h2>

            </div>

            <Link href={"/cv.pdf"}><a target={"__blank"}>
                <div className={styles.buttonShadow}>
                    <span id={styles["background-gradient"+(feature%4)]} className={styles.background}/>
                    <button id={styles["gradient"+(feature%4)]}>{t("index:downloadCv")}</button>
                    <button className={styles.hidden}>{t("index:downloadCv")}</button>
                </div>
            </a></Link>
        </div>
        <div className={styles.techStack}>
            <h1>{t("index:websiteStack")}</h1>
            <div className={styles.splineContainer}>
                <LoadAfterInteractive>
                    <LoadWhenVisible>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Spline scene="https://prod.spline.design/aFPE4IisyKst-uJq/scene.splinecode" onLoad={(spline)=>{splineRef.current=spline;}}/>
                        </Suspense>
                    </LoadWhenVisible>
                </LoadAfterInteractive>
            </div>
            <div className={styles.selectStack}>
                <div className={selected == 0 ? styles.selected : ""} onClick={()=>select(0)}>
                    <h1>Services</h1>
                    <p>Firebase, Medusa, Meilisearch, Discord, Stripe...</p>
                </div>
                <div className={selected == 1 ? styles.selected : ""} onClick={()=>select(1)}>
                    <h1>Back</h1>
                    <p>Nextjs, Storybook, Prisma...</p>
                </div>
                <div className={selected == 2 ? styles.selected : ""} onClick={()=>select(2)}>
                    <h1>Front</h1>
                    <p>React, Redux, Sass, Spline...</p>
                </div>
            </div>
        </div>
    </div>
}