import './Problem.css'
import './ProblemB.css'

const PROBLEM_IMAGE = '/new-project-1/problem-hero.png'
const PROBLEM_LABEL = 'Problem'
const PROBLEM_STATEMENT =
  'CX Pro is too conceptually complex for newer users to grasp, making otherwise simple flows unintuitive.'
const PROBLEM_BODY =
  'After speaking with users, I had learned that the central issue with the tool was conceptual clarity — what do buttons mean, how do layers work, what actions are instantaneous.'

export default function ProblemB() {
  return (
    <section
      className="np1-section np1-problem np1-problem--b"
      data-dev-section="problem"
      aria-label="Problem"
    >
      <div className="np1-problem__stage">
        <img
          className="np1-problem__image"
          src={PROBLEM_IMAGE}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
        />
        <div className="np1-problem__fade" aria-hidden />
      </div>

      <div className="np1-problem__copy" data-dev-section="problem-copy">
        <div className="np1-section__inner np1-problem__copy-inner np1-problem__copy-inner--b">
          <p className="np1-problem__label">{PROBLEM_LABEL}</p>
          <h2 className="np1-problem__statement">{PROBLEM_STATEMENT}</h2>
          <p className="np1-problem__body">{PROBLEM_BODY}</p>
        </div>
      </div>
    </section>
  )
}
