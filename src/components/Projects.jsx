import { useState } from 'react'
import { ArrowUpRight, Code2 } from 'lucide-react'
import Section, { EmptyState } from './Section.jsx'
import AssetImage from './AssetImage.jsx'
import Modal from './Modal.jsx'
import { webUrl } from '../utils/content.js'

export default function Projects({ items = [], heading, ui }) {
  const [selected, setSelected] = useState(null)
  return (
    <Section id="projects" heading={heading}>
      {items.length ? <div className="project-grid">{items.map((project) => (
        <article className="project-card" key={project.id}>
          <button type="button" className="project-open" aria-label={`${ui.projectDetails}: ${project.title}`} onClick={() => setSelected(project)}>
            <AssetImage src={project.image} alt={project.title} placeholder={ui.imageMissing} className="project-thumbnail" />
            <div className="project-heading"><h3>{project.title}</h3><ArrowUpRight size={21} aria-hidden="true" /></div>
          </button>
          <div className="project-summary">{project.year && <span className="project-year">{project.year}</span>}<p>{project.description}</p><ul className="skill-chips">{(project.technologies || []).map((tech) => <li key={tech}>{tech}</li>)}</ul></div>
        </article>
      ))}</div> : <EmptyState text={heading.emptyTitle} />}
      {selected && <Modal title={selected.title} onClose={() => setSelected(null)} closeLabel={ui.close}>
        <AssetImage src={selected.image} alt={selected.title} placeholder={ui.imageMissing} className="project-modal-image" />
        {selected.year && <p className="project-year">{selected.year}</p>}<p className="body-copy">{selected.description}</p>
        <ul className="skill-chips">{(selected.technologies || []).map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <div className="project-links">{webUrl(selected.github) && <a className="button button-secondary" href={webUrl(selected.github)} target="_blank" rel="noopener noreferrer"><Code2 size={17} aria-hidden="true" />{ui.github}</a>}{webUrl(selected.demo) && <a className="button button-primary" href={webUrl(selected.demo)} target="_blank" rel="noopener noreferrer">{ui.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>}</div>
      </Modal>}
    </Section>
  )
}
