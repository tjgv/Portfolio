import { useEffect, useState } from 'react'
import { fetchFreeAgency } from '../api'
import { FreeAgencyBoard } from '../components/FreeAgencyBoard'
import { IqTabHeader } from '../components/IqTabHeader'
import type { Transaction } from '../types'
import './free-agency.css'
import '../components/free-agency-board.css'

export function FreeAgencyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchFreeAgency()
      .then((data) => {
        setTransactions(data.transactions)
      })
      .catch(() => {
        setTransactions([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="free-agency-page">
      <IqTabHeader
        title="2026 FREE AGENCY CENTRAL"
        subtitle="GO INSIDE THE MINDS OF AN NFL PRO SCOUTING DEPARTMENT WITH NFL IQ POWERED BY AMAZON QUICK"
      />

      <section
        className="free-agency-board-section"
        aria-label="Free agency boards"
      >
        <FreeAgencyBoard />
      </section>

      {!loading && transactions.length > 0 ? (
        <div className="iq-panel free-agency-transactions">
          <div className="iq-panel__head">Recent transactions</div>
          <table className="iq-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Team</th>
                <th>Type</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={`${tx.date}-${tx.summary}`}>
                  <td>{tx.date}</td>
                  <td>
                    <strong>{tx.team}</strong>
                  </td>
                  <td>{tx.type}</td>
                  <td>{tx.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
