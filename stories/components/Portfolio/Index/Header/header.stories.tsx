import {Provider} from "react-redux";
import {store} from "../../../../../redux/store";
import styles from "./header.module.css";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Header} from "./header";
import {ThemeProvider} from "next-themes";

export default {
    title: 'Portfolio/Index/Components/Header',
    component: Header,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (
            <div className={styles.decoratorPageHeight}>
                <Story/>
            </div>
        ),
    ],
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args}/>;


export const Default = Template.bind({});
Default.args = {
    content: ""
}