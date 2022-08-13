import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {TranslationSwitch} from "./translationswitch";
import {useTranslation} from "react-i18next";



function TradTest () {
    const { t } = useTranslation('common');

    return(
        <>
            <p>{t("common:testing")}</p>
        </>
    )
}


export default {
    title: 'Portfolio/PostLayout/Components/Header/TranslationSwitch',
    component: TranslationSwitch,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [(Story)=>{
        return (
            <>
                <TradTest/>
                <Story/>
            </>)
    }]
} as ComponentMeta<typeof TranslationSwitch>;

const Template: ComponentStory<typeof TranslationSwitch> = (args) =>{
    return (<TranslationSwitch />)
};

export const Default = Template.bind({});

