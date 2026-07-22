import { useRef } from 'react'
import { ImgWithLoader } from '../MediaLoader'
import RevealGradient from './RevealGradient'
import './EndHeroSection.css'

const END_HERO_IMAGE = '/new-project-1/hero-end.png'

export default function EndHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className="np1c-section np1c-end-hero"
      data-dev-section="end-hero"
      aria-label="Closing"
    >
      <RevealGradient className="np1c-end-hero__gradient" />

      <div className="np1c-end-hero__stage">
        <div className="np1c-section__inner np1c-end-hero__inner">
          <ImgWithLoader
            className="np1c-end-hero__image"
            src={END_HERO_IMAGE}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
