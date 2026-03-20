import { useEffect, useState, useCallback, useRef } from 'react'

interface FigPalFloatingCharacterProps {
  enabled: boolean
  characterUrl: string
  accessoryUrl: string | null
}

const MOBILE_BREAKPOINT = 768
const TRAIL_SMOOTHING = 0.12
const OFFSET_Y = 36 // always below cursor
const OFFSET_X = 28 // horizontal offset from cursor

/** Pixels of horizontal offset before flipping; dead zone prevents jitter */
const FLIP_THRESHOLD = 48

/** Compute target position: below cursor, left or right of cursor based on screen side */
function getTargetFromCursor(clientX: number, clientY: number) {
  const isLeftSide = clientX < window.innerWidth / 2
  return {
    x: clientX + (isLeftSide ? OFFSET_X : -OFFSET_X),
    y: clientY + OFFSET_Y,
  }
}

/** Renders a character that trails behind the mouse cursor when enabled; on mobile, parks at bottom right */
export default function FigPalFloatingCharacter({
  enabled,
  characterUrl,
  accessoryUrl,
}: FigPalFloatingCharacterProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [facingRight, setFacingRight] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const targetRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    cursorRef.current = { x: e.clientX, y: e.clientY }
    targetRef.current = getTargetFromCursor(e.clientX, e.clientY)
  }, [])

  useEffect(() => {
    if (!enabled || isMobile) return
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [enabled, isMobile, onMouseMove])

  useEffect(() => {
    if (!enabled || isMobile) return
    const animate = () => {
      const target = targetRef.current
      const cursor = cursorRef.current
      setPos((prev) => {
        const next = {
          x: prev.x + (target.x - prev.x) * TRAIL_SMOOTHING,
          y: prev.y + (target.y - prev.y) * TRAIL_SMOOTHING,
        }
        const dx = next.x - cursor.x
        if (dx < -FLIP_THRESHOLD) {
          setFacingRight(true)
        } else if (dx > FLIP_THRESHOLD) {
          setFacingRight(false)
        }
        return next
      })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [enabled, isMobile])

  if (!enabled) return null

  return (
    <div
      className={`figpal-floating${isMobile ? ' figpal-floating--mobile' : ''}`}
      style={
        isMobile
          ? {
              right: 8,
              bottom: 8,
              left: 'auto',
              top: 'auto',
              marginLeft: 0,
              marginTop: 0,
            }
          : {
              left: pos.x,
              top: pos.y,
              transform: facingRight ? 'scaleX(-1)' : 'none',
            }
      }
      aria-hidden
    >
      <img src={characterUrl} alt="" className="figpal-floating-char" />
      {accessoryUrl && (
        <img src={accessoryUrl} alt="" className="figpal-floating-acc" />
      )}
    </div>
  )
}
