import styles from "./Search.module.sass"
import {instantMeiliSearch} from "@meilisearch/instant-meilisearch";
import {Highlight, Hits, InstantSearch, useHits, useSearchBox, UseSearchBoxProps} from "react-instantsearch-hooks-web";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faDeleteLeft,
    faDollarSign,
    faEuroSign, faMinus,
    faPlus,
    faSearch, faSpinner
} from "@fortawesome/free-solid-svg-icons";
import {NaturalImageFixedHeight} from "../../../../../lib/utils-components";
import {client, format_price, format_price_range, useCart} from "../../../../../lib/medusa-utils";
import {connectHits} from "instantsearch.js/es/connectors";
import {useTranslation} from "next-i18next";
import {Swiper, SwiperSlide} from "swiper/react";
import { EffectCards } from "swiper";
import Image from "next/image";
import {LineItem, MoneyAmount, Product, ProductVariant} from "@medusajs/medusa";
import {useAppDispatch, useAppSelector} from "../../../../../redux/hooks";
import {setTemporaryQuantity, useTemporaryQuantity} from "../cartReducer";

const searchClient = instantMeiliSearch(
    process.env.NEXT_PUBLIC_SEARCH_ENDPOINT!,
    process.env.NEXT_PUBLIC_SEARCH_API_KEY!
)

function CustomSearchBox(props: UseSearchBoxProps) {
    const { query, refine } = useSearchBox(props);
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(()=>{refine(value)}, [refine, value])

    return <><div className={[styles.searchBox, focused?styles.focused:null].join(" ")} onClick={()=>inputRef.current!.select()}>
        <FontAwesomeIcon icon={faSearch}/>
        <label htmlFor={"searchBox"}>
            <input id={"searchBox"} name={"searchBox"}  placeholder={"Search..."} ref={inputRef} value={value} onChange={(e)=>{setValue(e.target.value)}} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
        </label>
        <FontAwesomeIcon className={styles.delete+" "+(value ?styles.active:null)} icon={faDeleteLeft} onClick={()=>setValue("")}/>
    </div></>;
}

export const Search = () => {


    return (
        <div className={styles.main}>
            <InstantSearch indexName={process.env.NEXT_PUBLIC_SEARCH_INDEX_NAME!} searchClient={searchClient}>
                <CustomSearchBox/>
                <CustomHits className={styles.hits}/>
            </InstantSearch>
        </div>
    )
}


function CustomHits(props: any) {

    const [products, setProducts] = useState<Map<string, Product>>(new Map<string, Product>());
    const { hits, results, sendEvent } = useHits(props);
    const [maxItems, setMax] = useState(99);
    const {t} = useTranslation();

    useEffect(()=>{
        const temp = new Map<string, Product>();
        const idsToFetch: string[] = []
        for(const hit of hits){
            const id = hit.id as string;
            if(products.has(id))    {
                temp.set(id, products.get(id)!)
            }
            else{
                idsToFetch.push(id);
            }
        }
        if(idsToFetch.length){
            client.products.list({id: idsToFetch}).then((res)=>{
                if(res.response.status==200){
                    for(const p of res.products){
                        temp.set(p.id, p);
                    }
                    setProducts(temp);
                }
            })
        }
    }, [hits])

    // remplacer hit : any par hit : Product, pour ça : lors d'un changement de hits, faire un get de chaque hit et les placer dans la map, pour l'affichage utiliser les ids déjà présent dans la map

    return <>
        <div className={props.className}>
            <ol>
                {hits.slice(0, maxItems).map((hit, k) => {
                    return (<li key={hit.id! as string}>
                            <div><Hit hit={hit} product={products.get(hit.id! as string)}/></div>
                        </li>)
                })}
            </ol>
            {maxItems<hits.length ? <button onClick={()=>setMax(maxItems+3)}>{t("common:showMore")}</button> : null}
        </div>
    </>;
}



