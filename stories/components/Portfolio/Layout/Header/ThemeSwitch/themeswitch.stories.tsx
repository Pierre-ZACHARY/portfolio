import {ThemeSwitch} from "./themeswitch";
import {ThemeProvider} from "next-themes";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";

export default {
    title: 'Portfolio/PostLayout/Components/Header/ThemeSwitch',
    component: ThemeSwitch,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (<Story/>),
    ],
} as ComponentMeta<typeof ThemeSwitch>;

const Template: ComponentStory<typeof ThemeSwitch> = (args) => <ThemeSwitch />;



export const Default = Template.bind({});