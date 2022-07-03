import styles from "./translationswitch.module.css";
import {useRouter} from "next/router";


export const TranslationSwitch = () => {
    const router = useRouter()

    return (
        <>
            <select onChange={e => router.locale = e.target.value} className={styles.select}>
                <option value="en" > 🇬🇧 English</option>
                <option value="fr" > 🇫🇷 French</option>
            </select>
        </>
    )
}