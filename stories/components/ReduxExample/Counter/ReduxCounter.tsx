import React from "react";
import {useDispatch} from "react-redux";
import {incrementByAmount} from "./counterReducer";
import {switchCase} from "@babel/types";

interface ReduxCounterProps {
    backgroundColor?: string;
    action: ReduxAction;
    label: string;
}

enum ReduxAction {
    Increment= "Increment",
    Decrement = "Decrement",
    incrementByAmount = "IncrementByAmount",
}

export const ReduxCounter = ({
                           backgroundColor,
                           label,
                                 action: ReduxAction,
                           ...props
                       }: ReduxCounterProps) => {
    const dispatch = useDispatch()
    // TODO VOIR COMMENT ON PASSE UNE ACTION EN ARGUMENT

    return (

        <button
            type="button"
            style={{ backgroundColor }}
            onClick={() => dispatch(incrementByAmount(3))}

            {...props}
        >
            {label}
        </button>
    );
};