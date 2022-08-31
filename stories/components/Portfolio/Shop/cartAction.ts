import {AnyAction, Dispatch} from "redux";
import {Cart} from "@medusajs/medusa";
import {update} from "./cartReducer";

export enum CartAction {
    Update = "Update"
}

export const executeCartAction = (dispatch: Dispatch<AnyAction>, name: CartAction, new_cart: Omit<Cart, "refundable_amount" | "refunded_total">) => {
    switch (name){
        case CartAction.Update:
            dispatch(update(new_cart));
            break
    }
}