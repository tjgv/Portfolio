import { useState, useCallback } from 'react'
import { MediaLoader } from './MediaLoader'
import './MediaLoader.css'

interface ImgWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'default' | 'dark'
}

export function ImgWithLoader({ variant = 'default', onLoad, className = '', ...imgProps }: ImgWithLoaderProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoaded(true)
      onLoad?.(e)
    },
    [onLoad]
  )

  return (
    <div className="media-with-loader-wrap" style={{ position: 'relative' }}>
      <MediaLoader visible={!loaded} variant={variant} />
      <img
        {...imgProps}
        className={className}
        onLoad={handleLoad}
        style={{
          ...imgProps.style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />
    </div>
  )
}
