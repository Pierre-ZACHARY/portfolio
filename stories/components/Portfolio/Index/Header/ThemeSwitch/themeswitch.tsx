import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import styles from "./themeswitch.module.css"

export const ThemeSwitch = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <select value={theme} onChange={e => setTheme(e.target.value)} className={styles.select}>
            <option value="system" > 💻 System</option>
            <option value="dark" > 🌙 Dark</option>
            <option value="light" > ☀️ Light</option>
            <option value="oled" > ⬛ OLED️</option>
        </select>
    )
}

export default ThemeSwitch