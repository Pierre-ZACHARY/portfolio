import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {FlubberTextTransition} from "./FlubberTextTransition";


export default {
    title: 'Framer/FlubberTextTransition',
    component: FlubberTextTransition,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: { },
    decorators: [
        (Story) => (
            <Story/>
        ),
    ],
} as ComponentMeta<typeof FlubberTextTransition>;

const Template: ComponentStory<typeof FlubberTextTransition> = (args) => <FlubberTextTransition {...args}/>;

export const Default = Template.bind({});