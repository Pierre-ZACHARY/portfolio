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
    faPlus, faSpinner,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import {client, format_price, stripePromise, useCart} from "../../../../../lib/medusa-utils";
import {NaturalImageFixedHeight} from "../../../../../lib/utils-components";
import {useTranslation} from "next-i18next";
import {Country, LineItem, PaymentSession, Region, ShippingOption} from "@medusajs/medusa";
import {setTemporaryQuantity, useTemporaryQuantity} from "../cartReducer";
import {useAppDispatch} from "../../../../../redux/hooks";
import {getAuth, User} from "@firebase/auth";
import Link from "next/link";
import {useRouter} from "next/router";
import {db} from "../../../../../pages/_app";
import {addDoc, collection, deleteDoc, doc, DocumentReference, onSnapshot, setDoc} from "@firebase/firestore";
import {CardElement, Elements, useElements, useStripe, PaymentRequestButtonElement} from "@stripe/react-stripe-js";
import {PaymentRequest, PaymentRequestItem} from "@stripe/stripe-js";
import {useTheme} from "next-themes";


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
                    [ContentState.SelectShippingMethod]: <SelectShippingMethod onBack={()=>setContentState(ContentState.SelectShippingAddress)} onContinue={()=>setContentState(ContentState.SelectPaymentMethod)}/>,
                    [ContentState.SelectPaymentMethod]: <SelectPaymentProvider onBack={()=>setContentState(ContentState.SelectShippingMethod)} onContinue={()=>setContentState(ContentState.CompleteOrder)}/>,
                    [ContentState.CompleteOrder]: <></>,
                }[contentState]}
            </div>
            }
        </motion.div>
    )
}

function Form({clientSecret, cartId} : any) {
    const stripe = useStripe();
    const elements = useElements();
    const {cart} = useCart();
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | undefined>(undefined);
    const {resolvedTheme} = useTheme()
    console.log(resolvedTheme);

    useEffect(() => {
        if (stripe && cart) {
            const items: PaymentRequestItem[] = [];
            for(const elem of cart.items){
                items.push({label: elem.title, amount: elem.total!})
            }

            const pr = stripe.paymentRequest({
                country: cart.shipping_address?.country_code!.toUpperCase()!,
                currency: cart.region.currency_code,
                total: {
                    label: 'pierre-zachary.fr',
                    amount: cart.total!,
                },
                requestPayerName: true,
                requestPayerEmail: true,
                displayItems: items,
            });

            // Check the availability of the Payment Request API.
            pr.canMakePayment().then(result => {
                if (result) {
                    setPaymentRequest(pr);
                }
            });
        }
    }, [stripe, cart]);
    useEffect(()=>{
        if(paymentRequest && stripe && clientSecret){
            paymentRequest.on('paymentmethod', async (ev) => {
                // Confirm the PaymentIntent without handling potential next actions (yet).
                const {paymentIntent, error: confirmError} = await stripe.confirmCardPayment(
                    clientSecret,
                    {payment_method: ev.paymentMethod.id},
                    {handleActions: false}
                );

                if (confirmError) {
                    // Report to the browser that the payment failed, prompting it to
                    // re-show the payment interface, or show an error message and close
                    // the payment interface.
                    ev.complete('fail');
                } else {
                    // Report to the browser that the confirmation was successful, prompting
                    // it to close the browser payment method collection interface.
                    ev.complete('success');
                    // Check if the PaymentIntent requires any actions and if so let Stripe.js
                    // handle the flow. If using an API version older than "2019-02-11"
                    // instead check for: `paymentIntent.status === "requires_source_action"`.
                    if (paymentIntent.status === "requires_action") {
                        // Let Stripe.js handle the rest of the payment flow.
                        const {error} = await stripe.confirmCardPayment(clientSecret);
                        if (error) {
                            // The payment failed -- ask your customer for a new payment method.
                            if(error) alert(error);
                        } else {
                            // The payment has succeeded.
                            client.carts.complete(cartId).then(resp => console.log(resp))
                        }
                    } else {
                        // The payment has succeeded.
                        client.carts.complete(cartId).then(resp => console.log(resp))
                    }
                }
            });
        }

    }, [paymentRequest, stripe, clientSecret]);

    async function handlePayment(e: any) {
        e.preventDefault()
        return stripe!.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements!.getElement(CardElement)!,
                billing_details: {
                    name: cart?.shipping_address!.first_name+" "+cart?.shipping_address!.last_name,
                    email: cart?.email,
                    phone: cart?.shipping_address!.phone!,
                    address: {
                        city: cart?.shipping_address!.city!,
                        country: cart?.shipping_address!.country_code!.toUpperCase(),
                        line1: cart?.shipping_address!.address_1!,
                        line2: cart?.shipping_address!.address_2!,
                        postal_code: cart?.shipping_address!.postal_code!,
                    }
                }
            }
        }).then(({ error, paymentIntent }) => {
            //TODO handle errors
            if(error) alert(error);
            client.carts.complete(cartId).then(resp => console.log(resp))
        })
    }

    return (
        <form className={styles.stripeForm}>
            <h1>Payer par carte</h1>
            <CardElement />
            <button onClick={handlePayment}>Payer</button>
            <h1>Ou choisissez une autre méthode de paiement</h1>

            {paymentRequest ? <PaymentRequestButtonElement options={{
                paymentRequest: paymentRequest,
                style: {
                    paymentRequestButton: {
                        theme: (resolvedTheme === "light" ? "light-outline" : "dark"),
                    },
                }}} /> : null}
        </form>
    );
}

