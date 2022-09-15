import Spline from "@splinetool/react-spline";
import styles from "./Skills.module.sass"
import {Application, SPEObject} from "@splinetool/runtime";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";


enum Categorie{
    Perf="Perf",
    Natif="Natif",
    Web="Web",
    Data="Data"
}

export const SkillsComponent = () => {

    const splineRef = useRef<Application | undefined>();
    const camRef = useRef<SPEObject | undefined>(undefined);
    const [selectedCat, setSelectedCat] = useState<Categorie | undefined>(undefined);

    useEffect(()=>{
        if(splineRef.current) {
            if(selectedCat) {
                splineRef.current!.findObjectByName(selectedCat.toString())?.emitEvent("mouseDown")
            }
            else {

                splineRef.current!.findObjectByName("ResetSphere")?.emitEvent("mouseDown");
                setTimeout(()=>{splineRef.current!.findObjectByName("Sphere")?.emitEvent("mouseDown")}, 1000)
                // todo gérer le cas où y'a déjà un to de lancer
            }
        }
    }, [selectedCat, splineRef])

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
                {
                    !selectedCat ?
                        <>
                            <h2>Sélectionnez la catégorie qui vous intéresse :</h2>
                            <ol>
                                <li onClick={()=>setSelectedCat(Categorie.Web)}><motion.p className={styles.web} layoutId={"web"}>Développement Web</motion.p></li>
                                <li onClick={()=>setSelectedCat(Categorie.Natif)}><motion.p className={styles.natif} layoutId={"natif"}>Développement Natif</motion.p></li>
                                <li onClick={()=>setSelectedCat(Categorie.Perf)}><motion.p className={styles.perf} layoutId={"perf"}>Performance</motion.p></li>
                                <li onClick={()=>setSelectedCat(Categorie.Data)}><motion.p className={styles.data} layoutId={"data"}>Data</motion.p></li>
                            </ol>
                        </>
                        :
                        <>
                            <div className={styles.titles} onClick={()=>setSelectedCat(undefined)}>
                                <FontAwesomeIcon className={{
                                    [Categorie.Web]:styles.svgWeb,
                                    [Categorie.Natif]:styles.svgNatif,
                                    [Categorie.Perf]:styles.svgPerf,
                                    [Categorie.Data]:styles.svgData,
                                }[selectedCat]} icon={faChevronLeft}/>
                                {{
                                    [Categorie.Web]:<motion.p className={styles.web} layoutId={"web"}>Développement Web</motion.p>,
                                    [Categorie.Natif]:<motion.p className={styles.natif} layoutId={"natif"}>Développement Natif</motion.p>,
                                    [Categorie.Perf]:<motion.p className={styles.perf} layoutId={"perf"}>Performance</motion.p>,
                                    [Categorie.Data]:<motion.p className={styles.data} layoutId={"data"}>Data</motion.p>,
                                }[selectedCat]}
                            </div>

                        </>
                }
            </div>
        </div>
    )
}