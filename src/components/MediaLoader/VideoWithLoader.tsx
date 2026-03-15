import { useState, useCallback } from 'react'
import { MediaLoader } from './MediaLoader'
import './MediaLoader.css'

interface VideoWithLoaderProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  variant?: 'default' | 'dark'
}

export function VideoWithLoader({ variant = 'default', onLoadedData, onCanPlay, className = '', ...videoProps }: VideoWithLoaderProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoadedData = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setLoaded(true)
      onLoadedData?.(e)
    },
    [onLoadedData]
  )

  const handleCanPlay = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setLoaded(true)
      onCanPlay?.(e)
    },
    [onCanPlay]
  )

  return (
    <div className="media-with-loader-wrap" style={{ position: 'relative' }}>
      <MediaLoader visible={!loaded} variant={variant} />
      <video
        {...videoProps}
        className={className}
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        style={{
          ...videoProps.style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />
    </div>
  )
}