const Hit = ({ hit, product }: {hit: any, product: Product | undefined}) => {


    // console.log(hit);

    const [variantsMap, setVariantsMap] = useState<Map<string, any>>(()=>{
        const temp = new Map<string, any>();
        hit.variants.forEach((variant: any)=>{
            temp.set(variant.id, variant);
        });
        return temp;
    });
    const [optionsMap, setOptionsMap] = useState<Map<string, any>>(()=>{
        const temp = new Map<string, any>();
        hit.options.forEach((option: any)=>{
            temp.set(option.id, option);
        });
        return temp;
    });
    const [allOptions, setAllOptions] = useState<Map<string, Set<string>>>(()=>{
        const temp = new Map<string, Set<string>>();

        // @ts-ignore
        [...variantsMap.keys()].forEach((variant_id: string)=>{
            variantsMap.get(variant_id).options.forEach((option: any)=>{
                if(!temp.has(option.option_id)) temp.set(option.option_id, new Set());
                if(!(option.value in temp.get(option.option_id)!)) temp.get(option.option_id)!.add(option.value)
            });
        });
        return temp;
    });
    const [selectedOptions, setSelectedOptions] = useState<Map<string, string | undefined>>(new Map<string, string>());
    // @ts-ignore
    const [selected_variants, setSelected_variants] = useState<string[]>(()=>[...variantsMap.keys()]);
    const {t} = useTranslation();
    const {cart, updateCart} = useCart()
    // useEffect(()=>console.log("Cart Changed"), [cart])



    const variantHasOption = (variant_id: string, option_value: string): boolean => {
        return variantsMap.get(variant_id).options.some((opt: any): boolean | undefined => {
            if (opt.value === option_value) {
                return true;
            }
        });
    }

    const optionFromVariantCanBeSelected = (variant_id: string, option_value: string): boolean => {
        return variantHasOption(variant_id, option_value) && (variantsMap.get(variant_id).inventory_quantity > 0 || variantsMap.get(variant_id).allow_backorder);
    }

    const optionCanBeSelected = (option_value: string): boolean => {
        // Regarde si un variant possède cette option dans la liste des variants disponibles ET que l'option en question est en stock / peut être commandé
        return selected_variants.some((variant_id) => {
            const variant_has_option_value = variantsMap.get(variant_id).options.some((opt: any): boolean | undefined => {
                if (opt.value === option_value) return true;
            })
            if (variant_has_option_value) return true;
        });
    }

    const updateSelectedVariants = () => {
        const temp: string[] = [];
        // @ts-ignore
        [...variantsMap.keys()].forEach((variant_id)=> {
            // pour chaque variant
            // si ce variant n'a pas TOUTES les options sélectionné
            // @ts-ignore
            let variant_hasnt_options = [...selectedOptions.values()].some((option_value): boolean | undefined=> {
                if(option_value) {
                    // on l'enleve de liste de variant possible
                    if(!optionFromVariantCanBeSelected(variant_id, option_value)) return true;
                }
            });
            if(!variant_hasnt_options){
                temp.push(variant_id)
            }
        });
        setSelected_variants(temp);
    }

    const getVariantPrice = (currency: string, variant_id: string) : number[] | undefined=> {
        const variant: ProductVariant | undefined = product?.variants.find((elem => elem.id == variant_id));
        if(variant){
            const res: number[] = [];
            (variant.prices).forEach((price: MoneyAmount)=>{
                const now = new Date();
                if(price.currency_code === currency){
                    // @ts-ignore
                    if((!price.price_list?.starts_at || Date.parse(price.price_list?.starts_at) < now) && (!price.price_list?.ends_at || Date.parse(price.price_list?.ends_at) > now)){
                        res.push(price.amount)
                    }
                }

            })
            return res;
        }
    }

    const getPriceRange = (currency: string): number[][] => {
        const temp: number[][] = [];
        selected_variants.forEach((variant_id)=>{
            const price = getVariantPrice(currency, variant_id);
            if(price) temp.push(price)
        })
        return temp;
    }


    const availableOptions = new Map<string, string[]>();

    selected_variants.forEach((variant_id: any)=>{
        variantsMap.get(variant_id).options.forEach((option: any)=>{
            if(!availableOptions.has(option.option_id)) availableOptions.set(option.option_id, []);
            if(!(option.value in availableOptions.get(option.option_id)!)) availableOptions.get(option.option_id)!.push(option.value)
        });
    });


    return (
        <div className={"relative" +" "+ styles.hitCard}>
            {/*<div className={styles.imageBackground}/>*/}
            <div className={styles.imageContainer}>
                <Swiper effect={"cards"}
                        grabCursor={true}
                        modules={[EffectCards]}
                        className={styles.swiper}>
                    {
                        hit.images ? hit.images.map(
                            (image: any)=>{
                                return <SwiperSlide key={image.id} className={styles.swiperSlide}>
                                    <div key={image.id+"div"}><Image alt={"slide-img"} src={image.url} height={200} width={160} objectFit={"cover"}/></div>
                                </SwiperSlide>
                            }
                        ) : <SwiperSlide key={hit.thumbnail} className={styles.swiperSlide}>
                            <div><Image alt={"slide-img"} src={hit.thumbnail} height={200} width={160} objectFit={"cover"}/></div>
                        </SwiperSlide>
                    }
                </Swiper>
            </div>
            <div className={styles.objectInfo}>
                <div className={styles.allOptions}>
                    <div className="hit-name">
                        <Highlight attribute="title" hit={hit} highlightedTagName="mark" className={styles.highlight}/>
                    </div>
                    { // @ts-ignore
                      [...allOptions.entries()].map((k: [string, Set<string>])=>{
                        return (
                            <div key={k[0]} className={styles.selectOption}>
                                <p>{t("shop:"+optionsMap.get(k[0]).title)}</p>
                                {
                                    // @ts-ignore
                                    [...k[1].values()].map((opt_value)=>{
                                        if(!selectedOptions.has(k[0])) selectedOptions.set(k[0], undefined);
                                        const handleClick = () => {
                                            if(selectedOptions.get(k[0]) === opt_value) selectedOptions.set(k[0], undefined);
                                            else selectedOptions.set(k[0], opt_value);
                                            updateSelectedVariants();
                                        }
                                        return (<div key={opt_value}>
                                            {
                                                optionsMap.get(k[0]).title=="Color"?
                                                    <button style={{backgroundColor: opt_value}} disabled={!optionCanBeSelected(opt_value)} onClick={handleClick} className={styles.colorButton}></button>
                                                    :
                                                    <button style={{backgroundColor: opt_value}} disabled={!optionCanBeSelected(opt_value)} onClick={handleClick}>{opt_value}
                                                    </button>
                                            }
                                        </div>)
                                    })
                                }
                            </div>
                        )
                    })}
                </div>
                {!product ? <button className={styles.addToCart} disabled>Loading...</button> : selected_variants.length == 1 ? <Display_AddToCart variant_id={selected_variants[0]} price_range={getPriceRange(cart?.region.currency_code ?? "usd")}/> : <button className={styles.addToCart} disabled><Display_amount amount={getPriceRange(cart?.region.currency_code ?? "usd")}/></button>}
            </div>
        </div>
    )
}

