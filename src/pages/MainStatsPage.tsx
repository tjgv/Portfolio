import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMainStats, type MainStats } from '../lib/mainTracker'
import './MainStatsPage.css'

const REFRESH_MS = 10_000

export default function MainStatsPage() {
  const [stats, setStats] = useState<MainStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  const load = useCallback(async () => {
    try {
      const next = await fetchMainStats()
      setStats(next)
      setError(null)
      setUpdatedAt(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    const id = window.setInterval(() => {
      void load()
    }, REFRESH_MS)
    return () => window.clearInterval(id)
  }, [load])

  return (
    <main className="main-stats">
      <div className="main-stats__inner">
        <p className="main-stats__eyebrow">/main analytics</p>
        <h1 className="main-stats__title">Visit tracker</h1>
        <p className="main-stats__note">
          Counts exclude browsers marked with <code>?me=1</code>. Open{' '}
          <Link to="/main?me=1">/main?me=1</Link> once on your machine so your visits are ignored.
        </p>

        {loading && !stats ? (
          <p className="main-stats__status">Loading…</p>
        ) : error && !stats ? (
          <p className="main-stats__status main-stats__status--error">{error}</p>
        ) : stats ? (
          <div className="main-stats__grid">
            <article className="main-stats__card">
              <p className="main-stats__label">Pageviews</p>
              <p className="main-stats__value">{stats.pageviews.toLocaleString()}</p>
            </article>
            <article className="main-stats__card">
              <p className="main-stats__label">Unique visitors</p>
              <p className="main-stats__value">{stats.uniqueVisitors.toLocaleString()}</p>
            </article>
          </div>
        ) : null}

        <div className="main-stats__footer">
          <button type="button" className="main-stats__refresh" onClick={() => void load()}>
            Refresh
          </button>
          {updatedAt ? (
            <span className="main-stats__meta">
              Updated {updatedAt.toLocaleTimeString()}
              {stats?.persistence ? ` · ${stats.persistence}` : ''}
              {error ? ` · ${error}` : ''}
            </span>
          ) : null}
        </div>

        <p className="main-stats__links">
          <Link to="/main">Open /main</Link>
        </p>
      </div>
    </main>
  )
}
