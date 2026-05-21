import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { parseDraftSubView } from '../../../components/DraftSubnav'
import { DRAFT_PROSPECT_QUERY } from '../draft-central-test/draft-prospect-nav'
import { useIqTeam } from '../../../context/useIqTeam'
import { FreeAgencyTeamFilterBar } from './FreeAgencyTeamFilterBar'
import './option-a-team-filter-strip.css'

const DEFAULT_TEAM_ID = 'NE'

/** Draft subviews without the team filter strip */
const DRAFT_VIEWS_WITHOUT_TEAM_FILTER = new Set([
  'cheat-sheet',
  'combine-tracking',
])

export function OptionATeamFilterStrip() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const { selectedTeamId, setSelectedTeam } = useIqTeam()
  const didInitDraft = useRef(false)

  const onFreeAgency = pathname.startsWith('/free-agency')
  const onDraft = pathname.startsWith('/draft')
  const draftSubView = useMemo(
    () => (onDraft ? parseDraftSubView(searchParams) : null),
    [onDraft, searchParams],
  )
  const onProspectDetail =
    onDraft &&
    draftSubView === 'draft-central' &&
    searchParams.get(DRAFT_PROSPECT_QUERY) != null
  const hideTeamFilter =
    onProspectDetail ||
    (draftSubView != null && DRAFT_VIEWS_WITHOUT_TEAM_FILTER.has(draftSubView))
  const show = onFreeAgency || (onDraft && !hideTeamFilter)

  useEffect(() => {
    if (!onDraft) {
      didInitDraft.current = false
      return
    }
    if (!didInitDraft.current) {
      didInitDraft.current = true
      if (!selectedTeamId) setSelectedTeam(DEFAULT_TEAM_ID)
    }
  }, [onDraft, selectedTeamId, setSelectedTeam])

  if (!show) return null

  return (
    <div id="option-a-team-filter" className="option-a-team-filter-strip">
      <div className="iq-page-inner option-a-team-filter-strip__inner">
        <FreeAgencyTeamFilterBar
          selectedTeamId={selectedTeamId}
          onSelectTeam={setSelectedTeam}
          allowDeselect={onFreeAgency || onDraft}
        />
      </div>
    </div>
  )
}
