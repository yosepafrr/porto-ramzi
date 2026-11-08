import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { motion, useAnimationControls } from 'framer-motion'
import useMotionPreference from '../hooks/useMotionPreference.js'
import { dialogCloseDuration, dialogOpenDuration, easeOut } from '../utils/motion.js'

export default function Modal({ title, onClose, closeLabel, onKeyDown, children, className = '' }) {
  const ref = useRef(null)
  const titleId = useId()
  const controls = useAnimationControls()
  const reduced = useMotionPreference()
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const mounted = useRef(false)
  const closingRef = useRef(false)
  const finished = useRef(false)
  const introduced = useRef(false)
  const timeout = useRef(null)
  const [closing, setClosing] = useState(false)

  const finishClose = () => {
    if (!mounted.current || finished.current) return
    finished.current = true
    clearTimeout(timeout.current)
    closeRef.current()
  }
  const requestClose = () => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    if (reduced) { finishClose(); return }
    // Batas waktu menjamin dialog tetap tertutup bila animasi terinterupsi.
    timeout.current = setTimeout(finishClose, dialogCloseDuration * 1000 + 100)
    controls.start({ opacity: 0, y: 10, scale: 0.985 }, { duration: dialogCloseDuration, ease: easeOut }).then(finishClose)
  }

  useEffect(() => {
    const dialog = ref.current
    mounted.current = true
    const trigger = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      mounted.current = false
      clearTimeout(timeout.current)
      controls.stop()
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (trigger?.isConnected) trigger.focus()
    }
  }, [])

  useEffect(() => {
    if (reduced || introduced.current) {
      controls.stop()
      controls.set({ opacity: 1, y: 0, scale: 1 })
      if (reduced && closingRef.current) finishClose()
    } else {
      controls.set({ opacity: 0, y: 14, scale: 0.985 })
      controls.start({ opacity: 1, y: 0, scale: 1 }, { duration: dialogOpenDuration, ease: easeOut })
    }
    introduced.current = true
  }, [reduced, controls])

  return createPortal(
    <dialog ref={ref} className={`portfolio-dialog ${className}`} aria-labelledby={titleId} data-closing={closing}
      onCancel={(event) => { event.preventDefault(); requestClose() }} onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === event.currentTarget) requestClose() }}>
      <motion.div className="dialog-surface" initial={false} animate={controls} inert={closing}>
        <div className="dialog-heading"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label={closeLabel} disabled={closing} onClick={requestClose}><X size={21} aria-hidden="true" /></button></div>
        {children}
      </motion.div>
    </dialog>, document.body,
  )
}
