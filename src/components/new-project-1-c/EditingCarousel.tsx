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

export default function EditingCarousel() {
  return (
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
                High Impact, Low Effort Items For Rapid Rollout
              </h2>
              <div className="np1c-h-text-stack__body">
                <p>
                  I prioritized four initiatives that improved the current editing experience while
                  laying the groundwork for future Show Running capabilities. These initiatives were
                  selected based on what could realistically be shipped within a quarter to get the
                  ball moving in this new direction.
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
                  width={30}
                  height={30}
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
  )
}
