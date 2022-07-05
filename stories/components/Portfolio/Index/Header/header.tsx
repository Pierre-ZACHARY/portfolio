import {HeaderSection} from "./HeaderSection/headerSection";
import ThemeSwitch from "./ThemeSwitch/themeswitch";
import styles from "./header.module.css"
import Link from "next/link";
import {useEffect, useState} from "react";
import { HamburgerSqueeze } from 'react-animated-burgers'
import {TranslationSwitch} from "./TranslationSwitch/translationswitch";


const Separator = () => {
    return (<div className={styles.separator}></div>);
}


interface HeaderProps{
    content: string
}

export const Header = ({content}: HeaderProps) => {

    const [state, setState] = useState({scroll: 0, burgerActive: false});
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setState({scroll: window.scrollY, burgerActive: state.burgerActive});
        });
    }, []);

    let toggleButton = () => {
        setState({scroll: state.scroll, burgerActive: !state.burgerActive});
    }

    return (
        <>
            <div className={[styles.navcontainer, state.scroll>0 ? styles.notOnTop : styles.onTop].join(" ")}>
                <nav className={styles.navBar}>
                    <Link href="/"><a className={styles.logoLink}><h2 className={styles.logo}>Pierre ZACHARY</h2></a></Link>
                    <div className={styles.columnContainer}>
                        <section className={styles.firstRow}>
                            <TranslationSwitch className={styles.flagSelect} alignToRight={true}/>
                            <ThemeSwitch alignToRight={true} className={styles.themeSelect}/>
                        </section>
                        <section className={styles.secondRow}>
                            <HeaderSection content=""/>
                        </section>
                        <section className={styles.mobileRow}>
                            <HamburgerSqueeze className={state.burgerActive? styles.mBurgerActive : styles.mBurger} isActive={state.burgerActive} toggleButton={toggleButton} />
                        </section>
                    </div>
                </nav>
            </div>
            <div className={[state.burgerActive? styles.mobileMenuDisplay : styles.mobileMenuHide, styles.mobileMenuContainer].join(" ")}>
                <Link href="#"><a><h3>First</h3></a></Link>
                <Link href="#"><a><h3>Second</h3></a></Link>
                <Link href="#"><a><h3>Third</h3></a></Link>
                <Link href="#"><a><h3>Fourth</h3></a></Link>
                <ThemeSwitch/>
                <TranslationSwitch  />
            </div>
        </>)
}