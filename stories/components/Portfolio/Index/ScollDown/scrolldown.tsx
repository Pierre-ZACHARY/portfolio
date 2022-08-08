import styles from "./scrolldown.module.scss"

export const Scrolldown = ({...args}) => {
    return (
        <>
            <div className={styles.scroll__down}>
                      <span className={styles.scroll__mouse}>
                        <span className={styles.scroll__wheel}></span>
                      </span>
            </div>
        </>
    )
}