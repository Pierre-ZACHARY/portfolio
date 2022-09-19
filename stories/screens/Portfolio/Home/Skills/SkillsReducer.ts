import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface SkillState{
    topLevelIndex: number | undefined,
    secondLevelIndex: number | undefined,
}


const initialState: SkillState ={
    topLevelIndex: undefined,
    secondLevelIndex: undefined,
}

export const skillSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        setTopLevelIndex: (state, action: PayloadAction<number | undefined>) => {
            state.topLevelIndex = action.payload;
            if(action.payload==undefined){
                state.secondLevelIndex = undefined;
            }
        },
        setSecondLevelIndex: (state, action: PayloadAction<number | undefined>) => {
            state.secondLevelIndex = action.payload;
        }

    }
})

export const {setTopLevelIndex, setSecondLevelIndex} = skillSlice.actions;


export default skillSlice.reducer;