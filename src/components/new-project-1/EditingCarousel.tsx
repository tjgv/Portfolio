import ImageCarousel, { type CarouselSlide } from './ImageCarousel'
import RevealGradient from './RevealGradient'
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
    title: 'Layering Support',
    body: 'Communicate layer hierarchy and the unique behaviors of each layer type. The challenge was designing a consistent layer system where each layer behaves differently.',
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
    backText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    id: 'editing-image-3',
    type: 'image',
    src: '/new-project-1/editing-image-3.png',
    alt: 'Editing view overview',
    narrow: true,
    caption: 'Worked with 2 engineering teams to barter a property priority system to filter out advanced properties. Then, I utilized progressive discourse to provide high-level view of configuration.',
    backText: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: 'editing-image-2',
    type: 'image',
    src: '/new-project-1/editing-image-2.png',
    alt: 'CX Pro editing interface detail',
    caption: 'Found home for optional auto-play functionality, leveraging new sequencer (scene library top bar) to allow users the ability to enable auto-play in between scenes. For certain types of shows, this can eliminate transitions all together.',
    backText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  },
]

export default function EditingCarousel() {
  return (
    <section
      className="np1-section np1-editing-carousel"
      data-dev-section="editing-carousel"
      aria-label="MVP Priorities"
    >
      <RevealGradient className="np1-editing-carousel__gradient" />

      <div className="np1-editing-carousel__inner">
        <div className="np1-editing-carousel__intro">
          <p className="np1-editing-carousel__label">MVP Priorities</p>
          <h2 className="np1-editing-carousel__headline">
            Identifying highest impact upgrades for MVP
          </h2>
          <p className="np1-editing-carousel__lede">
            I prioritized four initiatives that improved the current editing experience while
            laying the groundwork for future Show Running capabilities.
          </p>
          <ul className="np1-editing-carousel__cards">
            {MVP_PRIORITY_CARDS.map((card) => (
              <li key={card.id} className="np1-editing-carousel__card">
                <img
                  className="np1-editing-carousel__card-icon"
                  src={card.icon}
                  alt=""
                  aria-hidden
                  width={24}
                  height={24}
                />
                <div className="np1-editing-carousel__card-text">
                  <h3 className="np1-editing-carousel__card-title">{card.title}</h3>
                  <p className="np1-editing-carousel__card-body">{card.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ImageCarousel slides={SLIDES} ariaLabel="Editing carousel slides" />
      </div>
    </section>
  )
}
