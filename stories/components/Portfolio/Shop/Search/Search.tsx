import styles from "./Search.module.sass"
import {instantMeiliSearch} from "@meilisearch/instant-meilisearch";
import {
    Highlight,
    Hits,
    InstantSearch,
    SearchBox,
    useSearchBox,
    UseSearchBoxProps
} from "react-instantsearch-hooks-web";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faDeleteLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
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

    const selected_variants = []
    const variantsMap = new Map<string, any>();
    const optionsMap = new Map<string, string[]>();
    hit.variants.forEach((variant: any)=>{
        selected_variants.push(variant.id);
        variantsMap.set(variant.id, variant);
    });


    return (
        <div key={hit.id} className="relative">
            <NaturalImageFixedHeight props={{src: hit.thumbnail}} fixedHeight={200}/>
            <div className="hit-name">
                <Highlight attribute="title" hit={hit} highlightedTagName="mark" className={styles.highlight}/>
            </div>
        </div>
    )
}