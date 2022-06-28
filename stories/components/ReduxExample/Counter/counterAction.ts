import {decrement, increment, incrementByAmount} from "./counterReducer";
import {AnyAction, Dispatch} from "redux";
export enum CounterAction {
    Increment = "Increment",
    Decrement = "Decrement",
    incrementByAmount = "incrementByAmount",
}


export const action = (dispatch: Dispatch<AnyAction>, name: CounterAction, amount: number = 0) => {
    switch (name){
        case CounterAction.Increment:
            dispatch(increment());
            break;
        case CounterAction.Decrement:
            dispatch(decrement());
            break;
        case CounterAction.incrementByAmount:
            dispatch(incrementByAmount(amount));
            break;
    }
}