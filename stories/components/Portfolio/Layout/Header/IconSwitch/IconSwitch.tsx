import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleHalfStroke, faComputer, faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import styles from "./IconSwitch.module.sass";
import {useTranslation} from "react-i18next";
import { motion } from "framer-motion";
import React, {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {useRouter} from "next/router";
import fr_flag from "../../../../../../public/fr_flag.png";
import gb_flag from "../../../../../../public/gb_flag.png";
import Image from "next/image";

export type OptionType = {
    key: string;
    icon: JSX.Element;
    onClick: Function
};

interface IconSwitchProps{
    optionList: OptionType[],
    defaultSelectedKey: string
}

export const ThemeSwitch = () => {
    const {t} = useTranslation();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(()=>{
        if(!mounted){
            setMounted(true);
        }
    });

    if(!mounted){ // on a besoin de connaitre le theme pour faire le rendu, ça sert à rien de le faire sur le serveur
        return null;
    }

    const options: OptionType[] = [
        { key: "system",
            icon: <span title={t("header:system")}><FontAwesomeIcon icon={faComputer} className={styles.optionIcon} /></span>,
          onClick: () => {setTheme('system')}
        },
        { key: "dark", icon: <span title={t("header:dark")}><FontAwesomeIcon icon={faMoon} className={styles.optionIcon} /></span>, onClick: () => {setTheme('dark')} },
        { key: "light", icon: <span title={t("header:light")}><FontAwesomeIcon icon={faSun} className={styles.optionIcon}   /></span>, onClick: () => {setTheme('light')}   },
        { key: "oled", icon: <span title={t("header:oled")}><FontAwesomeIcon icon={faCircleHalfStroke} className={styles.optionIcon} /></span>, onClick: () => {setTheme('oled')}    },
    ];
    return <IconSwitch optionList={options} defaultSelectedKey={theme ? theme : "system"}/>;
};


export const TranslationSwitch = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const handleSelect = (code: string) => {
        router.push('.', '.', { locale: code }); // next
        i18n.changeLanguage(code); // react
    }

    const options = [
        {key: "fr", onClick: () => handleSelect("fr"), icon: <div style={{position: "relative", width: "100%", height: "100%"}}><Image alt={"french flag"} title={"Français"} src={fr_flag} layout={'fill'} objectFit={'contain'} /></div>},
        {key: "en", onClick: () => handleSelect("en"), icon: <div style={{position: "relative", width: "100%", height: "100%"}}><Image alt={"english flag"} title={"English"} src={gb_flag} layout={'fill'} objectFit={'contain'} /></div>},
    ]
    return (<><IconSwitch optionList={options} defaultSelectedKey={i18n.language ? i18n.language : "fr"}/></>);
}



export const IconSwitch = (props: IconSwitchProps) => {

    const [isOpen, toggleMenu] = useState(false);
    const [hovered, setHovered] = useState(props.defaultSelectedKey);
    const [selected, setSelected] = useState(props.defaultSelectedKey);
    if(props.optionList.length == 0){
        return null
    }


    return (
        <>
            <motion.div id={styles["mainContainer"]}
                        layout
                        className={isOpen ? styles.mainContainerOpen : ""}
                        tabIndex={0}
                        onBlur={()=>toggleMenu(false)}>
                {props.optionList.map( (e, k) => {
                    if(isOpen){
                        return (
                            <motion.div key={k} layoutId={e.key+"container"} layout={"position"} onClick={() => {toggleMenu(false); e.onClick(); setSelected(e.key)}}>
                                <div style={{position: "relative"}}>
                                    {hovered == e.key ? <motion.div layoutId={"activeThemeHighlight"} id={styles["hoverTheme"]}></motion.div> : null}
                                    <div className={[styles.innerContainer, e.key == selected ? styles.activeTheme : null].join(" ")} onPointerEnter={(event) => setHovered(e.key)}>
                                        {e.icon}
                                    </div>
                                </div>
                            </motion.div>)
                    }
                    else if(e.key == selected){
                        return (
                            <motion.div key={k} layoutId={e.key+"container"} layout={"position"} onClick={() => {toggleMenu(true)}}>
                                <div className={styles.innerContainer}>
                                    {e.icon}
                                </div>
                            </motion.div>);
                    }
                })}
            </motion.div>
        </>
    )
}