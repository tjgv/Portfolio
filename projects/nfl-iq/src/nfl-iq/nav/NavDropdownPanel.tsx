import type { NavColumn, NavItem } from './nav-data'
import { ArrowUpright, NflPlusIcon, PlayIcon } from './NavIcons'
import { TeamsMegaMenu } from './TeamsMegaMenu'

function ColumnIcon({ icon }: { icon?: NavColumn['headingIcon'] }) {
  if (icon === 'nfl-plus') return <NflPlusIcon className="site-nav__col-icon site-nav__col-icon--plus" />
  if (icon === 'play') return <PlayIcon className="site-nav__col-icon" />
  return null
}

function NavColumnBlock({ column }: { column: NavColumn }) {
  const isPlus = column.variant === 'nfl-plus'

  return (
    <div className="site-nav__column">
      <span className="site-nav__column-heading" role="heading" aria-level={3}>
        <ColumnIcon icon={column.headingIcon} />
        {column.heading}
      </span>
      <ul className="site-nav__column-links">
        {column.links.map((link) => (
          <li key={link.label}>
            <a
              className={`site-nav__dropdown-link${isPlus ? ' site-nav__dropdown-link--plus' : ''}`}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              <span>{link.label}</span>
              {link.external ? <ArrowUpright size={16} className="site-nav__external-icon" /> : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

type NavDropdownPanelProps = {
  item: NavItem
  open: boolean
}

export function NavDropdownPanel({ item, open }: NavDropdownPanelProps) {
  if (item.layout === 'teams') {
    return (
      <div className={`site-nav__panel site-nav__panel--teams${open ? ' site-nav__panel--open' : ''}`}>
        <TeamsMegaMenu />
      </div>
    )
  }

  return (
    <div className={`site-nav__panel${open ? ' site-nav__panel--open' : ''}`}>
      <ul className="site-nav__panel-grid">
        {item.columns.map((col) => (
          <li key={col.heading}>
            <NavColumnBlock column={col} />
          </li>
        ))}
      </ul>
    </div>
  )
}
