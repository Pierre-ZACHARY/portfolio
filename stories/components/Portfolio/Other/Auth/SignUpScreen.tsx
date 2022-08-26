import styles from "./LoginScreen.module.sass"
import {useTranslation} from "next-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faAt, faCheckDouble, faKey, faRightToBracket, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {motion} from "framer-motion";
import {useRouter} from "next/router";
import {FormEvent, useEffect, useState} from "react";
import {createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithCredential} from "@firebase/auth";
import Script from "next/script";
import {googleDraw} from "./LoginScreen";



export const SignUpScreen = ({onLogin = undefined} : {onLogin: Function |undefined}) => {

    const {t} = useTranslation();
    const router = useRouter()
    const auth = getAuth();

    const [id_token, setId_token] = useState(null)
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
    const [passwordDoesntMatch, setPasswordDoesntMatch] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const handleSignUp = () => {
        if(onLogin) onLogin()
        else router.push("/login")
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try{
            // @ts-ignore
            const email: string = e.target![0]!.value;
            // @ts-ignore
            const pass1: string = e.target![1]!.value;
            // @ts-ignore
            const pass2: string = e.target![2]!.value;
            if(pass1 !== pass2) setPasswordDoesntMatch(true);
            else setPasswordDoesntMatch(false);
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) setEmailInvalid(false);
            else setEmailInvalid(true);
            if(pass1 === pass2 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){

                const auth = getAuth();
                createUserWithEmailAndPassword(auth, email, pass1)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;
                        setLoading(false);
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        switch(errorCode){
                            case "auth/email-already-in-use":
                                setErrorMessage(t("authentification:emailAlreadyInUse"));
                                break;
                            case "auth/weak-password":
                                setErrorMessage(t("authentification:passwordTooWeak"));
                                break;
                            default:
                                setErrorMessage(errorMessage);
                        }
                        setLoading(false);
                    });
            }
            else{
                setLoading(false);
            }
        }
        catch (e){
            console.log(e);
            setLoading(false);
        }
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
            googleDraw("signup", handleGoogleCredentialResponse);
        }


    }, [googleScriptLoaded]);

    return (

        <>
            <div className={styles.main}>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <h1>{t("authentification:signUp")}</h1>
                    {errorMessage ? <p>{errorMessage}</p> : null}
                    {emailInvalid ? <p>{t("authentification:emailInvalid")}</p> : null}
                    <label><FontAwesomeIcon icon={faAt}/><input type={"text"} placeholder={t("authentification:email")}/></label>
                    <label><FontAwesomeIcon icon={faKey}/><input type={"password"} placeholder={t("authentification:password")}/></label>
                    {passwordDoesntMatch ? <p>{t("authentification:doesntMatch")}</p> : null}
                    <label><FontAwesomeIcon icon={faCheckDouble}/><input type={"password"} placeholder={t("authentification:confirm")}/></label>
                    <button type={"submit"}>{loading ? <FontAwesomeIcon  icon={faSpinner} className={"fa-spin"}/> : <FontAwesomeIcon icon={faRightToBracket}/> } {t("authentification:signUp")}</button>
                </form>
                <p>{t("authentification:alreadyhave")}<br/><a onClick={()=>handleSignUp()}><FontAwesomeIcon icon={faArrowRight}/> {t("authentification:loginScreenTitle")}</a></p>
                <p>Or, sign up with :</p>
                <div id={styles["g_id_onload"]}/>
                <div id={styles["buttonDiv"]}/>
            </div>
            <Script src="https://accounts.google.com/gsi/client" async defer onLoad={()=>setGoogleScriptLoaded(true)}></Script>
        </>

    )
}