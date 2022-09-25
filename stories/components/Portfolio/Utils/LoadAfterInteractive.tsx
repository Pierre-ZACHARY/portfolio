import {useEffect, useState} from "react";


interface LoadAfterInteractiveParams {
    children: React.ReactNode;
}

export default function LoadAfterInteractive({children}: LoadAfterInteractiveParams){

    const [pageFullyLoaded, setPageFullyLoaded] = useState<boolean>(false);

    function handlePageLoad() {
        setTimeout(()=>setPageFullyLoaded(true), 1500);
    }

    useEffect(()=> {
        if (document.readyState === "complete") {
            handlePageLoad();
        } else {
            window.addEventListener("load", handlePageLoad);
            return () => window.removeEventListener("load", handlePageLoad);
        }
    }, []);
    return <>
        {pageFullyLoaded ? <>{children}</> : <div>Loading...</div>}
    </>
}