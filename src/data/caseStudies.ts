export type CaseStudySlug = 'consumer-cx-pro' | 'cx-pro-c2c' | 'validus-redesign'

export type CaseStudy = {
  slug: CaseStudySlug
  route: string
  legacyRoutes: readonly string[]
  title: string
  thumbnail: string
  homeCardId: 'placeholder1' | 'project1' | 'project2'
}

/** Canonical reading order for the three published case studies. */
export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: 'consumer-cx-pro',
    route: '/consumer-cx-pro',
    legacyRoutes: ['/new-project-1', '/consumer-cx-pro-b'],
    title: 'Consumer-Grade CX Pro',
    thumbnail: '/new-project-1/hero-bg.png',
    homeCardId: 'placeholder1',
  },
  {
    slug: 'cx-pro-c2c',
    route: '/cx-pro-c2c',
    legacyRoutes: ['/project1'],
    title: 'CX Pro: Concept to Commercialization',
    thumbnail: '/project1-cx.png',
    homeCardId: 'project1',
  },
  {
    slug: 'validus-redesign',
    route: '/validus-redesign',
    legacyRoutes: ['/project2'],
    title: 'Validus Overhaul',
    thumbnail: '/project2-events.png',
    homeCardId: 'project2',
  },
] as const

export function getCaseStudyBySlug(slug: CaseStudySlug): CaseStudy {
  const study = CASE_STUDIES.find((entry) => entry.slug === slug)
  if (!study) throw new Error(`Unknown case study slug: ${slug}`)
  return study
}

export function getCaseStudyByRoute(pathname: string): CaseStudy | undefined {
  return CASE_STUDIES.find(
    (entry) => entry.route === pathname || entry.legacyRoutes.includes(pathname),
  )
}

export function getCaseStudyNeighbors(slug: CaseStudySlug) {
  const index = CASE_STUDIES.findIndex((entry) => entry.slug === slug)
  return {
    prev: index > 0 ? CASE_STUDIES[index - 1] : null,
    next: index >= 0 && index < CASE_STUDIES.length - 1 ? CASE_STUDIES[index + 1] : null,
  }
}
