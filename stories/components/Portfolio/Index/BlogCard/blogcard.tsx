import Image from "next/image";
import styles from "./blogcard.module.css"
import cn from "classnames";
import {backgroundImages} from "polished";
import {format, parseISO} from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";
import {useTranslation} from "next-i18next";


interface BlogcardProps {
    cardtitle: string;
    descriptionHtml: string;
    mostviewed: boolean;
    lastupdated: boolean;
    datestringiso: string;
    id: string;
}

export const Blogcard = ({
                             cardtitle,
                             descriptionHtml,
                             mostviewed,
                             lastupdated,
                             datestringiso,
                             id,
                             ...props
                         }: BlogcardProps) => {

    const {t} = useTranslation()
    let infotext = ""
    if(lastupdated){
        infotext += "⏱️ "+t("index:lastUpdated")+"\n"
    }
    if(mostviewed){
        infotext += "👀️ "+t("index:MostViewed")
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
                    <motion.div className={[styles.card, cn({
                        [styles.mostViewed]: mostviewed,
                        [styles.lastUpdated]: lastupdated,
                    })].join(" ")}
                                initial={{
                                    scale: 1,
                                }}
                                whileHover={{
                                    scale: 1.05,
                                }}
                    >
                        <div className={styles.cardBorder}><div className={styles.cardBorderChild}></div></div>
                        <div className={styles.cardBackground}>
                            <h4 className={styles.cardTitle} style={{color: "var(--primary)"}}>{cardtitle}</h4>
                            <h6 className={styles.cardDate} style={{color: "var(--primary)"}}>{formated_date}</h6>
                            <div className={styles.clamp3lines} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />

                            {info}
                        </div>
                        <div className={styles.cardShadow}><div className={styles.cardShadowChild}></div></div>

                    </motion.div>
                </a>
            </Link>
        </>
    );
}