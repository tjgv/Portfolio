import { useNavigate } from 'react-router-dom'
import { ALL_NFL_TEAMS, ngsTeamLogoUrl } from '../constants'
import { useIqTeam } from '../context/useIqTeam'
import {
  MOST_ATHLETIC_DRAFT_CLASSES,
  MOST_PRODUCTIVE_DRAFT_CLASSES,
  NGS_DRAFT_SCORE_RANKINGS,
  type TeamScoreRow,
} from '../data/draft-data'
import { appRoute } from '../lib/app-paths'

const WINNER_CARDS: {
  title: string
  rows: TeamScoreRow[]
}[] = [
  { title: 'Overall Best Drafts', rows: NGS_DRAFT_SCORE_RANKINGS },
  { title: 'Top Boosts in Athleticism', rows: MOST_ATHLETIC_DRAFT_CLASSES },
  { title: 'Top Boosts in Production', rows: MOST_PRODUCTIVE_DRAFT_CLASSES },
]

const ROW_LIMIT = 10

function WinnerRow({
  rank,
  row,
  highlight,
  onSelect,
}: {
  rank: number
  row: TeamScoreRow
  highlight: boolean
  onSelect: (teamId: string) => void
}) {
  const teamName =
    ALL_NFL_TEAMS.find((t) => t.id === row.teamId)?.name ?? row.teamName

  return (
    <button
      type="button"
      className="iq-home-winner-row"
      onClick={() => onSelect(row.teamId)}
      aria-label={`Open ${teamName} in Team Central`}
    >
      <span className="iq-home-winner-row__left">
        <span className="iq-home-winner-row__rank">{rank}</span>
        <img
          className="iq-home-winner-row__logo"
          src={ngsTeamLogoUrl(row.teamId)}
          alt=""
        />
        <span className="iq-home-winner-row__team">{teamName}</span>
      </span>
      <span
        className={
          highlight
            ? 'iq-home-winner-row__score iq-home-winner-row__score--filled'
            : 'iq-home-winner-row__score iq-home-winner-row__score--outline'
        }
      >
        {row.score.toFixed(1)}
      </span>
    </button>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      className="iq-home-winners__chevron"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IqHomeBiggestWinners() {
  const navigate = useNavigate()
  const { selectTeam, activateTeamCentral } = useIqTeam()

  const openTeamCentral = (teamId: string) => {
    selectTeam(teamId)
    activateTeamCentral()
    navigate('/teams')
  }

  return (
    <section className="iq-home-winners" aria-label="Biggest winners">
      <div className="iq-home-winners__head">
        <h2 className="iq-home-display iq-home-winners__title">BIGGEST WINNERS</h2>
        <a className="iq-home-winners__find-team" href={appRoute('/teams')}>
          Find Your team
          <ChevronRightIcon />
        </a>
      </div>
      <div className="iq-home-winners__grid">
        {WINNER_CARDS.map((card) => (
          <article key={card.title} className="iq-home-winner-card">
            <header className="iq-home-winner-card__head">
              <h3 className="iq-home-winner-card__name">{card.title}</h3>
            </header>
            <div className="iq-home-winner-card__rows">
              {card.rows.slice(0, ROW_LIMIT).map((row, index) => (
                <WinnerRow
                  key={`${card.title}-${row.teamId}`}
                  rank={index + 1}
                  row={row}
                  highlight={index === 0}
                  onSelect={openTeamCentral}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
