import React from "react";
import styles from "../../../styles/Home.module.css";


interface NextHomeCardProps{
    titleLabel: string;
    description: string;
    link?: string;
}

export const NextHomeCard = ({
                           titleLabel,
                           description,
                           link = "#",
                           ...props
}: NextHomeCardProps) => {
    return (
        <div className={styles.grid}>
            <a href={link}
               className={styles.card}>
                <h2>{titleLabel}</h2>
                <p>{description}</p>
            </a>
        </div>
    );
};