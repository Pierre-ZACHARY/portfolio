import {ComponentMeta, ComponentStory, ReactFramework} from "@storybook/react";
import { HeaderSection } from "./headerSection";
import React from "react";
import {Provider} from "react-redux";
import {store} from "../../../../../../redux/store";
import styles from "./headerSection.module.css"

export default {
    title: 'Portfolio/Index/Components/Header/HeaderSection',
    component: HeaderSection,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (
                <div className={styles.decoratorPageHeight}>
                    <Story/>
                </div>
        ),
    ],
} as ComponentMeta<typeof HeaderSection>;

const Template: ComponentStory<typeof HeaderSection> = (args) => <HeaderSection {...args}/>;


export const Default = Template.bind({});
Default.args = {
    content: ""
}
