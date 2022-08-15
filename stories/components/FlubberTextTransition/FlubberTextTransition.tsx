import {useEffect, useState} from "react";
import {animate, motion, useMotionValue, useTransform} from "framer-motion";
import { getIndex, useFlubber } from "./use-flubber";
import { SVG } from '@svgdotjs/svg.js'

interface FlubberTextTransitionProps{
    startPath: string,
    text: string,
}

const colors = [
    "#00cc88",
    "#0099ff"
];

export const FlubberTextTransition = ({startPath, text}: FlubberTextTransitionProps) => {

    const paths = [startPath, startPath];
    const [pathIndex, setPathIndex] = useState(0);
    const progress = useMotionValue(pathIndex);
    const fill = useTransform(progress, paths.map(getIndex), colors);
    const path = useFlubber(progress, paths);

    useEffect(() => {
        var draw = SVG().addTo('#drawing')
        var path = draw.text("Bonjour")
        console.log(path);
        console.log(path.textPath());

        const animation = animate(progress, pathIndex, {
            duration: 0.8,
            ease: "easeInOut",
            onComplete: () => {
                if (pathIndex !== paths.length - 1) {
                    setPathIndex(pathIndex + 1);
                }
            }
        });

        return () => animation.stop();
    }, [pathIndex]);

    return(
        <>
            <svg id={"drawing"}>

            </svg>
            <svg width="400" height="400">
                <g transform="translate(10 10) scale(17 17)">
                    <motion.path fill={fill} d={path} />
                </g>
            </svg>
        </>
    )
}