const SelectPaymentProvider = ({onBack, onContinue}: {onBack: Function, onContinue: Function}) => {
    const auth = getAuth()
    const [user, setUser] = useState<User | null>(null)
    useEffect(()=>{const unsub = auth.onAuthStateChanged((user)=>setUser(user)); return ()=>unsub()}, [auth]);
    const {cart, updateCart} = useCart()
    const [clientSecret, setClientSecret] = useState<undefined | any>(undefined)

    useEffect(()=>{
        if(cart && !clientSecret){
            client.carts.createPaymentSessions(cart.id)
                .then(({cart}) => {
                    //check if stripe is selected
                    const isStripeAvailable = cart.payment_sessions?.some((session) => session.provider_id === 'stripe');
                    if (!isStripeAvailable) {
                        return;
                    }

                    //select stripe payment session
                    client.carts.setPaymentSession(cart.id, {
                        provider_id: 'stripe'
                    }).then(({cart}) => {
                        updateCart(cart);
                        setClientSecret(cart.payment_session!.data.client_secret);
                    });
                })
        }

    }, [cart])

    return(
        <div>
            {cart && clientSecret && (
                <Elements stripe={stripePromise} options={{clientSecret}}>
                    <Form clientSecret={clientSecret} cartId={cart.id} />
                </Elements>
            )}
        </div>
    )
}

