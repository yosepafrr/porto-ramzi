import { ArrowUpRight } from 'lucide-react'
import { socialLinks } from '../utils/content.js'

export default function SocialLinks({ contact }) {
  const links = socialLinks(contact)
  if (!links.length) return null
  return <div className="social-links">{links.map((link) => {
    return <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>
  })}</div>
}
