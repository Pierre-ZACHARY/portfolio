import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Cart} from "@medusajs/medusa";
import {chatbotSlice} from "../Layout/Chatbot/chatbotReducer";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";


interface CartState{
    cart: Omit<Cart, "refundable_amount" | "refunded_total"> | undefined,
    temporaryQuantities: {variant_id: string, quantity: number}[]
}


const initialState: CartState = {
    cart: undefined,
    temporaryQuantities: []
}

export const cartSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<Omit<Cart, "refundable_amount" | "refunded_total">>) => {
            state.cart = action.payload
        },
        setTemporaryQuantity: (state, action: PayloadAction<{variant_id: string, quantity: number}>) => {
            const temp: {variant_id: string, quantity: number}[] = [action.payload]
            for(let i = 0; i<state.temporaryQuantities.length; i++){
                if(state.temporaryQuantities[i].variant_id != action.payload.variant_id){
                    temp.push(state.temporaryQuantities[i])
                }
            }
            state.temporaryQuantities = temp
        },
    }
})

export const {update, setTemporaryQuantity} = cartSlice.actions;

export default cartSlice.reducer;

export const useTemporaryQuantity = (variant_id: string): number | undefined => {

    const temporaryQuantities = useAppSelector(state=>state.cart.temporaryQuantities)
    for(let i = 0; i<temporaryQuantities.length; i++){
        if(temporaryQuantities[i].variant_id == variant_id){
            return temporaryQuantities[i].quantity
        }
    }
    return undefined;
}