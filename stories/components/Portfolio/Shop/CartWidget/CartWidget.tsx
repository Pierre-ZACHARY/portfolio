import styles from "./CartWidget.module.sass"
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowUpRightFromSquare,
    faBagShopping,
    faCross,
    faDollarSign, faEuro,
    faEuroSign,
    faMinus,
    faPlus,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import {client, format_price, useCart} from "../../../../../lib/medusa-utils";
import {NaturalImageFixedHeight} from "../../../../../lib/utils-components";
import {useTranslation} from "next-i18next";
import {LineItem, Region} from "@medusajs/medusa";
import {setTemporaryQuantity, useTemporaryQuantity} from "../cartReducer";
import {useAppDispatch} from "../../../../../redux/hooks";
import {getAuth, User} from "@firebase/auth";
import Link from "next/link";
import {useRouter} from "next/router";


enum ContentState{
    CartOverView,
    SelectShippingAddress,
    SelectShippingMethod,
    SelectPaymentMethod,
    CompleteOrder
}


export const CartWidget = ( ) => {

    const [isOpen, setOpen] = useState(false);
    const [contentState, setContentState] = useState<ContentState>(ContentState.CartOverView);
    const cartHook = useCart()
    const {t} = useTranslation()

    return (
        <motion.div layout className={styles.main+" "+(isOpen ? styles.open : null)} onClick={()=>(!isOpen ? setOpen(true) : null)} >
            {!isOpen ? <div className={styles.svgContainer}>
                <FontAwesomeIcon icon={faBagShopping}/>
                {cartHook.cart && cartHook.cart.items.length ? <div className={styles.itemsIndicator}>{cartHook.cart.items.length}</div> : null}
            </div> :
            <div className={styles.openContent}>
                <button className={styles.buttonClose} onClick={()=>setOpen(false)}><FontAwesomeIcon icon={faXmark}/></button>
                {{
                    [ContentState.CartOverView]: <CartOverView onContinue={()=>setContentState(ContentState.SelectShippingAddress)}/>,
                    [ContentState.SelectShippingAddress]: <></>,
                    [ContentState.SelectShippingMethod]: <></>,
                    [ContentState.SelectPaymentMethod]: <></>,
                    [ContentState.CompleteOrder]: <></>,
                }[contentState]}
            </div>
            }
        </motion.div>
    )
}


