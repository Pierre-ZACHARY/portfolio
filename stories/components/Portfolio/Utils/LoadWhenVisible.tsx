import useIsVisible from "../../../../lib/useIsVisible";
import {useRef} from "react";


interface LoadWhenVisibleParams {
    children: React.ReactNode;
}

export default function LoadWhenVisible({...props}: LoadWhenVisibleParams){
    const elemRef = useRef(null)
    const contentIsVisible = useIsVisible(elemRef);

    return <>
        {contentIsVisible ? <>{props.children}</> : <div ref={elemRef} style={{margin: "auto"}}></div>}
    </>
}