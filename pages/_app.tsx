import '../styles/globals.css'
import '../styles/themesVariables.css'
import type { AppProps } from 'next/app'
import {Provider} from "react-redux";
import {store} from "../redux/store";
import { ThemeProvider } from 'next-themes'
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  return (<Provider store={store}>
            <ThemeProvider themes={['oled', 'light', 'dark']}>
              <Component {...pageProps} />
            </ThemeProvider>
          </Provider>)
}

export default appWithTranslation(MyApp)
