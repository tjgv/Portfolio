import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import HomePageV2 from './HomePageV2'
import { markMainSelfExcluded, trackMainPageview } from '../lib/mainTracker'

/**
 * Duplicate homepage at /main with visit tracking.
 * Visit /main?me=1 once to exclude this browser from counts forever.
 */
export default function MainLanding() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const isMe = searchParams.get('me') === '1'
    if (isMe) {
      markMainSelfExcluded()
      navigate('/main', { replace: true })
      return
    }

    void trackMainPageview()
  }, [searchParams, navigate])

  return <HomePageV2 />
}
