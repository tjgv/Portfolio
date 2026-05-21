import type { ComponentType } from 'react'
import type { MockVersionId } from '../mock-version'
import { NflIqAppOptionA } from './NflIqAppOptionA'
import { NflIqAppOptionB } from './NflIqAppOptionB'
import { NflIqAppOriginal } from './NflIqAppOriginal'

export const MOCK_VERSION_APPS: Record<MockVersionId, ComponentType> = {
  original: NflIqAppOriginal,
  'option-a': NflIqAppOptionA,
  'option-b': NflIqAppOptionB,
}

export { NflIqAppOriginal, NflIqAppOptionA, NflIqAppOptionB }
