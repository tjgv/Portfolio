import { useState } from 'react'
import { NAV_ITEMS, UTILITY_LINKS } from './nav-data'
import { ArrowUpright, MenuIcon } from './NavIcons'
import { NavDropdownPanel } from './NavDropdownPanel'

export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState(NAV_ITEMS[0]?.id ?? 'watch')

  return (
    <>
      <button
        type="button"
        className="site-nav__menu-btn"
        aria-label="More menu choices"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <MenuIcon />
      </button>

      <div
        className={`site-nav__mobile-drawer${menuOpen ? ' site-nav__mobile-drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="site-nav__mobile-inner">
          <ul className="site-nav__mobile-tabs">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.id}
                className={`site-nav__mobile-tab${activeId === item.id ? ' site-nav__mobile-tab--active' : ''}`}
              >
                <button type="button" onClick={() => setActiveId(item.id)}>
                  {item.label}
                </button>
                {activeId === item.id ? (
                  <div className="site-nav__mobile-panel">
                    <NavDropdownPanel item={item} open />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="site-nav__mobile-utilities">
            <ul>
              {UTILITY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-nav__utility-link"
                  >
                    <span>{link.label}</span>
                    <ArrowUpright size={12} />
                  </a>
                </li>
              ))}
            </ul>
            <hr />
            <button type="button" className="site-nav__sign-in">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
