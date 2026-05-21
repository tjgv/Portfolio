import { Calendar, Home, Newspaper, Trophy, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/teams', label: 'Team Central', icon: Users },
  { to: '/free-agency', label: 'Free Agency', icon: Calendar },
  { to: '/draft', label: 'Draft Central', icon: Trophy },
  { to: '/news', label: 'News', icon: Newspaper },
]

export function IqHubNav() {
  return (
    <nav className="iq-hub-nav" aria-label="NFL IQ sections">
      <div className="iq-hub-nav__inner">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `iq-hub-nav__link${isActive ? ' iq-hub-nav__link--active' : ''}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
