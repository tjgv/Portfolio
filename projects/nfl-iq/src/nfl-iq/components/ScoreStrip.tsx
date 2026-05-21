import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { SCORE_STRIP_GAMES, teamLogoUrl } from '../constants'

export function ScoreStrip() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <div className="iq-score-strip">
      <button type="button" className="iq-score-strip__btn" aria-label="Previous games" onClick={() => scroll(-1)}>
        <ChevronLeft size={16} />
      </button>
      <div className="iq-score-strip__track" ref={trackRef}>
        {SCORE_STRIP_GAMES.map((game) => (
          <a key={`${game.away}-${game.home}`} className="iq-score-card" href="#">
            {game.intl ? (
              <div className="iq-score-card__row" style={{ justifyContent: 'center', fontSize: '0.55rem' }}>
                INTL
              </div>
            ) : null}
            <div className="iq-score-card__row">
              <img className="iq-score-card__logo" src={teamLogoUrl(game.away)} alt="" />
              <span>{game.away}</span>
            </div>
            <div className="iq-score-card__row">
              <img className="iq-score-card__logo" src={teamLogoUrl(game.home)} alt="" />
              <span>{game.home}</span>
            </div>
            <div className="iq-score-card__network">{game.network}</div>
          </a>
        ))}
      </div>
      <button type="button" className="iq-score-strip__btn" aria-label="Next games" onClick={() => scroll(1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
