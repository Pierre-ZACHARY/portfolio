import styles from "./translationswitch.module.css";
import {useRouter} from "next/router";
import ReactFlagsSelect from "react-flags-select";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {executeHeaderSectionAction, headerSectionAction} from "../HeaderSection/headerSectionAction";
import {useAppDispatch, useAppSelector} from "../../../../../../redux/hooks";

interface TranslationswitchProps{
    className?: string;
    alignToRight?: boolean;
}


export const TranslationSwitch = ({ className="", alignToRight=false}: TranslationswitchProps) => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [state, setState] = useState({selected:"FR", mounted: false});

    if(i18n.language == "fr" && state.selected!= "FR"){
        setState({...state, selected: "FR"});
    }
    else if(i18n.language == "en" && state.selected!= "GB"){
        setState({...state, selected: "GB"});
    }

    const handleSelect = (code: string) => {
        setState({...state, selected: code});
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

    useEffect(() => {
        setState({...state, mounted: true})
    }, [])

    if(!state.mounted){
        return null
    }

    return (
        <>
            <ReactFlagsSelect
                selected={state.selected}
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