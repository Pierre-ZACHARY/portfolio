import styles from "./Search.module.sass"
import {instantMeiliSearch} from "@meilisearch/instant-meilisearch";
import {Highlight, Hits, InstantSearch, useSearchBox, UseSearchBoxProps} from "react-instantsearch-hooks-web";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping, faDeleteLeft, faSearch} from "@fortawesome/free-solid-svg-icons";
import {NaturalImageFixedHeight} from "../../../../../lib/utils-components";


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
                <Hits hitComponent={Hit} className={styles.hits}/>
            </InstantSearch>
        </div>
    )
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

    const variantHasOption = (variant_id: string, option_value: string): boolean => {
        return variantsMap.get(variant_id).options.some((opt: any): boolean | undefined => {
            if (opt.value === option_value) {
                return true;
            }
        });
    }

    const optionCanBeSelected = (option_value: string): boolean => {
        // Regarde si un variant possède cette option dans la liste des variants disponibles
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
                    if(!variantHasOption(variant_id, option_value)) return true;
                }
            });
            if(!variant_hasnt_options){
                temp.push(variant_id)
            }
        });
        setSelected_variants(temp);
    }

    const getVariantPrice = (currency: string, variant_id: string) : number | undefined=> {
        const variant = variantsMap.get(variant_id);
        if(variant){
            let res = 0;
            variant.prices.forEach((price: any) : number | undefined=>{
                if(price.currency_code === currency){
                    res = price.amount
                    return price.amount;
                }
            })
            console.log(res)
            return res;
        }
    }

    useEffect(()=>{console.log(selected_variants)}, [selected_variants]);

    const availableOptions = new Map<string, string[]>();

    selected_variants
        .forEach((variant_id: any)=>{
        variantsMap.get(variant_id).options.forEach((option: any)=>{
            if(!availableOptions.has(option.option_id)) availableOptions.set(option.option_id, []);
            if(!(option.value in availableOptions.get(option.option_id)!)) availableOptions.get(option.option_id)!.push(option.value)
        });
    });

    return (
        <div key={hit.id} className={"relative" +" "+ styles.hitCard}>
            <div className={styles.imageBackground}/>
            <NaturalImageFixedHeight props={{src: hit.thumbnail}} fixedHeight={200}/>
            <div className="hit-name">
                <Highlight attribute="title" hit={hit} highlightedTagName="mark" className={styles.highlight}/>
            </div>
            <div className={styles.objectInfo}>
                <div className={styles.allOptions}>
                    { // @ts-ignore
                      [...allOptions.entries()].map((k: [string, Set<string>])=>{
                        return (<>
                            <div className={styles.selectOption}>
                                <p>{optionsMap.get(k[0]).title}</p>
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
                <button className={styles.addToCart} disabled={selectedOptions.size!=1}>
                    {
                        selected_variants.length==0 ? "Unavailable..." : (
                            selected_variants.length==1 ? getVariantPrice("eur", selected_variants[0]) : <FontAwesomeIcon icon={faCartShopping}/>
                        )
                    }
                </button>
            </div>
        </div>
    )
}