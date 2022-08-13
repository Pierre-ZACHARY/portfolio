import styles from "./Layout.module.css";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import { Layout } from "./Layout";

export default {
    title: 'Portfolio/PostLayout/PostLayout',
    component: Layout,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (
            <div className={styles.decoratorPageHeight}>
                <Story/>
            </div>
        ),
    ],
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = (args) => <Layout {...args}/>;


export const Default = Template.bind({});
Default.args = {
    content: ""
}