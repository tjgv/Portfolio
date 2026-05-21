import { publicAsset } from '../lib/app-paths'

const NFL_IQ_ICON = publicAsset('/images/nfl-iq-icon.png')
const AMAZON_QUICK_ICON = publicAsset('/images/amazon-quick-icon.png')

export function IqHeaderPartners() {
  return (
    <div className="iq-header-partners">
      <div
        className="iq-header-partners__marks"
        aria-label="Powered by NFL IQ and Amazon Quick"
      >
        <img className="iq-header-partners__logo" src={NFL_IQ_ICON} alt="NFL IQ" />
        <span className="iq-header-partners__divider" aria-hidden="true" />
        <img
          className="iq-header-partners__logo iq-header-partners__logo--quick"
          src={AMAZON_QUICK_ICON}
          alt="Amazon Quick"
        />
      </div>
      <p className="iq-header-partners__learn">
        Learn more at{' '}
        <a href="https://aws.amazon.com/quick/" target="_blank" rel="noopener noreferrer">
          aws.com/quick
        </a>
      </p>
    </div>
  )
}
