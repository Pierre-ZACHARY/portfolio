import styles from "./LoginScreen.module.sass"
import {useTranslation} from "next-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faAt, faKey, faRightToBracket, faSpinner } from "@fortawesome/free-solid-svg-icons";
import {motion} from "framer-motion";
import {useRouter} from "next/router";
import {FormEvent, useEffect, useRef, useState} from "react";
import {
    getAuth, getRedirectResult,
    GoogleAuthProvider,
    sendPasswordResetEmail, signInWithCredential,
    signInWithEmailAndPassword,
    signInWithRedirect
} from "@firebase/auth";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import Script from "next/script";

export const googleDraw = (context: "signin" | "signup", callBack: Function) => {
    google.accounts.id.initialize({
        client_id: '1065332303972-9m6kfer2t2slptj0p06s9ej36gvd49rv.apps.googleusercontent.com',
        prompt_parent_id: styles["g_id_onload"],
        context: context,
        itp_support: true,
        cancel_on_tap_outside: false,
        callback: callBack
    });
    if(window.innerWidth>760){
        google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // try next provider if OneTap is not displayed or skipped
                google.accounts.id.renderButton(
                    document.getElementById(styles["buttonDiv"]),
                    { theme: "outline", size: "large" }  // customization attributes
                );
            }
        });
    }
    else{
        google.accounts.id.renderButton(
            document.getElementById(styles["buttonDiv"]),
            { theme: "outline", size: "large" }  // customization attributes
        );
    }
}
declare var google: any

export const LoginScreen = ({onSignUp = undefined} : {onSignUp: Function |undefined}) => {

    const {t} = useTranslation();
    const router = useRouter()
    const [id_token, setId_token] = useState(null)
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [passwordResetSent, setPasswordResetSent] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const emailRef = useRef(null);
    const auth = getAuth();


    const handleSignUp = () => {
        if(onSignUp) onSignUp()
        else router.push("/signup")
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // @ts-ignore
            const email: string = e.target![0]!.value;
            // @ts-ignore
            const pass1: string = e.target![1]!.value;

            console.log(email);
            console.log(pass1);
            if(pass1.length == 0){
                setErrorMessage(t("authentification:pleasePass"))
                setLoading(false);
                return;
            }
            signInWithEmailAndPassword(auth, email, pass1)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                    setLoading(false);
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    switch (errorCode){
                        case "auth/wrong-password":
                            setErrorMessage(t("authentification:wrongPassword"));
                            break;
                        default:
                            setErrorMessage(errorMessage);
                    }
                    setLoading(false);
                });
        }
        catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    const handleReset = () => {
        // @ts-ignore
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailRef.current!.value)) setEmailInvalid(false);
        else {
            setEmailInvalid(true);
            return;
        }

        // @ts-ignore
        sendPasswordResetEmail(auth, emailRef.current!.value)
            .then(() => {
                // Password reset email sent!
                // ..
                setPasswordResetSent(true);
                setTimeout(()=>{
                    setPasswordResetSent(false);
                }, 4000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                switch (errorCode){
                    case "auth/wrong-password":
                        setErrorMessage(t("authentification:wrongPassword"));
                        break;
                    default:
                        setErrorMessage(errorMessage);
                }
            });
    }

    const handleGoogleCredentialResponse = (response : any) => {
        setId_token(response.credential)
    }

    useEffect(() => {
        if (id_token) {
            // Sign in with credential from the Google user.
            signInWithCredential(auth, GoogleAuthProvider.credential(id_token))
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [auth, id_token])


    useEffect(() => {
        // @ts-ignore
        const google = window.google;
        if(google){
            googleDraw("signin", handleGoogleCredentialResponse);
        }


    }, [googleScriptLoaded]);

    return (

        <>
            <div className={styles.main}>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <h1>{t("authentification:loginScreenTitle")}</h1>
                    {errorMessage ? <p>{errorMessage}</p> : null}
                    {emailInvalid ? <p>{t("authentification:emailInvalid")}</p> : null}
                    <label><FontAwesomeIcon icon={faAt}/><input ref={emailRef} type={"text"} placeholder={t("authentification:email")}/></label>
                    <label><FontAwesomeIcon icon={faKey}/><input type={"password"} placeholder={t("authentification:password")}/></label>
                    <a onClick={()=>handleReset()}>{passwordResetSent ? t("authentification:resetSent") : t("authentification:forgotpassword")}</a>
                    <button type={"submit"}>{loading ? <FontAwesomeIcon  icon={faSpinner} className={"fa-spin"}/> : <FontAwesomeIcon  icon={faRightToBracket}/>} {t("authentification:loginScreenTitle")}</button>
                </form>
                <p>{t("authentification:donthave")}<br/><a onClick={()=>handleSignUp()}><FontAwesomeIcon icon={faArrowRight}/> {t("authentification:signUp")}</a></p>
                <p>{t("authentification:orSignInWith")}</p>
                <div id={styles["g_id_onload"]}/>
                <div id={styles["buttonDiv"]}/>
            </div>
            <Script src="https://accounts.google.com/gsi/client" async defer onLoad={()=>setGoogleScriptLoaded(true)}></Script>

        </>

    )
}