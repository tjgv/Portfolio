import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import './SiteMainNav.css'

export const SITE_RESUME_PDF_PATH = '/resume/TJ-Gomez-Vidal-Resume.pdf'
export const SITE_LINKEDIN_URL =
  'https://www.linkedin.com/in/trent-gomez-vidal/?skipRedirect=true'

export type SiteMainNavActive = 'work' | 'about' | 'prompts'

type SiteMainNavProps = {
  /** Visual theme — light for homepage/about, dark for case studies */
  theme?: 'light' | 'dark'
  active?: SiteMainNavActive
  /** Include the A.I. Prompts item (Prompts page) */
  showPrompts?: boolean
  /** Desktop: collapse inline links into the hamburger (case-study scroll). */
  condensed?: boolean
  className?: string
  'aria-label'?: string
}

function NavExternalArrow({ theme }: { theme: 'light' | 'dark' }) {
  const prefix = theme === 'light' ? 'home-v2-nav-arrow' : 'np1c-nav__arrow'
  const icon = theme === 'light' ? 'home-v2-nav-arrow__icon' : 'np1c-nav__arrow-icon'
  return (
    <span className={prefix} aria-hidden="true">
      <ArrowUpRight className={`${icon} ${icon}--primary`} size={13} strokeWidth={2.25} />
      <ArrowUpRight className={`${icon} ${icon}--secondary`} size={13} strokeWidth={2.25} />
    </span>
  )
}

/**
 * Site main nav — inline links on desktop, hamburger drawer on mobile.
 */
export default function SiteMainNav({
  theme = 'light',
  active = 'work',
  showPrompts = false,
  condensed = false,
  className = '',
  'aria-label': ariaLabel = 'Main',
}: SiteMainNavProps) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLElement>(null)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])
  const toggleVisible = isMobile || condensed

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const root = rootRef.current
      if (!root) return
      if (e.target instanceof Node && !root.contains(e.target)) close()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
    }
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!condensed) setOpen(false)
  }, [condensed])

  const itemClass =
    theme === 'light' ? 'home-v2-nav-item' : 'np1c-nav__link'
  const externalClass =
    theme === 'light'
      ? 'home-v2-nav-item home-v2-nav-item--external'
      : 'np1c-nav__link np1c-nav__link--external'
  const dividerClass =
    theme === 'light' ? 'home-v2-nav-divider' : 'np1c-nav__divider'
  const activeClass =
    theme === 'light' ? ' home-v2-nav-item--active' : ' np1c-nav__link--active'

  return (
    <nav
      ref={rootRef}
      className={`site-main-nav site-main-nav--${theme}${open ? ' site-main-nav--open' : ''}${
        condensed ? ' site-main-nav--condensed' : ''
      }${theme === 'light' ? ' home-v2-nav' : ' np1c-nav__links-wrap'} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className="site-main-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-hidden={!toggleVisible}
        tabIndex={toggleVisible ? 0 : -1}
        onClick={toggle}
      >
        {open ? <X size={22} strokeWidth={2.25} aria-hidden /> : <Menu size={22} strokeWidth={2.25} aria-hidden />}
      </button>

      {open ? (
        <button
          type="button"
          className="site-main-nav__backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={close}
        />
      ) : null}

      <div
        id={panelId}
        className={`site-main-nav__panel${theme === 'light' ? '' : ' np1c-nav__links'}`}
      >
        {active === 'work' ? (
          theme === 'light' ? (
            <button type="button" className={`${itemClass}${activeClass}`} onClick={close}>
              Work
            </button>
          ) : (
            <Link to="/" className={`${itemClass}${activeClass}`} onClick={close}>
              Work
            </Link>
          )
        ) : (
          <Link to="/" className={itemClass} onClick={close}>
            Work
          </Link>
        )}

        {showPrompts ? (
          active === 'prompts' ? (
            <span className={`${itemClass}${activeClass}`}>A.I Prompts</span>
          ) : (
            <Link to="/prompts" className={itemClass} onClick={close}>
              A.I Prompts
            </Link>
          )
        ) : null}

        {active === 'about' ? (
          theme === 'light' ? (
            <span className={`${itemClass}${activeClass}`}>About</span>
          ) : (
            <Link to="/contact" className={`${itemClass}${activeClass}`} onClick={close}>
              About
            </Link>
          )
        ) : (
          <Link to="/contact" className={itemClass} onClick={close}>
            About
          </Link>
        )}

        <span className={dividerClass} aria-hidden="true" />

        <a
          href={SITE_RESUME_PDF_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className={externalClass}
          onClick={close}
        >
          Resume
          <NavExternalArrow theme={theme} />
        </a>
        <a
          href={SITE_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={externalClass}
          onClick={close}
        >
          LinkedIn
          <NavExternalArrow theme={theme} />
        </a>
      </div>
    </nav>
  )
}
