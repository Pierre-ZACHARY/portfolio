import {AnyAction, Dispatch} from "redux";
import {select} from "./headerSectionReducer";

export enum headerSectionAction {
    Select = "Select",
}

export const executeHeaderSectionAction = (dispatch: Dispatch<AnyAction>, name: headerSectionAction, index: number) => {
    switch (name){
        case headerSectionAction.Select:
            dispatch(select(index));
            break;
    }
}