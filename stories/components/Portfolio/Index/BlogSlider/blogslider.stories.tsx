import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Blogslider} from "./blogslider";
import React from "react";


export default {
    title: 'Portfolio/Index/Components/BlogSlider',
    component: Blogslider,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
} as ComponentMeta<typeof Blogslider>;


const Template: ComponentStory<typeof Blogslider> = (args) => <Blogslider {...args}/>;

export const Default = Template.bind({});
Default.args = {
    content: ""
}