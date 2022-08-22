import {faClose, faCross, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useState } from "react";
import styles from "./AuthWidget.module.sass"
import {useRouter} from "next/router";
import {LoginScreen} from "./LoginScreen";
import {SignUpScreen} from "./SignUpScreen";
import {getAuth, onAuthStateChanged} from "@firebase/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {useEffectOnce} from "../../../../../lib/utils";
import {ProfilScreen} from "./ProfilScreen";

export const AuthWidget = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | any | undefined>(undefined);
    const [contentState, setContentState] = useState("login");

    const auth = getAuth();

    useEffectOnce(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setContentState("loggedIn");
                setUser(user);
            } else {
                // User is signed out
                // ...
                setContentState("login");
                setUser(undefined);
            }
        });
    });



    const router = useRouter()

    const handleClick = () => {
        console.log("click")
        if(window.innerWidth<960) router.push("/login")
        else setIsOpen(!isOpen)
    }
    console.log(contentState)
    return (
        <>
            <div tabIndex={1}
                 style={{position: "relative"}}
                 // onBlur={()=>setIsOpen(false)}
                 className={[styles.parentButton, isOpen ? styles.menuOpen : null].join(" ")}
                        >
                {isOpen ?
                    <div  className={styles.menuContent}>
                        { contentState === "login" ? <LoginScreen onSignUp={()=>setContentState("signup")}/> : null}
                        { contentState === "signup" ? <SignUpScreen onLogin={()=>setContentState("login")}/> : null}
                        { contentState === "loggedIn" ? <ProfilScreen/> : null}
                    </div> :
                    <div className={styles.menuContent} ></div>
                }
                <div className={styles.svgContainer} onClick={()=>handleClick()} style={{position: "relative"}}>
                    { user !== undefined && !isOpen ? <img src={user.photoUrl ?? "https://cdn-icons-png.flaticon.com/512/147/147144.png"} alt={""}/> : null }
                    { user === undefined && !isOpen ? <FontAwesomeIcon icon={faRightToBracket}/> : null }
                    { isOpen ? <FontAwesomeIcon icon={faClose}/> : null }
                </div>

            </div>

        </>
    )
    
}