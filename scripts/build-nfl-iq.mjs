/**
 * Builds NFL IQ into public/giq/ so it is only reachable at /giq/ (not in site nav).
 */
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const portfolioRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = resolve(portfolioRoot, 'public/giq')

function findNflIqRoot() {
  const candidates = [
    process.env.NFL_IQ_PROJECT_PATH,
    resolve(portfolioRoot, 'projects/nfl-iq'),
    resolve(portfolioRoot, '../Genius-Take-Home-Assignment'),
  ].filter(Boolean)

  for (const dir of candidates) {
    if (existsSync(resolve(dir, 'package.json'))) return dir
  }
  return null
}

const nflIqRoot = findNflIqRoot()

if (!nflIqRoot) {
  const msg =
    '[build-giq] NFL IQ source not found. Add projects/nfl-iq or keep Genius-Take-Home-Assignment as a sibling folder.'

  if (process.env.SKIP_NFL_IQ_BUILD === '1') {
    console.warn(`${msg} Skipping (SKIP_NFL_IQ_BUILD=1).`)
    process.exit(0)
  }

  console.error(msg)
  process.exit(1)
}

console.log(`[build-giq] Building from ${nflIqRoot}`)

const hasNodeModules = existsSync(resolve(nflIqRoot, 'node_modules'))
const install = spawnSync('npm', [hasNodeModules ? 'install' : 'ci'], {
  cwd: nflIqRoot,
  stdio: 'inherit',
  env: process.env,
})
if (install.status !== 0) process.exit(install.status ?? 1)

const build = spawnSync('npm', ['run', 'build'], {
  cwd: nflIqRoot,
  stdio: 'inherit',
  env: { ...process.env, VITE_BASE_PATH: '/giq/' },
})
if (build.status !== 0) process.exit(build.status ?? 1)

const distDir = resolve(nflIqRoot, 'dist')
if (!existsSync(resolve(distDir, 'index.html'))) {
  console.error('[build-giq] dist/index.html missing after build.')
  process.exit(1)
}

rmSync(outputDir, { recursive: true, force: true })
mkdirSync(outputDir, { recursive: true })
cpSync(distDir, outputDir, { recursive: true })

console.log(`[build-giq] Ready at /giq/ → ${outputDir}`)
