import {useRouter} from "next/router";
import utilStyles from "/styles/utils.module.css";
import Head from "next/head";
import {Layout} from "../../stories/components/Portfolio/Layout/Layout";
import {Order} from "@medusajs/medusa";
import styles from "./orderPage.module.sass"
import {LineItem} from "@medusajs/medusa/dist/models/line-item";
import {NaturalImageFixedHeight} from "../../lib/utils-components";
import {useTranslation} from "next-i18next";
import {format_price} from "../../lib/medusa-utils";
import {
    faCircleCheck,
    faDollarSign,
    faDolly,
    faEuroSign,
    faReceipt,
    faTruckFast
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useWindowSize} from "react-use";
import Confetti from 'react-confetti'
import {useEffect, useState} from "react";
// @ts-ignore
import { ProgressBar, Step } from "react-step-progress-bar";


const orderSteps: {i18nVar: string, jsx: JSX.Element}[] = [
    {i18nVar: "paymentAccepted", jsx: (<FontAwesomeIcon icon={faReceipt} />)},
    {i18nVar: "confirmed", jsx: (<FontAwesomeIcon icon={faCircleCheck} />)},
    {i18nVar: "waitingForShipping", jsx: (<FontAwesomeIcon icon={faDolly} />)},
    {i18nVar: "send", jsx: (<FontAwesomeIcon icon={faTruckFast} />)},
]
export const getStep = (order: Order) => {
    if(order.fulfillment_status == "shipped"){
        return 3;
    }
    else if(order.fulfillment_status == "fulfilled"){
        return 2;
    }
    else if(order.payment_status == "captured"){
        return 1;
    }
    return 0;
}


export default function OrderPage({ order }: {order: any}) {
    const router = useRouter()
    const {t} = useTranslation()
    const { width, height } = useWindowSize()
    const { new_order } = router.query
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);
    const updateProgress  = () => {
        setTimeout(()=>{
            if(progress<(step*33+1)) {
                setProgress(progress + 5)
            }
        }, 200)
    }
    useEffect(()=>{
        updateProgress();
    }, [step, progress])
    useEffect(()=>{
        if(order) setStep(getStep(order));
    }, [order])
    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <Layout className={utilStyles.defineMaxWidth}>
                    <Head>
                        <title>Loading Order</title>
                    </Head>
                    <div><h1>Loading...</h1></div>
        </Layout>
    }

    return <p>ok</p>

    // Render post...
    // return(order && <Layout className={utilStyles.defineMaxWidth}>
    //         <Head>
    //             <title>Commande {order.id}</title>
    //         </Head>
    //         <main className={styles.main}>
    //             <div className={styles.info}>
    //                 <h1>Commande</h1>
    //                 <p>#{order.id}</p>
    //             </div>
    //             <div className={styles.orderStatus}>
    //                 <ProgressBar
    //                     percent={progress}
    //                     filledBackground="linear-gradient(to right, #0380EF 0%, #05DCD9 100%)"
    //                 >
    //                     {
    //                         orderSteps.map((step)=>{
    //                             return (
    //                             <Step transition="scale" key={step.i18nVar} >
    //                                 {({ accomplished }: any) => <div title={t(step.i18nVar)} className={styles.step+" "+(accomplished ? styles.stepAccomplished : "")}>{step.jsx}</div>}
    //                             </Step>)
    //                         })
    //                     }
    //                 </ProgressBar>
    //             </div>
    //
    //             <div className={styles.orderRecap}>
    //                 {order.items.map((i: LineItem)=>
    //                     <div key={i.id} className={styles.lineItemContainer}>
    //                         <NaturalImageFixedHeight props={{src: i.thumbnail as string, alt: "line-item-img"}} fixedHeight={150}/>
    //                         <div>
    //                             <h1>{i.title}</h1>
    //                             <h2>{t("shop:quantity")} : {i.quantity}</h2>
    //                             <h2>Option : {i.description}</h2>
    //                         </div>
    //                         <h2>{format_price(i.unit_price)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
    //                     </div>)}
    //                 <div className={styles.orderTotal}>
    //                     <div>
    //                         <h2>{t("shop:Subtotal")} : </h2>
    //                         <h2>{format_price(order.subtotal)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
    //                     </div>
    //                     {order.discount_total>0 && <div>
    //                         <h2>{t("shop:discount")} : </h2>
    //                         <h2>- {format_price(order.discount_total)} <FontAwesomeIcon
    //                             icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
    //                     </div>}
    //                     <div>
    //                         <h2>{t("shop:Shipping")} : </h2>
    //                         <h2>{format_price(order.shipping_total)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
    //                     </div>
    //                     <div>
    //                         <h2>Total : </h2>
    //                         <h2>{format_price(order.total)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
    //                     </div>
    //                 </div>
    //             </div>
    //
    //             {new_order && <Confetti
    //                 className={styles.confettiCanvas}
    //                 width={width}
    //                 height={height}
    //                 numberOfPieces={200}
    //                 tweenDuration={4000}
    //                 recycle={false}
    //             />}
    //         </main>
    //
    //     </Layout>
    // )
}



export const getStaticPaths = async ({ locales }: {locales: string[]}) => {
    return {
        // no paths generated at build time
        paths: [],
        fallback: true,
    };
}

// This also gets called at build time
export async function getStaticProps({ locale, params }: any) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    const res = await fetch(`https://pz-medusa-core.herokuapp.com/store/orders/${params.id}`)
    // @ts-ignore
    const order = await res.json().order;

    console.log(order);

    // Pass post data to the page via props
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'chatbot', 'authentification', 'shop'])),
            order },
        // Re-generate the post at most once per second
        // if a request comes in
        revalidate: 1,
    }
}