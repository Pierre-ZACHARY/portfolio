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
    argTypes: { datestringiso: { control: 'date' }},
} as ComponentMeta<typeof Blogcard>;


const Template: ComponentStory<typeof Blogcard> = (args) => <Blogcard {...args}/>;

export const Default = Template.bind({});
Default.args = {
    cardtitle: "Default card",
    mostviewed: false,
    lastupdated: false,
    descriptionHtml: "",
    datestringiso: "2020-01-01"
}

export const MostViewed = Template.bind({});
MostViewed.args = {
    cardtitle: "MostViewed",
    mostviewed: true,
    lastupdated: false,
    descriptionHtml: "",
    datestringiso: "2020-02-15"
}

export const LastUpdated = Template.bind({});
LastUpdated.args = {
    cardtitle: "Last Updated",
    mostviewed: false,
    lastupdated: true,
    descriptionHtml: "",
    datestringiso: "2020-01-01"
}


export const LastUpdatedAndMostViewed = Template.bind({});
LastUpdatedAndMostViewed.args = {
    cardtitle: "LastUpdatedAndMostViewed",
    mostviewed: true,
    lastupdated: true,
    descriptionHtml: "",
    datestringiso: "2020-01-01"
}