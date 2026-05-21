import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const TEAMS = [
  { id: 'SEA', name: 'Seattle Seahawks', conference: 'NFC', division: 'West', capSpace: 18.4, draftPicks: 8, wins: 14 },
  { id: 'KC', name: 'Kansas City Chiefs', conference: 'AFC', division: 'West', capSpace: 12.1, draftPicks: 7, wins: 12 },
  { id: 'DET', name: 'Detroit Lions', conference: 'NFC', division: 'North', capSpace: 22.6, draftPicks: 9, wins: 13 },
  { id: 'PHI', name: 'Philadelphia Eagles', conference: 'NFC', division: 'East', capSpace: 9.8, draftPicks: 6, wins: 11 },
  { id: 'BAL', name: 'Baltimore Ravens', conference: 'AFC', division: 'North', capSpace: 15.3, draftPicks: 8, wins: 12 },
  { id: 'SF', name: 'San Francisco 49ers', conference: 'NFC', division: 'West', capSpace: 11.7, draftPicks: 7, wins: 10 },
]

export const TEAM_NEEDS = {
  SEA: [
    { position: 'EDGE', priority: 'High', note: 'Pass-rush complement opposite offense-first build' },
    { position: 'CB', priority: 'Medium', note: 'Depth behind starters with 2026 cap flexibility' },
    { position: 'IOL', priority: 'Medium', note: 'Interior competition after free agency losses' },
  ],
  KC: [
    { position: 'WR', priority: 'High', note: 'Vertical threat to stress condensed boxes' },
    { position: 'DL', priority: 'Medium', note: 'Rotational help on early downs' },
    { position: 'S', priority: 'Low', note: 'Special teams and dime packages' },
  ],
  DET: [
    { position: 'CB', priority: 'High', note: 'Outside corner with press-man traits' },
    { position: 'LB', priority: 'Medium', note: 'Coverage linebacker in sub packages' },
    { position: 'RB', priority: 'Low', note: 'Change-of-pace behind committee' },
  ],
  PHI: [
    { position: 'OL', priority: 'High', note: 'Tackle depth entering contract years' },
    { position: 'EDGE', priority: 'Medium', note: 'Situational rusher on third down' },
    { position: 'TE', priority: 'Low', note: 'Red-zone mismatch option' },
  ],
  BAL: [
    { position: 'WR', priority: 'High', note: 'Separator on intermediate crossers' },
    { position: 'EDGE', priority: 'Medium', note: 'Set edge in even fronts' },
    { position: 'CB', priority: 'Medium', note: 'Slot match for 11 personnel' },
  ],
  SF: [
    { position: 'QB', priority: 'Medium', note: 'Long-term planning behind starter' },
    { position: 'DL', priority: 'High', note: 'Interior run fits in odd fronts' },
    { position: 'CB', priority: 'Medium', note: 'Outside depth with size/speed' },
  ],
}

export const DEPTH_CHART = {
  SEA: [
    { unit: 'Offense', slots: ['QB: Geno Smith', 'RB: Kenneth Walker III', 'WR1: Jaxon Smith-Njigba', 'LT: Charles Cross'] },
    { unit: 'Defense', slots: ['EDGE: Boye Mafe', 'DT: Leonard Williams', 'LB: Devon Witherspoon', 'CB: Riq Woolen'] },
  ],
  KC: [
    { unit: 'Offense', slots: ['QB: Patrick Mahomes', 'RB: Isiah Pacheco', 'WR1: Xavier Worthy', 'TE: Travis Kelce'] },
    { unit: 'Defense', slots: ['EDGE: George Karlaftis', 'DT: Chris Jones', 'LB: Nick Bolton', 'CB: Trent McDuffie'] },
  ],
  DET: [
    { unit: 'Offense', slots: ['QB: Jared Goff', 'RB: Jahmyr Gibbs', 'WR1: Amon-Ra St. Brown', 'TE: Sam LaPorta'] },
    { unit: 'Defense', slots: ['EDGE: Aidan Hutchinson', 'DT: Alim McNeill', 'LB: Alex Anzalone', 'CB: Brian Branch'] },
  ],
  PHI: [
    { unit: 'Offense', slots: ['QB: Jalen Hurts', 'RB: Saquon Barkley', 'WR1: DeVonta Smith', 'LT: Jordan Mailata'] },
    { unit: 'Defense', slots: ['EDGE: Will Shipley*', 'DT: Jalen Carter', 'LB: Zack Baun', 'CB: Quinyon Mitchell'] },
  ],
  BAL: [
    { unit: 'Offense', slots: ['QB: Lamar Jackson', 'RB: Derrick Henry', 'WR1: Zay Flowers', 'TE: Mark Andrews'] },
    { unit: 'Defense', slots: ['EDGE: Odafe Oweh', 'DT: Nnamdi Madubuike', 'LB: Roquan Smith', 'CB: Marlon Humphrey'] },
  ],
  SF: [
    { unit: 'Offense', slots: ['QB: Brock Purdy', 'RB: Christian McCaffrey', 'WR1: Ricky Pearsall', 'TE: George Kittle'] },
    { unit: 'Defense', slots: ['EDGE: Nick Bosa', 'DT: Javon Hargrave', 'LB: Fred Warner', 'CB: Deommodore Lenoir'] },
  ],
}

