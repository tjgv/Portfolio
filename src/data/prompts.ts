/** Prompt data for Home grid and Prompt View page. URL: /prompts/[slug] */
export type Prompt = {
  id: string
  slug: string
  type: string
  pillClass: string
  title: string
  description: string
  tags: string[]
  useCase: string
  prompt: string
  howToUse: string[]
  proTips?: string[]
  relatedIds: string[]
}

type PromptRaw = {
  id: number
  slug: string
  type: string
  pillClass: string
  title: string
  description: string
  tags: string[]
  useCase: string
  prompt: string
  howToUse: string
  relatedIds: number[]
}

import promptsJson from './prompts.json'

function normalizeHowToUse(v: string): string[] {
  return v
    .split(/\n\d+\.\s*/)
    .map((s) => s.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
}

const PILL_CLASS_MAP: Record<string, string> = {
  Design: 'card-pill-blue',
  Strategy: 'card-pill-green',
  Career: 'card-pill-green',
  Philosophy: 'card-pill-purple',
  Research: 'card-pill-green',
  Other: 'card-pill-zinc',
}

function mapPillClass(pillClass: string): string {
  return PILL_CLASS_MAP[pillClass] ?? 'card-pill-zinc'
}

const PROMPTS_RAW: Prompt[] = (promptsJson as unknown as PromptRaw[]).map((p) => ({
  id: String(p.id),
  slug: p.slug,
  type: p.type === 'prompt-template' ? (p.pillClass || 'Other') : p.type,
  pillClass: mapPillClass(p.pillClass),
  title: p.title,
  description: p.description,
  tags: p.tags,
  useCase: p.useCase,
  prompt: p.prompt,
  howToUse: typeof p.howToUse === 'string' ? normalizeHowToUse(p.howToUse) : p.howToUse,
  relatedIds: p.relatedIds.map(String),
}))

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr]
  let s = seed
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export const PROMPTS: Prompt[] = seededShuffle(PROMPTS_RAW, 42)

export const PROMPTS_BY_SLUG = new Map(PROMPTS.map((p) => [p.slug, p]))
export const PROMPTS_BY_ID = new Map(PROMPTS.map((p) => [p.id, p]))

/** Filter chips = All + unique primary types from prompts (max 7 types) */
export const TYPE_FILTERS = ['All', ...Array.from(new Set(PROMPTS.map((p) => p.type))).slice(0, 7)]
