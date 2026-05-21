export type CombineTrackingRow = {
  player: string
  position: string
  school: string
  year: number
  metric: string
  time?: string
}

export type CombineTrackingDropdownOption = {
  value: string
  label: string
}

export type CombineTrackingPanel = {
  id: string
  viewLabel: string
  dropdownOptions: CombineTrackingDropdownOption[]
  defaultDropdownValue: string
  titleBold: string
  titleRest: string
  metricColumnLabel: string
  showTimeColumn: boolean
  rows: CombineTrackingRow[]
}

export type CombineTrackingData = {
  panels: CombineTrackingPanel[]
}
