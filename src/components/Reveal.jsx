import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import useMotionPreference from '../hooks/useMotionPreference.js'
import { easeOut, revealDuration } from '../utils/motion.js'

const visible = { opacity: 1, y: 0 }

export default function Reveal({ children, className = '', immediate = false, delay = 0 }) {
  const ref = useRef(null)
  const seen = useRef(false)
  const controls = useAnimationControls()
  const reduced = useMotionPreference()
  const [state, setState] = useState('visible')

  useEffect(() => {
    const element = ref.current
    let observer
    let disposed = false
    const show = (animate = true) => {
      if (disposed) return
      seen.current = true
      observer?.disconnect()
      setState('visible')
      if (animate && !reduced) controls.start(visible, { duration: revealDuration, delay, ease: easeOut })
      else { controls.stop(); controls.set(visible) }
    }

    // SSR dan browser tanpa observer selalu menampilkan isi. Hanya elemen
    // di bawah viewport yang disiapkan tersembunyi setelah mount.
    if (reduced || seen.current) show(false)
    else if (immediate) {
      controls.set({ opacity: 0, y: 16 })
      show()
    } else if (typeof IntersectionObserver !== 'undefined' && element.getBoundingClientRect().top > window.innerHeight - 48) {
      try {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) show()
        }, { rootMargin: '0px 0px -48px 0px', threshold: 0.06 })
        observer.observe(element)
        controls.set({ opacity: 0, y: 18 })
        setState('pending')
      } catch { show(false) }
    } else show(false)

    const revealFocus = () => show(false)
    const focusArea = element.closest('section') || element
    focusArea.addEventListener('focusin', revealFocus)
    return () => {
      disposed = true
      observer?.disconnect()
      focusArea.removeEventListener('focusin', revealFocus)
      controls.stop()
    }
  }, [controls, reduced, immediate, delay])

  return <motion.div ref={ref} className={className} initial={false} animate={controls} data-reveal-state={state}>{children}</motion.div>
}
