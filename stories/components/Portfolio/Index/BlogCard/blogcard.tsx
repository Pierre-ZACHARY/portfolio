import Image from "next/image";
import styles from "./blogcard.module.css"
import cn from "classnames";
import {backgroundImages} from "polished";
import {format, parseISO} from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";


interface BlogcardProps {
    cardtitle: string;
    description: string;
    imagesrc: string;
    mostviewed: boolean;
    lastupdated: boolean;
    datestringiso: string;
    id: string;
}

export const Blogcard = ({
                             cardtitle,
                             description,
                             imagesrc,
                             mostviewed,
                             lastupdated,
                             datestringiso,
                             id,
                             ...props
                         }: BlogcardProps) => {
    let infotext = ""
    if(lastupdated){
        infotext += "⏱️ Last Post\n"
    }
    if(mostviewed){
        infotext += "👀️ Most Viewed"
    }
    let info = <pre className={styles.cardInfo}>{infotext}</pre>
    let date;

    date = parseISO(datestringiso)
    if(date.toDateString() === "Invalid Date"){
        date = parseISO(new Date(parseInt(datestringiso)).toISOString())
    }

    const formated_date = format(date, 'LLLL d, yyyy');
    return (
        <>
            <Link  href={"/posts/"+id}>
                <a>
                    <div className={[styles.card, cn({
                        [styles.mostViewed]: mostviewed,
                        [styles.lastUpdated]: lastupdated,
                    })].join(" ")} >
                        <div className={styles.cardBorder}><div className={styles.cardBorderChild}></div></div>
                        <div className={styles.cardGradient}>
                            {info}
                            <h5 className={styles.cardDate}>{formated_date}</h5>
                            <hr className={styles.hrRounded}/>
                            <motion.h3 layoutId={id} className={styles.cardTitle}>{cardtitle}</motion.h3>
                        </div>
                        <div style={{width: "100%", height:"100%", borderRadius: "6px", overflow: "hidden"}}>
                            <motion.img layoutId={id+"-img"} src={imagesrc} alt="post thumbnail"/>
                        </div>
                        <div className={styles.cardShadow}><div className={styles.cardShadowChild}></div></div>

                    </div>
                </a>
            </Link>
        </>
    );
}