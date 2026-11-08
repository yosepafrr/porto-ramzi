import Reveal from './Reveal.jsx'
import { ArrowDown, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import ProfileVisual from './ProfileVisual.jsx'

export default function Hero({ hero, contact }) {
  const [firstName, ...lastName] = hero.name.split(' ')
  const disciplines = hero.role.split('|').map((role) => role.trim()).filter(Boolean)
  return (
    <section id="home" className="hero-section" aria-labelledby="hero-title">
      <div className="site-container">
        <div className="hero-grid">
          <Reveal className="hero-copy" immediate>
            <div className="hero-eyebrow"><span className="eyebrow-line" /><span>{hero.greeting}</span><ArrowDownRight size={17} aria-hidden="true" /></div>
            <h1 id="hero-title" className="hero-title">{firstName}<br /><span>{lastName.join(' ')}<span className="name-period">.</span></span></h1>
            <p className="hero-role">{hero.role}</p>
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#explore">{hero.exploreLabel}<ArrowUpRight size={19} aria-hidden="true" /></a>
              {contact.email && <a className="button button-secondary" href={`mailto:${contact.email}`}>{hero.contactLabel}<ArrowUpRight size={18} aria-hidden="true" /></a>}
            </div>
          </Reveal>
          <Reveal className="hero-profile" immediate delay={0.08}><ProfileVisual hero={hero} location={contact.location} /></Reveal>
        </div>
        <div className="hero-baseline">
          <a className="scroll-link" href="#explore"><span className="scroll-icon"><ArrowDown size={16} aria-hidden="true" /></span>{hero.scrollLabel}</a>
          <ul className="discipline-tags" aria-label={hero.role}>{disciplines.map((discipline) => <li key={discipline}>{discipline}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
