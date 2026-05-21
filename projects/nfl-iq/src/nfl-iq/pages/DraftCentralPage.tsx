import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchDraft } from '../api'
import { BigBoardBoard } from '../components/BigBoardBoard'
import { CheatSheetBoard } from '../components/CheatSheetBoard'
import { CombineTrackingOutOfScopePanel } from '../components/CombineTrackingOutOfScopePanel'
import { DraftCentralBoard } from '../components/DraftCentralBoard'
import { type DraftSubView, parseDraftSubView } from '../components/DraftSubnav'
import { IqTabHeader } from '../components/IqTabHeader'
import { DRAFT_BOARD_MOCK } from '../data/draft-board'
import type { DraftBoardProspect } from '../types'
import './draft-central.css'

const HEADER_COPY: Record<
  DraftSubView,
  { title: string; subtitle: string }
> = {
  'draft-central': {
    title: '2026 NFL DRAFT CENTRAL',
    subtitle:
      'JOIN THE COLLEGE SCOUTING DEPARTMENT IN DRAFT MEETINGS WITH NFL IQ POWERED BY AMAZON QUICK',
  },
  'cheat-sheet': {
    title: '2026 NFL IQ Projected First-Round Big Boards',
    subtitle:
      "PROJECTING EVERY TEAM'S FIRST-ROUND BOARD BASED ON OUTCOME, PLAYER AVAILABILITY AND RELIABLE POST-DRAFT REPORTING",
  },
  'big-board': {
    title: '2026 NFL IQ BIG BOARD',
    subtitle:
      'POSITION-BY-POSITION PROSPECT TIERS ACROSS PROJECTED DRAFT RANGES FOR THE 2026 NFL DRAFT CLASS',
  },
  'combine-tracking': {
    title: '2026 NFL IQ COMBINE TRACKING',
    subtitle:
      'NEXT GEN STATS SPEED AND ACCELERATION METRICS FROM THE SCOUTING COMBINE AND PRO DAYS',
  },
}

export function DraftCentralPage() {
  const [searchParams] = useSearchParams()
  const subView = useMemo(
    () => parseDraftSubView(searchParams),
    [searchParams],
  )

  const [prospects, setProspects] =
    useState<DraftBoardProspect[]>(() => [...DRAFT_BOARD_MOCK])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (subView !== 'draft-central') {
      setLoading(false)
      return
    }

    setLoading(true)
    void fetchDraft()
      .then((data) => {
        const next = data.prospects ?? []
        if (next.length > 0) setProspects(next as DraftBoardProspect[])
        else setProspects([...DRAFT_BOARD_MOCK])
      })
      .catch(() => setProspects([...DRAFT_BOARD_MOCK]))
      .finally(() => setLoading(false))
  }, [subView])

  const header = HEADER_COPY[subView]

  return (
    <div className="draft-central-page">
      <IqTabHeader title={header.title} subtitle={header.subtitle} />

      {subView === 'draft-central' ? (
        <section
          className="draft-central-section draft-central-section--board"
          aria-label="Prospect draft board"
        >
          <DraftCentralBoard
            rows={prospects}
            loading={loading && prospects.length === 0}
          />
        </section>
      ) : subView === 'cheat-sheet' ? (
        <section
          className="draft-central-section draft-central-section--board draft-central-section--cheat-sheet"
          aria-label="Cheat sheet big boards"
        >
          <div className="draft-board">
            <div className="draft-board__primary-wrap draft-board__primary-wrap--cheat-sheet">
              <div className="draft-board__primary-card draft-board__primary-card--cheat-sheet">
                <CheatSheetBoard />
              </div>
            </div>
          </div>
        </section>
      ) : subView === 'big-board' ? (
        <section
          className="draft-central-section draft-central-section--board draft-central-section--big-board"
          aria-label="Position big board"
        >
          <div className="draft-board">
            <div className="draft-board__primary-wrap draft-board__primary-wrap--big-board">
              <div className="draft-board__primary-card draft-board__primary-card--big-board">
                <BigBoardBoard />
              </div>
            </div>
          </div>
        </section>
      ) : subView === 'combine-tracking' ? (
        <section
          className="draft-central-section draft-central-section--combine-tracking-oos"
          aria-label="Combine tracking"
        >
          <CombineTrackingOutOfScopePanel />
        </section>
      ) : null}
    </div>
  )
}
