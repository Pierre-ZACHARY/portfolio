import styles from "./dotline.module.css";
import {motion} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";

interface DotlineInterface{
    typing: boolean
}

export const Dotline = ({typing = false} : DotlineInterface) => {
    return(
        <div className={[styles.dotLine, typing ? styles.animateCircle : null].join(" ")}>
            <motion.div animate={{opacity: typing ? [1, 0.1, 1] : 1 }}
                        transition={{
                            repeat: typing ? 6 : 0,
                            duration: typing ? 1.2 : 0.2 }}
                        className={styles.circleContainer}>
                <FontAwesomeIcon icon={faCircle} className={styles.circle} id={styles.Circle1}/>
            </motion.div>
            <motion.div animate={{opacity: typing ? [1, 0.1, 1] : 1 }}
                        transition={{
                            repeat: typing ? 6 : 0,
                            duration: typing ? 1.2 : 0.2,
                            delay: typing ? 0.4 : 0}}
                        className={styles.circleContainer}>
                <FontAwesomeIcon icon={faCircle} className={styles.circle} id={styles.Circle2}/>
            </motion.div>
            <motion.div animate={{opacity: typing ? [1, 0.1, 1] : 1 }}
                        transition={{
                            repeat: typing ? 6 : 0,
                            duration: typing ? 1.2 : 0.2,
                            delay: typing ? 0.8 : 0,
                            ease: "linear" }}
                        className={styles.circleContainer}>
                <FontAwesomeIcon icon={faCircle} className={styles.circle} id={styles.Circle2}/>
            </motion.div>
        </div>
    )
}