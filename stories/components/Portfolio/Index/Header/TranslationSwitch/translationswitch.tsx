import styles from "./translationswitch.module.css";
import {useRouter} from "next/router";
import ReactFlagsSelect from "react-flags-select";
import {useState} from "react";

interface TranslationswitchProps{
    className: string;
}

export const TranslationSwitch = ({ className }: TranslationswitchProps) => {
    const router = useRouter()
    const [selected, setSelected] = useState("FR");

    console.log(router.locale)
    return (
        <>
            <ReactFlagsSelect
                selected={selected}
                onSelect={(code) => setSelected(code)}
                countries={["FR", "US"]}
                fullWidth={false}
                className={[styles.select, className].join(" ")}
                showSelectedLabel={false}
                alignOptionsToRight={true}
            />
        </>
    )
}