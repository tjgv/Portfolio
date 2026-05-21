/**
 * NFL combine-style strings → inches for plotting.
 * Height: feet in first digit, next two whole inches, last digit eighths (e.g. 6046 = 6'4⅝").
 * Arm length: AA.BB inches (e.g. 3178 = 31 + 78/100").
 */

export function parseHeightToInches(ht: string | null | undefined): number | null {
  if (ht == null || ht === '') return null
  const d = ht.replace(/\D/g, '').padStart(4, '0').slice(0, 4)
  if (d.length < 4) return null
  const feet = parseInt(d[0], 10)
  const inches = parseInt(d.slice(1, 3), 10)
  const eighths = parseInt(d[3], 10)
  if (!Number.isFinite(feet) || !Number.isFinite(inches) || !Number.isFinite(eighths)) return null
  return feet * 12 + inches + eighths / 8
}

export function parseArmToInches(arm: string | null | undefined): number | null {
  if (arm == null || arm === '') return null
  const d = arm.replace(/\D/g, '')
  if (d.length < 3) return null
  const whole = parseInt(d.slice(0, 2), 10)
  const frac = parseInt(d.slice(2, 4), 10)
  if (!Number.isFinite(whole) || !Number.isFinite(frac)) return null
  return whole + frac / 100
}
