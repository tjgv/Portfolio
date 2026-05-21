import { MOCK_VERSION_OPTIONS } from '../mock-version'
import { useMockVersion } from '../context/useMockVersion'
import './mock-version-bar.css'

export function MockVersionBar() {
  const { version, setVersion } = useMockVersion()

  return (
    <div className="mock-version-bar" role="region" aria-label="Design mock version">
      <p className="mock-version-bar__label">NFL IQ prototype showcase</p>
      <div
        className="mock-version-bar__options"
        role="tablist"
        aria-label="Select mock version"
      >
        {MOCK_VERSION_OPTIONS.map((option) => {
          const active = version === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={
                active
                  ? 'mock-version-bar__option mock-version-bar__option--active'
                  : 'mock-version-bar__option'
              }
              onClick={() => setVersion(option.id)}
            >
              <span className="mock-version-bar__option-label">{option.label}</span>
              {option.badge ? (
                <span className="mock-version-bar__badge">{option.badge}</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
