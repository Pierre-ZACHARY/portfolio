import styles from "./translationswitch.module.css";
import {useRouter} from "next/router";
import ReactFlagsSelect from "react-flags-select";
import {useState} from "react";
import {useTranslation} from "react-i18next";

interface TranslationswitchProps{
    className?: string;
    alignToRight?: boolean;
}

export const TranslationSwitch = ({ className="", alignToRight=false}: TranslationswitchProps) => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [selected, setSelected] = useState("FR");

    if(router.locale == "fr" && selected!= "FR"){
        setSelected("FR");
    }
    else if(router.locale == "en" && selected!= "US"){
        setSelected("US");
    }

    const handleSelect = (code: string) => {
        setSelected(code);
        switch (code){
            case "FR":
                router.push('.', '.', { locale: 'fr' });
                break;
            case "US":
                router.push('.', '.', { locale: 'en' });
                break;
        }
    }

    return (
        <>
            <p>{t("common:testing")}</p>
            <ReactFlagsSelect
                selected={selected}
                onSelect={(code) => handleSelect(code)}
                countries={["FR", "US"]}
                fullWidth={false}
                className={[styles.select, className].join(" ")}
                showSelectedLabel={true}
                alignOptionsToRight={alignToRight}
            />
        </>
    )
}