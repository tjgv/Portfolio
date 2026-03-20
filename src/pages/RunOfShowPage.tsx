import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Plus,
  Trash2,
  Search,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react'
import './RunOfShowPage.css'

export type MediaItem = {
  id: string
  url: string
  title: string
  duration?: number
  thumbnail?: string
}

export type MediaBucket = {
  id: string
  label: string
  items: MediaItem[]
}

const BUCKETS: { id: string; label: string }[] = [
  { id: 'ingress', label: 'Ingress' },
  { id: 'commercials', label: 'Commercials' },
  { id: 'main', label: 'Main' },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function RunOfShowPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [buckets, setBuckets] = useState<MediaBucket[]>(() =>
    BUCKETS.map((b) => ({ ...b, items: [] }))
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [targetBucket, setTargetBucket] = useState<string>('main')
  const [playlist, setPlaylist] = useState<MediaItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentItem = playlist[currentIndex]

  const addVideo = useCallback(() => {
    if (!newUrl.trim()) return
    const bucketToAdd = targetBucket === 'all' ? 'main' : targetBucket
    const item: MediaItem = {
      id: crypto.randomUUID(),
      url: newUrl.trim(),
      title: newTitle.trim() || `Video ${Date.now()}`,
    }
    setBuckets((prev) =>
      prev.map((b) =>
        b.id === bucketToAdd
          ? { ...b, items: [...b.items, item] }
          : b
      )
    )
    setNewUrl('')
    setNewTitle('')
  }, [newUrl, newTitle, targetBucket])

  const removeFromBucket = useCallback(
    (bucketId: string, itemId: string) => {
      setBuckets((prev) =>
        prev.map((b) =>
          b.id === bucketId
            ? { ...b, items: b.items.filter((i) => i.id !== itemId) }
            : b
        )
      )
      setPlaylist((p) => p.filter((i) => i.id !== itemId))
    },
    []
  )

  const addToPlaylist = useCallback((item: MediaItem) => {
    setPlaylist((p) => (p.some((i) => i.id === item.id) ? p : [...p, item]))
  }, [])

  const buildPlaylistFromBucket = useCallback(
    (bucketId: string) => {
      const bucket = buckets.find((b) => b.id === bucketId)
      if (bucket) setPlaylist(bucket.items)
      setCurrentIndex(0)
      setIsPlaying(false)
    },
    [buckets]
  )

  const play = useCallback(() => {
    if (!videoRef.current || !currentItem) return
    videoRef.current.play()
    setIsPlaying(true)
  }, [currentItem])

  const pause = useCallback(() => {
    videoRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    setCurrentTime(0)
  }, [])

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = t
      setCurrentTime(t)
    }
  }, [])

  const onVideoEnded = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else if (loop) {
      setCurrentIndex(0)
    } else {
      setIsPlaying(false)
    }
  }, [currentIndex, playlist.length, loop])

  const onTimeUpdate = useCallback(() => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }, [])

  const onLoadedMetadata = useCallback(() => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }, [])

  useEffect(() => {
    if (!currentItem || !videoRef.current) return
    videoRef.current.src = currentItem.url
    videoRef.current.load()
    setCurrentTime(0)
    setDuration(0)
    if (isPlaying) videoRef.current.play()
  }, [currentItem?.id, isPlaying])

  const allItems = buckets.flatMap((b) => b.items)
  const itemsByBucket =
    targetBucket === 'all'
      ? allItems
      : buckets.find((b) => b.id === targetBucket)?.items ?? []
  const filteredItems = itemsByBucket.filter(
    (i) =>
      !searchQuery ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="ros-page">
      <header className="ros-topbar">
        <div className="ros-topbar-left">
          <Link to="/" className="ros-back" aria-label="Back to home">
            <ChevronRight className="ros-back-icon" />
            Home
          </Link>
          <span className="ros-breadcrumb">Run of Show</span>
        </div>
        <div className="ros-topbar-actions">
          <button type="button" className="ros-btn ros-btn-secondary">
            Reset
          </button>
          <button type="button" className="ros-btn ros-btn-primary">
            Publish
          </button>
        </div>
      </header>

      <div className="ros-layout">
        {/* Left: Media library */}
        <aside className="ros-sidebar ros-sidebar-left">
          <div className="ros-search-wrap">
            <Search size={16} className="ros-search-icon" />
            <input
              type="text"
              placeholder="Find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ros-search-input"
              aria-label="Search media"
            />
          </div>
          <select
            className="ros-select"
            value={targetBucket}
            onChange={(e) => setTargetBucket(e.target.value)}
            aria-label="Content filter"
          >
            <option value="all">All Content</option>
            {BUCKETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>

          <div className="ros-add-video">
            <input
              type="url"
              placeholder="Video URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="ros-input"
              aria-label="Video URL"
            />
            <input
              type="text"
              placeholder="Title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="ros-input"
              aria-label="Video title"
            />
            <button
              type="button"
              className="ros-btn ros-btn-icon"
              onClick={addVideo}
              aria-label="Add video"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="ros-media-list">
            {filteredItems.length === 0 ? (
              <p className="ros-empty">No media. Add a video URL above.</p>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`ros-media-item ${playlist.some((i) => i.id === item.id) ? 'ros-media-item--in-playlist' : ''}`}
                >
                  <div className="ros-media-thumb">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" />
                    ) : (
                      <div className="ros-media-thumb-placeholder">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="ros-media-info">
                    <span className="ros-media-title">{item.title}</span>
                    <span className="ros-media-meta">
                      {item.duration ? formatTime(item.duration) : '—'}
                    </span>
                  </div>
                  <div className="ros-media-actions">
                    <button
                      type="button"
                      className="ros-btn ros-btn-ghost"
                      onClick={() => addToPlaylist(item)}
                      aria-label="Add to playlist"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      className="ros-btn ros-btn-ghost"
                      onClick={() => {
                        const b = buckets.find((x) => x.items.some((i) => i.id === item.id))
                        if (b) removeFromBucket(b.id, item.id)
                      }}
                      aria-label="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center: Buckets + Canvas */}
        <main className="ros-main">
          <div className="ros-buckets">
            {buckets.map((bucket) => (
              <div key={bucket.id} className="ros-bucket">
                <div className="ros-bucket-header">
                  <span className="ros-bucket-label">{bucket.label}</span>
                  <button
                    type="button"
                    className="ros-btn ros-btn-sm"
                    onClick={() => buildPlaylistFromBucket(bucket.id)}
                    disabled={bucket.items.length === 0}
                  >
                    Play all
                  </button>
                </div>
                <div className="ros-bucket-strip">
                  {bucket.items.length === 0 ? (
                    <span className="ros-bucket-empty">Drop videos here</span>
                  ) : (
                    bucket.items.map((item) => (
                      <div
                        key={item.id}
                        className={`ros-bucket-card ${currentItem?.id === item.id ? 'ros-bucket-card--active' : ''}`}
                        onClick={() => {
                          const idx = playlist.findIndex((i) => i.id === item.id)
                          if (idx >= 0) {
                            setCurrentIndex(idx)
                            videoRef.current?.play()
                            setIsPlaying(true)
                          } else {
                            const next = [...playlist, item]
                            setPlaylist(next)
                            setCurrentIndex(next.length - 1)
                            setIsPlaying(true)
                          }
                        }}
                      >
                        <div className="ros-bucket-card-thumb">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt="" />
                          ) : (
                            <ImageIcon size={24} />
                          )}
                        </div>
                        <span className="ros-bucket-card-title">{item.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ros-canvas">
            <div className="ros-preview">
              {currentItem ? (
                <video
                  ref={videoRef}
                  src={currentItem.url}
                  className="ros-video"
                  muted={false}
                  playsInline
                  onEnded={onVideoEnded}
                  onTimeUpdate={onTimeUpdate}
                  onLoadedMetadata={onLoadedMetadata}
                  controls={false}
                />
              ) : (
                <div className="ros-preview-empty">
                  <ImageIcon size={48} />
                  <p>Add videos and add them to the playlist</p>
                  <p className="ros-preview-empty-hint">Click a bucket card or &quot;Play all&quot;</p>
                </div>
              )}
            </div>

            <div className="ros-playback-bar">
              <div className="ros-playback-controls">
                <button
                  type="button"
                  className="ros-btn ros-btn-icon ros-btn-play"
                  onClick={isPlaying ? pause : play}
                  disabled={!currentItem}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  type="button"
                  className="ros-btn ros-btn-icon"
                  onClick={reset}
                  disabled={!currentItem}
                  aria-label="Reset"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  type="button"
                  className={`ros-btn ros-btn-icon ${loop ? 'ros-btn--active' : ''}`}
                  onClick={() => setLoop(!loop)}
                  aria-label={loop ? 'Loop on' : 'Loop off'}
                  aria-pressed={loop}
                >
                  <Repeat size={18} />
                </button>
              </div>
              <div className="ros-playback-time">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{duration ? formatTime(duration) : '0:00'}</span>
              </div>
              <div className="ros-scrubber-wrap">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={seek}
                  className="ros-scrubber"
                  aria-label="Seek"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Right: Inspector */}
        <aside className="ros-sidebar ros-sidebar-right">
          <div className="ros-panel">
            <h3 className="ros-panel-title">Layers</h3>
            <div className="ros-layers">
              <div className="ros-layer-item">Layout</div>
              <div className="ros-layer-item">Preview</div>
            </div>
          </div>
          <div className="ros-panel">
            <h3 className="ros-panel-title">Inspector</h3>
            {currentItem ? (
              <div className="ros-inspector">
                <p className="ros-inspector-label">Current</p>
                <p className="ros-inspector-value">{currentItem.title}</p>
                <p className="ros-inspector-label">Position</p>
                <p className="ros-inspector-value">{currentIndex + 1} / {playlist.length}</p>
                <p className="ros-inspector-label">Status</p>
                <p className="ros-inspector-value">{isPlaying ? 'Playing' : 'Paused'}</p>
              </div>
            ) : (
              <p className="ros-inspector-empty">No item selected</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
