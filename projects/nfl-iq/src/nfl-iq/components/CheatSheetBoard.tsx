import { ngsTeamLogoUrl } from '../constants'
import { CHEAT_SHEET_GRID } from '../data/cheat-sheet-grid'
import { cheatSheetTeamId } from '../utils/cheat-sheet-team'
import './cheat-sheet.css'

export function CheatSheetBoard() {
  return (
    <div className="cheat-sheet__grid" aria-label="Team big board picks">
      {CHEAT_SHEET_GRID.flat().map((cell, index) => {
        const teamId = cheatSheetTeamId(cell.team)
        return (
          <article key={`${cell.team}-${index}`} className="cheat-sheet__cell">
            <img
              className="cheat-sheet__logo"
              src={ngsTeamLogoUrl(teamId)}
              alt=""
              width={40}
              height={40}
            />
            <ul className="cheat-sheet__picks">
              {cell.picks.map((pick) => (
                <li
                  key={`${pick.name}-${pick.position}`}
                  className={
                    pick.highlight
                      ? 'cheat-sheet__pick cheat-sheet__pick--highlight'
                      : 'cheat-sheet__pick cheat-sheet__pick--muted'
                  }
                >
                  {pick.name}, {pick.position}
                </li>
              ))}
            </ul>
          </article>
        )
      })}
    </div>
  )
}
