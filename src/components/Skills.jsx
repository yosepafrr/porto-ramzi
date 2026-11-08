import { Code2, Layers3, Palette, ScanSearch } from 'lucide-react'
import Section, { EmptyState } from './Section.jsx'

const categoryIcons = { Design: Palette, Multimedia: Layers3, Development: Code2, 'Problem Solving': ScanSearch }

export default function Skills({ hardSkills = [], coreSkills = [], heading, ui }) {
  return (
    <Section id="skills" heading={heading}>
      <h3 className="subsection-label">{ui.hardSkills}</h3>
      {hardSkills.length ? <div className="hard-skill-grid">{hardSkills.map((skill) => {
        const Icon = categoryIcons[skill.category] || Code2
        return <article key={skill.id} className="hard-skill-card"><Icon size={25} strokeWidth={1.4} aria-hidden="true" /><h4>{skill.name}</h4><span>{skill.category}</span></article>
      })}</div> : <EmptyState text={ui.empty} />}
      {!!coreSkills.length && <div className="core-skills"><h3 className="subsection-label">{ui.coreSkills}</h3><ul className="skill-chips">{coreSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>}
    </Section>
  )
}
