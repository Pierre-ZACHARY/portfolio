import styles from "./translationswitch.module.css";
import {useRouter} from "next/router";
import ReactFlagsSelect from "react-flags-select";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {executeAction, headerSectionAction} from "../HeaderSection/headerSectionAction";
import {useAppDispatch, useAppSelector} from "../../../../../../redux/hooks";

interface TranslationswitchProps{
    className?: string;
    alignToRight?: boolean;
}


export const TranslationSwitch = ({ className="", alignToRight=false}: TranslationswitchProps) => {
    const { t, i18n } = useTranslation();
    const dispatch  = useAppDispatch();
    const router = useRouter();
    const [selected, setSelected] = useState("FR");
    const selected_index: number = useAppSelector(state => state.headerSection.selected);

    if(i18n.language == "fr" && selected!= "FR"){
        setSelected("FR");
    }
    else if(i18n.language == "en" && selected!= "GB"){
        setSelected("GB");
    }

    const handleSelect = (code: string) => {
        setSelected(code);
        switch (code){
            case "FR":
                router.push('.', '.', { locale: 'fr' }); // next
                i18n.changeLanguage("fr"); // react
                break;
            case "GB":
                router.push('.', '.', { locale: 'en' }); // next
                i18n.changeLanguage("en"); // react
                break;
        }


    }

    return (
        <>
            <ReactFlagsSelect
                selected={selected}
                onSelect={(code) => handleSelect(code)}
                countries={["FR", "GB"]}
                customLabels={{ FR: t("header:french"), GB: t("header:english") }}
                fullWidth={false}
                className={[styles.select, className].join(" ")}
                showSelectedLabel={true}
                alignOptionsToRight={alignToRight}
            />
        </>
    )
}