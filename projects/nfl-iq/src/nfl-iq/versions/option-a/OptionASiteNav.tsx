import { useCallback, useRef, useState } from 'react'
import {
  DESKTOP_PROMO_LINKS,
  MOBILE_QUICK_LINKS,
  NAV_ITEMS,
  UTILITY_LINKS,
} from '../../nav/nav-data'
import { ArrowUpright, ChevronDown } from '../../nav/NavIcons'
import { NavDropdownPanel } from '../../nav/NavDropdownPanel'
import { MobileNav } from '../../nav/MobileNav'
import { NFL_LOGO } from '../../constants'
import { appRoute } from '../../lib/app-paths'
import '../../nav/site-nav.css'
import './option-a-site-nav.css'

type OptionASiteNavProps = {
  onAskIq?: () => void
}

export function OptionASiteNav({ onAskIq }: OptionASiteNavProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpenId(null), 120)
  }, [clearCloseTimer])

  const openMenu = useCallback(
    (id: string) => {
      clearCloseTimer()
      setOpenId(id)
    },
    [clearCloseTimer],
  )

  return (
    <nav aria-label="Site" className="site-nav">
      <div className="site-nav__container">
        <div className="site-nav__left">
          <a className="site-nav__logo-link" href={appRoute('/')} aria-label="NFL Homepage">
            <img className="site-nav__logo" src={NFL_LOGO} alt="" aria-hidden width={36} height={36} />
          </a>

          <ul className="site-nav__primary">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.id}
                className="site-nav__primary-item"
                onMouseEnter={() => openMenu(item.id)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={`site-nav__trigger${openId === item.id ? ' site-nav__trigger--open' : ''}`}
                  aria-expanded={openId === item.id}
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                >
                  <span className="site-nav__trigger-label">
                    {item.label}
                    <span className="site-nav__trigger-underline" />
                  </span>
                  <ChevronDown className="site-nav__trigger-chevron" />
                </button>
                <div
                  className="site-nav__dropdown-wrap"
                  onMouseEnter={clearCloseTimer}
                  onMouseLeave={scheduleClose}
                >
                  <NavDropdownPanel item={item} open={openId === item.id} />
                </div>
              </li>
            ))}
          </ul>

          <ul className="site-nav__mobile-quick">
            {MOBILE_QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  className="site-nav__promo-link"
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  <span>
                    {link.label}
                    <span className="site-nav__trigger-underline" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <span className="site-nav__divider site-nav__divider--desktop" />

          <ul className="site-nav__desktop-promo">
            {DESKTOP_PROMO_LINKS.map((link) => (
              <li key={link.label}>
                <a className="site-nav__promo-link" href={link.href}>
                  <span>
                    {link.label}
                    <span className="site-nav__trigger-underline" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-nav__right site-nav__right--desktop">
          <ul className="site-nav__utilities">
            {UTILITY_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  className="site-nav__utility-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{link.label}</span>
                  <ArrowUpright size={12} />
                </a>
              </li>
            ))}
          </ul>
          <span className="site-nav__divider" />
          <button type="button" className="site-nav__sign-in">
            Sign In
          </button>
        </div>

        <div className="site-nav__right site-nav__right--mobile">
          {onAskIq ? (
            <button type="button" className="site-nav__ask-iq" onClick={onAskIq}>
              Ask NFL IQ
            </button>
          ) : null}
          <MobileNav />
        </div>
      </div>
    </nav>
  )
}
