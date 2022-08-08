import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import { Index } from "./Index";

export default {
    title: 'Portfolio/Index/Index',
    component: Index,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (
                <Story/>
        ),
    ],
} as ComponentMeta<typeof Index>;

const Template: ComponentStory<typeof Index> = (args) => <Index {...args}/>;

export const Default = Template.bind({});
Default.args = {
    content: ""
}