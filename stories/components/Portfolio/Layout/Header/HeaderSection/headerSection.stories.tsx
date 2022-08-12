import {ComponentMeta, ComponentStory, ReactFramework} from "@storybook/react";
import { HeaderSection } from "./headerSection";
import React from "react";
import {Provider} from "react-redux";
import {store} from "../../../../../../redux/store";
import styles from "./headerSection.module.css"
import {HeaderSectionV2} from "./HeaderSectionV2";

export default {
    title: 'Portfolio/Layout/Components/Header/HeaderSection',
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

const TemplateV2: ComponentStory<typeof HeaderSectionV2> = (args) => <HeaderSectionV2 {...args}/>;

export const Version2 = TemplateV2.bind({});
Version2.args = {
    keyList: ["first", "second", "third", "fourth", "fifth"]
}

