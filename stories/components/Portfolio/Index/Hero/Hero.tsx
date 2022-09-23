import styles from "./Hero.module.sass"
import Image from "next/image";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import {useEffect, useRef, useState} from "react";
import {Application} from "@splinetool/runtime";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

let current_to: NodeJS.Timeout | null = null;

export default function Hero(){


    const [selected, setSelected] = useState(2)
    const splineRef = useRef<Application | null>(null);
    useEffect(()=>{
        current_to = setTimeout(()=>setSelected((selected+1)%3), 4000);
        if(splineRef.current){
            splineRef.current?.findObjectByName("Rectangle "+selected)?.emitEvent("mouseDown")
        }
    }, [selected])
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
            <p>Scroll for more</p>
            <motion.div initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{ease: "easeInOut", repeat: Infinity, duration: 2}}><FontAwesomeIcon icon={faArrowDown}/></motion.div>

        </div>
        <div className={styles.presentation}>
            <div className={styles.line}>
                <Image src={"/profile.jpg"} width={40} height={40} className={styles.profilePicture}/>
                <h3>Pierre Zachary</h3>
            </div>
            <div className={styles.line}>
                <h1>Hello</h1>
                <motion.div className={styles.emoji} initial={{rotateZ: 0}} animate={{rotateZ: [0, 45, -45, 45, -45, 0]}} transition={{delay: 1, rotateZ: {duration: 1.4}}}><span>👋</span></motion.div>
                <h1>Welcome</h1> <h1>on</h1> <h1>my</h1> <h1>website !</h1>
            </div>
            <p>➡️I'm a French IT student interested in all sorts of software development</p>
            <h2>This is a <u>features-oriented</u> portfolio ⬇️</h2>
            <div className={styles.featuresContainer}>
                <h1>E-Commerce</h1>
                <h2>Internationalization</h2>
                <h1>Blog</h1>
                <h2>Comment Section</h2>
                <h1>Authentication</h1>
                <h2>Custom Search</h2>
                <h1>3D Scenes</h1>
                <h2>Theming</h2>
                <h1>Animations</h1>
                <h2>Lighthouse Optimised</h2>
                <h1>Chat-bot</h1>
                <h2>Realtime</h2>
            </div>

        </div>
        <div className={styles.techStack}>
            <h1>Website stack</h1>
            <div className={styles.splineContainer}>
                <Spline scene="https://prod.spline.design/aFPE4IisyKst-uJq/scene.splinecode" onLoad={(spline)=>{splineRef.current=spline;}}/>

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