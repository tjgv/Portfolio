/** First / second focus slot colors for Draft Central */
export const DRAFT_TEST_FOCUS_SLOTS = [
  { border: '#14b8a6', fill: 'rgba(20, 184, 166, 0.35)' },
  { border: '#9333ea', fill: 'rgba(147, 51, 234, 0.35)' },
] as const

export function draftTestFocusSlotIndex(
  key: string,
  focusedKeys: readonly string[],
): 0 | 1 | null {
  const index = focusedKeys.indexOf(key)
  if (index === 0) return 0
  if (index === 1) return 1
  return null
}
