import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {IconSwitch, ThemeSwitch, TranslationSwitch} from "./IconSwitch";




export default {
    title: 'Portfolio/PostLayout/Components/Header/IconSwitch',
    component: IconSwitch,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof IconSwitch>;

const TemplateTS: ComponentStory<typeof ThemeSwitch> = (props) => <ThemeSwitch />;

export const ThemeSwitchDefault = TemplateTS.bind({});

const TemplateTranslationS: ComponentStory<typeof TranslationSwitch> = (props) => <TranslationSwitch />;

export const TranslationSwitchDefault = TemplateTranslationS.bind({});