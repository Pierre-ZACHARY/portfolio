import Image from "next/image";
import styles from "./blogcard.module.css"
import cn from "classnames";
import {backgroundImages} from "polished";


interface BlogcardProps {
    cardtitle: string;
    description: string;
    imagesrc: string;
    mostviewed: boolean;
    lastupdated: boolean;
}

export const Blogcard = ({
                             cardtitle,
                             description,
                             imagesrc,
                             mostviewed,
                             lastupdated,
                             ...props
                         }: BlogcardProps) => {
    console.log(cardtitle)
    let infotext = ""
    if(lastupdated){
        infotext += "⏱️ Last Post\n"
    }
    if(mostviewed){
        infotext += "👀️ Most Viewed"
    }
    let info = <pre className={styles.cardInfo}>{infotext}</pre>
    return (
        <>
            <div className={[styles.card, cn({
                [styles.mostViewed]: mostviewed,
                [styles.lastUpdated]: lastupdated,
            })].join(" ")} style={{backgroundImage: `url(${imagesrc})`}}>

                <div className={styles.cardGradient}>
                    <h2 className={styles.cardTitle}>{cardtitle}</h2>
                    {info}
                </div>

            </div>

        </>
    );
}