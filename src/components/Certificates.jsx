import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Section, { EmptyState } from './Section.jsx'
import AssetImage from './AssetImage.jsx'
import Lightbox from './Lightbox.jsx'
import { newestFirst } from '../utils/content.js'

export default function Certificates({ items = [], heading, ui }) {
  const [viewer, setViewer] = useState(null)
  const images = newestFirst(items, 'date').filter((item) => item.image).map((item) => ({ src: item.image, alt: item.name, caption: [item.name, item.dateLabel].filter(Boolean).join(' · ') }))
  return (
    <Section id="certificates" heading={heading}>
      {items.length ? <div className="certificate-grid">{newestFirst(items, 'date').map((certificate) => {
        const thumbnail = <AssetImage src={certificate.image} alt={certificate.name} placeholder={ui.certificateMissing} className="certificate-thumbnail" />
        return <article className="certificate-card" key={certificate.id}>
          {certificate.image ? <button type="button" className="media-button" aria-label={`${ui.viewImage}: ${certificate.name}`} onClick={() => setViewer(images.findIndex((image) => image.src === certificate.image))}>{thumbnail}<span className="media-open-indicator"><ArrowUpRight size={18} aria-hidden="true" /></span></button> : thumbnail}
          <div className="certificate-info"><p>{certificate.dateLabel}</p><h3>{certificate.name}</h3>{certificate.issuer && <span>{certificate.issuer}</span>}</div>
        </article>
      })}</div> : <EmptyState text={heading.emptyTitle} />}
      {viewer !== null && <Lightbox images={images} startIndex={viewer} onClose={() => setViewer(null)} ui={ui} />}
    </Section>
  )
}
