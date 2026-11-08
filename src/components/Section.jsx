import Reveal from './Reveal.jsx'

export default function Section({ id, heading, children, className = '' }) {
  return (
    <section id={id} className={`portfolio-section ${className}`} aria-labelledby={`${id}-title`}>
      <Reveal className="site-container">
        <div className="section-heading">
          <p className="section-eyebrow"><span />{heading.eyebrow}</p>
          <h2 id={`${id}-title`}>{heading.title}</h2>
          {heading.description && <p className="section-description">{heading.description}</p>}
        </div>
        {children}
      </Reveal>
    </section>
  )
}

export function EmptyState({ text }) {
  return <div className="empty-state"><span className="empty-mark" aria-hidden="true" /><p>{text}</p></div>
}

