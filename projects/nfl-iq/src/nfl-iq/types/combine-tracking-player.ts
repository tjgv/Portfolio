export type SpeedDistancePoint = {
  distance: number
  speed: number
}

export type PlayerTrackingSummary = {
  id: string
  rank: number
  player: string
  position: string
  school: string
  schoolDisplay: string
  year: number
  fortyTime: number
  topSpeed: number
  tenTime: number
  tenYardSpeed: number
  maxAccel: number
  height: string
  weight: number
  speedCurve: SpeedDistancePoint[]
  avgSpeedCurve: SpeedDistancePoint[]
}
