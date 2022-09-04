import styles from "./PayByCardButton.module.scss"

export const PayByCardButton = ({onClick}: {onClick: Function}) => {

    return (
        <div className={styles.root}>
            <div className={styles.container} onClick={()=>onClick()}>
                <div className={styles.leftSide}>
                    <div className={styles.card}>
                        <div className={styles.cardLine}></div>
                        <div className={styles.buttons}></div>
                    </div>
                    <div className={styles.post}>
                        <div className={styles.postLine}></div>
                        <div className={styles.screen}>
                            <div className={styles.dollar}>$</div>
                        </div>
                        <div className={styles.numbers}></div>
                        <div className={styles.numbersLine2}></div>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.new}>Payer</div>

                    <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="512" height="512"
                         viewBox="0 0 451.846 451.847">
                        <path
                            d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"
                            data-original="#000000" className="active-path" data-old_color="#000000" fill="#cfcfcf"/>
                    </svg>

                </div>
            </div>
        </div>
    )
}