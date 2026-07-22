import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MODAL_CLOSE_MS,
  MODAL_SHEET_OPEN_DELAY_MS,
} from './slideUpModalTiming'

export type SlideUpModalPhase = 'closed' | 'entering' | 'opening' | 'open' | 'closing'

export function useSlideUpModal() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayPhase, setOverlayPhase] = useState<SlideUpModalPhase>('closed')
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const openOverlay = useCallback(() => {
    setOverlayOpen(true)
    setOverlayPhase('entering')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOverlayPhase('opening')
        window.setTimeout(() => setOverlayPhase('open'), MODAL_SHEET_OPEN_DELAY_MS)
      })
    })
  }, [])

  const closeOverlay = useCallback(() => {
    const scrollEl = scrollRef.current
    if (scrollEl) scrollEl.style.overflow = 'hidden'
    setOverlayPhase('closing')
    window.setTimeout(() => {
      setOverlayOpen(false)
      setOverlayPhase('closed')
      if (scrollEl) scrollEl.style.overflow = ''
    }, MODAL_CLOSE_MS)
  }, [])

  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [overlayOpen, closeOverlay])

  useEffect(() => {
    if (!overlayOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    scrollRef.current?.scrollTo({ top: 0, left: 0 })
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [overlayOpen])

  return {
    overlayOpen,
    overlayPhase,
    overlayRef,
    scrollRef,
    openOverlay,
    closeOverlay,
  }
}
