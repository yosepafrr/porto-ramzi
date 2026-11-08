import { useState } from 'react'
import Section, { EmptyState } from './Section.jsx'
import AssetImage from './AssetImage.jsx'
import Lightbox from './Lightbox.jsx'

export default function Gallery({ items = [], heading, ui }) {
  const [viewer, setViewer] = useState(null)
  const images = items.filter((item) => item.src)
  return (
    <Section id="gallery" heading={heading}>
      {images.length ? <div className="gallery-grid">{images.map((image, index) => (
        <figure key={image.id} className="gallery-item"><button type="button" className="media-button" aria-label={`${ui.viewImage}: ${image.alt || image.caption}`} onClick={() => setViewer(index)}><AssetImage {...image} placeholder={ui.imageMissing} /></button>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>
      ))}</div> : <EmptyState text={heading.emptyTitle} />}
      {viewer !== null && <Lightbox images={images} startIndex={viewer} onClose={() => setViewer(null)} ui={ui} />}
    </Section>
  )
}
