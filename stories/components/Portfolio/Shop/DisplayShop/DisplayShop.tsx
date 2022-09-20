import styles from "./DisplayShop.module.sass"
import {ShopCard} from "../Shop Card/ShopCard";
import {Search} from "../Search/Search";

export const DisplayShop = () => {
    return (
        <>
            <div className={styles.main}>
                <Search/>
            </div>
        </>
    )
}