export const FREE_AGENTS = [
  { rank: 1, name: 'Micah Parsons', position: 'EDGE', prevTeam: 'DAL', status: 'Signed', newTeam: 'GB', deal: '4 yr / $186M' },
  { rank: 2, name: 'Kenneth Walker III', position: 'RB', prevTeam: 'SEA', status: 'Signed', newTeam: 'KC', deal: '3 yr / $51M' },
  { rank: 3, name: 'James Cook', position: 'RB', prevTeam: 'BUF', status: 'Signed', newTeam: 'MIA', deal: '4 yr / $48M' },
  { rank: 4, name: 'Tyler Lockett', position: 'WR', prevTeam: 'SEA', status: 'Available', newTeam: null, deal: null },
  { rank: 5, name: 'D.J. Reed', position: 'CB', prevTeam: 'NYJ', status: 'Available', newTeam: null, deal: null },
  { rank: 6, name: 'Aaron Rodgers', position: 'QB', prevTeam: 'NYJ', status: 'Available', newTeam: null, deal: null },
]

export const TRANSACTIONS = [
  { date: '2026-03-14', team: 'KC', summary: 'Signed RB Kenneth Walker III', type: 'Signing' },
  { date: '2026-03-13', team: 'GB', summary: 'Signed EDGE Micah Parsons', type: 'Signing' },
  { date: '2026-03-12', team: 'MIA', summary: 'Signed RB James Cook', type: 'Signing' },
  { date: '2026-03-11', team: 'DET', summary: 'Released CB Emmanuel Moseley', type: 'Release' },
  { date: '2026-03-10', team: 'PHI', summary: 'Re-signed LB Zack Baun', type: 'Signing' },
]

const draftBoardJsonPath = join(
  __dirname,
  '..',
  'src',
  'nfl-iq',
  'data',
  'draft-board.mock.json',
)

export const DRAFT_BOARD = JSON.parse(readFileSync(draftBoardJsonPath, 'utf8'))

export const CHAT_SUGGESTIONS = [
  'What are the Seahawks biggest roster needs?',
  'Who are the top available edge rushers?',
  'Explain Next Gen Stats Draft Score',
  'How much cap space do the Lions have?',
]

export const CHAT_RESPONSES = {
  default:
    'Based on roster construction models and cap context, I can break down team needs, free-agent fits, and draft value. Try asking about a specific team or position group.',
  seahawks:
    'Seattle profiles as a contender retooling on defense: EDGE and corner depth are the highest-priority needs, with interior line competition as a secondary focus. Draft capital and ~$18.4M in practical cap space support one significant addition plus depth.',
  edge:
    'Top available EDGE targets in this mock board include D.J. Reed (CB) mislabeled — for pass rush, monitor franchise-tag candidates and day-2 draft tiers with 4.5–4.6 forty times and strong pressure rates.',
  draftscore:
    'Next Gen Stats Draft Score blends athletic testing, production, and model projections into a 0–100 scale — higher scores indicate stronger predicted NFL impact relative to position peers.',
  lions:
    'Detroit enters the window with ~$22.6M cap space and nine picks. Corner is the clearest need; the model favors press-man profiles who can match in the slot early in their careers.',
}
