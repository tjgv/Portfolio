import {
  BIG_BOARD_COLUMNS,
  BIG_BOARD_ROWS,
  type BigBoardColumn,
  type BigBoardPlayer,
} from '../data/big-board-grid'
import './big-board.css'

function PlayerName({ player }: { player: BigBoardPlayer }) {
  return (
    <span
      className={
        player.tone === 'bold'
          ? 'big-board__name big-board__name--bold'
          : 'big-board__name big-board__name--muted'
      }
    >
      {player.name}
      {player.marker ? (
        <span
          className={`big-board__diamond big-board__diamond--${player.marker}`}
          aria-hidden
        />
      ) : null}
    </span>
  )
}

function CellPlayers({ players }: { players: BigBoardPlayer[] | undefined }) {
  if (!players?.length) return null
  return (
    <div className="big-board__names">
      {players.map((player) => (
        <PlayerName key={player.name} player={player} />
      ))}
    </div>
  )
}

export function BigBoardBoard() {
  return (
    <div className="big-board__scroll">
      <table className="big-board__table">
        <thead>
          <tr>
            <th scope="col" className="big-board__th big-board__th--rd">
              RD
            </th>
            {BIG_BOARD_COLUMNS.map((col) => (
              <th key={col} scope="col" className="big-board__th">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BIG_BOARD_ROWS.map((row, rowIndex) => (
            <tr key={`${row.tier}-${rowIndex}`}>
              <th scope="row" className="big-board__tier">
                {row.tier}
              </th>
              {BIG_BOARD_COLUMNS.map((col: BigBoardColumn) => (
                <td key={col} className="big-board__td">
                  <CellPlayers players={row.cells[col]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
