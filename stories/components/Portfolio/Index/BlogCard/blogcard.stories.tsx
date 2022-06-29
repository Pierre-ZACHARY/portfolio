import {ReduxCounter} from "../../../ReduxExample/Counter/ReduxCounter";
import {CounterAction} from "../../../ReduxExample/Counter/counterAction";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Blogcard} from "./blogcard";
import React from "react";
import cardbg from "../../../../../public/cardbg.jpg"

export default {
    title: 'Portfolio/Index/Components/Blogcard',
    component: Blogcard,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {

    },
} as ComponentMeta<typeof Blogcard>;


const Template: ComponentStory<typeof Blogcard> = (args) => <Blogcard {...args}/>;

export const Default = Template.bind({});
Default.args = {
    cardtitle: "Default card",
    mostviewed: false,
    lastupdated: false,
    description: "",
    imagesrc: cardbg.src
}

export const MostViewed = Template.bind({});
MostViewed.args = {
    cardtitle: "MostViewed",
    mostviewed: true,
    lastupdated: false,
    description: "",
    imagesrc: cardbg.src
}

export const LastUpdated = Template.bind({});
LastUpdated.args = {
    cardtitle: "Last Updated",
    mostviewed: false,
    lastupdated: true,
    description: "",
    imagesrc: cardbg.src
}


export const LastUpdatedAndMostViewed = Template.bind({});
LastUpdatedAndMostViewed.args = {
    cardtitle: "LastUpdatedAndMostViewed",
    mostviewed: true,
    lastupdated: true,
    description: "",
    imagesrc: cardbg.src
}