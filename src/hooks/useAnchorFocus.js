import { useEffect } from 'react'

// Pertahankan hash/native smooth scrolling, sambil memindahkan fokus ke
// tujuan navigasi agar pengguna keyboard tidak tertinggal di menu yang ditutup.
export default function useAnchorFocus() {
  useEffect(() => {
    const focusTarget = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest?.('a[href^="#"]')
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const hash = link.getAttribute('href')
      if (hash.length < 2) return
      let id
      try { id = decodeURIComponent(hash.slice(1)) } catch { return }
      const target = document.getElementById(id)
      if (!target) return
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
    document.addEventListener('click', focusTarget)
    return () => document.removeEventListener('click', focusTarget)
  }, [])
}
