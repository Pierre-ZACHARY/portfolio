import styles from "./CartWidget.module.sass"
import {FormEvent, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
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
import {Country, LineItem, Region} from "@medusajs/medusa";
import {setTemporaryQuantity, useTemporaryQuantity} from "../cartReducer";
import {useAppDispatch} from "../../../../../redux/hooks";
import {getAuth, User} from "@firebase/auth";
import Link from "next/link";
import {useRouter} from "next/router";
import {db} from "../../../../../pages/_app";
import {addDoc, collection, deleteDoc, doc, DocumentReference, onSnapshot, setDoc} from "@firebase/firestore";


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
                    [ContentState.SelectShippingAddress]: <SelectShippingAddress onContinue={()=>setContentState(ContentState.SelectShippingMethod)} onBack={()=>setContentState(ContentState.CartOverView)}/>,
                    [ContentState.SelectShippingMethod]: <></>,
                    [ContentState.SelectPaymentMethod]: <></>,
                    [ContentState.CompleteOrder]: <></>,
                }[contentState]}
            </div>
            }
        </motion.div>
    )
}


interface Shipping_Address{
    company: string,
    first_name: string,
    last_name: string,
    address_1: string,
    address_2: string,
    city: string,
    country_code: string,
    province: string,
    postal_code: string,
    phone: string,
    ref: DocumentReference
}


