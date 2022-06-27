import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Home} from "./NextHome";
import React from "react";

export default {
    title: 'nextjs/NextHome/Screens/NextHome',
    component: Home,
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof Home>;

const Template: ComponentStory<typeof Home> = (args) => <Home {...args} />;

export const HomePage = Template.bind({});