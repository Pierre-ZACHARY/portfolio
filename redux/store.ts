import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "../stories/components/ReduxExample/Counter/counterReducer";


export default configureStore({
    reducer: {counter: counterReducer},
})