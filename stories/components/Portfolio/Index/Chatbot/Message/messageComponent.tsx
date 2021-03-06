import styles from "./message.module.css"
import Image from "next/image"

export const MessageComponent = ({content, fromUser, author_name = "", author_avatar_url = ""}: any) =>{
    return (
        <>
            <div className={[fromUser ? styles.messageContainerFromUser : null, styles.messageContainer].join(" ")}>
                <div className={[author_name!="" ? styles.asInfo : null, styles.authorInfo].join(" ")}>
                    {author_avatar_url != "" ? <Image src={author_avatar_url} alt="avatar_url" width="20" height="20"/> : null}
                    {author_name != "" ? <p>{author_name}</p> : null}
                </div>
                <p className={styles.messageContent}>{content}</p>
            </div>
        </>
    )
}