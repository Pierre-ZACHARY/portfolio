

export const user_currency = "eur";

export const format_price = (amount: number): string => {
    const length = amount.toString().length;
    const units = amount.toString().substring(0, length-2);
    const pennies = amount.toString().substring(length-2, length);
    let res = ""
    if(parseInt(units)!=0){
        res+=units;
        if(parseInt(pennies)!=0){
            res+=",";
        }
    }
    else{
        res+="0,"
    }
    if(parseInt(pennies)!=0){
        res+=pennies;
    }
    return res
}




export const format_amount = (amount: number[]): {original: string, current: string } => {
    const current = Math.min(...amount)
    const original = Math.max(...amount)
    return {original: format_price(original), current: format_price(current)};
}

interface FormattedPrice{
    min: string | undefined,
    max: string | undefined,
    original: string | undefined,
    current: string | undefined,
}

export const format_price_range = (amount: number[][]): FormattedPrice => {
    // amount is a list of all orginal price / current price ( list of list ) ( not sorted )
    let price_min: number[] | undefined = undefined;
    let price_max: number[] | undefined = undefined;
    amount.forEach((price) => {
        const current = Math.min(...price)
        const original = Math.max(...price)
        if(!price_min || current<Math.min(...price_min)) price_min = price;
        if(!price_max || original>Math.max(...price_max)) price_max = price;
    })
    if(amount.length == 1) return {...format_amount(price_min!), min: undefined, max: undefined};
    else return {min: format_price(Math.min(...price_min!)), max:format_price(Math.max(...price_max!)), original: undefined, current: undefined};
}

