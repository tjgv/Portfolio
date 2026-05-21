import { useNavigate } from 'react-router-dom'
import { ngsTeamLogoUrl } from '../constants'
import { publicAsset } from '../lib/app-paths'
import { draftTestFocusPath } from '../versions/option-a/draft-central-test/draft-test-focus-nav'

const HERO_BACKDROP = publicAsset('/images/home/hero-backdrop.png')
const HERO_PLAYER_IMG = publicAsset('/images/home/hero-mendoza.png')
const HERO_CLOSE_ICON = publicAsset('/images/home/close-small.svg')
const HERO_PLAYER_NAME = 'Fernando Mendoza'

export function IqHomeHero() {
  const navigate = useNavigate()

  const goToDraftTest = () => {
    navigate(draftTestFocusPath(HERO_PLAYER_NAME))
  }

  return (
    <section
      className="iq-home-hero"
      aria-label="Is the hype real?"
      style={{ backgroundImage: `url(${HERO_BACKDROP})` }}
      role="button"
      tabIndex={0}
      onClick={goToDraftTest}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          goToDraftTest()
        }
      }}
    >
      <h2 className="iq-home-hero__title">{`IS  THE  HYPE  REAL?`}</h2>
      <img className="iq-home-hero__cutout" src={HERO_PLAYER_IMG} alt="" />
      <div className="iq-home-hero__branding">
        <img
          className="iq-home-hero__team-logo"
          src={ngsTeamLogoUrl('LV')}
          alt=""
          width={32}
          height={32}
        />
        <img
          className="iq-home-hero__close"
          src={HERO_CLOSE_ICON}
          alt=""
          width={24}
          height={24}
        />
        <p className="iq-home-hero__player-name">FERNANDO MENDOZA</p>
      </div>
      <div className="iq-home-hero__footer">
        <span className="iq-home-stat-cta iq-home-hero__cta">SEE THE STATS</span>
      </div>
    </section>
  )
}
