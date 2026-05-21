import { Calendar, Home, Menu, Newspaper, Trophy, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/free-agency', label: 'Calendar', icon: Calendar },
  { to: '/draft', label: 'Draft', icon: Trophy },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/coach', label: 'Menu', icon: Menu },
]

export function IqBottomNav() {
  return (
    <nav className="iq-bottom-nav" aria-label="Mobile navigation">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `iq-bottom-nav__link${isActive ? ' iq-bottom-nav__link--active' : ''}`
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
