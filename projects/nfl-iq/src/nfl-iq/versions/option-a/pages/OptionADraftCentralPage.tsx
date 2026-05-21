import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchDraft } from '../../../api'
import { CheatSheetBoard } from '../../../components/CheatSheetBoard'
import { CombineTrackingOutOfScopePanel } from '../../../components/CombineTrackingOutOfScopePanel'
import { type DraftSubView, parseDraftSubView } from '../../../components/DraftSubnav'
import { IqTabHeader } from '../../../components/IqTabHeader'
import { DRAFT_BOARD_MOCK } from '../../../data/draft-board'
import type { DraftBoardProspect } from '../../../types'
import { OptionABigBoardBoard } from '../components/OptionABigBoardBoard'
import { OptionADraftCentralTestBoard } from '../draft-central-test/OptionADraftCentralTestBoard'
import { OptionADraftProspectDetail } from '../draft-central-test/OptionADraftProspectDetail'
import {
  DRAFT_PROSPECT_QUERY,
  findProspectByKey,
} from '../draft-central-test/draft-prospect-nav'
import '../../../pages/draft-central.css'
import '../draft-central-test/option-a-draft-central-test.css'
import '../draft-central-test/option-a-draft-prospect-detail.css'

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

export function OptionADraftCentralPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const subView = useMemo(
    () => parseDraftSubView(searchParams),
    [searchParams],
  )
  const [prospects, setProspects] =
    useState<DraftBoardProspect[]>(() => [...DRAFT_BOARD_MOCK])
  const [loading, setLoading] = useState(true)
  const prospectKey = searchParams.get(DRAFT_PROSPECT_QUERY)
  const prospectDetail = useMemo(() => {
    if (subView !== 'draft-central' || !prospectKey) return null
    return findProspectByKey(prospects, prospectKey) ?? null
  }, [subView, prospectKey, prospects])

  const openProspectDetail = useCallback(
    (key: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(DRAFT_PROSPECT_QUERY, key)
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const closeProspectDetail = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete(DRAFT_PROSPECT_QUERY)
        return next
      },
      { replace: false },
    )
  }, [setSearchParams])

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
  const showProspectDetail = subView === 'draft-central' && prospectDetail != null

  return (
    <div
      className={
        subView === 'draft-central'
          ? `draft-central-page draft-central-page--option-a draft-central-page--draft-test${showProspectDetail ? ' draft-central-page--prospect-detail' : ''}`
          : 'draft-central-page draft-central-page--option-a'
      }
    >
      {showProspectDetail ? null : (
        <IqTabHeader title={header.title} subtitle={header.subtitle} />
      )}

      {showProspectDetail ? (
        <OptionADraftProspectDetail
          prospect={prospectDetail}
          onBack={closeProspectDetail}
        />
      ) : subView === 'draft-central' ? (
        <section
          className="draft-central-section draft-central-section--board draft-central-section--prospect-board"
          aria-label="Prospect draft board"
        >
          <OptionADraftCentralTestBoard
            rows={prospects}
            loading={loading && prospects.length === 0}
            onOpenProspect={openProspectDetail}
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
          <OptionABigBoardBoard />
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
