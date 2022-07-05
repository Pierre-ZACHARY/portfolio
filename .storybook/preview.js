import '../styles/globals.css';
import "../styles/themesVariables.css";
import {addDecorator} from "@storybook/react";
import {store} from "../redux/store";
import {ThemeProvider} from "next-themes";
import {Provider} from "react-redux";
import i18n from "./i18n";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
    i18n,
    locale: 'fr',
    locales: {
        en: 'English',
        fr: 'Français',
    },
}

addDecorator(storyFn => (
    <Provider store={store}>
      <ThemeProvider themes={['oled', 'light', 'dark']}>

          {storyFn()}

      </ThemeProvider>
    </Provider>
));