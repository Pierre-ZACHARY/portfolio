import styles from "./LoginScreen.module.sass"
import {useTranslation} from "next-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faAt, faKey, faRightToBracket, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {motion} from "framer-motion";
import {useRouter} from "next/router";
import {FormEvent, useRef, useState} from "react";
import {getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from "@firebase/auth";



export const LoginScreen = ({onSignUp = undefined} : {onSignUp: Function |undefined}) => {

    const {t} = useTranslation();
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [passwordResetSent, setPasswordResetSent] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const emailRef = useRef();
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

    return (

        <>
            <div className={styles.main}>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <h1>{t("authentification:loginScreenTitle")}</h1>
                    {errorMessage ? <p>{errorMessage}</p> : null}
                    {emailInvalid ? <p>{t("authentification:emailInvalid")}</p> : null}
                    <label><FontAwesomeIcon icon={faAt}/><input ref={emailRef.current} type={"text"} placeholder={t("authentification:email")}/></label>
                    <label><FontAwesomeIcon icon={faKey}/><input type={"password"} placeholder={t("authentification:password")}/></label>
                    <a onClick={()=>handleReset()}>{passwordResetSent ? t("authentification:resetSent") : t("authentification:forgotpassword")}</a>
                    <button type={"submit"}>{loading ? <FontAwesomeIcon  icon={faSpinner} className={"fa-spin"}/> : <FontAwesomeIcon  icon={faRightToBracket}/>} {t("authentification:loginScreenTitle")}</button>
                </form>
                <p>{t("authentification:donthave")}<br/><a onClick={()=>handleSignUp()}><FontAwesomeIcon icon={faArrowRight}/> {t("authentification:signUp")}</a></p>
            </div>
        </>

    )
}