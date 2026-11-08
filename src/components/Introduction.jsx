import { motion } from 'framer-motion'
import { ArrowUp, Code2, Gamepad2, Layers3 } from 'lucide-react'

const disciplineIcons = { code: Code2, gamepad: Gamepad2, layers: Layers3 }

// Kelanjutan komposisi hero, bukan section skills/CV Tahap 4.
export default function Introduction({ introduction, name }) {
  return (
    <section id="explore" className="introduction-section" aria-labelledby="introduction-title">
      <div className="site-container">
        <motion.div className="introduction-heading" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
          <div><p className="section-eyebrow"><span />{introduction.eyebrow}</p><h2 id="introduction-title">{introduction.title}<br /><span>{introduction.accent}</span></h2></div>
          <p className="introduction-description">{introduction.description}</p>
        </motion.div>
        <div className="discipline-list">{introduction.disciplines.map((discipline) => {
          const Icon = disciplineIcons[discipline.icon] || Code2
          return <div className="discipline-item" key={discipline.id}><span className="discipline-number">{discipline.number}</span><h3>{discipline.label}</h3><Icon size={26} strokeWidth={1.3} aria-hidden="true" /></div>
        })}</div>
        <div className="page-signoff"><p>© {new Date().getFullYear()} {name}<span>{introduction.closing}</span></p><a href="#home" aria-label={introduction.backToTopLabel}><ArrowUp size={18} aria-hidden="true" /></a></div>
      </div>
    </section>
  )
}
