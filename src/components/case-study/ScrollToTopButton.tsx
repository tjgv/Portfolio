import { smoothScrollToTop } from '../../hooks/useScrollToTopReveal'

type ScrollToTopButtonProps = {
  visible: boolean
}

export default function ScrollToTopButton({ visible }: ScrollToTopButtonProps) {
  return (
    <button
      type="button"
      className={`cx-scroll-to-top ${visible ? 'cx-scroll-to-top--visible' : ''}`}
      onClick={smoothScrollToTop}
      aria-label="Scroll to top"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
