import { useRef } from 'react'
import ImageCarousel, { type CarouselSlide } from './ImageCarousel'
import './EditingCarousel.css'

const MVP_PRIORITY_CARDS = [
  {
    id: 'asset-visualizations',
    icon: '/new-project-1/icons/asset-visualization.svg',
    title: 'Asset Visualizations',
    body: 'Create clear visual identifiers for assets, making scene building more intuitive. The challenge was developing a scalable system alongside our content teams.',
  },
  {
    id: 'scene-visualizations',
    icon: '/new-project-1/icons/scene-visualization.svg',
    title: 'Scene Visualizations',
    body: 'Represent the combinations of assets that make up a show. The challenge was communicating these combinations without pre-rendered scenes.',
  },
  {
    id: 'layering-support',
    icon: '/new-project-1/icons/layering-support.svg',
    title: 'Simpler Properties',
    body: 'Create a system to prioritize properties so that users have a more focused view of just what they need.',
  },
  {
    id: 'auto-play-scenes',
    icon: '/new-project-1/icons/auto-play.svg',
    title: 'Auto-Play Scenes',
    body: 'Move us closer to a click-and-go show running experience by reducing manual transitions. The challenge was supporting shows that do not follow a linear sequence.',
  },
] as const

// Thin image (Image2) is in the center slot so it can be centered with overflow on both sides
const SLIDES: CarouselSlide[] = [
  {
    id: 'editing-video',
    type: 'video',
    src: '/new-project-1/editing-clip-1.mp4',
    caption: 'Worked with content teams to develop a Thumbnail System for layer assets, and introduced layer-priority logic to use the thumbnails as the key-identifier for a scene.',
  },
  {
    id: 'editing-sequence',
    type: 'video',
    src: '/new-project-1/mvp-sequence-01.mp4',
    caption: 'Designed scene visualizations that communicate asset combinations without pre-rendered scenes, giving editors a clear view of how a show comes together.',
  },
  {
    id: 'editing-inspector',
    type: 'video',
    src: '/new-project-1/mvp-insp-2-main.mp4',
    fit: 'contain',
    caption: 'Worked with 2 engineering teams to barter a property priority system to filter out advanced properties. Then, I utilized progressive discourse to provide high-level view of configuration.',
  },
  {
    id: 'editing-image-2',
    type: 'image',
    src: '/new-project-1/editing-image-2.png',
    alt: 'CX Pro editing interface detail',
    caption: 'Found home for optional auto-play functionality, leveraging new sequencer (scene library top bar) to allow users the ability to enable auto-play in between scenes. For certain types of shows, this can eliminate transitions all together.',
  },
]

export default function EditingCarousel() {
  const carouselSectionRef = useRef<HTMLElement>(null)

  return (
    <>
      <section
        className="np1c-section np1c-mvp-priorities np1c-section-size-1"
        data-dev-section="mvp-priorities"
        aria-label="MVP Priorities"
      >
        <div className="np1c-section__inner np1c-editing-carousel__intro">
          <div className="np1c-h-text-stack">
            <p className="np1c-h-text-stack__label">MVP Priorities</p>
            <div className="np1c-h-text-stack__row">
              <h2 className="np1c-h-text-stack__headline">
                Identifying highest impact upgrades for MVP.
              </h2>
              <div className="np1c-h-text-stack__body">
                <p>
                  I prioritized four initiatives that improved the current editing experience while
                  laying the groundwork for future Show Running capabilities.
                </p>
              </div>
            </div>
          </div>
          <ul className="np1c-editing-carousel__cards">
            {MVP_PRIORITY_CARDS.map((card) => (
              <li key={card.id} className="np1c-editing-carousel__card">
                <img
                  className="np1c-editing-carousel__card-icon"
                  src={card.icon}
                  alt=""
                  aria-hidden
                  width={24}
                  height={24}
                />
                <div className="np1c-editing-carousel__card-text">
                  <h3 className="np1c-editing-carousel__card-title">{card.title}</h3>
                  <p className="np1c-editing-carousel__card-body">{card.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        ref={carouselSectionRef}
        className="np1c-section np1c-editing-carousel np1c-section-size-1"
        data-dev-section="editing-carousel"
        aria-label="Editing carousel"
      >
        <ImageCarousel
          slides={SLIDES}
          ariaLabel="Editing carousel slides"
          controlsVariant="autoplay"
          pillGrowSectionRef={carouselSectionRef}
        />
      </section>
    </>
  )
}
