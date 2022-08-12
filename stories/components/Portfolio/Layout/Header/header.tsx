import {HeaderSection} from "./HeaderSection/headerSection";
import styles from "./header.module.css"
import Link from "next/link";
import {useEffect, useState} from "react";
import { Squash as Hamburger } from 'hamburger-react'
import {useTranslation} from "react-i18next";
import {ThemeSwitch, TranslationSwitch} from "./IconSwitch/IconSwitch";
import {LayoutGroup} from "framer-motion";
import { HeaderSectionV2 } from "./HeaderSection/HeaderSectionV2";

interface HeaderProps{
    content: string
}

export const Header = ({content}: HeaderProps) => {
    const { t } = useTranslation();

    const [state, setState] = useState({scroll: 0, burgerActive: false});
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setState({scroll: window.scrollY, burgerActive: state.burgerActive});
        });
    }, []);

    let toggleButton = () => {
        setState({...state, burgerActive: !state.burgerActive});
    }
//
    return (
        <>
            <div className={[styles.navcontainer, state.scroll>0 ? styles.notOnTop : styles.onTop].join(" ")}>
                <nav className={styles.navBar}>
                    <Link href="/"><a className={styles.logoLink} id="header-name"><h2 className={styles.logo} >Pierre <strong style={{color: "var(--secondary-color)", backgroundColor: "var(--background-color)"}}>ZACHARY</strong></h2></a></Link>
                    <div className={styles.columnContainer}>
                        <section className={styles.firstRow}>
                            <LayoutGroup id="desktop-icons-switchs">
                                <ThemeSwitch/>
                                <TranslationSwitch/>
                            </LayoutGroup>
                        </section>
                        <section className={styles.secondRow}>
                            <HeaderSectionV2 keyList={["first", "second", "third", "fourth", "fifth"]}/>
                        </section>
                        <section className={[styles.mobileRow, state.burgerActive? styles.mBurgerActive : styles.mBurger].join(" ")}>
                            <Hamburger rounded
                                       toggled={state.burgerActive}
                                       toggle={()=>toggleButton()}/>
                        </section>
                    </div>
                </nav>
            </div>
            <div className={[state.burgerActive? styles.mobileMenuDisplay : styles.mobileMenuHide, styles.mobileMenuContainer].join(" ")}>
                <Link href="#first"><a><h3>{t("header:section1")}</h3></a></Link>
                <Link href="#second"><a><h3>{t("header:section2")}</h3></a></Link>
                <Link href="#third"><a><h3>{t("header:section3")}</h3></a></Link>
                <Link href="#fourth"><a><h3>{t("header:section4")}</h3></a></Link>
                <Link href="#fifth"><a><h3>{t("header:section5")}</h3></a></Link>
                <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <LayoutGroup  id="mobile-icons-switchs">
                        <TranslationSwitch/>
                        <ThemeSwitch/>
                    </LayoutGroup>
                </div>
            </div>
        </>)
}