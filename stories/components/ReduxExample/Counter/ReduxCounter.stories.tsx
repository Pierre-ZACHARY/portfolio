import {ComponentMeta, ComponentStory, ReactFramework} from "@storybook/react";
import {ReduxCounter} from "./ReduxCounter";
import React from "react";
import {Provider, useSelector} from 'react-redux';
import {CounterAction} from "./counterAction";
import {PartialStoryFn} from "@storybook/csf";
import {Args} from "@storybook/api";
import {useAppSelector} from "../../../../redux/hooks";
import {store} from "../../../../redux/store";


function Counter(){
    const count = useAppSelector(state => state.counter.value)
    return(
        <p>{count}</p>
    )
}

function decorator(story: PartialStoryFn<ReactFramework, Args>) {
    return (
        <Provider store={store}>
            <Counter/>
            {story()}
        </Provider>)
}

export default {
    title: 'Storybook/ReduxExample/Components/Counter',
    component: ReduxCounter,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
        amount: {control: 'number', if: {arg: 'CounterAction', eq: CounterAction.incrementByAmount}}
    },
} as ComponentMeta<typeof ReduxCounter>;

const Template: ComponentStory<typeof ReduxCounter> = (args) => <ReduxCounter {...args} />;

export const Add = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Add.args = {
    label: "+",
    CounterAction: CounterAction.Increment
};
Add.decorators = [
    (story) => (decorator(story)),
]

export const Minus = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Minus.args = {
    label: "-",
    CounterAction: CounterAction.Decrement
};
Minus.decorators = [
    (story) => (decorator(story)),
]