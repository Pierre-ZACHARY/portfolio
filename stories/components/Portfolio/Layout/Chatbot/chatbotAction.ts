import {AnyAction, Dispatch} from "redux";
import {select} from "../Header/HeaderSection/headerSectionReducer";
import {read, recv, send, typing, confirmSend} from "./chatbotReducer";

export enum ChatbotAction {
     Recv = "Recv",
     Send = "Send",
     Typing = "Typing",
     Read = "Read",
     Confirm = "Confirm"
}

const timeoutsIds: NodeJS.Timeout[] = [];

export const executeChatBotAction = (dispatch: Dispatch<AnyAction>, name: ChatbotAction, data: any = {}) => {
    switch (name){
        case ChatbotAction.Recv:
            dispatch(recv(data));
            dispatch(typing(false));
            for(let i = 0; i< timeoutsIds.length; i++){
                clearTimeout(timeoutsIds[i]);
            }
            break;
        case ChatbotAction.Send:
            dispatch(send(data));
            break;
        case ChatbotAction.Typing:
            dispatch(typing(true));
            for(let i = 0; i< timeoutsIds.length; i++){
                clearTimeout(timeoutsIds[i]);
            }
            timeoutsIds.push(setTimeout(()=>{
                dispatch(typing(false));
            }, 9000));
            break;
        case ChatbotAction.Read:
            dispatch(read());
            break;
        case ChatbotAction.Confirm:
            dispatch(confirmSend(data.index!));
            break;
    }
}