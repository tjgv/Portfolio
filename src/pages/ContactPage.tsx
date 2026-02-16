import { Link } from 'react-router-dom'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <div className="app contact-page">
      <nav className="navbar-glass" aria-label="Main navigation">
        <div className="navbar-content">
          <Link to="/" className="nav-brand">TJ Gomez-Vidal</Link>
          <div className="nav-links">
            <a href="https://www.linkedin.com/in/trent-gomez-vidal/" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-link">Resume</a>
            <Link to="/contact" className="nav-link nav-link-active">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="contact-main">
        <h1 className="contact-title">Get in touch</h1>
        <p className="contact-intro">Reach out for collaboration, opportunities, or just to say hello.</p>
        <div className="contact-links">
          <a href="mailto:tjgomezvidal@gmail.com" className="contact-link">tjgomezvidal@gmail.com</a>
          <a href="tel:+15593600445" className="contact-link">(559) 360-0445</a>
          <a href="https://www.linkedin.com/in/trent-gomez-vidal/" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
        </div>
        <p className="contact-quote">"Great design is invisible—it anticipates needs before users articulate them."</p>
      </main>
    </div>
  )
}
