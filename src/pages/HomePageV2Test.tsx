/** Duplicate of home page for testing – hidden route, green dot to distinguish from original */
import HomePageV2 from './HomePageV2'

export default function HomePageV2Test() {
  return (
    <>
      <div className="home-v2-verify-dot" aria-hidden />
      <HomePageV2 />
    </>
  )
}
