import { parseArmToInches, parseHeightToInches } from '../../../utils/combine-measurements'

function eighthsToFraction(eighths: number): string {
  if (eighths === 2) return '1/4'
  if (eighths === 4) return '1/2'
  if (eighths === 6) return '3/4'
  if (eighths === 0) return ''
  return `${eighths}/8`
}

/** NFL.com prospect page style: 6' 2 1/4" */
export function formatProspectHeight(ht: string | null | undefined): string {
  const inches = parseHeightToInches(ht)
  if (inches == null) return ht?.trim() || '—'
  const feet = Math.floor(inches / 12)
  const wholeInches = Math.floor(inches % 12)
  const eighths = Math.round((inches % 1) * 8)
  const frac = eighthsToFraction(eighths)
  if (!frac) return `${feet}' ${wholeInches}"`
  return `${feet}' ${wholeInches} ${frac}"`
}

/** NFL.com style: 30 7/8" */
export function formatProspectArm(arm: string | null | undefined): string {
  const inches = parseArmToInches(arm)
  if (inches == null) return arm?.trim() || '—'
  const whole = Math.floor(inches)
  const eighths = Math.round((inches % 1) * 8)
  const frac = eighthsToFraction(eighths)
  if (!frac) return `${whole}"`
  return `${whole} ${frac}"`
}

export function formatProspectWeight(wt: string | null | undefined): string {
  if (wt == null || wt === '') return '—'
  const n = Number.parseInt(String(wt).replace(/\D/g, ''), 10)
  return Number.isFinite(n) ? `${n} lbs` : wt
}

/** NFL.com style: 9 1/8" */
export function formatProspectHand(hand: string | null | undefined): string {
  if (hand == null || hand === '') return '—'
  const inches = parseArmToInches(hand)
  if (inches != null) {
    const whole = Math.floor(inches)
    const eighths = Math.round((inches % 1) * 8)
    const frac = eighthsToFraction(eighths)
    if (!frac) return `${whole}"`
    return `${whole} ${frac}"`
  }
  const digits = hand.replace(/\D/g, '')
  if (digits.length >= 3) {
    const whole = digits.slice(0, 1)
    const fracDigits = digits.slice(1, 3)
    const eighths = Math.round(Number.parseInt(fracDigits, 10) / 100 * 8)
    const frac = eighthsToFraction(eighths)
    if (!frac) return `${whole}"`
    return `${whole} ${frac}"`
  }
  return hand
}
