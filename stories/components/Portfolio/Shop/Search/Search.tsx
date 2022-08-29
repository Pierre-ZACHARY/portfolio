import styles from "./Search.module.sass"
import {instantMeiliSearch} from "@meilisearch/instant-meilisearch";
import {Highlight, Hits, InstantSearch, useHits, useSearchBox, UseSearchBoxProps} from "react-instantsearch-hooks-web";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping, faDeleteLeft, faDollarSign, faEuroSign, faSearch} from "@fortawesome/free-solid-svg-icons";
import {NaturalImageFixedHeight} from "../../../../../lib/utils-components";
import {format_price, format_price_range, user_currency} from "../../../../../lib/medusa-utils";
import {connectHits} from "instantsearch.js/es/connectors";
import {useTranslation} from "next-i18next";
import {Swiper, SwiperSlide} from "swiper/react";
import { EffectCards } from "swiper";
import Image from "next/image";

const searchClient = instantMeiliSearch(
    process.env.NEXT_PUBLIC_SEARCH_ENDPOINT!,
    process.env.NEXT_PUBLIC_SEARCH_API_KEY!
)

function CustomSearchBox(props: UseSearchBoxProps) {
    const { query, refine } = useSearchBox(props);
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(()=>{refine(value)}, [value])

    return <><div className={[styles.searchBox, focused?styles.focused:null].join(" ")} onClick={()=>inputRef.current!.select()}>
        <FontAwesomeIcon icon={faSearch}/>
        <input ref={inputRef} value={value} onChange={(e)=>{setValue(e.target.value)}} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
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
    const { hits, results, sendEvent } = useHits(props);
    const [maxItems, setMax] = useState(3);
    const {t} = useTranslation();

    return <>
        <div className={props.className}>
            <ol>
                {hits.slice(0, maxItems).map((hit) => (
                    <li key={hit.id as string}><Hit hit={hit}/></li>
                ))}
            </ol>
            {maxItems<hits.length ? <button onClick={()=>setMax(maxItems+3)}>{t("common:showMore")}</button> : null}
        </div>
    </>;
}


const Hit = ({ hit }: {hit: any}) => {
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

    if(hit.title=="Medusa Sweatshirt"){
        console.log(hit);
        console.log(allOptions);
    }

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
        const variant = variantsMap.get(variant_id);
        if(variant){
            const res: number[] = [];
            variant.prices.forEach((price: any)=>{
                if(price.currency_code === currency){
                    res.push(price.amount)
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
        <div key={hit.id} className={"relative" +" "+ styles.hitCard}>
            <div className={styles.imageBackground}/>
            <div className={styles.imageContainer}>
                <Swiper effect={"cards"}
                        grabCursor={true}
                        modules={[EffectCards]}
                        className={styles.swiper}>
                    {hit.images.map((image: any)=><SwiperSlide className={styles.swiperSlide} key={image.id}><Image src={image.url} height={200} width={160} objectFit={"cover"}/></SwiperSlide>)}
                </Swiper>
            </div>
            <div className={styles.objectInfo}>
                <div className={styles.allOptions}>
                    <div className="hit-name">
                        <Highlight attribute="title" hit={hit} highlightedTagName="mark" className={styles.highlight}/>
                    </div>
                    { // @ts-ignore
                      [...allOptions.entries()].map((k: [string, Set<string>])=>{
                        return (<>
                            <div className={styles.selectOption}>
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
                                        return (<>
                                            {
                                                optionsMap.get(k[0]).title=="Color"?
                                                    <button style={{backgroundColor: opt_value}} disabled={!optionCanBeSelected(opt_value)} onClick={handleClick} className={styles.colorButton}></button>
                                                    :
                                                    <button style={{backgroundColor: opt_value}} disabled={!optionCanBeSelected(opt_value)} onClick={handleClick}>{opt_value}
                                                    </button>
                                            }
                                        </>)
                                    })
                                }
                            </div></>
                        )
                    })}
                </div>
                <button className={styles.addToCart} disabled={selected_variants.length!=1 || selected_variants.length==1 && !getVariantPrice("eur", selected_variants[0])}>
                    {
                        selected_variants.length==0 ? "Unavailable..." : <Display_amount amount={getPriceRange(user_currency)}/>
                    }
                </button>
            </div>
        </div>
    )
}

const Display_amount = ({amount}: {amount: number[][]}) => {
    const {t} = useTranslation()
    if(!amount || !amount.length){
        return (<>Unavailable</>)
    }
    const formatted = format_price_range(amount);
    let str = <>{formatted.min && formatted.max ? <>{formatted.min} {formatted.max!=formatted.min ? <>{" - "+formatted.max}</> : null}</> :
        <>{} {formatted.current!=formatted.original ? <><p className={styles.onSale}>{t("shop:onSale")}</p><del>{formatted.original}</del> {formatted.current}</>: formatted.original}</>
    } </>;

    return (<>{str} <FontAwesomeIcon icon={user_currency === "eur"? faEuroSign : faDollarSign}/></>)
}