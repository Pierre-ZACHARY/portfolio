import Spline from "@splinetool/react-spline";
import styles from "./Skills.module.sass"
import {Application, SPEObject} from "@splinetool/runtime";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import {JsonTree} from "../../../../../pages";


enum Categorie{
    Perf="Perf",
    Natif="Natif",
    Web="Web",
    Data="Data"
}


function ulChildNodesToJSX(childNodes: any[]): JSX.Element[]{
    const res = [];
    for(const child of childNodes){
        if(child.childNodes.length) res.push(<li>{childNodesToText(child.childNodes)}</li>);
    }
    return res;
}
function childNodesToText(childNodes: any[]): string{
    let res = "";
    for(const child of childNodes){
        if(child.childNodes.length) res+=childNodesToText(child.childNodes);
        else res+=child._rawText;
    }
    return res;
}
const Skill = ({skill}: {skill: JsonTree }) => {
    if(!skill.content) console.log(skill);
    switch(skill.content.rawTagName){
        case "h1": return <><h1>{childNodesToText(skill.content.childNodes)}</h1> {skill.children.map((s, i)=><Skill key={i} skill={s}/>)}</>
        case "h2": return <><h2>{childNodesToText(skill.content.childNodes)}</h2> {skill.children.map((s, i)=><Skill key={i} skill={s}/>)}</>
        case "h3": return <><h3>{childNodesToText(skill.content.childNodes)}</h3> {skill.children.map((s, i)=><Skill key={i} skill={s}/>)}</>
        case "p": return <><p>{childNodesToText(skill.content.childNodes)}</p></>
        case "ul": return <><ul>{ulChildNodesToJSX(skill.content.childNodes)}</ul></>
    }
    return <></>
}

export const SkillsComponent = ({skills}: {skills: JsonTree[]}) => {

    const splineRef = useRef<Application | undefined>();
    const camRef = useRef<SPEObject | undefined>(undefined);


    function onLoad(spline: Application) {
        splineRef.current = spline;
        camRef.current = spline.findObjectById("13b3d49f-38b0-4a8e-8c3e-85172aa9af0c");
    }

    return (
        <div className={styles.main}>
            <div className={styles.skills}>
                <Spline
                    scene="https://prod.spline.design/XhjYI7UwM5Mo2WPm/scene.splinecode"
                    onLoad={onLoad}
                />
            </div>
            <div className={styles.select}>
                {skills.map((s)=><Skill key={s.toString()} skill={s}/>)}
            </div>
        </div>
    )
}