const SelectShippingAddress = ({onContinue, onBack}: {onContinue: Function, onBack: Function }) => {

    const auth = getAuth()
    const [user, setUser] = useState<User | null>(null)
    const [countries, setCountries] = useState<Country[]>([])
    const {cart, updateCart} = useCart()
    useEffect(()=>{if(cart) client.regions.retrieve(cart.region_id).then((reg)=>setCountries(reg.region.countries))}, [cart])
    const [shipping_address_list, set_shipping_address_list] = useState<Shipping_Address[]>([])
    const [selected_shipping_address_id, setselected_shipping_address] = useState<string>("")
    useEffect(()=>{const unsub = auth.onAuthStateChanged((user)=>setUser(user)); return ()=>unsub()}, [auth]);
    useEffect(()=>{
        if(user){
            const unsub = onSnapshot(collection(db, "users", user.uid, "shipping_address"), (col) => {
                const temp: Shipping_Address[] = []
                col.docs.forEach((doc)=>{
                    temp.push({...doc.data(), ref: doc.ref} as Shipping_Address)
                });
                set_shipping_address_list(temp);
            });
            return ()=>unsub()
        }
    }, [user])

    function getShippingAddressFromId(id: string): Shipping_Address | null{
        for(let i = 0; i<shipping_address_list.length; i++){
            if(shipping_address_list[i].ref.id == id) return shipping_address_list[i];
        }
        return null
    }

    const handleAddEditShippingAddress = (e: FormEvent<HTMLFormElement>) => {
        if(user){
            const form: HTMLFormElement = e.target as HTMLFormElement;
            // @ts-ignore
            const ref_id: string = (form[0].value! as string);
            // @ts-ignore
            const address_1: string = (form[1].value! as string);
            // @ts-ignore
            const address_2: string = (form[2].value! as string);
            // @ts-ignore
            const city: string = (form[3].value! as string);
            // @ts-ignore
            const postal_code: string = (form[4].value! as string);
            // @ts-ignore
            const province: string = (form[5].value! as string);
            // @ts-ignore
            const country_code: string = (form[6].value! as string);
            console.log(country_code)
            // @ts-ignore
            const company: string = (form[7].value! as string);
            // @ts-ignore
            const phone: string = (form[8].value! as string);
            // @ts-ignore
            const first_name: string = (form[9].value! as string);
            // @ts-ignore
            const last_name: string = (form[10].value! as string);
            if(ref_id != "" && selected_address) setDoc(selected_address.ref, {address_1, address_2, city, postal_code, province, country_code, company, phone, first_name, last_name}).then();
            else addDoc(collection(db, "users", user.uid, "shipping_address"), {address_1, address_2, city, postal_code, province, country_code, company, phone, first_name, last_name}).then();
        }

    }

    const RemoveSelectedAddress = () => {
        if(selected_shipping_address_id !== "" && selected_address){
            const ok = confirm("Voulez-vous supprimer cette adresse ?")
            if(ok){
                deleteDoc(selected_address.ref).then(()=>setselected_shipping_address(""))
            }
        }
    }

    const handleContinue = () => {
        if(cart && selected_address) {
            const {ref, ...post} = selected_address
            console.log(post)
            client.carts.update(cart.id, {
                shipping_address: post,
            }).then((response) => {
                updateCart(response.cart);
                onContinue();
            }).catch((error)=>alert(error))
        }

    }

    const selected_address = getShippingAddressFromId(selected_shipping_address_id);


    return (<>
        <div className={styles.selectUserAddress}>
            <div className={styles.forms}>
                {/* @ts-ignore */}
                <fieldset onChange={(e)=>setselected_shipping_address(e.target.value)}>
                    <legend>Select a shipping address</legend>
                    {
                        shipping_address_list.map(
                            (addr) => {
                                return (
                                    <div key={addr.ref.id} className={styles.radioContainer+" "+(selected_shipping_address_id == addr.ref.id ? styles.selected : null)}>
                                        <input type={"radio"} id={addr.ref.id} name={addr.ref.id} value={addr.ref.id} checked={selected_shipping_address_id == addr.ref.id}/>
                                        <label htmlFor={addr.ref.id}>
                                            <div className={styles.radioButton}>
                                                <div />
                                            </div>
                                            <div>
                                                <h1>{addr.last_name} {addr.first_name}</h1>
                                                <p>{addr.address_1} {addr.address_2}</p>
                                                <p>{addr.city} {addr.postal_code}</p>
                                            </div></label>
                                    </div>
                                )
                            }
                        )
                    }
                    <div className={styles.radioContainer+" "+(selected_shipping_address_id == "" ? styles.selected : null)}>
                        <input type={"radio"} id={"add_addr"} name={"add_addr"} value={""} checked={selected_shipping_address_id == ""}/>
                        <label htmlFor={"add_addr"}>
                            <div className={styles.radioButton}>
                                <div />
                            </div>
                            <div>
                                <h1>Add Shipping Address</h1>
                            </div>
                        </label>
                    </div>
                </fieldset>
                <form onSubmit={(e)=>{e.preventDefault(); handleAddEditShippingAddress(e)}}>
                    <legend>{selected_shipping_address_id === "" ? "Add Shipping Address" : "Edit Shipping Address"}</legend>
                    <input type={"hidden"} value={selected_shipping_address_id}/>
                    <div>
                        <input type={"text"} placeholder={"Address 1 *"} required autoComplete={"address-line1"}/>
                        <input type={"text"} placeholder={"Address 2"} autoComplete={"address-line2"}/>
                    </div>
                    <div>
                        <input type={"text"} placeholder={"City *"} required autoComplete={"home city"}/>
                        <input type={"text"} placeholder={"Postal Code *"} required autoComplete={"postal-code"}/>
                    </div>
                    <div>
                        <input type={"text"} placeholder={"Province"}/>
                        <select required placeholder={"Country"} autoComplete={"on"}>
                            <option disabled value={""} selected>Please Select A country *</option>
                            {countries.map((c)=>{
                                return (<option key={c.iso_3} value={c.iso_2}>{c.name.slice(0,1)+c.name.slice(1).toLowerCase()}</option>)
                            })}
                        </select>
                    </div>
                    <input type={"text"} placeholder={"Company"}/>
                    <input type={"text"} placeholder={"Phone"} autoComplete={"tel"}/>
                    <div>
                        <input type={"text"} placeholder={"First Name *"} required autoComplete={"given-name"}/>
                        <input type={"text"} placeholder={"Last Name *"} required autoComplete={"family-name"}/>
                    </div>
                    <div className={styles.formButtons}>
                        <button type={"submit"}>{selected_shipping_address_id === "" ? "Add" : "Confirm Edit"}</button>
                        {selected_shipping_address_id!= "" ? <button type={"button"} onClick={() => RemoveSelectedAddress()} className={styles.buttonRemove}>Remove</button> : null}
                    </div>
                </form>
            </div>
            <div className={styles.buttons}>
                <button onClick={()=>onBack()}><FontAwesomeIcon icon={faArrowLeft}/> Back</button>
                <button onClick={()=>handleContinue()} className={styles.buttonContinue} disabled={selected_shipping_address_id == ""}>Continue</button>
            </div>
        </div>
    </>)
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
    }, [auth])

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
                    {user ? <button disabled={!(cartHook.cart && cartHook.cart .items.length)} onClick={()=>onContinue()}>{t("shop:continueCheckout")}</button> : <Link href={"/login?onSignIn="+router.asPath}><a>{t("authentification:youMustLoginToContinue")} <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></a></Link>}
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
        <select onChange={(e)=>changeRegion(e.target.value)} value={cart ? cart.region.id : ""}>
            {regionList.map((reg) => {
                return(

                    <option key={reg.id} value={reg.id} >{reg.name}</option>
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