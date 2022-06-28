import React from "react";
import {action, CounterAction} from "./counterAction";
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
                onClick={() => action(dispatch, CounterAction, amount)}
                {...props}>
            {label}
        </button>
    );
};