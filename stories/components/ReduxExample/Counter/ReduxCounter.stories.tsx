import {ComponentMeta, ComponentStory} from "@storybook/react";
import {ReduxCounter} from "./ReduxCounter";
import React from "react";
import store from "../../../../redux/store";
import {Provider, useDispatch} from 'react-redux';
import {increment} from "./counterReducer";



export default {
    title: 'Storybook/ReduxExample/Components/Counter',
    component: ReduxCounter,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof ReduxCounter>;

const Template: ComponentStory<typeof ReduxCounter> = (args) => <ReduxCounter {...args} />;

export const Add = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Add.args = {
    label: "+",
};
Add.decorators = [
    (story) => (<Provider store={store}>{story()}</Provider>),
]

export const Minus = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Minus.args = {
    label: "-",
};
Minus.decorators = [
    (story) => (<Provider store={store}>{story()}</Provider>),
]