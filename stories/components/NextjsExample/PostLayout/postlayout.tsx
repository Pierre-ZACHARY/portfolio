import Head from 'next/head';
import Image from 'next/image';
import styles from './postlayout.module.css';
import utilStyles from '/styles/utils.module.css';
import Link from 'next/link';
import profilePic from "../../../../public/profile.jpg"
import { motion } from 'framer-motion';
import {ThemeSwitch, TranslationSwitch} from "../../Portfolio/Layout/Header/IconSwitch/IconSwitch";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

const name = 'Pierre ZACHARY';
export const siteTitle = 'Blog de Pierre Zachary';

export default function PostLayout({ children, home }: any) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/public/favicon.ico" />
                <meta
                    name="description"
                    content="Learn how to build a personal website using Next.js"
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle,
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                <title>{siteTitle}</title>
            </Head>
            <motion.nav layoutScroll className={styles.postHeaderNav}>
                <div className={styles.navContainer}>
                    <section>
                        <Link href={"/"}><a><button style={{padding: "9px 15px", borderRadius: "9px", margin: 0}}><span><FontAwesomeIcon icon={faHome}/> Home</span></button></a></Link>
                    </section>
                    <section style={{display: "flex"}}>
                        <ThemeSwitch/>
                        <TranslationSwitch/>
                    </section>
                </div>
            </motion.nav>
            {/*<header className={styles.header}>*/}
            {/*    /!*<Link href="/">*!/*/}
            {/*    /!*    <a>*!/*/}
            {/*    /!*        <Image*!/*/}
            {/*    /!*            priority*!/*/}
            {/*    /!*            src={profilePic}*!/*/}
            {/*    /!*            className={utilStyles.borderCircle}*!/*/}
            {/*    /!*            height={108}*!/*/}
            {/*    /!*            width={108}*!/*/}
            {/*    /!*            alt={name}*!/*/}
            {/*    /!*        />*!/*/}
            {/*    /!*    </a>*!/*/}
            {/*    /!*</Link>*!/*/}
            {/*    /!*<h2 className={utilStyles.headingLg}>*!/*/}
            {/*    /!*    <Link href="/">*!/*/}
            {/*    /!*        <a className={utilStyles.colorInherit}>{name}</a>*!/*/}
            {/*    /!*    </Link>*!/*/}
            {/*    /!*</h2>*!/*/}
            {/*</header>*/}
            <main className={styles.layoutMain}>
                {children}
            </main>
            <footer></footer>
        </div>
    );
}