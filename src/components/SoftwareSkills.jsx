import Section, { EmptyState } from './Section.jsx'
import AssetImage from './AssetImage.jsx'

export default function SoftwareSkills({ items = [], heading, ui }) {
  const groups = items.reduce((result, item) => {
    if (!result.has(item.category)) result.set(item.category, [])
    result.get(item.category).push(item)
    return result
  }, new Map())
  return (
    <Section id="software-skills" heading={heading}>
      {items.length ? <div className="software-groups">{[...groups].map(([category, software]) => (
        <div className="software-group" key={category}><h3 className="subsection-label">{category}</h3><div className="software-grid">{software.map((item) => (
          <div className="software-item" key={item.id}><AssetImage src={item.logo} alt={item.name} placeholder={ui.logoPlaceholder} placeholderLabel={`${item.name} — ${ui.logoMissing}`} className="software-logo" /><span>{item.name}</span></div>
        ))}</div></div>
      ))}</div> : <EmptyState text={ui.empty} />}
    </Section>
  )
}
