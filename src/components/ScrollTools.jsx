import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollTools({ label }) {
  const [scroll, setScroll] = useState({ visible: false, progress: 0 })
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const remaining = document.documentElement.scrollHeight - window.innerHeight
      setScroll({ visible: window.scrollY > 500, progress: remaining > 0 ? Math.min(1, Math.max(0, window.scrollY / remaining)) : 0 })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return <a href="#home" className={`floating-top ${scroll.visible ? 'is-visible' : ''}`} aria-label={label}
    aria-hidden={!scroll.visible} tabIndex={scroll.visible ? 0 : -1}
    style={{ '--scroll-progress': `${scroll.progress * 360}deg` }}><ArrowUp size={18} aria-hidden="true" /></a>
}
