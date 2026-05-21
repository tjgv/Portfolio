export type CheatSheetPick = {
  name: string
  position: string
  highlight: boolean
}

export type CheatSheetCell = {
  team: string
  picks: CheatSheetPick[]
}

/** 4 rows × 8 columns — matches 2026 NFL IQ projected first-round big boards cheat sheet */
export const CHEAT_SHEET_GRID: CheatSheetCell[][] = [
  [
    {
      team: 'Raiders',
      picks: [{ name: 'Fernando Mendoza', position: 'QB', highlight: true }],
    },
    {
      team: 'Jets',
      picks: [
        { name: 'David Bailey', position: 'ED', highlight: true },
        { name: 'Arvell Reese', position: 'ED', highlight: false },
      ],
    },
    {
      team: 'Cardinals',
      picks: [
        { name: 'Jeremiyah Love', position: 'RB', highlight: true },
        { name: 'David Bailey', position: 'ED', highlight: false },
        { name: 'Arvell Reese', position: 'ED', highlight: false },
        { name: 'Francis Mauigoa', position: 'T', highlight: false },
        { name: 'Ty Simpson', position: 'QB', highlight: false },
      ],
    },
    {
      team: 'Titans',
      picks: [
        { name: 'Jeremiyah Love', position: 'RB', highlight: false },
        { name: 'Carnell Tate', position: 'WR', highlight: true },
        { name: 'David Bailey', position: 'ED', highlight: false },
        { name: 'Arvell Reese', position: 'ED', highlight: false },
        { name: 'Sonny Styles', position: 'LB', highlight: false },
      ],
    },
    {
      team: 'Giants',
      picks: [
        { name: 'Arvell Reese', position: 'ED', highlight: true },
        { name: 'Jeremiyah Love', position: 'RB', highlight: false },
        { name: 'Jordyn Tyson', position: 'WR', highlight: false },
        { name: 'Sonny Styles', position: 'LB', highlight: false },
      ],
    },
    {
      team: 'Chiefs',
      picks: [
        { name: 'Mansoor Delane', position: 'CB', highlight: true },
        { name: 'Carnell Tate', position: 'WR', highlight: false },
        { name: 'Jordyn Tyson', position: 'WR', highlight: false },
        { name: 'Caleb Downs', position: 'S', highlight: false },
        { name: 'Rueben Bain Jr.', position: 'ED', highlight: false },
      ],
    },
    {
      team: 'Commanders',
      picks: [
        { name: 'Jeremiyah Love', position: 'RB', highlight: false },
        { name: 'Sonny Styles', position: 'LB', highlight: true },
        { name: 'Carnell Tate', position: 'WR', highlight: false },
        { name: 'Mansoor Delane', position: 'CB', highlight: false },
        { name: 'Caleb Downs', position: 'S', highlight: false },
      ],
    },
    {
      team: 'Saints',
      picks: [
        { name: 'Arvell Reese', position: 'ED', highlight: false },
        { name: 'Mansoor Delane', position: 'CB', highlight: false },
        { name: 'Jordyn Tyson', position: 'WR', highlight: true },
        { name: 'Carnell Tate', position: 'WR', highlight: false },
      ],
    },
  ],
  [
    {
      team: 'Browns',
      picks: [
        { name: 'Spencer Fano', position: 'T', highlight: true },
        { name: 'Carnell Tate', position: 'WR', highlight: false },
        { name: 'Francis Mauigoa', position: 'T', highlight: false },
        { name: 'Kadyn Proctor', position: 'T', highlight: false },
        { name: 'Monroe Freeling', position: 'T', highlight: false },
      ],
    },
    {
      team: 'Giants',
      picks: [
        { name: 'Carnell Tate', position: 'WR', highlight: false },
        { name: 'Francis Mauigoa', position: 'T', highlight: true },
        { name: 'Caleb Downs', position: 'S', highlight: false },
        { name: 'Olaivavega Ioane', position: 'G', highlight: false },
      ],
    },
    {
      team: 'Cowboys',
      picks: [
        { name: 'Arvell Reese', position: 'ED', highlight: false },
        { name: 'David Bailey', position: 'ED', highlight: false },
        { name: 'Caleb Downs', position: 'S', highlight: true },
        { name: 'Sonny Styles', position: 'LB', highlight: false },
        { name: 'Mansoor Delane', position: 'CB', highlight: false },
      ],
    },
    {
      team: 'Dolphins',
      picks: [
        { name: 'Mansoor Delane', position: 'CB', highlight: false },
        { name: 'Francis Mauigoa', position: 'T', highlight: false },
        { name: 'Spencer Fano', position: 'T', highlight: false },
        { name: 'Kadyn Proctor', position: 'T', highlight: true },
        { name: 'Carnell Tate', position: 'WR', highlight: false },
      ],
    },
    {
      team: 'Rams',
      picks: [
        { name: 'Ty Simpson', position: 'QB', highlight: true },
        { name: 'Jordyn Tyson', position: 'WR', highlight: false },
        { name: 'Carnell Tate', position: 'WR', highlight: false },
        { name: 'Makai Lemon', position: 'WR', highlight: false },
      ],
    },
    {
      team: 'Ravens',
      picks: [
        { name: 'Olaivavega Ioane', position: 'G', highlight: true },
        { name: 'Rueben Bain Jr.', position: 'ED', highlight: false },
        { name: 'Kenyon Sadiq', position: 'TE', highlight: false },
      ],
    },
    {
      team: 'Buccaneers',
      picks: [
        { name: 'Rueben Bain Jr.', position: 'ED', highlight: true },
        { name: 'Akheem Mesidor', position: 'ED', highlight: false },
      ],
    },
    {
      team: 'Jets',
      picks: [
        { name: 'Carnell Tate', position: 'WR', highlight: false },
        { name: 'Jordyn Tyson', position: 'WR', highlight: false },
        { name: 'Kenyon Sadiq', position: 'TE', highlight: true },
        { name: 'Makai Lemon', position: 'WR', highlight: false },
      ],
    },
  ],
  [
    {
      team: 'Lions',
      picks: [
        { name: 'Rueben Bain Jr.', position: 'ED', highlight: false },
        { name: 'Kadyn Proctor', position: 'T', highlight: false },
        { name: 'Blake Miller', position: 'T', highlight: true },
        { name: 'Monroe Freeling', position: 'T', highlight: false },
      ],
    },
    {
      team: 'Vikings',
      picks: [
        { name: 'Caleb Banks', position: 'DT', highlight: true },
        { name: 'Kenyon Sadiq', position: 'TE', highlight: false },
        { name: 'Dillon Thieneman', position: 'S', highlight: false },
        { name: 'Peter Woods', position: 'DT', highlight: false },
      ],
    },
    {
      team: 'Panthers',
      picks: [
        { name: 'Monroe Freeling', position: 'T', highlight: true },
        { name: 'Blake Miller', position: 'T', highlight: false },
        { name: 'Kenyon Sadiq', position: 'TE', highlight: false },
      ],
    },
    {
      team: 'Eagles',
      picks: [
        { name: 'Jordyn Tyson', position: 'WR', highlight: false },
        { name: 'Kenyon Sadiq', position: 'TE', highlight: false },
        { name: 'Makai Lemon', position: 'WR', highlight: true },
      ],
    },
    {
      team: 'Steelers',
      picks: [
        { name: 'Makai Lemon', position: 'WR', highlight: false },
        { name: 'Olaivavega Ioane', position: 'G', highlight: false },
        { name: 'Max Iheanachor', position: 'T', highlight: true },
      ],
    },
    {
      team: 'Rams',
      picks: [
        { name: 'Olaivavega Ioane', position: 'G', highlight: false },
        { name: 'Akheem Mesidor', position: 'ED', highlight: true },
        { name: 'Peter Woods', position: 'DT', highlight: false },
      ],
    },
    {
      team: 'Cowboys',
      picks: [
        { name: 'Malachi Lawrence', position: 'ED', highlight: true },
        { name: 'Akheem Mesidor', position: 'ED', highlight: false },
      ],
    },
    {
      team: 'Browns',
      picks: [
        { name: 'KC Concepcion', position: 'WR', highlight: true },
        { name: 'Omar Cooper Jr.', position: 'WR', highlight: false },
      ],
    },
  ],
  [
    {
      team: 'Bears',
      picks: [
        { name: 'Dillon Thieneman', position: 'S', highlight: true },
        { name: 'Malachi Lawrence', position: 'ED', highlight: false },
        { name: 'Keldric Faulk', position: 'ED', highlight: false },
      ],
    },
    {
      team: 'Texans',
      picks: [
        { name: 'Keylan Rutledge', position: 'G', highlight: true },
        { name: 'Blake Miller', position: 'T', highlight: false },
        { name: 'Max Iheanachor', position: 'T', highlight: false },
        { name: 'Kayden McDonald', position: 'DT', highlight: false },
      ],
    },
    {
      team: 'Dolphins',
      picks: [{ name: 'Chris Johnson', position: 'CB', highlight: true }],
    },
    {
      team: 'Patriots',
      picks: [
        { name: 'Blake Miller', position: 'T', highlight: false },
        { name: 'Max Iheanachor', position: 'T', highlight: false },
        { name: 'Caleb Lomu', position: 'T', highlight: true },
      ],
    },
    {
      team: 'Chiefs',
      picks: [
        { name: 'Peter Woods', position: 'DT', highlight: true },
        { name: 'Chris Johnson', position: 'CB', highlight: false },
        { name: 'Malachi Lawrence', position: 'ED', highlight: false },
      ],
    },
    {
      team: 'Jets',
      picks: [{ name: 'Omar Cooper Jr.', position: 'WR', highlight: true }],
    },
    {
      team: 'Titans',
      picks: [{ name: 'Keldric Faulk', position: 'ED', highlight: true }],
    },
    {
      team: 'Seahawks',
      picks: [
        { name: 'Chris Johnson', position: 'CB', highlight: false },
        { name: 'Jadarian Price', position: 'RB', highlight: true },
      ],
    },
  ],
]
