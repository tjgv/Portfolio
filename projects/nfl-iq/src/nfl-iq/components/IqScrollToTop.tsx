import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset window scroll when the route changes (SPA does not do this by default). */
export function IqScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
