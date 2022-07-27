import styles from "./chatbot.module.css"
import {motion} from "framer-motion"
import {FormEvent, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../../redux/hooks";
import {ChatbotAction, executeChatBotAction} from "./chatbotAction";
import {Author, ChatbotState, Message} from "./chatbotReducer";
import {MessageComponent} from "./Message/messageComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faPaperPlane, faXmark} from "@fortawesome/free-solid-svg-icons";
import {Dotline} from "./Dotline/dotline";
import {useTranslation} from "react-i18next";


const size = [100, 60];
const badge = [30, 20];
const offset = [7, 3];
const badge_expanded = [90, 50];
const query = "(max-width: 768px)";


const ws = new WebSocket("wss://portfolio-chatbot-discordpy.herokuapp.com/CHANNEL_ID")

const bot: Author = {name: "Bot", avatar_url: "https://images.emojiterra.com/google/android-11/512px/1f916.png"};

export const Chatbot = ({args}: any) => {

    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [state, setState] = useState({
        isopen: false,
        preview_key: "",
        welcome_msg: false,
        user_name: "",
        whatsyourname: false,
        canAskForInfo: false,
        inputValue: "",
        isSmall : window.matchMedia(query).matches,
        didMount: false,
        padding: "5%",
    });


    const open = (e: any) => {
        executeChatBotAction(dispatch, ChatbotAction.Read);
        if(!state.isopen){
            setState({...state,
                isopen: true,
                padding: "0%"})
        }
    }

    const close = (e: any)=>{
        executeChatBotAction(dispatch, ChatbotAction.Read);
        setState({...state,
            isopen: false,
            padding: "5%"})
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        const input = e.target.children[0];
        const content = input.value;

        input.value = "";
        if(content.split(" ").join("") != ""){
            console.log("submit...");
            console.log(state);
            if(state.whatsyourname){
                ws.send(JSON.stringify({"set_name": content}));
                executeChatBotAction(dispatch, ChatbotAction.Send, {content: content});
                executeChatBotAction(dispatch, ChatbotAction.Typing);
                setTimeout(()=>{
                    executeChatBotAction(dispatch, ChatbotAction.Recv, {
                        type: "MESSAGE",
                        content: t("chatbot:thanks")+", "+content,
                        attachments: [],
                        author: bot});
                    if(state.isopen){
                        executeChatBotAction(dispatch, ChatbotAction.Read);
                    }
                    setState({...state, canAskForInfo: true, whatsyourname: false, inputValue: content});
                }, 1000);
            }
            else{
                ws.send(JSON.stringify({"content": content}));
                executeChatBotAction(dispatch, ChatbotAction.Send, {content: content});
            }
        }
    }

    ws.onmessage = (e) => {

        const data = JSON.parse(e.data);
        if(data.type === "MESSAGE"){
            executeChatBotAction(dispatch, ChatbotAction.Read);
            executeChatBotAction(dispatch, ChatbotAction.Recv, data);
            if(state.isopen){
                executeChatBotAction(dispatch, ChatbotAction.Read);
            }
            else{
                setState({...state, preview_key: data.content.split(" ").join("")})
            }
        }
        else{
            executeChatBotAction(dispatch, ChatbotAction.Typing);
        }

    }

    const redux_state: ChatbotState = useAppSelector(state => state.chatbot);

    useEffect(()=>{
        const messageView = document.getElementById("messageView");
        messageView!.scrollTop = messageView!.scrollHeight;
        if(!state.didMount){
            window.matchMedia(query).addEventListener('change', e => setState({...state, isSmall: e.matches}));
            setState({...state, didMount: true});
        }

        if(!state.welcome_msg && redux_state.msgList.length == 1 && redux_state.msgList[0].fromUser){
            setState({...state, welcome_msg: true});
            executeChatBotAction(dispatch, ChatbotAction.Typing);

            setTimeout(()=>{
                executeChatBotAction(dispatch, ChatbotAction.Recv, {
                    type: "MESSAGE",
                    content: t("chatbot:welcome"),
                    attachments: [],
                    author: bot});
                if(state.isopen){
                    executeChatBotAction(dispatch, ChatbotAction.Read);
                }
                if(state.user_name==""){
                    executeChatBotAction(dispatch, ChatbotAction.Typing);
                    setTimeout(()=>{
                        executeChatBotAction(dispatch, ChatbotAction.Recv, {
                            type: "MESSAGE",
                            content: t("chatbot:whatsyourname"),
                            attachments: [],
                            author: bot});
                        console.log("set whatsyourname to true");
                        setState({...state, whatsyourname: true});
                        if(state.isopen){
                            executeChatBotAction(dispatch, ChatbotAction.Read);
                        }
                    }, 2000);
                }
                else{
                    setState({...state, canAskForInfo: true});
                }
            }, 300);
        }

        if(state.canAskForInfo){
            setState({...state, canAskForInfo: false});
            executeChatBotAction(dispatch, ChatbotAction.Typing);
            setTimeout(()=>{
                executeChatBotAction(dispatch, ChatbotAction.Recv, {
                    type: "MESSAGE",
                    content: t("chatbot:giveyourinfo"),
                    attachments: [],
                    author: bot});
                if(state.isopen){
                    executeChatBotAction(dispatch, ChatbotAction.Read);
                }
            }, 4000);
        }
    }, [state, redux_state.msgList, dispatch, t]);

    const onBlurNameInput = (e: any) => {
        if(e.target.value && e.target.value != ""){
            ws.send(JSON.stringify({"set_name": e.target.value}));
            setState({...state, user_name: e.target.value});
        }
    }




    const show_preview = redux_state.msgList.length && !redux_state.msgList[redux_state.msgList.length-1].read;


    const mediaquery = state.isSmall ? 1 : 0;
    const badge_offset = state.isopen ? offset[mediaquery]+"px" : "-"+offset[mediaquery]+"px";
    const widget_size = state.isopen ? "100%" : size[mediaquery]+"px";
    const padding = state.isopen ? "0" : "5%";

    return (
        <>
            <motion.div initial={{
                bottom: "5%",
                right: "5%"
            }}
                        animate={{
                width: widget_size,
                height: widget_size,
                bottom: state.padding ,
                right: state.padding}}
                        className={[styles.container, state.isopen ? styles.containeropen : null].join(" ")}
                        onClick={(e)=>open(e)}>
                <div className={styles.closedContent}>
                    <div className={styles.absoluteContainer}>
                        <FontAwesomeIcon icon={faComment} className={styles.commentSvg}/>
                        <Dotline typing={redux_state.distantTyping}/>
                    </div>
                </div>
                <div className={styles.openContent}>
                    <div style={{width: "100%", marginBottom: "auto"}}>
                        <input className={styles.nameInput}
                               type="text"
                               placeholder="Your name here"
                               value={state.inputValue}
                               onChange={(e)=>{setState({...state, inputValue: e.target.value})}}
                               onBlur={(e)=>onBlurNameInput(e)}/>
                    </div>
                    <div className={styles.messageView} id="messageView">
                        {redux_state.msgList.map( (msg: Message, key: number) => (
                            <MessageComponent content={msg.content} fromUser={msg.fromUser} author_name={msg.author.name} author_avatar_url={msg.author.avatar_url} key={key} />
                            ))}
                        <div className={[styles.messageViewTypingContainer, redux_state.distantTyping ? styles.isTyping : null].join(" ")}>
                            <Dotline typing={redux_state.distantTyping}/>
                            <p style={{margin: "40px 0 0 0"}}></p>
                            {/* Don't know why but putting height on the div hide it when messageView overflow, but margin on relative <p> never hide */}
                        </div>
                    </div>
                    <form onSubmit={(e)=>handleSubmit(e)} className={styles.chatform} action="#">
                        <input type="text" name="form-content" className={styles.textinput}/>
                        <button type="submit"  className={styles.submitbutton}><FontAwesomeIcon icon={faPaperPlane} className={styles.submitbuttonSVG} /></button>
                    </form>
                </div>

                <motion.div
                    animate={{
                        top: badge_offset,
                        right: badge_offset,
                        width: state.isopen ? 30 : show_preview ? badge_expanded[mediaquery]+"px" : badge[mediaquery],
                        height: state.isopen ? 30 : badge[mediaquery],
                }}
                    className={[show_preview ? styles.containerBadgeHasMessage : null, styles.containerbadge].join(" ")}
                    onClick={(e)=>close(e)}
                    >
                    {show_preview ?
                        <motion.div
                                    key={state.preview_key} // Pour forcer React à recréer la div à chaque message ...
                                    initial={{x: badge_expanded[mediaquery]}}
                                    animate={{x: "-100%"}}
                                    transition={{
                                        repeat: Infinity,
                                        duration: Math.ceil(redux_state.msgList[redux_state.msgList.length-1].content.length*0.3),
                                        ease: "linear"}}
                                    className={styles.scrollingTextContainer}>
                            <p className={styles.badgeTextPreview}>{redux_state.msgList[redux_state.msgList.length - 1].content}</p>
                        </motion.div> : null}
                    <FontAwesomeIcon icon={faXmark} className={styles.closeMenu}/>
                </motion.div>
            </motion.div>
        </>
    )
}