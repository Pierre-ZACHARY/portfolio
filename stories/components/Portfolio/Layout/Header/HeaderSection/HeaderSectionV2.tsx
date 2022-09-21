import stylesSass from "./headerSection.module.sass";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../../../../../redux/hooks";
import {useState} from "react";
import {AnimatePresence, LayoutGroup, motion} from "framer-motion";


interface HeaderSectionV2Props{
    keyList: string[]
}

export const HeaderSectionV2 = ({keyList}: HeaderSectionV2Props) => {
    const {t} = useTranslation();
    const selected_index: number = useAppSelector(state => state.headerSection.selected);
    const [hovered, setHovered] = useState("");

    return (
        <>
            <AnimatePresence exitBeforeEnter>
                <LayoutGroup id={"headerSectionV2"}>
                    <section className={stylesSass.navbar} onPointerLeave={()=>setHovered("")} >
                        <ul>
                            {
                                keyList.map((value, index) => {
                                    return <li key={index}
                                               className={
                                                    [selected_index == index ? stylesSass.active : null,
                                                     index == keyList.length-1 ? stylesSass.contactLi : null,
                                                        stylesSass.highlightContainer
                                                    ].join(" ")
                                                }
                                               onPointerEnter={()=>setHovered(value)}

                                    >
                                        {hovered == value ? <motion.span  layoutId={"sectionHighlight"}
                                                                          id={stylesSass["highlight"]}
                                                                          initial={{opacity: 1, y: 0}}
                                                                          exit={{opacity: 0}}
                                                                          transition={{
                                            opacity: { duration: 1 },
                                            default: { ease: "linear" }}}/> : null}
                                        <div style={{position: "relative"}}>
                                            <a href={"#"+value}>{t("header:section"+(index+1))}</a>
                                            {selected_index == index ? <motion.span layoutId={"sectionLine"}
                                                                                    id={stylesSass["sectionLine"]}
                                                                                    initial={{y: 0}}/> : null}
                                        </div>

                                    </li>
                                })
                            }
                        </ul>
                    </section>
                </LayoutGroup>
            </AnimatePresence>
        </>
    )
}