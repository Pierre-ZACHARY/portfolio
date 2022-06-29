import {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "./Home.module.css";
import profilePic from '../../../public/vercel.svg'
import Link from "next/link";
import Layout, {siteTitle} from "../../components/NextjsExample/Layout/layout";
import utilStyles from "/styles/utils.module.css";
import {Component} from "react";
import Date from '../../components/NextjsExample/Date/date';

export class Home extends Component<{ allPostsData: {date: string; id: string; title: string;}[] }> {
    render() {
        let allPostsData = this.props.allPostsData;
        console.log(allPostsData);
        return (
            <Layout home>
                <Head>
                    <title>{siteTitle}</title>
                </Head>
                <section className={utilStyles.headingMd}>
                    <p>Hello Im Pierre !</p>
                    <p>
                        (This is a sample website - you’ll be building a site like this on{' '}
                        <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
                    </p>
                </section>
                <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                    <h2 className={utilStyles.headingLg}>Blog</h2>
                    <ul className={utilStyles.list}>
                        {allPostsData.map(({ id, date, title }: {date: string; id: string; title: string;}) => (
                            <li className={utilStyles.listItem} key={id}>
                                <Link href={`/posts/${id}`}>
                                    <a>{title}</a>
                                </Link>
                                <br />
                                <small className={utilStyles.lightText}>
                                    <Date dateString={date} />
                                </small>
                            </li>
                        ))}
                    </ul>
                </section>
            </Layout>
        )
    }
}