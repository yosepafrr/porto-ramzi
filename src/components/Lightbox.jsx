import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import Modal from './Modal.jsx'
import AssetImage from './AssetImage.jsx'
import Reveal from './Reveal.jsx'

export default function Lightbox({ images, startIndex = 0, onClose, ui }) {
  const [view, setView] = useState({ index: startIndex, zoom: false })
  const viewportRef = useRef(null)
  const image = images[view.index] || images[0]
  if (!image) return null
  const resetScroll = () => {
    if (viewportRef.current) { viewportRef.current.scrollLeft = 0; viewportRef.current.scrollTop = 0 }
  }
  const move = (step) => {
    resetScroll()
    setView((current) => ({ index: (current.index + step + images.length) % images.length, zoom: false }))
  }
  const zoom = (value) => {
    resetScroll()
    setView((current) => ({ ...current, zoom: value }))
  }

  return (
    <Modal title={image.caption || image.alt || ui.viewImage} onClose={onClose} closeLabel={ui.close} className="lightbox-dialog"
      onKeyDown={(event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return
        if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(true); return }
        if (event.key === '-' || event.key === '0') { event.preventDefault(); zoom(false); return }
        if (images.length < 2 || (view.zoom && event.target === viewportRef.current)) return
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
      }}>
      <div ref={viewportRef} className={`lightbox-viewport ${view.zoom ? 'is-zoomed' : ''}`} tabIndex={0} role="region" aria-label={ui.imageViewArea}>
        <Reveal key={image.src} immediate className="lightbox-image"><AssetImage src={image.src} alt={image.alt || image.caption} placeholder={ui.imageMissing} /></Reveal>
      </div>
      <div className="lightbox-controls">
        <div className="lightbox-navigation">
          {images.length > 1 && <><button className="icon-button" type="button" aria-label={ui.previous} onClick={() => move(-1)}><ChevronLeft size={20} aria-hidden="true" /></button><span aria-live="polite">{view.index + 1} / {images.length}</span><button className="icon-button" type="button" aria-label={ui.next} onClick={() => move(1)}><ChevronRight size={20} aria-hidden="true" /></button></>}
        </div>
        <button type="button" className="icon-button" aria-label={view.zoom ? ui.zoomOut : ui.zoomIn} aria-pressed={view.zoom} onClick={() => zoom(!view.zoom)}>{view.zoom ? <ZoomOut size={20} aria-hidden="true" /> : <ZoomIn size={20} aria-hidden="true" />}</button>
      </div>
      <p className="lightbox-hint">{ui.imageKeyboardHint}</p>
    </Modal>
  )
}
