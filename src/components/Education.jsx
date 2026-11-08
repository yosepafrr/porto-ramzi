import { GraduationCap } from 'lucide-react'
import Section, { EmptyState } from './Section.jsx'

export default function Education({ items = [], heading, ui }) {
  const ordered = [...items].sort((a, b) => (b.startYear || 0) - (a.startYear || 0))
  return (
    <Section id="education" heading={heading}>
      {ordered.length ? <div className="education-grid">{ordered.map((item) => (
        <article className="education-card" key={item.id}>
          <div className="card-topline"><GraduationCap size={23} strokeWidth={1.4} aria-hidden="true" /><span>{item.period}</span></div>
          <h3>{item.institution}</h3>
          <p className="education-major">{[item.degree, item.major].filter(Boolean).join(' · ')}</p>
          {item.gpa && <p className="gpa-pill">{ui.gpa} <strong>{item.gpa}</strong></p>}
          {!!item.competencies?.length && <div className="education-competencies"><h4>{ui.competencies}</h4><ul>{item.competencies.map((competency) => <li key={competency}>{competency}</li>)}</ul></div>}
        </article>
      ))}</div> : <EmptyState text={ui.empty} />}
    </Section>
  )
}
