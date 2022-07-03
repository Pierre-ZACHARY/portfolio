// Define a type for the slice state
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HeaderSection} from "./headerSection";


interface HeaderSectionState {
    selected: number
}

// Define the initial state using that type
const initialState: HeaderSectionState = {
    selected: 0
}

export const headerSectionSlice = createSlice({
    name: 'headerSection',
    initialState,
    reducers: {
        select: (state, action: PayloadAction<number>) => {
            state.selected = action.payload;
        }
    }
})

export const {select} = headerSectionSlice.actions;

export default headerSectionSlice.reducer;

