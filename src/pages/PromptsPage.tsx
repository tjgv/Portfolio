import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PROMPTS, PROMPTS_BY_SLUG, PROMPTS_BY_ID, TYPE_FILTERS, type Prompt } from '../data/prompts'
import './HomePageV2.css'
import './PromptsPage.css'

function PromptDetailContent({
  prompt,
  copied,
  onCopy,
}: {
  prompt: Prompt
  copied: boolean
  onCopy: () => void
}) {
  const relatedPrompts = prompt.relatedIds
    .map((id) => PROMPTS_BY_ID.get(id))
    .filter((p): p is Prompt => p != null)

  return (
    <>
      <h1 className="ai-prompts-detail-title">{prompt.title}</h1>

      <section className="ai-prompts-detail-section">
        <h2 className="ai-prompts-detail-heading">Use Case</h2>
        <p className="ai-prompts-detail-text">{prompt.useCase}</p>
      </section>

      <section className="ai-prompts-detail-section">
        <div className="ai-prompts-detail-section-header">
          <h2 className="ai-prompts-detail-heading">Prompt</h2>
          <button
            type="button"
            className="ai-prompts-detail-copy"
            onClick={onCopy}
            aria-label="Copy prompt"
          >
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>
        <pre className="ai-prompts-detail-code">{prompt.prompt}</pre>
      </section>

      <section className="ai-prompts-detail-section">
        <h2 className="ai-prompts-detail-heading">How to use</h2>
        <ol className="ai-prompts-detail-steps">
          {prompt.howToUse.map((step, i) => (
            <li key={i} className="ai-prompts-detail-step">{step}</li>
          ))}
        </ol>
      </section>

      {prompt.proTips && prompt.proTips.length > 0 && (
        <section className="ai-prompts-detail-section">
          <h3 className="ai-prompts-detail-subheading">Pro Tips</h3>
          <ul className="ai-prompts-detail-tips">
            {prompt.proTips.map((tip, i) => (
              <li key={i} className="ai-prompts-detail-tip">{tip}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="ai-prompts-detail-section">
        <h2 className="ai-prompts-detail-heading">Tags</h2>
        <div className="ai-prompts-detail-tags">
          {prompt.tags.map((tag) => (
            <span key={tag} className="ai-prompts-detail-tag">{tag}</span>
          ))}
        </div>
        <p className="ai-prompts-credit ai-prompts-credit--inline">
          Prompt Credit: <a href="https://www.aiuxplayground.com/" target="_blank" rel="noopener noreferrer">Ai/UX Playground</a>
        </p>
      </section>

      {relatedPrompts.length > 0 && (
        <section className="ai-prompts-detail-section">
          <h2 className="ai-prompts-detail-heading">Related Prompts</h2>
          <ul className="ai-prompts-detail-related">
            {relatedPrompts.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="ai-prompts-detail-related-link"
                  onClick={() => onSelectRelated(p.slug)}
                >
                  {p.title}
                </button>
                <span className="ai-prompts-detail-related-desc">{p.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

function PromptPopup({
  prompt,
  onClose,
  copied,
  onCopy,
  onSelectRelated,
}: {
  prompt: Prompt
  onClose: () => void
  copied: boolean
  onCopy: () => void
  onSelectRelated: (slug: string) => void
}) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [onClose])

  return (
    <div
      className="home-v2-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Prompt: ${prompt.title}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="home-v2-popup ai-prompts-popup" onClick={(e) => e.stopPropagation()}>
        <nav className="home-v2-popup-nav" aria-label="Preview actions">
          <button
            type="button"
            className="home-v2-popup-close"
            onClick={onClose}
            aria-label="Close preview"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </nav>
        <div className="home-v2-popup-scroll ai-prompts-popup-scroll">
          <PromptDetailContent prompt={prompt} copied={copied} onCopy={onCopy} onSelectRelated={onSelectRelated} />
        </div>
      </div>
    </div>
  )
}

function matchesSearch(prompt: Prompt, q: string): boolean {
  if (!q.trim()) return true
  const lower = q.toLowerCase().trim()
  const searchable = [
    prompt.title,
    prompt.description,
    prompt.useCase,
    ...prompt.tags,
  ].join(' ').toLowerCase()
  return searchable.includes(lower)
}

export default function PromptsPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  const typeFiltered = filterType === 'All'
    ? PROMPTS
    : PROMPTS.filter((p) => p.type === filterType)
  const filteredPrompts = typeFiltered.filter((p) => matchesSearch(p, searchQuery))
  const selectedPrompt = selectedSlug ? PROMPTS_BY_SLUG.get(selectedSlug) : null

  const copyPrompt = useCallback(() => {
    if (!selectedPrompt) return
    navigator.clipboard.writeText(selectedPrompt.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [selectedPrompt])

  return (
    <div className="ai-prompts-page">
      <div className="home-v2-gradient" aria-hidden />
      <div className="home-v2-content-margin">
        <header className="home-v2-header ai-prompts-header">
          <Link to="/" className="home-v2-logo" aria-label="Home">
            <img src="/logo-personal.png" alt="" className="home-v2-logo-img" />
          </Link>
          <div className="home-v2-header-inner">
            <h1 className="home-v2-name">A.I. prompts for velocity</h1>
            <div className="home-v2-header-bottom">
              <div className="home-v2-header-text">
                <p className="home-v2-tagline">
                  Repository of AI prompts I find helpful in speeding up design and non-design work.
                </p>
              </div>
              <nav className="home-v2-nav ai-prompts-nav" aria-label="Main">
                <Link to="/" className="home-v2-nav-item">Work</Link>
                <span className="home-v2-nav-item home-v2-nav-item--active">A.I Prompts</span>
                <Link to="/contact" className="home-v2-nav-item">About</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="ai-prompts-main ai-prompts-main--grid">
          <div className="ai-prompts-toolbar">
            <div className="ai-prompts-filter-chips" role="tablist" aria-label="Filter prompts by type">
              {TYPE_FILTERS.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={filterType === type}
                  className={`ai-prompts-filter-chip ${filterType === type ? 'ai-prompts-filter-chip--selected' : ''}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <input
              type="search"
              className="ai-prompts-search"
              placeholder="Search for prompts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search prompts"
            />
          </div>

          <div className="ai-prompts-grid">
            {filteredPrompts.map((card) => (
              <button
                key={card.id}
                type="button"
                className={`ai-prompts-grid-card ${card.pillClass}`}
                onClick={() => setSelectedSlug(card.slug)}
                aria-label={`${card.title} – view prompt`}
              >
                <span className="ai-prompts-grid-card-pill">{card.type}</span>
                <h3 className="ai-prompts-grid-card-title">{card.title}</h3>
                <p className="ai-prompts-grid-card-desc">{card.description}</p>
                <div className="ai-prompts-grid-card-tags">
                  {card.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </main>

        <footer className="home-v2-footer ai-prompts-footer">
          <div className="home-v2-footer-inner">
            <span className="home-v2-footer-name">T.J. Gomez-Vidal</span>
            <div className="home-v2-footer-links">
              <Link to="/" className="home-v2-footer-link">Work</Link>
              <span className="home-v2-footer-link home-v2-footer-link--active">A.I Prompts</span>
              <Link to="/contact" className="home-v2-footer-link">About</Link>
            </div>
            <div className="home-v2-footer-contact">
              <span>Let&apos;s work together!</span>
              <a href="mailto:tjgomezvidal@gmail.com">tjgomezvidal@gmail.com</a>
            </div>
          </div>
        </footer>
      </div>

      {selectedPrompt && (
        <PromptPopup
          prompt={selectedPrompt}
          onClose={() => setSelectedSlug(null)}
          copied={copied}
          onCopy={copyPrompt}
          onSelectRelated={setSelectedSlug}
        />
      )}
    </div>
  )
}
