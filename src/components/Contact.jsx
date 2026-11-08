import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import Section from './Section.jsx'
import SocialLinks from './SocialLinks.jsx'

export default function Contact({ contact, heading, ui }) {
  return (
    <Section id="contact" heading={heading} className="contact-section">
      <div className="contact-layout">
        <div>{contact.email && <a className="button button-primary contact-cta" href={`mailto:${contact.email}`}>{ui.emailAction}<ArrowUpRight size={22} aria-hidden="true" /></a>}<SocialLinks contact={contact} /></div>
        <dl className="contact-details">
          {contact.email && <div><dt><Mail size={16} aria-hidden="true" />{ui.email}</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
          {contact.phone && <div><dt><Phone size={16} aria-hidden="true" />{ui.phone}</dt><dd><a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a></dd></div>}
          {contact.location && <div><dt><MapPin size={16} aria-hidden="true" />{ui.location}</dt><dd>{contact.location}</dd></div>}
        </dl>
      </div>
    </Section>
  )
}
