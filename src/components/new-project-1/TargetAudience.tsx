import { useCallback } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import './TargetAudience.css'

const AUDIENCE_VIDEO = '/new-project-1/audience-educators.mp4'
const PLAYBACK_RATE = 0.75
const VIDEO_START_SEC = 2

type AudienceCard = {
  id: string
  title: string
  body: string
  video?: string
  videoLabel?: string
}

const FEATURED_CARD: AudienceCard = {
  id: 'educators',
  title: 'Educators',
  body: "Professors, TA's, Speakers, and those who use the tool as an extension of their work.",
  video: AUDIENCE_VIDEO,
  videoLabel: 'Educator presenting immersive dome content to an audience',
}

const COMPACT_CARDS: AudienceCard[] = [
  {
    id: 'students',
    title: 'Students',
    body: 'From club organizers running movie night, to 3D engineering students who want to make the most of our technology.',
  },
  {
    id: 'staff',
    title: 'Staff',
    body: 'Dedicated broadcast professionals who run routine events.',
  },
]

export default function TargetAudience() {
  const prepareVideo = useCallback((video: HTMLVideoElement) => {
    video.defaultPlaybackRate = PLAYBACK_RATE
    video.playbackRate = PLAYBACK_RATE

    if (video.currentTime < VIDEO_START_SEC) {
      if (video.fastSeek) {
        video.fastSeek(VIDEO_START_SEC)
      } else {
        video.currentTime = VIDEO_START_SEC
      }
    }
  }, [])

  const handleEnded = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget
      prepareVideo(video)
      void video.play()
    },
    [prepareVideo]
  )

  return (
    <section
      className="np1-section np1-audience"
      data-dev-section="audience"
      aria-label="Target audience"
    >
      <div className="np1-section__inner np1-section__inner--wide np1-audience__inner">
        <h2 className="np1-audience__heading">Who we&apos;re anticipating using CX Pro</h2>

        <div className="np1-audience__grid">
          <article className="np1-audience-card">
            <h3 className="np1-audience-card__title">{FEATURED_CARD.title}</h3>
            <p className="np1-audience-card__body">{FEATURED_CARD.body}</p>
          </article>

          {FEATURED_CARD.video ? (
            <article className="np1-audience-card np1-audience-card--media">
              <div className="np1-audience-card__media">
                <VideoWithLoader
                  src={FEATURED_CARD.video}
                  aria-label={FEATURED_CARD.videoLabel}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onLoadedData={(e) => prepareVideo(e.currentTarget)}
                  onCanPlay={(e) => prepareVideo(e.currentTarget)}
                  onEnded={handleEnded}
                />
              </div>
            </article>
          ) : null}

          {COMPACT_CARDS.map((card) => (
            <article key={card.id} className="np1-audience-card">
              <h3 className="np1-audience-card__title">{card.title}</h3>
              <p className="np1-audience-card__body">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
