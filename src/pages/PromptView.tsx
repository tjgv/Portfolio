import { useParams, Link } from 'react-router-dom'
import { PROMPTS_BY_SLUG, PROMPTS_BY_ID, type Prompt } from '../data/prompts'
import { useState, useCallback } from 'react'
import './PromptView.css'

export default function PromptView() {
  const { slug } = useParams<{ slug: string }>()
  const prompt = slug ? PROMPTS_BY_SLUG.get(slug) : null
  const [copied, setCopied] = useState(false)

  const copyPrompt = useCallback(() => {
    if (!prompt) return
    navigator.clipboard.writeText(prompt.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [prompt])

  if (!prompt) {
    return (
      <div className="app">
        <nav className="navbar-glass" aria-label="Main navigation">
          <div className="navbar-content">
            <Link to="/" className="nav-brand">TJ Gomez-Vidal</Link>
            <div className="nav-links">
              <a href="https://www.linkedin.com/in/trent-gomez-vidal/" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-link">Resume</a>
              <Link to="/contact" className="nav-link">Contact</Link>
            </div>
          </div>
        </nav>
        <main className="prompt-view prompt-view-error">
          <p>Prompt not found.</p>
          <a href="/#prompts" className="prompt-view-back">← Back to prompts</a>
        </main>
      </div>
    )
  }

  const relatedPrompts = prompt.relatedIds
    .map((id) => PROMPTS_BY_ID.get(id))
    .filter((p): p is Prompt => p != null)

  return (
    <div className="app">
      <nav className="navbar-glass" aria-label="Main navigation">
        <div className="navbar-content">
          <Link to="/" className="nav-brand">TJ Gomez-Vidal</Link>
          <div className="nav-links">
            <a href="https://www.linkedin.com/in/trent-gomez-vidal/" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-link">Resume</a>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="prompt-view">
        <a href="/#prompts" className="prompt-view-back">← Back to prompts</a>

        <h1 className="prompt-view-title">{prompt.title}</h1>

        <section className="prompt-view-section">
          <h2 className="prompt-view-heading">Use Case</h2>
          <p className="prompt-view-text">{prompt.useCase}</p>
        </section>

        <section className="prompt-view-section">
          <div className="prompt-view-section-header">
            <h2 className="prompt-view-heading">Prompt</h2>
            <button
              type="button"
              className="prompt-view-copy"
              onClick={copyPrompt}
              aria-label="Copy prompt"
            >
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
          <pre className="prompt-view-code">{prompt.prompt}</pre>
        </section>

        <section className="prompt-view-section">
          <h2 className="prompt-view-heading">How to use</h2>
          <ol className="prompt-view-steps">
            {prompt.howToUse.map((step, i) => (
              <li key={i} className="prompt-view-step">{step}</li>
            ))}
          </ol>
        </section>

        {prompt.proTips && prompt.proTips.length > 0 && (
          <section className="prompt-view-section">
            <h3 className="prompt-view-subheading">Pro Tips</h3>
            <ul className="prompt-view-tips">
              {prompt.proTips.map((tip, i) => (
                <li key={i} className="prompt-view-tip">{tip}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="prompt-view-section">
          <h2 className="prompt-view-heading">Tags</h2>
          <div className="prompt-view-tags">
            {prompt.tags.map((tag) => (
              <span key={tag} className="prompt-view-tag">{tag}</span>
            ))}
          </div>
        </section>

        {relatedPrompts.length > 0 && (
          <section className="prompt-view-section">
            <h2 className="prompt-view-heading">Related Prompts</h2>
            <ul className="prompt-view-related">
              {relatedPrompts.map((p) => (
                <li key={p.id}>
                  <Link to={`/prompts/${p.slug}`} className="prompt-view-related-link">
                    {p.title}
                  </Link>
                  <span className="prompt-view-related-desc">{p.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
