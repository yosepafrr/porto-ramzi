import { ArrowUp } from 'lucide-react'
import SocialLinks from './SocialLinks.jsx'

export default function Footer({ name, footer, contact, ui }) {
  return (
    <footer className="site-footer"><div className="site-container">
      <div className="footer-top"><div><a className="footer-name" href="#home">{name}<span>.</span></a><p>{footer.tagline}</p></div><nav aria-label={footer.navigationLabel}>{footer.links.map((link) => <a key={link.id} href={`#${link.id}`}>{link.label}</a>)}</nav></div>
      <SocialLinks contact={contact} />
      <div className="footer-bottom"><p>© {new Date().getFullYear()} {name}<span>{footer.note}</span></p><a className="icon-button" href="#home" aria-label={ui.backToTop}><ArrowUp size={18} aria-hidden="true" /></a></div>
    </div></footer>
  )
}
