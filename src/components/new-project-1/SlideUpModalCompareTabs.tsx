import { useCallback, useEffect, useRef, useState } from 'react'
import type { SlideUpModalMediaCompare } from './CaseStudySlideUpModal'
import ModalSectionTextStack from './ModalSectionTextStack'
import SlideUpModalLoopVideo from './SlideUpModalLoopVideo'

type CompareTab = 'before' | 'after'

type SlideUpModalCompareTabsProps = {
  sectionId: string
  headline: string
  body: string
  compare: SlideUpModalMediaCompare
}

const PROGRESS_RADIUS = 20
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

function FilledPlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4.5 2.75v10.5c0 .55.6.88 1.05.58l8.25-5.25a.75.75 0 0 0 0-1.26L5.55 2.17A.75.75 0 0 0 4.5 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FilledPauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
      <rect x="3" y="2" width="3.5" height="12" rx="0.75" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="0.75" fill="currentColor" />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

export default function SlideUpModalCompareTabs({
  sectionId,
  headline,
  body,
  compare,
}: SlideUpModalCompareTabsProps) {
  const [activeTab, setActiveTab] = useState<CompareTab>('before')
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Reset playback state when tab switches (video remounts via key)
  useEffect(() => {
    setIsPlaying(true)
    setProgress(0)
  }, [activeTab])

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const handleReplay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.fastSeek) video.fastSeek(0)
    else video.currentTime = 0
    void video.play()
    setIsPlaying(true)
    setProgress(0)
  }, [])

  const strokeOffset = PROGRESS_CIRCUMFERENCE * (1 - progress)

  const beforeLabel = compare.beforeLabel ?? 'Before (Current)'
  const afterLabel = compare.afterLabel ?? 'After (Proposed)'

  const activeVideo =
    activeTab === 'before'
      ? {
          src: compare.beforeVideo,
          ariaLabel: compare.beforeAriaLabel,
          playbackRate: compare.beforePlaybackRate ?? 1,
        }
      : {
          src: compare.afterVideo,
          ariaLabel: compare.afterAriaLabel,
          playbackRate: compare.afterPlaybackRate ?? 1,
        }

  const panelId = `np1-modal-compare-${sectionId}`

  return (
    <div className="np1-modal-compare">
      <ModalSectionTextStack sectionId={sectionId} headline={headline} body={body} />

      <div
        className="np1-modal-compare__tabs"
        role="tablist"
        aria-label="Compare before and after"
      >
        <button
          type="button"
          role="tab"
          id={`${panelId}-tab-before`}
          aria-selected={activeTab === 'before'}
          aria-controls={`${panelId}-panel-before`}
          className={`np1-modal-compare__tab${activeTab === 'before' ? ' np1-modal-compare__tab--active' : ''}`}
          onClick={() => setActiveTab('before')}
        >
          {beforeLabel}
        </button>
        <button
          type="button"
          role="tab"
          id={`${panelId}-tab-after`}
          aria-selected={activeTab === 'after'}
          aria-controls={`${panelId}-panel-after`}
          className={`np1-modal-compare__tab${activeTab === 'after' ? ' np1-modal-compare__tab--active' : ''}`}
          onClick={() => setActiveTab('after')}
        >
          {afterLabel}
        </button>
      </div>

      {/* panel has overflow:hidden for border-radius clipping — controls live outside */}
      <div
        id={`${panelId}-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${activeTab}`}
        className={`np1-modal-compare__panel${activeTab === 'after' ? ' np1-modal-compare__panel--after' : ''}`}
      >
        <SlideUpModalLoopVideo
          key={`${sectionId}-${activeTab}-${activeVideo.src}`}
          src={activeVideo.src}
          ariaLabel={activeVideo.ariaLabel}
          className="np1-modal-compare__video"
          videoRef={videoRef}
          onProgress={setProgress}
          playbackRate={activeVideo.playbackRate}
        />
      </div>

      {/* Video controls — outside the overflow:hidden panel, right-aligned to panel edge */}
      <div className="np1-modal-compare__video-controls">
        <button
          type="button"
          className="np1-modal-video-btn"
          onClick={handleReplay}
          aria-label="Replay video from beginning"
        >
          <ReplayIcon />
        </button>

        <button
          type="button"
          className="np1-modal-video-btn np1-modal-video-btn--progress"
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          <svg className="np1-modal-video-progress" viewBox="0 0 48 48" aria-hidden>
            <circle
              className="np1-modal-video-progress__track"
              cx="24" cy="24" r={PROGRESS_RADIUS}
            />
            <circle
              className="np1-modal-video-progress__fill"
              cx="24" cy="24" r={PROGRESS_RADIUS}
              strokeDasharray={PROGRESS_CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
            />
          </svg>
          <span className="np1-modal-video-btn__icon">
            {isPlaying ? <FilledPauseIcon /> : <FilledPlayIcon />}
          </span>
        </button>
      </div>
    </div>
  )
}
