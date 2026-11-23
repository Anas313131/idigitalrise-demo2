import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Home from './Home'
import { About, Contact } from './Pages'
import PrivacyPolicy from './PrivacyPolicy'
import { ProjectContact, ProjectButton } from './components/ProjectContact'
import { email, services, website } from './content'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function Wordmark() {
  return <span className="header-wordmark">iDigital<span className="brand-accent">Rise</span><span className="brand-dot">.</span></span>
}

function Header({ path }: { path: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      toggle.current?.focus()
    }
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', closeOutside)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', closeOutside)
    }
  }, [menuOpen])

  return (
    <header ref={header} className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="/" aria-label="iDigitalRise home"><Wordmark /></a>
      <nav id="main-navigation" className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        {links.map(({ label, href }) => <a key={href} href={href} aria-current={path === href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <ProjectButton className="header-cta" beforeOpen={() => setMenuOpen(false)} />
      <button ref={toggle} id="navigation-toggle" type="button" className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer section-dark">
      <div className="footer-directory">
        <div><a className="brand" href="/" aria-label="iDigitalRise home"><Wordmark /></a><p>A digital studio focused on building impactful digital experiences and helping businesses grow online.</p></div>
        <nav aria-label="Quick links"><h2>Quick Links</h2><a href="/">Home</a><a href="/about">About Us</a><a href="/contact">Contact Us</a><a href="/privacy-policy">Privacy Policy</a></nav>
        <nav aria-label="Services"><h2>Services</h2>{services.map(service => <a key={service.id} href={`/#${service.id}`}>{service.title}</a>)}</nav>
        <div className="footer-contact"><h2>Contact</h2><a href={`mailto:${email}`}>{email}</a><h2>Website</h2><a href={website}>{website}</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 iDigitalRise. All rights reserved.</span></div>
    </footer>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/'
  const Page = path === '/about' ? About : path === '/contact' ? Contact : path === '/privacy-policy' ? PrivacyPolicy : Home

  useEffect(() => {
    const fragment = window.location.hash.slice(1)
    if (!fragment) return
    const frame = requestAnimationFrame(() => document.getElementById(fragment)?.scrollIntoView({ behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="site-shell">
      <ProjectContact>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header path={path} />
        <main id="main-content" tabIndex={-1}><Page /></main>
        <Footer />
      </ProjectContact>
    </div>
  )
}
