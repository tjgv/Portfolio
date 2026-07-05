import { forwardRef, useCallback, useState } from 'react'
import { MediaLoader } from './MediaLoader'
import './MediaLoader.css'

interface VideoWithLoaderProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  variant?: 'default' | 'dark' | 'video'
  fill?: boolean
}

export const VideoWithLoader = forwardRef<HTMLVideoElement, VideoWithLoaderProps>(function VideoWithLoader(
  {
    variant = 'video',
    fill = false,
    onLoadedData,
    onCanPlay,
    onPlaying,
    className = '',
    style,
    ...videoProps
  },
  ref
) {
  const [loaded, setLoaded] = useState(false)

  const markLoaded = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleLoadedData = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      markLoaded()
      onLoadedData?.(e)
    },
    [markLoaded, onLoadedData]
  )

  const handleCanPlay = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      markLoaded()
      onCanPlay?.(e)
    },
    [markLoaded, onCanPlay]
  )

  const handlePlaying = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      markLoaded()
      onPlaying?.(e)
    },
    [markLoaded, onPlaying]
  )

  const targetOpacity = typeof style?.opacity === 'number' ? style.opacity : 1

  return (
    <div
      className={`media-with-loader-wrap${fill ? ' media-with-loader-wrap--fill' : ''}`}
      style={{ position: 'relative' }}
    >
      <MediaLoader visible={!loaded} variant={variant} />
      <video
        {...videoProps}
        ref={ref}
        className={className}
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        onPlaying={handlePlaying}
        style={{
          ...style,
          opacity: loaded ? targetOpacity : 0,
          transition: 'opacity 0.45s ease',
        }}
      />
    </div>
  )
})
