import { useMemo, type CSSProperties } from 'react'
import { ngsTeamLogoUrl } from '../../../constants'
import {
  BIG_BOARD_COLUMNS,
  BIG_BOARD_ROWS,
  type BigBoardColumn,
  type BigBoardPlayer,
} from '../../../data/big-board-grid'
import { teamPrimaryColor } from '../../../data/team-colors'
import {
  bigBoardCellKey,
  computeBigBoardTeamViewLayout,
  teamColorFill5,
} from '../data/big-board-team-view'
import '../../../components/big-board.css'
import './option-a-big-board-team-view.css'

type OptionABigBoardTableProps = {
  teamViewActive: boolean
  teamId: string
}

function PlayerName({
  player,
  hideMarkers,
}: {
  player: BigBoardPlayer
  hideMarkers: boolean
}) {
  return (
    <span
      className={
        player.tone === 'bold'
          ? 'big-board__name big-board__name--bold'
          : 'big-board__name big-board__name--muted'
      }
    >
      <span className="big-board__name-text">{player.name}</span>
      {!hideMarkers && player.marker ? (
        <span
          className={`big-board__diamond big-board__diamond--${player.marker}`}
          aria-hidden
        />
      ) : null}
    </span>
  )
}

function CellPlayers({
  players,
  hideMarkers,
}: {
  players: BigBoardPlayer[] | undefined
  hideMarkers: boolean
}) {
  if (!players?.length) return null
  return (
    <div className="big-board__names">
      {players.map((player) => (
        <PlayerName key={player.name} player={player} hideMarkers={hideMarkers} />
      ))}
    </div>
  )
}

export function OptionABigBoardTable({
  teamViewActive,
  teamId,
}: OptionABigBoardTableProps) {
  const teamColor = teamPrimaryColor(teamId)
  const layout = useMemo(
    () => (teamViewActive ? computeBigBoardTeamViewLayout(teamId) : null),
    [teamViewActive, teamId],
  )

  return (
    <div
      className={`big-board__scroll${teamViewActive ? ' big-board__scroll--team-view' : ''}`}
    >
      <table className="big-board__table">
        <thead>
          <tr>
            <th scope="col" className="big-board__th big-board__th--rd">
              RD
            </th>
            {BIG_BOARD_COLUMNS.map((col) => {
              const isHighlight =
                teamViewActive && layout?.highlightColumns.has(col)
              return (
                <th
                  key={col}
                  scope="col"
                  className={`big-board__th${isHighlight ? ' big-board__th--team-view' : ''}`}
                  style={
                    isHighlight ? { background: teamColor, borderColor: teamColor } : undefined
                  }
                >
                  {col}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {BIG_BOARD_ROWS.map((row, rowIndex) => (
            <tr key={`${row.tier}-${rowIndex}`}>
              <th scope="row" className="big-board__tier">
                {row.tier}
              </th>
              {BIG_BOARD_COLUMNS.map((col: BigBoardColumn) => {
                const cellKey = bigBoardCellKey(rowIndex, col)
                const isHighlight =
                  teamViewActive && layout?.highlightColumns.has(col)
                const logoTeamId = teamViewActive
                  ? layout?.logosByCell.get(cellKey)
                  : undefined
                const hasLogo = Boolean(logoTeamId)
                const isSelectedTeamLogo =
                  hasLogo && logoTeamId?.toUpperCase() === teamId.toUpperCase()

                const cellStyle: CSSProperties | undefined =
                  isHighlight || isSelectedTeamLogo
                    ? {
                        ...(isHighlight
                          ? { background: teamColorFill5(teamColor) }
                          : {}),
                        ...(isSelectedTeamLogo
                          ? { '--bb-team-color': teamColor } as CSSProperties
                          : {}),
                      }
                    : undefined

                return (
                  <td
                    key={col}
                    className={[
                      'big-board__td',
                      isHighlight ? 'big-board__td--team-view-col' : '',
                      hasLogo ? 'big-board__td--has-logo' : '',
                      isSelectedTeamLogo
                        ? 'big-board__td--selected-team-logo'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={cellStyle}
                  >
                    <div className="big-board__cell-inner">
                      <CellPlayers
                        players={row.cells[col]}
                        hideMarkers={teamViewActive}
                      />
                      {hasLogo && logoTeamId ? (
                        <img
                          className="big-board__cell-logo"
                          src={ngsTeamLogoUrl(logoTeamId)}
                          alt=""
                        />
                      ) : null}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
