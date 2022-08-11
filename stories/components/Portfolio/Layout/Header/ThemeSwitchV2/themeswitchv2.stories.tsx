import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Themeswitchv2} from "./themeswitchv2";

export default {
    title: 'Portfolio/Layout/Components/Header/ThemeSwitchv2',
    component: Themeswitchv2,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (<Story/>),
    ],
} as ComponentMeta<typeof Themeswitchv2>;

const Template: ComponentStory<typeof Themeswitchv2> = (args) => <Themeswitchv2 />;

export const Default = Template.bind({});