const Display_AddToCart = ({variant_id, price_range}: {variant_id: string, price_range: number[][] }) => {

    const [canEditQuantity, setCanEditQuantity] = useState(true);
    const hook = useCart()
    const tempQuantity = useTemporaryQuantity(variant_id)
    const dispatch = useAppDispatch()

    const updateLineItemQuantities = (lineItemId: string, add_quantity: number) => {
        if(hook.cart && lineItemInCart && tempQuantity!=undefined){
            const new_quantity = Math.max(add_quantity + tempQuantity, 0);
            dispatch(setTemporaryQuantity({ variant_id: variant_id, quantity: new_quantity}));
        }
    }

    const handleAddToCart = () => {
        if(hook.cart){
            dispatch(setTemporaryQuantity({ variant_id: variant_id, quantity: 1}));
            client.carts.lineItems.create(hook.cart.id, {
                variant_id: variant_id,
                quantity: 1
            })
                .then(({cart}) => {
                    // console.log("Update Cart Called");
                    hook.updateCart(cart)
                });
        }
    }

    const variantIdInCart = (variant_id: string): LineItem | undefined => {
        if(!hook.cart) return undefined
        let res = undefined;
        hook.cart.items.some((item)=> {
            if (item.variant_id === variant_id) {
                res = item;
                return true
            }
        })
        return res;
    }
    const lineItemInCart = variantIdInCart(variant_id);

    if(lineItemInCart && lineItemInCart?.quantity!=0 && tempQuantity == undefined){
        dispatch(setTemporaryQuantity({ variant_id: variant_id, quantity: lineItemInCart.quantity}));
    }

    if(tempQuantity!=undefined && lineItemInCart && hook.cart && tempQuantity!=lineItemInCart?.quantity && canEditQuantity){
        setCanEditQuantity(false);
        // console.log(tempQuantity, lineItemInCart?.quantity)
        if(tempQuantity <= 0){
            client.carts.lineItems.delete(hook.cart.id, lineItemInCart.id)
                .then(({cart}) => {
                    setCanEditQuantity(true);
                    // console.log("Update Cart Called");
                    hook.updateCart(cart)
                })
        }
        else{
            client.carts.lineItems.update(hook.cart.id, lineItemInCart.id, {
                quantity: tempQuantity
            }).then(({cart}) => {
                setCanEditQuantity(true);
                // console.log("Update Cart Called");
                hook.updateCart(cart)
            })
        }
    }



    return (
        <>
            {lineItemInCart ?
                <div className={styles.updateQuantitiesContainer}>
                    <button onClick={()=>updateLineItemQuantities(lineItemInCart?.id, -1)}><FontAwesomeIcon icon={faMinus}/></button>
                    {tempQuantity != lineItemInCart.quantity ? <div className={styles.showQuantity} style={{opacity: 0.4}}>{tempQuantity}</div> : <div className={styles.showQuantity}>{lineItemInCart.quantity}</div>}
                    <button onClick={()=>updateLineItemQuantities(lineItemInCart?.id, 1)}><FontAwesomeIcon icon={faPlus}/></button>
                </div>
                : <button className={styles.addToCart}
                          onClick={()=>{handleAddToCart()}}
                          disabled={(!!tempQuantity)}>

                    {tempQuantity ? <FontAwesomeIcon icon={faSpinner} className={"fa-spin"}/> : <Display_amount amount={price_range}/>}

                </button>}
        </>
    )
}

const Display_amount = ({amount}: {amount: number[][]}) => {
    const {t} = useTranslation()
    const {cart, updateCart} = useCart()

    if(!amount || !amount.length){
        return (<>Unavailable</>)
    }
    const formatted = format_price_range(amount);
    let str = <>{formatted.min && formatted.max ? <>{formatted.min} {formatted.max!=formatted.min ? <>{" - "+formatted.max}</> : null}</> :
        <>{} {formatted.current!=formatted.original ? <><p className={styles.onSale}>{t("shop:onSale")}</p><del>{formatted.original}</del> {formatted.current}</>: formatted.original}</>
    } </>;

    return (<>{str} <FontAwesomeIcon icon={cart && cart?.region.currency_code === "eur"? faEuroSign : faDollarSign}/></>)
}