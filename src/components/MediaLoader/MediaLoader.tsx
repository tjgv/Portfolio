import './MediaLoader.css'

interface MediaLoaderProps {
  visible: boolean
  variant?: 'default' | 'dark'
  className?: string
}

export function MediaLoader({ visible, variant = 'default', className = '' }: MediaLoaderProps) {
  return (
    <div
      className={`media-loader media-loader--${variant} ${!visible ? 'media-loader--hidden' : ''} ${className}`}
      aria-hidden
    >
      <div className="media-loader__sheen" />
    </div>
  )
}
