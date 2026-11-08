import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useMotionPreference from '../hooks/useMotionPreference.js'
import { easeOut } from '../utils/motion.js'

// Garis pembuka dekoratif. Tidak mengunci scroll/fokus atau menunda konten.
export default function PageIntro() {
  const reduced = useMotionPreference()
  const [finished, setFinished] = useState(false)
  useEffect(() => {
    if (reduced) { setFinished(true); return }
    if (finished) return
    const timeout = setTimeout(() => setFinished(true), 900)
    return () => clearTimeout(timeout)
  }, [reduced, finished])

  if (reduced || finished) return null
  return <motion.div className="page-intro" aria-hidden="true" initial={{ opacity: 1 }} animate={{ opacity: 0 }}
    transition={{ duration: 0.2, delay: 0.5 }} onAnimationComplete={() => setFinished(true)}>
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: easeOut }} />
  </motion.div>
}
