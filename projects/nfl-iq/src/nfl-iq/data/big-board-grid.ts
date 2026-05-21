export type BigBoardColumn =
  | 'QB'
  | 'RB'
  | 'WR'
  | 'TE'
  | 'T'
  | 'IOL'
  | 'DT'
  | 'ED'
  | 'LB'
  | 'CB'
  | 'S'

export type BigBoardPlayer = {
  name: string
  tone: 'muted' | 'bold'
  marker?: 'blue' | 'green' | null
}

export type BigBoardRow = {
  tier: string
  cells: Partial<Record<BigBoardColumn, BigBoardPlayer[]>>
}

export const BIG_BOARD_COLUMNS: BigBoardColumn[] = [
  'QB',
  'RB',
  'WR',
  'TE',
  'T',
  'IOL',
  'DT',
  'ED',
  'LB',
  'CB',
  'S',
]

export const BIG_BOARD_ROWS: BigBoardRow[] = [
  {
    tier: 'Top 5',
    cells: {
      QB: [{ name: 'Fernando Mendoza', tone: 'muted' }],
      ED: [{ name: 'David Bailey', tone: 'muted' }],
    },
  },
  {
    tier: 'Top 10',
    cells: {
      RB: [{ name: 'Jeremiyah Love', tone: 'muted', marker: 'blue' }],
      WR: [{ name: 'Carnell Tate', tone: 'muted' }],
      T: [{ name: 'Francis Mauigoa', tone: 'muted' }],
      ED: [{ name: 'Arvell Reese', tone: 'muted' }],
      LB: [{ name: 'Sonny Styles', tone: 'muted', marker: 'blue' }],
      CB: [{ name: 'Mansoor Delane', tone: 'muted' }],
      S: [{ name: 'Caleb Downs', tone: 'muted' }],
    },
  },
  {
    tier: 'Top 15',
    cells: {
      WR: [{ name: 'Jordyn Tyson', tone: 'muted' }],
      T: [{ name: 'Spencer Fano', tone: 'muted', marker: 'green' }],
      IOL: [{ name: 'Olaivavega Ioane', tone: 'muted' }],
      ED: [{ name: 'Rueben Bain Jr.', tone: 'muted' }],
    },
  },
  {
    tier: '1st',
    cells: {
      WR: [{ name: 'Makai Lemon', tone: 'muted' }],
      TE: [{ name: 'Kenyon Sadiq', tone: 'muted', marker: 'blue' }],
      T: [{ name: 'Monroe Freeling', tone: 'muted', marker: 'green' }],
      ED: [{ name: 'Keldric Faulk', tone: 'muted' }],
      CB: [{ name: 'Chris Johnson', tone: 'muted' }],
      S: [{ name: 'Dillon Thieneman', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [{ name: 'Omar Cooper Jr.', tone: 'muted' }],
      T: [{ name: 'Kadyn Proctor', tone: 'muted' }],
    },
  },
  { tier: '', cells: {} },
  {
    tier: '1st-2nd',
    cells: {
      QB: [{ name: 'Ty Simpson', tone: 'muted' }],
      WR: [{ name: 'Denzel Boston', tone: 'muted' }],
      T: [{ name: 'Blake Miller', tone: 'muted', marker: 'green' }],
      DT: [{ name: 'Kayden McDonald', tone: 'muted' }],
      ED: [{ name: 'Akheem Mesidor', tone: 'muted' }],
      CB: [{ name: 'Jermod McCoy', tone: 'muted' }],
      S: [{ name: 'E. McNeil-Warren', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [{ name: 'KC Concepcion', tone: 'muted' }],
      T: [{ name: 'Caleb Lomu', tone: 'muted' }],
      ED: [{ name: 'T.J. Parker', tone: 'muted' }],
      CB: [{ name: 'Colton Hood', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      T: [{ name: 'Max Iheanachor', tone: 'muted' }],
      ED: [{ name: 'Malachi Lawrence', tone: 'muted' }],
      CB: [{ name: 'Avieon Terrell', tone: 'muted' }],
    },
  },
  {
    tier: '2nd',
    cells: {
      RB: [{ name: 'Jadarian Price', tone: 'muted' }],
      WR: [{ name: 'Germie Bernard', tone: 'muted' }],
      TE: [{ name: 'Eli Stowers', tone: 'muted' }],
      IOL: [{ name: 'Keylan Rutledge', tone: 'muted', marker: 'green' }],
      DT: [{ name: 'Peter Woods', tone: 'muted' }],
      ED: [{ name: 'Cashius Howell', tone: 'muted' }],
      LB: [{ name: 'CJ Allen', tone: 'muted' }],
      CB: [{ name: 'Brandon Cisse', tone: 'muted' }],
      S: [{ name: 'Treydan Stukes', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [{ name: 'Antonio Williams', tone: 'muted' }],
      IOL: [{ name: 'Chase Bisontis', tone: 'muted' }],
      DT: [{ name: 'Lee Hunter', tone: 'muted' }],
      ED: [{ name: 'R Mason Thomas', tone: 'muted' }],
      LB: [{ name: 'Anthony Hill Jr.', tone: 'muted' }],
      CB: [{ name: "D'Angelo Ponds", tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      IOL: [{ name: 'Emmanuel Pregnon', tone: 'muted' }],
      DT: [{ name: 'Christen Miller', tone: 'muted' }],
      ED: [{ name: 'Zion Young', tone: 'muted' }],
      LB: [{ name: 'Jacob Rodriguez', tone: 'muted' }],
      CB: [{ name: 'Keionte Scott', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      IOL: [{ name: 'Gennings Dunker', tone: 'muted' }],
      DT: [{ name: 'Caleb Banks', tone: 'muted' }],
      ED: [{ name: 'Gabe Jacas', tone: 'muted' }],
      LB: [{ name: 'Jake Golday', tone: 'muted' }],
      CB: [{ name: 'Daylen Everette', tone: 'muted' }],
    },
  },
  {
    tier: '2nd-3rd',
    cells: {
      WR: [{ name: 'Malachi Fields', tone: 'muted' }],
      T: [{ name: 'Caleb Tiernan', tone: 'muted' }],
      ED: [{ name: 'Derrick Moore', tone: 'muted' }],
      S: [{ name: 'Bud Clark', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [{ name: 'D. Stribling', tone: 'muted' }],
      ED: [{ name: 'Keyron Crawford', tone: 'muted' }],
      S: [{ name: 'A.J. Haulcy', tone: 'muted' }],
    },
  },
  { tier: '', cells: { WR: [{ name: 'Chris Bell', tone: 'muted' }] } },
  {
    tier: '3rd',
    cells: {
      RB: [{ name: 'M. Washington Jr.', tone: 'muted', marker: 'green' }],
      WR: [{ name: 'Deion Burks', tone: 'muted', marker: 'green' }],
      TE: [{ name: 'Oscar Delp', tone: 'muted' }],
      IOL: [{ name: 'Sam Hecht', tone: 'muted' }],
      DT: [{ name: 'Tyler Onyedim', tone: 'muted' }],
      ED: [{ name: 'J. Barham', tone: 'muted' }],
      LB: [{ name: 'Kyle Louis', tone: 'muted' }],
      CB: [{ name: 'Tacario Davis', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [{ name: 'Elijah Sarratt', tone: 'muted' }],
      TE: [{ name: 'Max Klare', tone: 'muted' }],
      IOL: [{ name: 'Logan Jones', tone: 'muted' }],
      LB: [{ name: 'Josiah Trotter', tone: 'muted' }],
      CB: [{ name: 'Keith Abney II', tone: 'muted' }],
    },
  },
  { tier: '', cells: { WR: [{ name: 'Ted Hurst', tone: 'muted' }] } },
  {
    tier: '3rd-4th',
    cells: {
      QB: [{ name: 'Carson Beck', tone: 'muted' }],
      WR: [{ name: 'Chris Brazzell II', tone: 'muted' }],
      TE: [{ name: 'Sam Roush', tone: 'muted' }],
      T: [{ name: 'Markel Bell', tone: 'muted' }],
      IOL: [{ name: 'Jalen Farmer', tone: 'muted', marker: 'green' }],
      DT: [{ name: 'Chris McClellan', tone: 'muted' }],
      ED: [{ name: 'Joshua Josephs', tone: 'muted' }],
      CB: [{ name: 'Julian Neal', tone: 'muted' }],
      S: [{ name: 'Jalon Kilgore', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      QB: [{ name: 'Garrett Nussmeier', tone: 'muted' }],
      WR: [{ name: 'Zachariah Branch', tone: 'muted' }],
      TE: [{ name: 'Marlin Klein', tone: 'muted' }],
      T: [{ name: 'Travis Burke', tone: 'muted' }],
      IOL: [{ name: 'Jake Slaughter', tone: 'muted' }],
      DT: [{ name: 'Kaleb Proctor', tone: 'muted' }],
      ED: [{ name: 'D. Dennis-Sutton', tone: 'muted', marker: 'green' }],
      CB: [{ name: 'Malik Muhammad', tone: 'muted' }],
      S: [{ name: 'Genesis Smith', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [{ name: 'Brenen Thompson', tone: 'muted' }],
      T: [{ name: 'Austin Barber', tone: 'muted' }],
      DT: [{ name: 'Domonique Orange', tone: 'muted' }],
      ED: [{ name: 'Romello Height', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: { WR: [{ name: 'Bryce Lance', tone: 'muted', marker: 'green' }] },
  },
  {
    tier: '4th',
    cells: {
      QB: [{ name: 'Drew Allar', tone: 'muted' }],
      RB: [{ name: 'N. Singleton', tone: 'muted', marker: 'green' }],
      WR: [{ name: 'Kendrick Law', tone: 'muted' }],
      TE: [{ name: 'Eli Raridon', tone: 'muted' }],
      T: [{ name: 'D. Crownover', tone: 'muted' }],
      IOL: [{ name: 'Febechi Nwalwu', tone: 'muted' }],
      DT: [{ name: 'Gracen Halton', tone: 'muted' }],
      ED: [{ name: 'Max Llewellyn', tone: 'muted' }],
      LB: [{ name: 'Bryce Boettcher', tone: 'muted' }],
      CB: [{ name: 'Devin Moore', tone: 'muted' }],
      S: [{ name: 'Kamari Ramsey', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      RB: [{ name: 'Emmett Johnson', tone: 'muted' }],
      WR: [{ name: 'Skyler Bell', tone: 'muted' }],
      TE: [{ name: 'Will Kacmarek', tone: 'muted' }],
      IOL: [{ name: 'Brian Parker II', tone: 'muted' }],
      DT: [{ name: 'Zane Durant', tone: 'muted', marker: 'green' }],
      LB: [{ name: 'H. Perkins Jr.', tone: 'muted' }],
      CB: [{ name: 'Chandler Rivers', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [{ name: "Ja'Kobi Lane", tone: 'muted' }],
      TE: [{ name: 'Justin Joly', tone: 'muted' }],
      IOL: [{ name: 'Parker Brailsford', tone: 'muted' }],
      LB: [{ name: 'Kaleb Elarms-Orr', tone: 'muted' }],
      CB: [{ name: 'Jadon Canady', tone: 'muted' }],
    },
  },
  {
    tier: '4th-5th',
    cells: {
      QB: [{ name: 'Cole Payton', tone: 'muted' }],
      RB: [{ name: 'Jonah Coleman', tone: 'muted' }],
      WR: [{ name: 'Josh Cameron', tone: 'muted' }],
      TE: [{ name: 'Michael Trigg', tone: 'bold' }],
      T: [{ name: 'Kage Casey', tone: 'muted' }],
      IOL: [{ name: 'Beau Stephens', tone: 'muted' }],
      DT: [{ name: 'Rayshaun Benny', tone: 'muted' }],
      ED: [{ name: 'Caden Curry', tone: 'muted' }],
      LB: [{ name: 'Justin Jefferson', tone: 'muted' }],
      CB: [{ name: 'Charles Demmings', tone: 'muted' }],
      S: [{ name: 'L. Styles Jr.', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      QB: [{ name: 'Cade Klubnik', tone: 'muted' }],
      RB: [{ name: 'Kaytron Allen', tone: 'muted' }],
      WR: [{ name: 'Caleb Douglas', tone: 'muted' }],
      TE: [{ name: 'Nate Boerkircher', tone: 'muted' }],
      T: [{ name: 'Diego Pounds', tone: 'bold' }],
      IOL: [{ name: 'Billy Schrauth', tone: 'muted' }],
      DT: [{ name: 'Albert Regis', tone: 'muted' }],
      ED: [{ name: 'Anthony Lucas', tone: 'muted' }],
      LB: [{ name: 'Wade Woodaz', tone: 'muted' }],
      CB: [{ name: 'Davison Igbinosun', tone: 'muted' }],
      S: [{ name: 'Jalen Huskey', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      RB: [{ name: 'Demond Claiborne', tone: 'muted' }],
      WR: [{ name: 'Jeff Caldwell', tone: 'muted', marker: 'green' }],
      TE: [{ name: 'Dallen Bentley', tone: 'muted' }],
      IOL: [{ name: 'Alex Harkey', tone: 'muted' }],
      DT: [{ name: 'D. Jackson Jr.', tone: 'muted' }],
      ED: [{ name: 'Nadame Tucker', tone: 'bold' }],
      LB: [{ name: 'Aiden Fisher', tone: 'muted' }],
      CB: [{ name: 'Will Lee III', tone: 'muted' }],
      S: [{ name: 'Bishop Fitzgerald', tone: 'bold' }],
    },
  },
  {
    tier: '',
    cells: {
      TE: [{ name: 'Jack Endries', tone: 'muted' }],
      IOL: [{ name: 'Anez Cooper', tone: 'muted' }],
      DT: [{ name: 'DeMonte Capehart', tone: 'muted' }],
      ED: [{ name: 'LT Overton', tone: 'muted' }],
      LB: [{ name: 'Keyshaun Elliott', tone: 'muted' }],
      CB: [{ name: 'Domani Jackson', tone: 'muted' }],
      S: [{ name: 'VJ Payne', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      IOL: [{ name: 'Logan Taylor', tone: 'muted' }],
      DT: [{ name: 'Dontay Corleone', tone: 'bold' }],
      ED: [{ name: 'Logan Fano', tone: 'bold' }],
      LB: [{ name: 'Jimmy Rolder', tone: 'muted' }],
      CB: [{ name: 'Thaddeus Dixon', tone: 'bold' }],
      S: [{ name: 'Zakee Wheatley', tone: 'muted' }],
    },
  },
  {
    tier: '5th-6th',
    cells: {
      QB: [{ name: 'Taylen Green', tone: 'muted', marker: 'green' }],
      RB: [{ name: 'Adam Randall', tone: 'muted' }],
      WR: [{ name: 'CJ Daniels', tone: 'muted' }],
      TE: [{ name: 'Tanner Koziol', tone: 'muted' }],
      T: [{ name: 'Aamil Wagner', tone: 'bold' }],
      IOL: [{ name: 'DJ Campbell', tone: 'muted' }],
      DT: [{ name: 'Nick Barrett', tone: 'muted' }],
      ED: [{ name: 'Aidan Hubbard', tone: 'bold' }],
      LB: [{ name: 'Taurean York', tone: 'bold' }],
      CB: [{ name: 'Andre Fuller', tone: 'muted' }],
      S: [{ name: 'Michael Taaffe', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      RB: [{ name: 'Eli Heidenreich', tone: 'muted' }],
      WR: [{ name: 'J. Michael Sturmotion', tone: 'bold' }],
      TE: [{ name: 'Joe Royer', tone: 'muted' }],
      T: [{ name: 'Drew Shelton', tone: 'muted' }],
      IOL: [{ name: 'Jager Burton', tone: 'muted', marker: 'green' }],
      DT: [{ name: 'Tim Keenan III', tone: 'muted' }],
      ED: [{ name: 'Trey Moore', tone: 'muted' }],
      LB: [{ name: 'Jack Kelly', tone: 'muted' }],
      CB: [{ name: 'Ephesians Prysock', tone: 'muted' }],
      S: [{ name: 'Dalton Johnson', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      RB: [{ name: 'Seth McGowan', tone: 'muted' }],
      WR: [{ name: 'Colbie Young', tone: 'muted' }],
      TE: [{ name: 'Josh Cuevas', tone: 'muted' }],
      T: [{ name: 'Jude Bowry', tone: 'muted' }],
      ED: [{ name: 'Tyreak Sapp', tone: 'bold' }],
      LB: [{ name: 'Red Murdock', tone: 'muted' }],
      CB: [{ name: 'Latrell McCutchin', tone: 'bold' }],
      S: [{ name: 'DeShon Singleton', tone: 'bold' }],
    },
  },
  {
    tier: '',
    cells: {
      RB: [{ name: "Le'Veon Moss", tone: 'bold' }],
      WR: [{ name: 'Malik Benson', tone: 'muted' }],
      TE: [{ name: 'Riley Nowakowski', tone: 'muted' }],
      T: [{ name: 'J.C. Davis', tone: 'muted' }],
      ED: [{ name: 'Mason Reiger', tone: 'bold' }],
      CB: [{ name: 'Ahmari Harvey', tone: 'bold' }],
      S: [{ name: 'R. Spears-Jennings', tone: 'muted' }],
    },
  },
  {
    tier: '',
    cells: {
      WR: [
        { name: 'Kevin Coleman Jr.', tone: 'muted' },
        { name: 'Reggie Virgil', tone: 'muted' },
      ],
      T: [{ name: 'Isaiah World', tone: 'bold' }],
      ED: [
        { name: 'George Gumbs Jr.', tone: 'muted' },
        { name: 'Wesley Williams', tone: 'muted' },
      ],
      CB: [{ name: 'Hezekiah Masses', tone: 'muted' }],
      S: [{ name: 'Jakobe Thomas', tone: 'muted' }],
    },
  },
  {
    tier: '6th-7th',
    cells: {
      QB: [{ name: 'Haynes King', tone: 'muted', marker: 'green' }],
      RB: [{ name: 'Desmond Reid', tone: 'bold' }],
      WR: [{ name: 'Aaron Anderson', tone: 'bold' }],
      TE: [{ name: 'Bauer Sharp', tone: 'muted' }],
      T: [{ name: 'Keagen Trost', tone: 'muted' }],
      IOL: [{ name: "Ar'maj Reed-Adams", tone: 'muted' }],
      DT: [{ name: 'David Gusta', tone: 'muted', marker: 'green' }],
      ED: [{ name: 'V. Anthony Jr.', tone: 'muted' }],
      LB: [{ name: 'Deontae Lawson', tone: 'bold' }],
      CB: [{ name: 'Collin Wright', tone: 'bold' }],
      S: [{ name: 'Ahmaad Moses', tone: 'bold' }],
    },
  },
  {
    tier: '7th',
    cells: {
      QB: [{ name: 'Behren Morton', tone: 'muted' }],
      RB: [{ name: 'Max Bredeson', tone: 'muted' }],
      WR: [{ name: 'Zavion Thomas', tone: 'muted' }],
      TE: [{ name: "Dae'Quan Wright", tone: 'bold' }],
      T: [{ name: 'Alan Herron', tone: 'bold' }],
      IOL: [{ name: 'Fernando Carmona', tone: 'muted' }],
      DT: [{ name: 'Bryson Eason', tone: 'bold' }],
      LB: [{ name: 'Owen Heinecke', tone: 'bold' }],
      CB: [{ name: 'Toriano Pride Jr.', tone: 'muted' }],
      S: [{ name: 'Louis Moore', tone: 'bold' }],
    },
  },
  {
    tier: '',
    cells: {
      QB: [{ name: 'Jalon Daniels', tone: 'bold' }],
      RB: [{ name: "J'Mari Taylor", tone: 'muted' }],
      WR: [{ name: 'H. Wallace III', tone: 'bold' }],
      TE: [{ name: 'J. Michael Gyllenborg', tone: 'muted' }],
      T: [{ name: "Fa'alili Fa'amoe", tone: 'muted' }],
      IOL: [{ name: 'Jeremiah Wright', tone: 'muted' }],
      DT: [{ name: 'S. Gill-Howard', tone: 'muted' }],
      CB: [{ name: 'TJ Hall', tone: 'muted' }],
    },
  },
]
