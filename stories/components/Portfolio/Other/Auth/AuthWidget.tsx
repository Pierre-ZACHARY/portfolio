import {faClose, faCross, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import styles from "./AuthWidget.module.sass"
import {useRouter} from "next/router";
import {LoginScreen} from "./LoginScreen";
import {SignUpScreen} from "./SignUpScreen";
import {getAuth, onAuthStateChanged} from "@firebase/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import {useEffectOnce} from "../../../../../lib/utils";
import {ProfilScreen} from "./ProfilScreen";
import Image from "next/image";
import UserInfo from "../../../../../lib/UserInfo";
import {doc, onSnapshot, setDoc} from "@firebase/firestore";
import {db} from "../../../../../pages/_app";

export const AuthWidget = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [contentState, setContentState] = useState("login");
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);

    const auth = getAuth();

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setContentState("loggedIn");
                const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot)=>{
                    if(snapshot.data()){
                        // UserInfo exist
                        setUserInfo(new UserInfo(snapshot));
                    }
                    else{
                        // No UserInfo Yet
                        console.log("no userinfo yet");
                        setDoc(doc(db, "users", user.uid), {
                            username: user.displayName ?? "User",
                            avatarUrl: user.photoURL,
                        }).then((ref) =>{
                            console.log(ref);
                        }).catch( (error)=>{
                            console.log(error);
                        });
                    }
                });
                return () => {
                    unsub();
                }
            } else {
                // User is signed out
                // ...
                setContentState("login");
                setUserInfo(undefined);
            }

        });
        return ()=>{
            unsub();
        }
    }, [auth]);



    const router = useRouter()

    const handleClick = () => {
        if(window.innerWidth<960){
            switch(contentState){
                case "loggedIn": {
                    router.push("/profile");
                    break;
                }
                default: {
                    router.push("/login");
                    break;
                }
            }
        }

        else setIsOpen(!isOpen)
    }
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
                    { userInfo !== undefined && !isOpen ?
                        <div style={{position: "relative", width: "24px", height: "24px", borderRadius: "50%", overflow: "hidden"}}>
                            <Image src={userInfo?.avatarUrl ?? "https://firebasestorage.googleapis.com/v0/b/portfolio-3303d.appspot.com/o/2289_SkVNQSBGQU1PIDEwMjgtMTIx.jpg?alt=media&token=21e67942-e97d-4356-95f5-fdc562e51e40"} alt={""} layout={"fill"} objectFit={"contain"}/>
                        </div> : null }
                    { userInfo === undefined && !isOpen ? <FontAwesomeIcon icon={faRightToBracket}/> : null }
                    { isOpen ? <FontAwesomeIcon icon={faClose}/> : null }
                </div>

            </div>

        </>
    )
    
}