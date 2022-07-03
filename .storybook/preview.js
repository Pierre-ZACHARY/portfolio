import '../styles/globals.css';
import "../styles/themesVariables.css"
import i18n from "./i18n";
import {I18nextProvider} from "react-i18next";
import {addDecorator} from "@storybook/react";
import {store} from "../redux/store";
import {ThemeProvider} from "next-themes";
import {Provider} from "react-redux";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

addDecorator(storyFn => (
    <Provider store={store}>
      <ThemeProvider themes={['oled', 'light', 'dark']}>
        <I18nextProvider i18n={i18n}>
          {storyFn()}
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
));