import { useMemo } from 'react'
import { ngsTeamLogoUrl } from '../../../constants'
import type { RecentSigning, SigningType } from '../data/recent-signings.mock'
import { useOptionATableSort } from '../hooks/useOptionATableSort'
import {
  compareAlpha,
  compareNumeric,
  parseAavMillions,
} from '../utils/option-a-sort-utils'
import { OptionASortableTh } from './OptionASortableTh'
import './option-a-sortable-table.css'
import './option-a-recent-signings.css'

type SigningSortKey = 'date' | 'player' | 'team' | 'type' | 'price'

function sortSignings(
  rows: RecentSigning[],
  key: SigningSortKey,
  direction: 'asc' | 'desc',
): RecentSigning[] {
  return [...rows].sort((a, b) => {
    switch (key) {
      case 'date':
        return compareAlpha(a.date, b.date, direction)
      case 'player':
        return compareAlpha(a.player, b.player, direction)
      case 'team':
        return compareAlpha(a.teamId, b.teamId, direction)
      case 'type':
        return compareAlpha(a.type, b.type, direction)
      case 'price':
        return compareNumeric(
          parseAavMillions(a.price),
          parseAavMillions(b.price),
          direction,
        )
      default:
        return 0
    }
  })
}

function PlayerPortrait({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <span className="fa-signings__portrait" aria-hidden>
      <span className="fa-signings__portrait-initials">{initials}</span>
    </span>
  )
}

function SigningTypeIcon({ type }: { type: SigningType }) {
  if (type === 'Sold') {
    return (
      <svg
        className="fa-signings__type-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg
      className="fa-signings__type-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5 0 1.06-.33 2.04-.89 2.85l1.46 1.46A6.96 6.96 0 0 0 19 13c0-3.87-3.13-7-7-7Zm-5 5c0-1.06.33-2.04.89-2.85L6.43 6.69A6.96 6.96 0 0 0 5 13c0 3.87 3.13 7 7 7v3l4-4-4-4v3c-2.76 0-5-2.24-5-5Z"
        fill="currentColor"
      />
    </svg>
  )
}

type OptionARecentSigningsTableProps = {
  signings: RecentSigning[]
}

export function OptionARecentSigningsTable({
  signings,
}: OptionARecentSigningsTableProps) {
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<SigningSortKey>('date', 'desc')

  const rows = useMemo(
    () => sortSignings(signings, sortKey, sortDirection),
    [signings, sortKey, sortDirection],
  )

  const th = (
    label: string,
    key: SigningSortKey,
    options?: { alpha?: boolean; align?: 'left' | 'center' },
  ) => (
    <OptionASortableTh
      key={key}
      label={label}
      sortKey={key}
      sortVariant={options?.alpha === false ? 'numeric' : 'alpha'}
      activeKey={sortKey}
      direction={sortDirection}
      onSort={handleSort}
      align={options?.align}
      groupCenter={options?.align === 'center'}
      className={`fa-signings__th fa-signings__th--${key}`}
    />
  )

  return (
    <div className="fa-signings__scroll">
      <table className="fa-signings__table">
        <thead>
          <tr>
            {th('Player', 'player')}
            {th('Team', 'team', { align: 'center' })}
            {th('Type', 'type')}
            {th('Deal', 'price', { alpha: false })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="fa-signings__td fa-signings__td--player">
                <div className="fa-signings__player">
                  <PlayerPortrait name={row.player} />
                  <span className="fa-signings__player-text">
                    <span className="fa-signings__player-name">{row.player}</span>
                    <span className="fa-signings__player-pos">{row.position}</span>
                  </span>
                </div>
              </td>
              <td className="fa-signings__td fa-signings__td--team">
                <img
                  className="fa-signings__team-logo"
                  src={ngsTeamLogoUrl(row.teamId)}
                  alt=""
                  width={28}
                  height={28}
                />
              </td>
              <td className="fa-signings__td fa-signings__td--type">
                <span
                  className={`fa-signings__type fa-signings__type--${row.type.toLowerCase()}`}
                  title={row.type}
                >
                  <SigningTypeIcon type={row.type} />
                  <span className="fa-signings__type-label">{row.type}</span>
                </span>
              </td>
              <td className="fa-signings__td fa-signings__td--deal">
                <div className="fa-signings__deal">
                  <span className="fa-signings__deal-value">{row.price}</span>
                  <span className="fa-signings__deal-years">
                    {row.years} yr{row.years === 1 ? '' : 's'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
