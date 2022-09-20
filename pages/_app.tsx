import '../styles/globals.css'
import '../styles/themesVariables.css'
import type { AppProps } from 'next/app'
import {Provider, useDispatch} from "react-redux";
import {store} from "../redux/store";
import { ThemeProvider } from 'next-themes'
import { appWithTranslation } from 'next-i18next';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import "react-step-progress-bar/styles.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


config.autoAddCss = false
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {useEffect} from "react";
import {reduceCart} from "../stories/components/Portfolio/Shop/cartReducer";
import {client, useCart} from "../lib/medusa-utils";
import {useAppDispatch} from "../redux/hooks";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAecq8IuJH-8_LV7FdWjZTMLroMBDaoY7I",
    authDomain: "portfolio-3303d.firebaseapp.com",
    projectId: "portfolio-3303d",
    storageBucket: "portfolio-3303d.appspot.com",
    messagingSenderId: "460956162001",
    appId: "1:460956162001:web:55dd1abde7221764ff72f0",
    measurementId: "G-VKY4GH3CHE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
function MyApp({ Component, pageProps }: AppProps) {



  return (<Provider store={store}>
              <AsyncStateLoader>
                <ThemeProvider themes={['oled', 'light', 'dark']}>
                    <Component {...pageProps} />
                </ThemeProvider>
              </AsyncStateLoader>
  </Provider>)
}

const AsyncStateLoader = (props: any) => {

    const dispatch = useAppDispatch();

    useEffect(()=>{


        const id = localStorage.getItem('cart_id');
        if(id) {
            client.carts.retrieve(id).then(({cart}) => {
                dispatch(reduceCart(cart))
            });
        }
        else {
            client.carts.create({
                region_id: "reg_01GBGGFM1CDN3C9BGKAVVB37E0"
            })
                .then(({cart}) => {
                    localStorage.setItem('cart_id', cart.id);
                    //assuming you have a state variable to store the cart
                    dispatch(reduceCart(cart))
                });
        }

    }, []);
    return (<>{props.children}
        </>)
}

export default appWithTranslation(MyApp)
