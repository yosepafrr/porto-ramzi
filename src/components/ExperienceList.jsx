import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Section, { EmptyState } from './Section.jsx'
import AssetImage from './AssetImage.jsx'
import Lightbox from './Lightbox.jsx'
import { newestFirst } from '../utils/content.js'

export default function ExperienceList({ id, items = [], heading, ui, showDocumentation = false }) {
  const [viewer, setViewer] = useState(null)
  return (
    <Section id={id} heading={heading} className="experience-section">
      {items.length ? <div className="experience-timeline">{newestFirst(items).map((item) => {
        const images = (item.images || []).filter((image) => image.src)
        return (
          <article className="experience-entry" key={item.id}>
            <div className="experience-meta"><span className="timeline-dot" />{item.period && <p>{item.period}</p>}{(item.location || item.village) && <span>{[item.village, item.location].filter(Boolean).join(', ')}</span>}</div>
            <div className="experience-content">
              <p className="experience-organization">{item.organization}</p><h3>{item.role}</h3>
              {item.description && <p className="body-copy">{item.description}</p>}
              {!!item.responsibilities?.length && <details className="responsibilities"><summary>{ui.responsibilities}<ChevronDown size={16} aria-hidden="true" /></summary><ul>{item.responsibilities.map((task) => <li key={task}>{task}</li>)}</ul></details>}
              {images.length ? <div className="experience-photos">{images.map((image, index) => <button key={image.src} className="media-button" type="button" aria-label={`${ui.viewImage}: ${image.alt || item.organization}`} onClick={() => setViewer({ images, index })}><AssetImage {...image} placeholder={ui.imageMissing} /></button>)}</div> : showDocumentation && <div className="documentation-placeholder">{ui.documentationMissing}</div>}
            </div>
          </article>
        )
      })}</div> : <EmptyState text={heading.emptyTitle || ui.empty} />}
      {viewer && <Lightbox images={viewer.images} startIndex={viewer.index} onClose={() => setViewer(null)} ui={ui} />}
    </Section>
  )
}
