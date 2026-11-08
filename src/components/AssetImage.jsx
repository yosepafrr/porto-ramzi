import { useState } from 'react'

export default function AssetImage({ src, alt = '', placeholder, placeholderLabel, className = '', imageClassName = '' }) {
  const [failedSource, setFailedSource] = useState(null)
  const visible = Boolean(src) && src !== failedSource
  return (
    <div className={`asset-image ${className} ${visible ? '' : 'asset-placeholder'}`}>
      {visible ? (
        <img className={imageClassName} src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailedSource(src)} />
      ) : <span className="asset-fallback" role="img" aria-label={placeholderLabel || (alt ? `${alt} — ${placeholder}` : placeholder)}>{placeholder}</span>}
    </div>
  )
}
