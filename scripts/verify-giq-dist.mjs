import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const index = resolve(process.cwd(), 'dist/giq/index.html')
if (!existsSync(index)) {
  console.error('[verify-giq] Missing dist/giq/index.html — NFL IQ was not bundled into the deploy output.')
  process.exit(1)
}
console.log('[verify-giq] dist/giq/index.html OK')
