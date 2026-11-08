import { useEffect, useLayoutEffect, useState } from 'react'

export const THEME_KEY = 'ramzi-portfolio-theme'
export const validTheme = (value) => value === 'light' || value === 'dark' ? value : null

function storedTheme() {
  try { return validTheme(window.localStorage.getItem(THEME_KEY)) } catch { return null }
}

function systemLight() {
  try { return window.matchMedia('(prefers-color-scheme: light)').matches } catch { return false }
}

export default function useTheme() {
  const [preference, setPreference] = useState(storedTheme)
  const [lightSystem, setLightSystem] = useState(systemLight)
  const theme = preference || (lightSystem ? 'light' : 'dark')

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = theme === 'light' ? '#f6f7f1' : '#101312'
  }, [theme])

  useEffect(() => {
    let media
    const onSystemChange = (event) => setLightSystem(event.matches)
    try {
      media = window.matchMedia('(prefers-color-scheme: light)')
      media.addEventListener('change', onSystemChange)
    } catch { /* Tema manual tetap dapat digunakan tanpa matchMedia. */ }
    const onStorage = (event) => {
      if (event.key === THEME_KEY || event.key === null) setPreference(validTheme(event.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => {
      media?.removeEventListener?.('change', onSystemChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setPreference(next)
    try { window.localStorage.setItem(THEME_KEY, next) } catch { /* Pilihan tetap berlaku pada sesi ini. */ }
  }
  return { theme, toggleTheme }
}
