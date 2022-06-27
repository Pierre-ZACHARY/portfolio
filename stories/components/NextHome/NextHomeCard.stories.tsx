import {ComponentMeta, ComponentStory} from "@storybook/react";
import {NextHomeCard} from "./NextHomeCard";
import React from "react";

export default {
    title: 'nextjs/NextHome/Components/NextHomeCard',
    component: NextHomeCard,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof NextHomeCard>;

const Template: ComponentStory<typeof NextHomeCard> = (args) => <NextHomeCard {...args} />;

export const Documentation = Template.bind({});
Documentation.args = {
    titleLabel: "Documentation",
    description: "Find in-depth information about Next.js features and API.",
    link: "https://nextjs.org/docs"
}

export const Learn = Template.bind({});
Learn.args = {
    titleLabel: "Learn",
    description: "Learn about Next.js in an interactive course with quizzes!",
    link: "https://nextjs.org/learn"
}