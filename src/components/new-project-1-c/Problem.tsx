import './Problem.css'

const PROBLEM_IMAGE = '/new-project-1/problem-hero.png'
const PROBLEM_LABEL = 'Problem'
const PROBLEM_STATEMENT =
  'CX Pro is too conceptually complex for newer users to grasp, making otherwise simple flows unintuitive.'

export default function Problem() {
  return (
    <section
      className="np1c-section np1c-problem"
      data-dev-section="problem"
      aria-label="Problem"
    >
      <div className="np1c-problem__stage">
        <img
          className="np1c-problem__image"
          src={PROBLEM_IMAGE}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
        />
        <div className="np1c-problem__fade" aria-hidden />
      </div>

      <div className="np1c-problem__copy" data-dev-section="problem-copy">
        <div className="np1c-section__inner np1c-problem__copy-inner">
          <p className="np1c-problem__label">{PROBLEM_LABEL}</p>
          <h2 className="np1c-problem__statement">{PROBLEM_STATEMENT}</h2>
        </div>
      </div>
    </section>
  )
}
