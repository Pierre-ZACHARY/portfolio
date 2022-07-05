import {ComponentType, useEffect, useRef, useState} from 'react'
import {useTheme} from 'next-themes'
import Select, {components, GroupBase, StylesConfig, ValueContainerProps} from 'react-select';
import {faCircleHalfStroke, faComputer, faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "./themeswitch.module.css"
import {SelectComponents} from "react-select/dist/declarations/src/components";
import {useTranslation} from "react-i18next";

const { Option, ValueContainer, Menu } = components;

const CustomOption = (props: any) => {
    //console.log(props)
    return(<Option {...props} className={styles.option}>
            {props.data.icon}
            <p className={styles.optionLabel}>{props.data.label}</p>
        </Option>
    )
}




type OptionType = {
    value: string;
    label: string;
    icon: JSX.Element;
};


const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
    menu: () => ({
        // none of react-select's styles are passed to <Control />
        border: "solid 1px",
        borderRadius: "3px"
    }),
    indicatorsContainer: () => ({
        // none of react-select's styles are passed to <Control />
        display: "none"
    }),
    control: () => ({
        // none of react-select's styles are passed to <Control />
        border: "none",
        marginLeft: "auto"
    }),
}

interface ThemeSwitchProps{
    className?: string;
    alignToRight?: boolean;
}


export const ThemeSwitch = ({className = "", alignToRight = false}: ThemeSwitchProps) => {
    const {t} = useTranslation()
    const [state, setState] = useState({mounted: false, open: false})
    const { theme, setTheme } = useTheme()
    const selectRef = useRef();

    const toggleMenu = () => {
        setState({...state, open: !state.open});
    }

    const HandleBlur = (e: any) => {
        setState({...state, open: false});
    }

    const options: OptionType[] = [
        { value: "system", label: t("header:system"), icon: <FontAwesomeIcon icon={faComputer} className={styles.optionIcon}/>  },
        { value: "dark", label: t("header:dark"), icon: <FontAwesomeIcon icon={faMoon} className={styles.optionIcon}/> },
        { value: "light", label: t("header:light"), icon: <FontAwesomeIcon icon={faSun} className={styles.optionIcon} />  },
        { value: "oled", label: t("header:oled"), icon: <FontAwesomeIcon icon={faCircleHalfStroke} className={styles.optionIcon} />  },
    ];

    const getOption = (value: string | undefined) => {
        if(value){
            for(let i = 0; i<options.length; i++ ){
                if(options[i].value == value){
                    return options[i];
                }
            }
        }
    }

    const CustomValueContainer = ({children, ...props}:  any) => {
        const {} = props;
        return(<ValueContainer {...props} className={styles.valueContainer} onBlur={HandleBlur}><button onClick={toggleMenu} onTouchEnd={toggleMenu} onBlur={HandleBlur} autoFocus={true}>{getOption(theme)!.icon}<p className={[styles.buttonLabel, state.open ? styles.menuOpen : null].join(" ")}>{getOption(theme)!.label}</p></button></ValueContainer>)
    }

    const CustomMenu = ({children, ...props}: any) => {
        return(<Menu {...props} className={[styles.Menu, alignToRight ? styles.alignToRight : null].join(" ")}><div>{children}</div></Menu>)
    }

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setState({ ...state, mounted: true})
    }, [])

    if (!state) {
        return null
    }

    function handleChange(e: any) {
        setTheme(e.value);
    }

    const components: Partial<SelectComponents<OptionType, false, GroupBase<OptionType>>> = { ValueContainer: CustomValueContainer, Option: CustomOption, Menu: CustomMenu } ;

    return (
        <>
            <Select components={components}
                    menuIsOpen={state.open}
                    className={[styles.select, className].join(" ")}
                    menuPosition="fixed"
                    styles={customStyles}
                    options={options}
                    onMenuClose={() => setState({...state, open: false})}
                    onChange={e => handleChange(e)}/>
        </>
    )
}

export default ThemeSwitch