import type { DraftBoardProspect } from '../types'

import draftBoardRaw from './draft-board.mock.json'

/** Same fixtures as `/api/iq/draft`; bundled so Draft Central renders without running the Express server. */
export const DRAFT_BOARD_MOCK: DraftBoardProspect[] =
  draftBoardRaw as DraftBoardProspect[]
