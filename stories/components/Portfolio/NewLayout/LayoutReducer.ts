import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface LayoutReducerState{
    initialLine: {x: number, width: number},
    animateLine: {x: number, width: number},
}

const initialState: LayoutReducerState = {
    initialLine: {x: 0, width: 0},
    animateLine: {x: 0, width: 0},
}

export const layoutSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        setAnimateLine: (state, action: PayloadAction<{x: number, width: number}>) => {
            state.initialLine = state.animateLine;
            state.animateLine = action.payload;
        }
    }
});

export const {setAnimateLine} = layoutSlice.actions;


export default layoutSlice.reducer;