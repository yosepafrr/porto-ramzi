import { Clock3, Lightbulb, MessageCircle, Palette, RefreshCw, ScanSearch, Users, Zap } from 'lucide-react'
import Section, { EmptyState } from './Section.jsx'

// Pemetaan terbatas menjaga bundle kecil; ikon baru ditambahkan secara eksplisit.
const icons = { Clock3, Lightbulb, MessageCircle, Palette, RefreshCw, ScanSearch, Users, Zap }

export default function PersonalSkills({ items = [], heading, ui }) {
  return (
    <Section id="personal-skills" heading={heading}>
      {items.length ? <div className="personal-skill-grid">{items.map((skill) => {
        const Icon = icons[skill.icon] || Lightbulb
        return <article key={skill.id} className="personal-skill-card"><Icon size={23} strokeWidth={1.4} aria-hidden="true" /><h3>{skill.name}</h3><p>{skill.description}</p></article>
      })}</div> : <EmptyState text={ui.empty} />}
    </Section>
  )
}
