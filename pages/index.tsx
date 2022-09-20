import {Home} from "../stories/screens/NextHome/NextHome";
import {getSortedPostsData} from "../lib/posts";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import { Index } from "../stories/screens/Portfolio/Index/Index";
import {LayoutGroup} from "framer-motion";
import {ThemeSwitch, TranslationSwitch} from "../stories/components/Portfolio/Layout/Header/IconSwitch/IconSwitch";
import Head from "next/head";
import {remark} from "remark";
import fs from 'fs';
import remarkHtml from "remark-html";
import { parse, HTMLElement } from 'node-html-parser';
import {Exception} from "sass";

export default function IndexPage({skills}: { allPostsData: any, skills: JsonTree[] }) {
    return (
        <>
            <Head>
                <title>Pierre Zachary</title>
            </Head>
            <Index skills={skills}/>
        </>
    )
}

export interface JsonTree{
    content: HTMLElement,
    children: JsonTree[]
}

function domToJsonTree(dom: HTMLElement): JsonTree[] {
    const res: JsonTree[] = [];
    let level = 0;
    let temp: JsonTree | undefined = undefined;
    let tempLevel1: JsonTree | undefined = undefined;
    let tempLevel2: JsonTree | undefined = undefined;
    // @ts-ignore
    for(const elem of dom.childNodes.values()){
        if(level == 0 && elem.rawTagName == 'h1'){
            if(temp) res.push(temp);
            const {parentNode, childNodes, voidTag, classList, ...elemWithoutParent} = elem;
            temp = {content: {childNodes: clearChilds(childNodes), ...elemWithoutParent}, children: []};
            level = 1;
        }
        if(level == 1 && elem.rawTagName == 'h2'){
            if(tempLevel1) temp!.children.push(tempLevel1);
            const {parentNode, childNodes, voidTag, classList, ...elemWithoutParent} = elem;
            tempLevel1 = {content: {childNodes: clearChilds(childNodes), ...elemWithoutParent}, children: []};
            level = 2;
        }
        if(level == 2 && elem.rawTagName == 'h3'){
            if(tempLevel2) tempLevel1!.children.push(tempLevel2);
            const {parentNode, childNodes, voidTag, classList, ...elemWithoutParent} = elem;
            tempLevel2 = {content: {childNodes: clearChilds(childNodes), ...elemWithoutParent}, children: []};
            level = 3;
        }
        if(level==3){
            if(elem.rawTagName=='p' || elem.rawTagName=='ul') {
                const {parentNode, childNodes, voidTag, classList, ...elemWithoutParent} = elem;
                tempLevel2!.children.push({content: {childNodes: clearChilds(childNodes), ...elemWithoutParent}, children: []});
            }
            else if(elem.rawTagName=='h3') {
                tempLevel1!.children.push(tempLevel2!)
                const {parentNode, childNodes, voidTag, classList, ...elemWithoutParent} = elem;
                tempLevel2 = {content: {childNodes: clearChilds(childNodes), ...elemWithoutParent}, children: []};
            }
            else if(elem.rawTagName=='h2') {
                tempLevel1!.children.push(tempLevel2!)
                tempLevel2 = undefined
                temp!.children.push(tempLevel1!);
                const {parentNode, childNodes, voidTag, classList, ...elemWithoutParent} = elem;
                tempLevel1 = {content: {childNodes: clearChilds(childNodes), ...elemWithoutParent}, children: []};
                level = 2;
            }
            else if(elem.rawTagName=='h1') {
                tempLevel1!.children.push(tempLevel2!)
                tempLevel2 = undefined
                temp!.children.push(tempLevel1!);
                tempLevel1 = undefined;
                res.push(temp!);
                const {parentNode, childNodes, voidTag, classList, ...elemWithoutParent} = elem;
                temp = {content: {childNodes: clearChilds(childNodes), ...elemWithoutParent}, children: []};
                level = 1;
            }
        }
    }
    if(temp) res.push(temp);
    return res;
}

function clearChilds(childNodes: Node[]): any{
    const res = []
    for(const node of childNodes){
        // @ts-ignore
        const {parentNode, childNodes, voidTag, classList, ...clearedElem} = node;
        // @ts-ignore
        res.push({childNodes: clearChilds([...childNodes.values()]), ...clearedElem});
    }
    return res;
}


export async function getStaticProps({ locale }: any) {
    let skills: JsonTree[] = [];
    try{
        const skillsHtml: any = (await remark().use(remarkHtml).process(fs.readFileSync(process.cwd()+ '/pages/markdown/'+locale+'/skills.md', 'utf8'))).value;
        skills = domToJsonTree(parse(skillsHtml));
    }
    catch(e){
        console.log(e);
    }
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'header', 'index', 'chatbot', 'authentification', 'shop'])),
            skills: skills,
        },
    };
}