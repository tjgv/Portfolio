import { Link } from 'react-router-dom'
import { MapPin, GraduationCap } from 'lucide-react'
import './HomePageV2.css'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <div className="home-v2 contact-page">
      <div className="home-v2-gradient" aria-hidden />
      <div className="home-v2-content-margin">
        <header className="home-v2-header contact-header">
          <Link to="/" className="home-v2-logo" aria-label="Home">
            <img src="/logo-personal.png" alt="" className="home-v2-logo-img" />
          </Link>
          <div className="home-v2-header-inner">
            <h1 className="home-v2-name"><span className="home-v2-name-initials">T.J.</span> Gomez-Vidal</h1>
            <div className="home-v2-header-bottom">
              <div className="home-v2-header-text">
                <p className="home-v2-tagline">
                  Product designer with a speciality in crafting simple workflows based on complex systems.
                </p>
              </div>
              <nav className="home-v2-nav" aria-label="Main">
                <Link to="/" className="home-v2-nav-item">Work</Link>
                <Link to="/ai" className="home-v2-nav-item">A.I Prompts</Link>
                <span className="home-v2-nav-item home-v2-nav-item--active">About</span>
              </nav>
            </div>
          </div>
        </header>

        <main className="home-v2-main contact-main">
          <div className="contact-about-grid">
            <div className="contact-about-image">
              <img
                src="/about-photo.png"
                alt="T.J. Gomez-Vidal"
                className="contact-about-photo"
              />
            </div>
            <div className="contact-about-content">
              <h2 className="contact-about-title">Hi, I&apos;m T.J.!</h2>
              <p className="contact-about-meta">
                <span className="contact-about-meta-item">
                  <MapPin size={16} aria-hidden />
                  LA / SF
                </span>
                <span className="contact-about-meta-item">
                  <GraduationCap size={16} aria-hidden />
                  Philosophy @ UCLA 2018
                </span>
              </p>
              <div className="contact-about-text">
                <p>
                  Besides design, I am super big into coffee, Philosophy, and all-things-nerd.
                </p>
                <p>
                  During college, after exchanging majors when meeting new people, I was frequently asked &quot;what are you going to do with that (a philosophy degree)?&quot;
                </p>
                <p>
                  My go-to response would be to crack a joke, &quot;Probably work at Starbucks.&quot; Little did I know, I actually would wind up working at Starbucks.
                </p>
                <p>
                  It wasn&apos;t until I began doing Product work when I came to realize that my degree in Philosophy had been training me to be a Product Designer all along.
                </p>
                <p>
                  Philosophy in the active tense, &quot;philosophizing 👉😎👉&quot; is all about dispelling ambiguity, getting specific, forming hypothesis and finding truth.
                </p>
                <p>
                  Not too long ago I was walking my dog on the UCLA campus when a group of students sparked small-talk. They asked &quot;Are you an alum?&quot; — &quot;Yes&quot; — &quot;What did you study?&quot; — &quot;Philosophy&quot; — &quot;Oh, what did you do with that?&quot; — <strong>I&apos;m a product designer</strong>
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="home-v2-footer">
          <div className="home-v2-footer-inner">
            <span className="home-v2-footer-name">T.J. Gomez-Vidal</span>
            <div className="home-v2-footer-links">
              <Link to="/" className="home-v2-footer-link">Work</Link>
              <Link to="/ai" className="home-v2-footer-link">A.I Prompts</Link>
              <span className="home-v2-footer-link home-v2-footer-link--active">About</span>
            </div>
            <div className="home-v2-footer-contact">
              <span>Let&apos;s work together!</span>
              <a href="mailto:tjgomezvidal@gmail.com">tjgomezvidal@gmail.com</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
