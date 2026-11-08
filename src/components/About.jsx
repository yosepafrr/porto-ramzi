import { MapPin } from 'lucide-react'
import Section from './Section.jsx'
import AssetImage from './AssetImage.jsx'

export default function About({ about, hero, contact, education = [], heading, ui }) {
  const university = education.find((item) => item.gpa)
  return (
    <Section id="explore" heading={{ ...heading, title: about.title || heading.title }} className="about-section">
      <div className="about-layout">
        <div className="about-photo-panel">
          <AssetImage src={about.image} alt={about.imageAlt || hero.name} placeholder={hero.photoPlaceholder} className="about-photo" />
          <div className="about-photo-caption"><span>{hero.name}</span>{contact.location && <span><MapPin size={13} aria-hidden="true" />{contact.location}</span>}</div>
        </div>
        <div className="about-content">
          <p className="about-role">{hero.role}</p>
          <p className="about-description">{about.description}</p>
          {university && <div className="education-highlight"><div><strong>{university.gpa}</strong><span>{ui.gpa}</span></div><p>{university.institution}<span>{[university.degree, university.major].filter(Boolean).join(' · ')}</span></p></div>}
        </div>
      </div>
    </Section>
  )
}
