import {useEffect, useState} from "react";


interface InnerHeightCSSVariableParams {
    children: React.ReactNode;
}


export const useInnerHeight = () => {

    const [innerHeight, setInnerHeight] = useState(0);

    useEffect(()=>{
        if(window) setInnerHeight(window.innerHeight);
    }, [])

    return innerHeight
}


export default function InnerHeightCSSVariable({children}: InnerHeightCSSVariableParams){

    const innerHeight = useInnerHeight();
    const style = { "--inner-height": innerHeight+"px" } as React.CSSProperties;

    return <div style={style}>{children}</div>
}