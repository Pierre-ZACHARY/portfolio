import React from "react";
import {action, CounterAction} from "./counterAction";
import {useAppDispatch} from "../../../../redux/hooks";

interface ReduxCounterProps {
    backgroundColor?: string;
    CounterAction: CounterAction;
    label: string;
    amount?: number
}

export const ReduxCounter = ({
                                 backgroundColor,
                                 label,
                                 CounterAction,
                                 amount,
                                 ...props
}: ReduxCounterProps) => {
    const dispatch = useAppDispatch()

    return (
        <button type="button"
                style={{ backgroundColor }}
                onClick={() => action(dispatch, CounterAction, amount)}
                {...props}>
            {label}
        </button>
    );
};