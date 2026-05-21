export type FreeAgencyHeadline = {
  teamId: string
  teamName: string
  date: string
  accentColor: string
  body: string
}

export const FREE_AGENCY_HEADLINES: FreeAgencyHeadline[] = [
  {
    teamId: 'CIN',
    teamName: 'Bengals',
    date: '4/20',
    accentColor: '#FB4F14',
    body: 'acquire DT Dexter Lawrence from Giants for No. 10 overall pick; Cincinnati also gives Lawrence a 1-year, $28M extension, per NFL Network Insiders Ian Rapoport and Mike Garafolo.',
  },
  {
    teamId: 'JAX',
    teamName: 'Jaguars',
    date: '4/3',
    accentColor: '#101820',
    body: 'sign EDGE Travon Walker to a 4-year, $110M extension with $77M guaranteed.',
  },
  {
    teamId: 'LV',
    teamName: 'Raiders',
    date: '4/2',
    accentColor: '#000000',
    body: 'sign QB Kirk Cousins to what is essentially a fully guaranteed 1-year, $20M deal, per NFL Network Insiders Tom Pelissero and Ian Rapoport.',
  },
  {
    teamId: 'KC',
    teamName: 'Chiefs',
    date: '4/2',
    accentColor: '#E31837',
    body: 'agree to terms with CB Kaiir Elam, per NFL Network Insiders Ian Rapoport and Mike Garafolo.',
  },
]