const SelectShippingMethod = ({onBack, onContinue}: {onBack: Function, onContinue: Function}) => {

    const auth = getAuth()
    const [user, setUser] = useState<User | null>(null)
    useEffect(()=>{const unsub = auth.onAuthStateChanged((user)=>setUser(user)); return ()=>unsub()}, [auth]);
    const {cart, updateCart} = useCart()
    const [shipping_options, setShipping_Options] = useState<ShippingOption[]>([])
    useEffect(()=>{if(cart) {
        console.log(cart);

        client.shippingOptions.listCartOptions(cart.id).then((res)=>setShipping_Options(res.shipping_options))
    }}, [cart])
    useEffect(()=>{console.log(shipping_options)}, [shipping_options])
    const [loadingContinue, setLoadingContinue] = useState(false);
    const [selected_shipping_option_id, setSelected_shipping_option_id] = useState("");
    const handleContinue = () => {
        if(selected_shipping_option_id!="" && cart){
            setLoadingContinue(true)
            client.carts.addShippingMethod(cart.id, {
                option_id: selected_shipping_option_id //shipping_option is the select option
            }).then((response) => {
                //updated cart is in response.cart
                console.log("update Cart Called")
                updateCart(response.cart);
                setLoadingContinue(false);
                onContinue();
            })
        }
    }


    return (
        <div className={styles.selectUserAddress}>
            <div className={styles.forms}>
                {/* @ts-ignore */}
                <fieldset onChange={(e)=>setSelected_shipping_option_id(e.target.value)}>
                    <legend>Select your shipping method</legend>
                    {
                        shipping_options.map(
                            (opt) => {
                                return (
                                    <div key={opt.id} className={styles.radioContainer+" "+(selected_shipping_option_id == opt.id ? styles.selected : null)}>
                                        <input type={"radio"} id={opt.id} name={opt.id} value={opt.id} checked={selected_shipping_option_id == opt.id} readOnly/>
                                        <label htmlFor={opt.id}>
                                            <div className={styles.radioButton}>
                                                <div />
                                            </div>
                                            <div>
                                                <h1>{opt.name}</h1>
                                                <p>{opt.amount && cart ? <>{format_price(opt.amount)} <FontAwesomeIcon icon={cart.region.currency_code === "eur" ? faEuroSign : faDollarSign}/></> : null}</p>
                                            </div>
                                        </label>
                                    </div>
                                )
                            }
                        )
                    }
                </fieldset>
            </div>

            <div className={styles.buttons}>
                <button onClick={()=>onBack()}><FontAwesomeIcon icon={faArrowLeft}/> Back</button>
                <button onClick={()=>handleContinue()} className={styles.buttonContinue+" "+(loadingContinue ? styles.loading : null)} disabled={selected_shipping_option_id == "" || loadingContinue}>Continue {loadingContinue ? <FontAwesomeIcon icon={faSpinner} className={"fa-spin"}/> : null}</button>
            </div>
        </div>
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
    ref: DocumentReference | undefined
}

const SelectShippingAddress = ({onContinue, onBack}: {onContinue: Function, onBack: Function }) => {

    const auth = getAuth()
    const [user, setUser] = useState<User | null>(null)
    const [countries, setCountries] = useState<Country[]>([])
    const {cart, updateCart} = useCart()
    useEffect(()=>{if(cart) client.regions.retrieve(cart.region_id).then((reg)=>setCountries(reg.region.countries))}, [cart])
    const [shipping_address_list, set_shipping_address_list] = useState<Shipping_Address[]>([])
    const [temporary_address, setTempopary_address] = useState<Shipping_Address>({address_1: "", address_2: "", city: "", ref: undefined, company: "", country_code: "", phone: "", postal_code: "", first_name: "", last_name: "", province: ""})
    const [selected_address, setSelected_address] = useState<Shipping_Address>({address_1: "", address_2: "", city: "", ref: undefined, company: "", country_code: "", phone: "", postal_code: "", first_name: "", last_name: "", province: ""})
    const [selected_shipping_address_id, setselected_shipping_address] = useState<string>("")
    useEffect(()=>{
        console.log(selected_shipping_address_id)
        const s_a = getShippingAddressFromId(selected_shipping_address_id)
        console.log(s_a)
        console.log(shipping_address_list)
        if(s_a != null) {
            setSelected_address(s_a)
            setTempopary_address(s_a);
        }
        else setTempopary_address({address_1: "", address_2: "", city: "", ref: undefined, company: "", country_code: "", phone: "", postal_code: "", first_name: "", last_name: "", province: ""})
    }, [selected_shipping_address_id]);

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
    const [loadingContinue, setLoadingContinue] = useState(false);

    const getShippingAddressFromId = (id: string): Shipping_Address | null => {
        if(id=="") return null
        for(let i = 0; i<shipping_address_list.length; i++){
            if(shipping_address_list[i].ref!.id == id) return shipping_address_list[i];
        }
        alert("null id : "+id)
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
            // @ts-ignore
            const company: string = (form[7].value! as string);
            // @ts-ignore
            const phone: string = (form[8].value! as string);
            // @ts-ignore
            const first_name: string = (form[9].value! as string);
            // @ts-ignore
            const last_name: string = (form[10].value! as string);
            if(ref_id != "" && selected_address) setDoc(selected_address.ref!, {address_1, address_2, city, postal_code, province, country_code, company, phone, first_name, last_name}).then();
            else addDoc(collection(db, "users", user.uid, "shipping_address"), {address_1, address_2, city, postal_code, province, country_code, company, phone, first_name, last_name}).then();
        }

    }

    const RemoveSelectedAddress = () => {
        if(selected_shipping_address_id !== "" && selected_address){
            const ok = confirm("Voulez-vous supprimer cette adresse ?")
            if(ok){
                deleteDoc(selected_address.ref!).then(()=>setselected_shipping_address(""))
            }
        }
    }

    const handleContinue = () => {
        if(cart && selected_address) {
            const {ref, ...post} = selected_address
            console.log(post);
            setLoadingContinue(true);
            client.carts.update(cart.id, {
                shipping_address: post,
            }).then((response) => {
                console.log("Update Cart Called");
                updateCart(response.cart);
                setLoadingContinue(false);
                onContinue();
            }).catch((error)=> {
                setLoadingContinue(false);
                alert(error)
            })
        }

    }

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
                                    <div key={addr.ref!.id} className={styles.radioContainer+" "+(selected_shipping_address_id == addr.ref!.id ? styles.selected : null)}>
                                        <input type={"radio"} id={addr.ref!.id} name={addr.ref!.id} value={addr.ref!.id} checked={selected_shipping_address_id == addr.ref!.id} readOnly/>
                                        <label htmlFor={addr.ref!.id}>
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
                        <input type={"radio"} id={"add_addr"} name={"add_addr"} value={""} checked={selected_shipping_address_id == ""} readOnly/>
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
                        <input type={"text"} placeholder={"Address 1 *"} required autoComplete={"address-line1"} value={temporary_address?.address_1} onChange={(e)=>setTempopary_address({...temporary_address!, address_1: e.target.value ?? ""})}/>
                        <input type={"text"} placeholder={"Address 2"} autoComplete={"address-line2"} value={temporary_address?.address_2} onChange={(e)=>setTempopary_address({...temporary_address!, address_2: e.target.value ?? ""})} />
                    </div>
                    <div>
                        <input type={"text"} placeholder={"City *"} required autoComplete={"home city"} value={temporary_address?.city} onChange={(e)=>setTempopary_address({...temporary_address!, city: e.target.value ?? ""})}/>
                        <input type={"text"} placeholder={"Postal Code *"} required autoComplete={"postal-code"} value={temporary_address?.postal_code} onChange={(e)=>setTempopary_address({...temporary_address!, postal_code: e.target.value ?? ""})}/>
                    </div>
                    <div>
                        <input type={"text"} placeholder={"Province"} value={temporary_address?.province} onChange={(e)=>setTempopary_address({...temporary_address!, province: e.target.value ?? ""})}/>
                        <select required placeholder={"Country"} autoComplete={"on"} value={temporary_address.country_code} onChange={(e)=>setTempopary_address({...temporary_address!, country_code: e.target.value ?? ""})}>
                            <option disabled value={""}>Please Select A country *</option>
                            {countries.map((c)=>{
                                return (<option key={c.iso_3} value={c.iso_2}>{c.name.slice(0,1)+c.name.slice(1).toLowerCase()}</option>)
                            })}
                        </select>
                    </div>
                    <input type={"text"} placeholder={"Company"} value={temporary_address.company} onChange={(e)=>setTempopary_address({...temporary_address!, company: e.target.value ?? ""})}/>
                    <input type={"text"} placeholder={"Phone *"} required autoComplete={"tel"} value={temporary_address.phone} onChange={(e)=>setTempopary_address({...temporary_address!, phone: e.target.value ?? ""})}/>
                    <div>
                        <input type={"text"} placeholder={"First Name *"} required autoComplete={"given-name"} value={temporary_address.first_name} onChange={(e)=>setTempopary_address({...temporary_address!, first_name: e.target.value ?? ""})}/>
                        <input type={"text"} placeholder={"Last Name *"} required autoComplete={"family-name"} value={temporary_address.last_name} onChange={(e)=>setTempopary_address({...temporary_address!, last_name: e.target.value ?? ""})}/>
                    </div>
                    <div className={styles.formButtons}>
                        <button type={"submit"}>{selected_shipping_address_id === "" ? "Add" : "Confirm Edit"}</button>
                        {selected_shipping_address_id!= "" ? <button type={"button"} onClick={() => RemoveSelectedAddress()} className={styles.buttonRemove}>Remove</button> : null}
                    </div>
                </form>
            </div>
            <div className={styles.buttons}>
                <button onClick={()=>onBack()}><FontAwesomeIcon icon={faArrowLeft}/> Back</button>
                <button onClick={()=>handleContinue()} className={styles.buttonContinue+" "+(loadingContinue ? styles.loading : null)} disabled={selected_shipping_address_id == "" || loadingContinue}>Continue {loadingContinue ? <FontAwesomeIcon icon={faSpinner} className={"fa-spin"}/> : null}</button>
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
            .then(({cart}) => {
                console.log("Update Cart Called");
                updateCart(cart)
            });
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
        console.log(item.quantity, tempQuantity)
        if(tempQuantity <= 0){
            client.carts.lineItems.delete(hook.cart.id, item.id)
                .then(({cart}) => {
                    setCanEditQuantity(true);
                    console.log("Update Cart Called");
                    hook.updateCart(cart)
                })
        }
        else{
            console.log("quantity : "+tempQuantity)
            client.carts.lineItems.update(hook.cart.id, item.id, {
                quantity: tempQuantity
            }).then(({cart}) => {
                setCanEditQuantity(true);
                console.log("Update Cart Called");
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