import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "../stories/components/ReduxExample/Counter/counterReducer";
import headerSectionReducer from "../stories/components/Portfolio/Layout/Header/HeaderSection/headerSectionReducer";
import chatbotReducer from "../stories/components/Portfolio/Layout/Chatbot/chatbotReducer";


export const store =  configureStore({
    reducer: {
        counter: counterReducer,
        headerSection: headerSectionReducer,
        chatbot: chatbotReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch