import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Author{
    name: string,
    avatar_url: string
}

export interface Message{
    content: string,
    attachments: Array<string>,
    author: Author,
    fromUser: boolean,
    read: boolean
}

export interface ChatbotState {
    msgList: Array<Message>
    distantTyping: boolean
}

const initialState: ChatbotState = {
    msgList: [],
    distantTyping: false
}

export const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        recv: (state, action: PayloadAction<any>) => {
            state.msgList.push({...action.payload, fromUser: false, read: false})
        },
        send: (state, action: PayloadAction<any>) => {
            state.msgList.push({...action.payload, fromUser: true, author: {name: "", avatar_url: ""}, attachments: [], read: true})
        },
        typing: (state, action: PayloadAction<boolean>) => {
            state.distantTyping = action.payload;
        },
        read: (state) => {
            if(state.msgList.length){
                state.msgList[state.msgList.length-1].read = true;
            }
        }
    }
})

export const {recv, send, typing, read} = chatbotSlice.actions;


export default chatbotSlice.reducer;

