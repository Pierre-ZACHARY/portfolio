import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleHalfStroke, faComputer, faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import styles from "./themeswitch.module.sass";
import {useTranslation} from "react-i18next";
import { motion } from "framer-motion";
import {useState} from "react";
import {useTheme} from "next-themes";

type OptionType = {
    value: string;
    label: string;
    icon: JSX.Element;
};




export const Themeswitchv2 = ({...args}: any) => {
    const {t} = useTranslation();
    const [isOpen, toggleMenu] = useState(false);
    const { theme, setTheme } = useTheme();
    const [hovered, setHovered] = useState("");

    const options: OptionType[] = [
        { value: "system", label: t("header:system"), icon: <FontAwesomeIcon icon={faComputer} className={styles.optionIcon} title={t("header:system")}/>  },
        { value: "dark", label: t("header:dark"), icon: <FontAwesomeIcon icon={faMoon} className={styles.optionIcon} title={t("header:dark")}/> },
        { value: "light", label: t("header:light"), icon: <FontAwesomeIcon icon={faSun} className={styles.optionIcon} title={t("header:light")}/>  },
        { value: "oled", label: t("header:oled"), icon: <FontAwesomeIcon icon={faCircleHalfStroke} className={styles.optionIcon} title={t("header:oled")}/>  },
    ];



    return (
        <>
            <motion.div id={styles["mainContainer"]}
                        layout
                        className={isOpen ? styles.mainContainerOpen : ""}
                        tabIndex={0}
                        onBlur={()=>toggleMenu(false)}>
                {options.map( (e, k) => {
                    if(isOpen){
                        return (
                            <motion.div layoutId={e.value+"container"} layout={"position"} onClick={() => {toggleMenu(false); setTheme(e.value)}}>
                                <div style={{position: "relative"}}>
                                    {hovered == e.value ? <motion.div layoutId={"activeThemeHighlight"} id={styles["hoverTheme"]}></motion.div> : null}
                                    <div className={[styles.innerContainer, e.value == theme ? styles.activeTheme : null].join(" ")} onPointerEnter={(event) => setHovered(e.value)}>
                                        {e.icon}
                                    </div>
                                </div>
                            </motion.div>)
                    }
                    else if(e.value == theme){
                        return (<motion.div layoutId={e.value+"container"} layout={"position"} onClick={() => {toggleMenu(true)}}>{e.icon}</motion.div>);
                    }
                } )}
            </motion.div>
        </>
    )
}