import { useEffect, useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'

export default function ProfileVisual({ hero, location }) {
  const [imageFailed, setImageFailed] = useState(false)
  useEffect(() => setImageFailed(false), [hero.image])
  const initials = hero.name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('')
  const hasImage = Boolean(hero.image) && !imageFailed

  return (
    <div className={`profile-visual ${hasImage ? 'has-photo' : ''}`}>
      <div className="profile-topline"><span>{hero.profileLabel}</span><span>01 / {initials}</span></div>
      {hasImage ? <img className="profile-photo" src={hero.image} alt={hero.imageAlt || hero.name} fetchPriority="high" onError={() => setImageFailed(true)} /> : (
        <div className="profile-art" role="img" aria-label={`${initials} — ${hero.photoPlaceholder}`}>
          <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
          <div className="art-cross cross-one" aria-hidden="true" /><div className="art-cross cross-two" aria-hidden="true" />
          <span className="portrait-monogram" aria-hidden="true">{initials}<span>✳</span></span>
          <span className="portrait-caption">{hero.photoPlaceholder}</span>
        </div>
      )}
      <div className="profile-bottomline"><span><MapPin size={13} aria-hidden="true" />{location}</span><ArrowUpRight size={19} aria-hidden="true" /></div>
      <span className="profile-edge-label" aria-hidden="true">{hero.name} — PORTFOLIO</span>
    </div>
  )
}
