import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import Chatbot from "./chatbot";


export default {
    title: 'Portfolio/PostLayout/Components/Chatbot',
    component: Chatbot,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (
                <Story/>
        ),
    ],
} as ComponentMeta<typeof Chatbot>;

const Template: ComponentStory<typeof Chatbot> = (args) => <Chatbot {...args}/>;

export const Default = Template.bind({});
