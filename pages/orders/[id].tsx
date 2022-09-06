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
    {i18nVar: "shop:paymentAccepted", jsx: (<FontAwesomeIcon icon={faReceipt} />)},
    {i18nVar: "shop:confirmed", jsx: (<FontAwesomeIcon icon={faCircleCheck} />)},
    {i18nVar: "shop:waitingForShipping", jsx: (<FontAwesomeIcon icon={faDolly} />)},
    {i18nVar: "shop:send", jsx: (<FontAwesomeIcon icon={faTruckFast} />)},
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


export default function OrderPage({order}: {order: Order}) {
    const router = useRouter()
    const {t} = useTranslation()
    const [widthheight, setWidthHeight] = useState<undefined | { width: number, height: number }>(undefined);
    const { new_order } = router.query
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);

    useEffect(()=>{
        setWidthHeight({width: window.innerWidth, height: window.innerHeight});
    }, [])
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

    // Render post...
    return(order && <Layout className={utilStyles.defineMaxWidth}>
            <Head>
                <title>{t("shop:Order")+" "+order.id}</title>
            </Head>
            <main className={styles.main}>
                <div className={styles.info}>
                    <h1>{t("shop:Order")}</h1>
                    <p>#{order.id}</p>
                </div>
                <div className={styles.orderStatus}>
                    <ProgressBar
                        percent={progress}
                        filledBackground="linear-gradient(to right, #0380EF 0%, #05DCD9 100%)"
                    >
                        {
                            orderSteps.map((step)=>{
                                return (
                                <Step transition="scale" key={step.i18nVar} >
                                    {({ accomplished }: any) => <div title={t(step.i18nVar)} className={styles.step+" "+(accomplished ? styles.stepAccomplished : "")}>{step.jsx}</div>}
                                </Step>)
                            })
                        }
                    </ProgressBar>
                    <h1>{t(orderSteps[step].i18nVar)}</h1>
                </div>

                <div className={styles.orderRecap}>
                    {order.items.map((i: LineItem)=>
                        <div key={i.id} className={styles.lineItemContainer}>
                            <NaturalImageFixedHeight props={{src: i.thumbnail as string, alt: "line-item-img", priority: true}} fixedHeight={150}/>
                            <div>
                                <h1>{i.title}</h1>
                                <h2>{t("shop:quantity")} : {i.quantity}</h2>
                                <h2>Option : {i.description}</h2>
                            </div>
                            <h2>{format_price(i.unit_price)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
                        </div>)}
                    <div className={styles.orderTotal}>
                        <div>
                            <h2>{t("shop:Subtotal")} : </h2>
                            <h2>{format_price(order.subtotal)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
                        </div>
                        {order.discount_total>0 && <div>
                            <h2>{t("shop:discount")} : </h2>
                            <h2>- {format_price(order.discount_total)} <FontAwesomeIcon
                                icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
                        </div>}
                        <div>
                            <h2>{t("shop:Shipping")} : </h2>
                            <h2>{format_price(order.shipping_total)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
                        </div>
                        <div>
                            <h2>Total : </h2>
                            <h2>{format_price(order.total)} <FontAwesomeIcon icon={order.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2>
                        </div>
                    </div>
                </div>

                {new_order && widthheight && <Confetti
                    className={styles.confettiCanvas}
                    width={widthheight.width}
                    height={widthheight.height}
                    numberOfPieces={200}
                    tweenDuration={4000}
                    recycle={false}
                />}
            </main>

        </Layout>
    )
}



// This also gets called at build time
export async function getServerSideProps({ locale, params }: any) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    const res = await fetch(`https://pz-medusa-core.herokuapp.com/store/orders/${params.id}`)
    const json = await res.json()

    // Pass post data to the page via props
    return {
        props: {
            order: json.order,
            ...(await serverSideTranslations(locale, ['common', 'header', 'chatbot', 'authentification', 'shop'])),
            id: params.id,
        },
    }
}