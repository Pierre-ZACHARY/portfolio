import Image from "next/image";
import styles from "./blogcard.module.css"
import cn from "classnames";
import {backgroundImages} from "polished";
import {format, parseISO} from "date-fns";


interface BlogcardProps {
    cardtitle: string;
    description: string;
    imagesrc: string;
    mostviewed: boolean;
    lastupdated: boolean;
    datestringiso: string;
}

export const Blogcard = ({
                             cardtitle,
                             description,
                             imagesrc,
                             mostviewed,
                             lastupdated,
                             datestringiso,
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
            <div className={[styles.card, cn({
                [styles.mostViewed]: mostviewed,
                [styles.lastUpdated]: lastupdated,
            })].join(" ")} >
                <div style={{backgroundImage: `url(${imagesrc})`}}/>
                <div className={styles.cardBorder}><div className={styles.cardBorderChild}></div></div>
                <div className={styles.cardGradient}>
                    {info}
                    <h5 className={styles.cardDate}>{formated_date}</h5>
                    <hr className={styles.hrRounded}/>
                    <h3 className={styles.cardTitle}>{cardtitle}</h3>
                </div>
                <div className={styles.cardShadow}><div className={styles.cardShadowChild}></div></div>

            </div>

        </>
    );
}