const CartOverView = ({onContinue}: {onContinue: Function }) => {
    const cartHook = useCart()
    const auth = getAuth()
    const [user, setUser] = useState<User | null>(null)
    const {t} = useTranslation()
    const router = useRouter()

    useEffect(()=>{
        const unsub = auth.onAuthStateChanged((user) => setUser(user))
        return () => unsub()
    })

    return(
        <>
            <div className={styles.topBar}>
                <SelectRegion/>
            </div>
            <div className={styles.showItems}>
                <ol>
                    {
                        cartHook.cart?.items.map((item)=>{
                            return (
                                <li key={item.id}>
                                    <CartItem default_item={item}/>
                                </li>)
                        })
                    }
                </ol>
            </div>
            <div className={styles.checkOut}>
                <div className={styles.checkOutInfo}>
                    {cartHook.cart?.discount_total ? <div><h2>{t("shop:discount")} :</h2><h2 className={styles.displayDiscount}>- {format_price(cartHook.cart?.discount_total)} <FontAwesomeIcon icon={cartHook.cart.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2></div> : null}
                    {cartHook.cart?.shipping_total ? <div><h2>{t("shop:shipping")} :</h2><h2>{format_price(cartHook.cart?.shipping_total)} <FontAwesomeIcon icon={cartHook.cart.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2></div>: null}
                    {cartHook.cart?.total ? <div><h2>Total :</h2><h2>{format_price(cartHook.cart?.total!)} <FontAwesomeIcon icon={cartHook.cart.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></h2></div> : null}
                </div>
                <div className={styles.checkOutSteps}>
                    {user ? <button onClick={()=>onContinue()}>{t("shop:continueCheckout")}</button> : <Link href={"/login?onSignIn="+router.asPath}><a>{t("authentification:youMustLoginToContinue")} <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a></Link>}
                </div>
            </div>
        </>
    )
}


const SelectRegion = () => {

    const [regionList, setRegionList] = useState<Region[]>([])
    const {cart, updateCart} = useCart()
    useEffect(()=>{
        client.regions.list().then((resp)=>setRegionList(resp.regions))
    }, [])

    const changeRegion = (region_id: string) => {
        if(cart)
            client.carts.update(cart.id, {
                region_id
            })
            .then(({cart}) => updateCart(cart));
    }


    return (
        <select onChange={(e)=>changeRegion(e.target.value)}>
            {regionList.map((reg) => {
                return(

                    <option key={reg.id} value={reg.id} selected={cart ? cart.region_id == reg.id : false}>{reg.name}</option>
                )
            })
            }
        </select>
    )
}


const CartItem = ({default_item}: {default_item: LineItem }) => {
    const {t} = useTranslation()
    const tempQuantity = useTemporaryQuantity(default_item?.variant_id);
    const [canEditQuantity, setCanEditQuantity] = useState<boolean>(true);
    const hook = useCart();
    const dispatch = useAppDispatch();
    const [item, setItem]  = useState<LineItem | undefined>(()=>{
        if(hook.cart){
            let res = undefined
            hook.cart.items.some((i) => {
                if(i.id == default_item.id) {
                    res = i;
                    return true
                }
            })
            return res
        }
    });


    useEffect(()=>{if(hook.cart){
        let res = undefined
        hook.cart.items.some((i) => {
            if(i.id == default_item.id) {
                res = i;
                return true
            }
        })
        setItem(res);
    }}, [hook.cart, default_item])

    if(item && item.quantity!=0 && tempQuantity == undefined){
        console.log(tempQuantity, item.quantity)
        dispatch(setTemporaryQuantity({variant_id: item.variant_id, quantity: item.quantity}));
    }

    if(item && tempQuantity!=undefined && hook.cart && tempQuantity!=item.quantity && canEditQuantity){
        setCanEditQuantity(false);
        console.log("canEdit = false")
        if(tempQuantity <= 0){
            client.carts.lineItems.delete(hook.cart.id, item.id)
                .then(({cart}) => {
                    setCanEditQuantity(true);
                    hook.updateCart(cart)
                })
        }
        else{
            console.log("quantity : "+tempQuantity)
            client.carts.lineItems.update(hook.cart.id, item.id, {
                quantity: tempQuantity
            }).then(({cart}) => {
                setCanEditQuantity(true);
                hook.updateCart(cart)
            })
        }
    }

    const updateLineItemQuantities = (item: LineItem, add_quantity: number) => {
        if(hook.cart && tempQuantity!=undefined){
            const new_quantity = Math.max(add_quantity + tempQuantity, 0);
            dispatch(setTemporaryQuantity({variant_id: item.variant_id, quantity: new_quantity}));
        }
    }

    return (
       <>
           {item ? <><div className={styles.itemInfo}>
               <NaturalImageFixedHeight props={{src: item.variant.product.thumbnail!}} fixedHeight={70}/>
               <div>
                   <h1>{item.variant.product.title}</h1>
                   <h3>Option : <strong>{item.variant.title}</strong></h3>
                   <h3>{t("shop:quantity")} :
                       { tempQuantity != item.quantity ? <strong className={styles.tempQuantity}>{tempQuantity}</strong> : <strong>{item.quantity}</strong>}
                   </h3>
                   <h2>Total : <strong>{format_price(item.subtotal!)}<FontAwesomeIcon
                       icon={hook.cart && hook.cart.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></strong></h2>
               </div>
           </div>

               <div className={styles.quantitiesButton}>
               <button onClick={()=>updateLineItemQuantities(item, -1)}><FontAwesomeIcon icon={faMinus}/></button>
               <button onClick={()=>updateLineItemQuantities(item, 1)}><FontAwesomeIcon icon={faPlus}/></button>
               </div></>
            : <div/>
           }
       </>
    )
}