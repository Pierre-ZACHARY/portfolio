import Image, {ImageProps} from "next/image";
import {useState} from "react";

export const NaturalImageFixedHeight = ({props, fixedHeight = 200}: {props: ImageProps, fixedHeight: number}) => {
    const [ratio, setRatio] = useState(1) // default to 1:1

    return (<Image
            {...props}
            // set the dimension (affected by layout)
            width={fixedHeight*ratio}
            height={fixedHeight}
            layout="fixed" // you can use "responsive", "fill" or the default "intrinsic"
            onLoadingComplete={({ naturalWidth, naturalHeight }) =>setRatio(naturalWidth / naturalHeight)}/>)
}