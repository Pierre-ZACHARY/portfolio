import React from "react";
import {executeAction, CounterAction} from "./counterAction";
import {useAppDispatch} from "../../../../redux/hooks";
import styles from "./ReduxCounter.module.css";

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
                className={styles.counterButton}
                style={{ backgroundColor }}
                onClick={() => executeAction(dispatch, CounterAction, amount)}
                {...props}>
            {label}
        </button>
    );
};