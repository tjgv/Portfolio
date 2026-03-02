/**
 * Renders SVG or PNG via <img>. Using img for SVG avoids black-box rendering
 * issues that <object> causes in many browsers. SVGs stay crisp at typical display sizes.
 */

import { useEffect, useState } from 'react'

interface SvgOrImgProps {
  src: string
  className?: string
  alt?: string
}

export default function SvgOrImg({ src, className, alt = '' }: SvgOrImgProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const t = setTimeout(() => setLoaded(true), 2000)
    return () => clearTimeout(t)
  }, [src])

  const encodedSrc = encodeURI(src)
  const style: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    opacity: loaded ? 1 : 0,
    transition: 'opacity 0.25s ease',
  }

  return (
    <img
      src={encodedSrc}
      alt={alt}
      className={className}
      style={style}
      onLoad={() => setLoaded(true)}
    />
  )
}
