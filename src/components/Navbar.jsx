import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar({ name, navigation, email }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(navigation.links[0]?.id)
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const toggleRef = useRef(null)
  const initials = name.split(' ').filter(Boolean).map((word) => word[0]).slice(0, 2).join('')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setActive(navigation.links.reduce((last, link) => {
        const section = document.getElementById(link.id)
        return section && section.getBoundingClientRect().top <= window.innerHeight * 0.45 ? link.id : last
      }, navigation.links[0]?.id))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [navigation.links])

  useEffect(() => {
    if (!open) return
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false)
    }
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = (event) => { if (event.matches) setOpen(false) }
    menuRef.current?.querySelector('a')?.focus()
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeWithEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeWithEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  const navigate = (id) => { setActive(id); setOpen(false) }

  return (
    <header ref={headerRef} className="site-header" onBlur={(event) => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}>
      <div className="site-container header-inner">
        <a className="brand" href="#home" title={navigation.homeLabel} onClick={() => navigate('home')}>
          <span className="brand-monogram" aria-hidden="true">{initials}<span>.</span></span>
          <span className="brand-name">{name}<span>PERSONAL PORTFOLIO</span></span>
        </a>
        <nav className="desktop-nav" aria-label={navigation.ariaLabel}>
          {navigation.links.map((link) => <a key={link.id} className={`nav-link ${active === link.id ? 'is-active' : ''}`} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined} onClick={() => navigate(link.id)}>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          {email && <a className="header-contact" href={`mailto:${email}`}>{navigation.contactLabel}<ArrowUpRight size={16} aria-hidden="true" /></a>}
          <ThemeToggle labels={navigation.theme} />
          <button ref={toggleRef} type="button" className={`menu-toggle ${open ? 'is-open' : ''}`} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? navigation.closeLabel : navigation.openLabel} onClick={() => setOpen((value) => !value)}>{open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}</button>
        </div>
      </div>
      <div className={`mobile-menu-shell ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
        <div className="mobile-menu-clip">
          <nav id="mobile-navigation" ref={menuRef} className="mobile-nav site-container" aria-label={navigation.ariaLabel}>
        {navigation.links.map((link) => <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'location' : undefined} onClick={() => navigate(link.id)}><span className="nav-number">{link.number}</span>{link.label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
        {email && <a href={`mailto:${email}`} onClick={() => setOpen(false)}><span className="nav-number">↗</span>{navigation.contactLabel}<ArrowUpRight size={18} aria-hidden="true" /></a>}
          </nav>
        </div>
      </div>
    </header>
  )
}
