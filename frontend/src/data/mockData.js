export const ROLES = [
  {
    id: 'guest',
    label: 'Guest (Public)',
    shortLabel: 'Guest',
    description: 'Browse public clubs, open events, and the association ladder.',
    userName: null,
    initials: null,
  },
  {
    id: 'player',
    label: 'Player',
    shortLabel: 'Player',
    description: 'Books courts, registers for events, manages their own profile.',
    userName: 'Alex Moreno',
    initials: 'AM',
  },
  {
    id: 'admin',
    label: 'Club Admin',
    shortLabel: 'Admin',
    description: 'Full access to their club; the only role that can assign officers.',
    userName: 'Alex Moreno',
    initials: 'AM',
  },
  {
    id: 'treasurer',
    label: 'Treasurer',
    shortLabel: 'Treasurer',
    description: 'Members & dues records.',
    userName: 'Ruth Abad',
    initials: 'RA',
  },
  {
    id: 'scheduler',
    label: 'Scheduler',
    shortLabel: 'Scheduler',
    description: 'Court bookings & availability.',
    userName: 'Teodoro Santos',
    initials: 'TS',
  },
  {
    id: 'tournament_handler',
    label: 'Tournament handler',
    shortLabel: 'Tournament handler',
    description: 'Tournament setup & brackets.',
    userName: 'Dana Villanueva',
    initials: 'DV',
  },
]

export const CLUBS = [
  {
    id: 'pf',
    code: 'PF',
    name: 'Peñafrancia Pickleball Club',
    shortName: 'Peñafrancia',
    barangay: 'Brgy. Peñafrancia',
    area: 'Centro',
    feeSummary: '₱1,200–₱8,000/yr',
    gcashNumber: '0917 201 4410',
    tagline: 'Six lit courts a short walk from the Basilica.',
    description:
      'Peñafrancia Pickleball Club runs 6 dedicated courts with a volunteer board of five officers. We host weekday socials, a monthly ladder, and one association-sanctioned tournament each season. New players get a free intro clinic.',
    courtsCount: 6,
    membersCount: 214,
    since: 2016,
    email: 'hello@penafranciapickle.ph',
    phone: '0917 201 4410',
    address: 'Peñafrancia Sports Complex, Brgy. Peñafrancia, Naga City',
    mapPos: { x: 48, y: 42 },
    plans: [
      {
        id: 'junior',
        name: 'Junior',
        price: '₱1,200',
        amountNum: 1200,
        perks: ['Under 18 · student ID', 'Weekday open play', 'Junior clinics'],
      },
      {
        id: 'standard',
        name: 'Standard',
        price: '₱3,600',
        amountNum: 3600,
        featured: true,
        perks: ['Book 7 days ahead', 'All open play', 'Ladder & ratings'],
      },
      {
        id: 'premier',
        name: 'Premier',
        price: '₱6,000',
        amountNum: 6000,
        perks: ['Book 14 days ahead', '2 guest passes / mo', 'Tournament fee −20%'],
      },
      {
        id: 'family',
        name: 'Family',
        price: '₱8,000',
        amountNum: 8000,
        perks: ['Up to 4 members', 'Shared booking pool', 'Junior clinics'],
      },
    ],
    faqs: [
      {
        q: 'Can guests play?',
        a: 'Yes — members may bring guests for ₱150 per session, up to twice a month.',
      },
      {
        q: 'I belong to another association club.',
        a: 'Your NCPA rating carries over automatically. You can book open-play guest slots or join Peñafrancia as a secondary club.',
      },
      {
        q: 'How are ratings calculated?',
        a: 'Association ratings update from verified singles and doubles matches. Cross-club matches carry higher weighting.',
      },
    ],
  },
  {
    id: 'rs',
    code: 'RS',
    name: 'Riverside Paddle Club',
    shortName: 'Riverside',
    barangay: 'Brgy. Sabang',
    area: 'Naga River',
    feeSummary: '₱1,000–₱5,400/yr',
    gcashNumber: '0918 552 1039',
    tagline: 'Dinks by the Naga River, drives at sunset.',
    description:
      'Located beside the Naga River esplanade, Riverside hosts evening social mixers, beginner coaching, and Sunset Shootout tournaments.',
    courtsCount: 4,
    membersCount: 138,
    since: 2019,
    email: 'play@riversidepaddle.ph',
    phone: '0918 552 1039',
    address: 'Sabang Riverfront Courts, Brgy. Sabang, Naga City',
    mapPos: { x: 30, y: 61 },
    plans: [
      {
        id: 'junior',
        name: 'Junior',
        price: '₱1,000',
        amountNum: 1000,
        perks: ['Under 18 · student ID', 'Weekday open play', 'Junior clinics'],
      },
      {
        id: 'standard',
        name: 'Standard',
        price: '₱3,200',
        amountNum: 3200,
        featured: true,
        perks: ['Book 7 days ahead', 'All open play', 'Ladder & ratings'],
      },
      {
        id: 'premier',
        name: 'Premier',
        price: '₱5,400',
        amountNum: 5400,
        perks: ['Book 14 days ahead', '2 guest passes / mo', 'Tournament fee −20%'],
      },
    ],
    faqs: [
      {
        q: 'Can guests play?',
        a: 'Guests are welcome during open play sessions for ₱150/session with a sponsoring member.',
      },
      {
        q: 'Are paddles available to rent?',
        a: 'Loaner paddles and balls are available at the court desk for ₱50 per session.',
      },
    ],
  },
  {
    id: 'cd',
    code: 'CD',
    name: 'Concepcion Dink Society',
    shortName: 'Concepcion',
    barangay: 'Brgy. Concepcion Pequeña',
    area: 'Uptown',
    feeSummary: '₱3,800–₱6,200/yr',
    gcashNumber: '0917 889 3320',
    tagline: 'Covered courts — habagat season, no problem.',
    description:
      'Five roofed indoor-outdoor courts in Uptown Naga, built for year-round play rain or shine. Home of the annual NCPA Inter-Club Open.',
    courtsCount: 5,
    membersCount: 176,
    since: 2021,
    email: 'hello@concepciondink.ph',
    phone: '0917 889 3320',
    address: 'Concepcion Pequeña Covered Sports Hub, Naga City',
    mapPos: { x: 65, y: 69 },
    plans: [
      {
        id: 'standard',
        name: 'Standard',
        price: '₱3,800',
        amountNum: 3800,
        featured: true,
        perks: ['Covered courts access', 'Book 7 days ahead', 'Ladder & ratings'],
      },
      {
        id: 'premier',
        name: 'Premier',
        price: '₱6,200',
        amountNum: 6200,
        perks: ['Book 14 days ahead', '2 guest passes / mo', 'Priority open play'],
      },
    ],
    faqs: [
      {
        q: 'Are courts playable during heavy rain?',
        a: 'Yes, all 5 courts are fully roofed with high-bay LED lighting.',
      },
    ],
  },
  {
    id: 'ih',
    code: 'IH',
    name: 'Isarog Highlands PC',
    shortName: 'Isarog',
    barangay: 'Brgy. Panicuason',
    area: 'Highlands',
    feeSummary: '₱2,800/yr',
    gcashNumber: '0920 441 7811',
    tagline: 'Cool air at the foot of Mt. Isarog.',
    description:
      'The newest member of NCPA with three scenic hillside courts and cool mountain breeze sessions every morning and weekend.',
    courtsCount: 3,
    membersCount: 92,
    since: 2023,
    email: 'hello@isarogpickle.ph',
    phone: '0920 441 7811',
    address: 'Panicuason Eco-Sports Ground, Brgy. Panicuason, Naga City',
    mapPos: { x: 83, y: 24 },
    plans: [
      {
        id: 'standard',
        name: 'Standard',
        price: '₱2,800',
        amountNum: 2800,
        featured: true,
        perks: ['Book 7 days ahead', 'Morning social play', 'Ladder & ratings'],
      },
    ],
    faqs: [
      {
        q: 'What are peak hours?',
        a: 'Early morning 6am–10am and late afternoon 4pm–8pm are most popular.',
      },
    ],
  },
]

export const ASSOCIATION_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    scope: 'association',
    source: 'Association',
    date: 'Oct 6',
    title: 'NCPA Inter-Club Open registration is open',
    body: 'Hosted by Concepcion. All four clubs eligible; mixed and gender doubles 3.0–4.5+.',
  },
  {
    id: 'ann-2',
    scope: 'association',
    source: 'Association',
    date: 'Oct 2',
    title: 'New rating engine goes live Nov 1',
    body: 'Ratings will now weight cross-club matches higher. Your history carries over.',
  },
  {
    id: 'ann-3',
    scope: 'association',
    source: 'Association',
    date: 'Sep 28',
    title: 'Isarog Highlands joins the association',
    body: 'Welcome to 92 new players and three hillside courts in Panicuason.',
  },
]

export const INITIAL_CLUB_ANNOUNCEMENTS = [
  {
    id: 'cann-1',
    clubId: 'pf',
    date: 'Oct 5',
    audience: 'Members only',
    title: 'Court 6 resurfacing Wed–Thu',
    body: 'Shown as closed on the schedule. Back Friday morning.',
  },
  {
    id: 'cann-2',
    clubId: 'pf',
    date: 'Oct 1',
    audience: 'Members only',
    title: 'Q4 dues now open',
    body: 'Renew before Oct 31 to keep booking priority.',
  },
]

export const CLUB_CALENDAR_EVENTS = [
  {
    id: 'ce-1',
    clubId: 'pf',
    day: 'Today',
    time: '6:00–8:00pm',
    title: 'Evening Open Play · 3.5+',
    detail: 'Courts 1–2 · 9 of 16 spots',
    badge: 'Open play',
    badgeVariant: 'openPlay',
  },
  {
    id: 'ce-2',
    clubId: 'pf',
    day: 'Sat 10',
    time: '9:00am–4:00pm',
    title: 'Ladder Finals block',
    detail: 'Courts 1–3 reserved',
    badge: 'Tournament',
    badgeVariant: 'tournament',
  },
  {
    id: 'ce-3',
    clubId: 'pf',
    day: 'Mon 12',
    time: '9:00–11:00am',
    title: 'Morning Social · All levels',
    detail: 'Courts 3–4 · 4 of 16 spots',
    badge: 'Open play',
    badgeVariant: 'openPlay',
  },
]

export const INITIAL_TOURNAMENTS = [
  {
    id: 't-open',
    title: 'NCPA Inter-Club Open',
    status: 'upcoming',
    visibility: 'public',
    hostClubId: 'cd',
    dateLabel: 'Oct 24–26',
    bracketDate: 'Oct 22',
    registeredTeams: 58,
    maxTeams: 64,
    fee: '₱800',
    scopeLabel: 'Cross-club',
    divisions: [
      { id: 'm35', name: 'Mixed 3.5', minRating: 3.0, maxRating: 3.75, format: 'Double elim · games to 11', registered: 12, max: 16, status: 'Open' },
      { id: 'm40', name: 'Mixed 4.0', minRating: 3.75, maxRating: 4.5, format: 'Double elim · games to 11', registered: 13, max: 16, status: 'Open' },
      { id: 'men45', name: "Men's 4.5+", minRating: 4.2, maxRating: 5.5, format: 'Double elim · games to 11', registered: 16, max: 16, status: 'Full · waitlist' },
      { id: 'women40', name: "Women's 4.0", minRating: 3.5, maxRating: 4.5, format: 'Double elim · games to 11', registered: 15, max: 16, status: 'Open' },
    ],
    bracket: [
      {
        round: 'Quarterfinals',
        matches: [
          { id: 'qf1', teamA: 'Villanueva / Santos (PF)', scoreA: 11, teamB: 'Hidalgo / Gonzaga (IH)', scoreB: 6, winner: 'A' },
          { id: 'qf2', teamA: 'Bautista / Dimaano (RS)', scoreA: 11, teamB: 'Aquino / Ng (RS/PF)', scoreB: 8, winner: 'A' },
          { id: 'qf3', teamA: 'Reyes / Abrenica (CD)', scoreA: 11, teamB: 'Castillo / Pascual (CD)', scoreB: 7, winner: 'A' },
          { id: 'qf4', teamA: 'Moreno / Javier (PF)', scoreA: null, teamB: 'Cortez / Pineda (PF)', scoreB: null, winner: null },
        ],
      },
      {
        round: 'Semifinals',
        matches: [
          { id: 'sf1', teamA: 'Villanueva / Santos (PF)', scoreA: null, teamB: 'Bautista / Dimaano (RS)', scoreB: null, winner: null },
          { id: 'sf2', teamA: 'Reyes / Abrenica (CD)', scoreA: null, teamB: 'Winner QF4', scoreB: null, winner: null },
        ],
      },
      {
        round: 'Final',
        matches: [
          { id: 'f1', teamA: 'Winner SF1', scoreA: null, teamB: 'Winner SF2', scoreB: null, winner: null },
        ],
      },
    ],
    schedule: [
      { time: 'Oct 24 · 8:30am', court: 'Concepcion C1–C4', match: 'Mixed 3.5 Round of 16 & QF' },
      { time: 'Oct 24 · 1:00pm', court: 'Concepcion C1–C4', match: "Women's 4.0 Pool & Bracket" },
      { time: 'Oct 25 · 9:00am', court: 'Concepcion C1–C5', match: 'Mixed 4.0 & Men’s 4.5+ Bracket' },
      { time: 'Oct 26 · 2:00pm', court: 'Concepcion Show Court C1', match: 'All Division Finals & Medal Ceremony' },
    ],
    standings: [
      { seed: 1, team: 'Villanueva / Santos', club: 'PF', w: 3, l: 0, diff: '+18' },
      { seed: 2, team: 'Bautista / Dimaano', club: 'RS', w: 3, l: 0, diff: '+14' },
      { seed: 3, team: 'Reyes / Abrenica', club: 'CD', w: 2, l: 1, diff: '+9' },
      { seed: 4, team: 'Moreno / Javier', club: 'PF', w: 2, l: 1, diff: '+6' },
    ],
  },
  {
    id: 't-sunset',
    title: 'Riverside Sunset Shootout',
    status: 'upcoming',
    visibility: 'public',
    hostClubId: 'rs',
    dateLabel: 'Nov 8',
    bracketDate: 'Nov 6',
    registeredTeams: 22,
    maxTeams: 32,
    fee: '₱600',
    scopeLabel: 'Open to all clubs',
    divisions: [
      { id: 'open35', name: 'Open Doubles 3.5', minRating: 3.0, maxRating: 3.9, format: 'Round robin + playoff', registered: 12, max: 16, status: 'Open' },
      { id: 'open40', name: 'Open Doubles 4.0+', minRating: 3.8, maxRating: 5.0, format: 'Round robin + playoff', registered: 10, max: 16, status: 'Open' },
    ],
    bracket: [],
    schedule: [
      { time: 'Nov 8 · 3:30pm', court: 'Riverside C1–C4', match: 'Pool Play Rounds 1–3' },
      { time: 'Nov 8 · 6:30pm', court: 'Riverside C1–C2', match: 'Sunset Finals under the lights' },
    ],
    standings: [],
  },
  {
    id: 't-mixer',
    title: "Peñafrancia Members' Mixer",
    status: 'upcoming',
    visibility: 'private',
    hostClubId: 'pf',
    dateLabel: 'Oct 17',
    bracketDate: 'Oct 15',
    registeredTeams: 23,
    maxTeams: 32,
    fee: '₱350',
    closesIn: 'Closes in 10 days',
    scopeLabel: 'Private · Peñafrancia only',
    divisions: [
      { id: 'm30', name: 'Mixed 3.0', minRating: 2.5, maxRating: 3.5, format: 'Round robin · games to 11', registered: 9, max: 16, status: 'Open' },
      { id: 'm35', name: 'Mixed 3.5', minRating: 3.25, maxRating: 4.25, format: 'Round robin · games to 11', registered: 14, max: 16, status: 'Open' },
    ],
    bracket: [],
    schedule: [
      { time: 'Oct 17 · 8:00am', court: 'Peñafrancia C1–C5', match: 'Mixed 3.0 & 3.5 Pool Play' },
    ],
    standings: [],
  },
  {
    id: 't-ladder',
    title: 'Peñafrancia Ladder Finals',
    status: 'in_progress',
    visibility: 'private',
    hostClubId: 'pf',
    dateLabel: 'Today, 9:00',
    bracketDate: 'Oct 7',
    registeredTeams: 16,
    maxTeams: 16,
    fee: '₱300',
    scopeLabel: 'Private · Peñafrancia only',
    divisions: [
      { id: 'top16', name: 'Club Top 16', minRating: 3.5, maxRating: 5.5, format: 'Single elim · best of 3', registered: 16, max: 16, status: 'In progress' },
    ],
    bracket: [
      {
        round: 'Semifinals',
        matches: [
          { id: 'lsf1', teamA: 'Dana Villanueva', scoreA: 11, teamB: 'Sam Javier', scoreB: 5, winner: 'A' },
          { id: 'lsf2', teamA: 'Teodoro Santos', scoreA: 11, teamB: 'Alex Moreno', scoreB: 9, winner: 'A' },
        ],
      },
      {
        round: 'Final',
        matches: [
          { id: 'lf1', teamA: 'Dana Villanueva', scoreA: null, teamB: 'Teodoro Santos', scoreB: null, winner: null },
        ],
      },
    ],
    schedule: [
      { time: 'Today · 2:30pm', court: 'Peñafrancia C1', match: 'Championship Final: Villanueva vs Santos' },
    ],
    standings: [
      { seed: 1, team: 'Dana Villanueva', club: 'PF', w: 3, l: 0, diff: '+19' },
      { seed: 2, team: 'Teodoro Santos', club: 'PF', w: 3, l: 0, diff: '+11' },
    ],
  },
  {
    id: 't-summer',
    title: 'Summer Smash',
    status: 'completed',
    visibility: 'public',
    hostClubId: 'pf',
    dateLabel: 'Aug 16–17',
    bracketDate: 'Aug 14',
    registeredTeams: 48,
    maxTeams: 48,
    fee: '₱700',
    scopeLabel: 'Open to all clubs',
    divisions: [
      { id: 'sm35', name: 'Mixed 3.5', minRating: 3.0, maxRating: 3.75, format: 'Double elim', registered: 16, max: 16, status: 'Completed' },
      { id: 'sm40', name: 'Open 4.0+', minRating: 3.8, maxRating: 5.5, format: 'Double elim', registered: 16, max: 16, status: 'Completed' },
    ],
    bracket: [],
    schedule: [],
    standings: [
      { seed: 1, team: 'Villanueva / Santos', club: 'PF', w: 5, l: 0, diff: '+31' },
      { seed: 2, team: 'Reyes / Abrenica', club: 'CD', w: 4, l: 1, diff: '+17' },
    ],
  },
]

export const LEADERBOARD_PLAYERS = [
  { id: 'p-dv', rank: 1, initials: 'DV', name: 'Dana Villanueva', phone: '0917 310 1101', clubId: 'pf', rating: 4.82, singlesRating: 4.74, played: 64, winPct: 78, form: ['W', 'W', 'W', 'L', 'W'], duesStatus: 'Paid' },
  { id: 'p-mb', rank: 2, initials: 'MB', name: 'Marco Bautista', phone: '0918 220 4412', clubId: 'rs', rating: 4.71, singlesRating: 4.66, played: 58, winPct: 74, form: ['W', 'L', 'W', 'W', 'W'], duesStatus: 'Paid' },
  { id: 'p-pr', rank: 3, initials: 'PR', name: 'Patricia Reyes', phone: '0917 812 9087', clubId: 'cd', rating: 4.65, singlesRating: 4.52, played: 71, winPct: 70, form: ['W', 'W', 'L', 'W', 'W'], duesStatus: 'Paid' },
  { id: 'p-ts', rank: 4, initials: 'TS', name: 'Teodoro Santos', phone: '0917 501 2345', clubId: 'pf', rating: 4.58, singlesRating: 4.49, played: 49, winPct: 69, form: ['L', 'W', 'W', 'W', 'L'], duesStatus: 'Due soon' },
  { id: 'p-rd', rank: 5, initials: 'RD', name: 'Rosa Dimaano', phone: '0919 332 7781', clubId: 'rs', rating: 4.44, singlesRating: 4.35, played: 66, winPct: 65, form: ['W', 'W', 'L', 'L', 'W'], duesStatus: 'Paid' },
  { id: 'p-ja', rank: 6, initials: 'JA', name: 'Jun Abrenica', phone: '0920 445 8812', clubId: 'cd', rating: 4.39, singlesRating: 4.28, played: 40, winPct: 63, form: ['W', 'L', 'W', 'L', 'W'], duesStatus: 'Paid' },
  { id: 'p-am', rank: 7, initials: 'AM', name: 'Alex Moreno', phone: '0917 440 2026', clubId: 'pf', isYou: true, rating: 4.21, singlesRating: 4.12, played: 52, winPct: 60, form: ['L', 'W', 'W', 'L', 'W'], duesStatus: 'Paid' },
  { id: 'p-kg', rank: 8, initials: 'KG', name: 'Kaye Gonzaga', phone: '0917 778 1902', clubId: 'ih', rating: 4.12, singlesRating: 4.04, played: 37, winPct: 59, form: ['W', 'W', 'W', 'W', 'L'], duesStatus: 'Paid' },
  { id: 'p-sj', rank: 9, initials: 'SJ', name: 'Sam Javier', phone: '0918 640 3119', clubId: 'pf', rating: 3.94, singlesRating: 3.88, played: 44, winPct: 55, form: ['L', 'L', 'W', 'W', 'W'], duesStatus: 'Overdue' },
  { id: 'p-nc', rank: 10, initials: 'NC', name: 'Nora Castillo', phone: '0917 912 6640', clubId: 'cd', rating: 3.81, singlesRating: 3.74, played: 60, winPct: 52, form: ['W', 'L', 'L', 'W', 'L'], duesStatus: 'Paid' },
  { id: 'p-ba', rank: 11, initials: 'BA', name: 'Ben Aquino', phone: '0921 118 4501', clubId: 'rs', rating: 3.62, singlesRating: 3.55, played: 31, winPct: 48, form: ['L', 'W', 'L', 'W', 'W'], duesStatus: 'Paid' },
  { id: 'p-lf', rank: 12, initials: 'LF', name: 'Lucia Fernandez', phone: '0917 229 8830', clubId: 'pf', rating: 3.47, singlesRating: 3.41, played: 28, winPct: 46, form: ['L', 'L', 'W', 'L', 'W'], duesStatus: 'Paid' },
  { id: 'p-oh', rank: 13, initials: 'OH', name: 'Omar Hidalgo', phone: '0919 881 2044', clubId: 'ih', rating: 3.33, singlesRating: 3.29, played: 22, winPct: 41, form: ['W', 'L', 'L', 'L', 'W'], duesStatus: 'Paid' },
  { id: 'p-gp', rank: 14, initials: 'GP', name: 'Grace Pascual', phone: '0917 302 9918', clubId: 'cd', rating: 3.12, singlesRating: 3.08, played: 19, winPct: 37, form: ['L', 'L', 'W', 'L', 'L'], duesStatus: 'Paid' },
]

export const RATING_HISTORY_12M = [
  { month: 'Nov', rating: 3.79 },
  { month: 'Dec', rating: 3.88 },
  { month: 'Jan', rating: 3.9 },
  { month: 'Feb', rating: 3.86 },
  { month: 'Mar', rating: 3.89 },
  { month: 'Apr', rating: 3.99 },
  { month: 'May', rating: 4.08 },
  { month: 'Jun', rating: 4.07 },
  { month: 'Jul', rating: 4.04 },
  { month: 'Aug', rating: 4.09 },
  { month: 'Sep', rating: 4.18 },
  { month: 'Oct', rating: 4.21 },
]

export const INITIAL_MATCH_HISTORY = [
  { id: 'm-1', date: 'Oct 6', opponent: 'Marco Bautista', clubId: 'rs', format: 'Doubles', result: 'W', score: '11–8', delta: '+0.04' },
  { id: 'm-2', date: 'Oct 5', opponent: 'Rosa Dimaano', clubId: 'rs', format: 'Singles', result: 'W', score: '11–6', delta: '+0.04' },
  { id: 'm-3', date: 'Oct 4', opponent: 'Teodoro Santos', clubId: 'pf', format: 'Singles', result: 'L', score: '9–11', delta: '−0.03' },
  { id: 'm-4', date: 'Oct 3', opponent: 'Kaye Gonzaga', clubId: 'ih', format: 'Doubles', result: 'W', score: '11–4', delta: '+0.04' },
  { id: 'm-5', date: 'Oct 2', opponent: 'Patricia Reyes', clubId: 'cd', format: 'Doubles', result: 'W', score: '12–10', delta: '+0.04' },
  { id: 'm-6', date: 'Oct 1', opponent: 'Dana Villanueva', clubId: 'pf', format: 'Singles', result: 'L', score: '5–11', delta: '−0.03' },
]

export const INITIAL_INCOMING_CONFIRMATIONS = [
  {
    id: 'inc-1',
    submittedBy: 'Dana Villanueva',
    clubId: 'pf',
    format: 'Singles',
    score: '11–9',
    winner: 'Dana Villanueva',
    date: 'Today · 10:15am',
  },
]

export const INITIAL_CLUB_MEMBERS = [
  { id: 'm-dv', initials: 'DV', name: 'Dana Villanueva', email: 'dana.o@mail.com', phone: '0917 310 1101', type: 'Premier', rating: '4.82', dues: 'Paid', nextDue: 'Mar 1, 2027', since: 2017, lastReminded: null },
  { id: 'm-ts', initials: 'TS', name: 'Teodoro Santos', email: 'theo.b@mail.com', phone: '0917 501 2345', type: 'Standard', rating: '4.58', dues: 'Due soon', nextDue: 'Oct 15, 2026', since: 2019, lastReminded: 'Oct 2' },
  { id: 'm-am', initials: 'AM', name: 'Alex Moreno', email: 'alex.m@mail.com', phone: '0917 440 2026', type: 'Standard', rating: '4.21', dues: 'Paid', nextDue: 'Jan 1, 2027', since: 2021, lastReminded: null },
  { id: 'm-sj', initials: 'SJ', name: 'Sam Javier', email: 'sam.w@mail.com', phone: '0918 640 3119', type: 'Family', rating: '3.94', dues: 'Overdue', nextDue: 'Sep 1, 2026', since: 2020, lastReminded: 'Sep 24' },
  { id: 'm-lf', initials: 'LF', name: 'Lucia Fernandez', email: 'lucia.f@mail.com', phone: '0917 229 8830', type: 'Junior', rating: '3.47', dues: 'Paid', nextDue: 'Jun 1, 2027', since: 2024, lastReminded: null },
  { id: 'm-es', initials: 'ES', name: 'Enrique Sarmiento', email: '', phone: '0917 615 4490', type: 'Senior', rating: '3.71', dues: 'Due soon', nextDue: 'Oct 12, 2026', since: 2018, lastReminded: null },
  { id: 'm-mc', initials: 'MC', name: 'Maya Cortez', email: 'maya.c@mail.com', phone: '0919 412 0093', type: 'Standard', rating: '3.00', dues: 'Pending approval', nextDue: '—', since: 2026, lastReminded: null },
  { id: 'm-ip', initials: 'IP', name: 'Ivan Pineda', email: 'ivan.p@mail.com', phone: '0917 889 1002', type: 'Premier', rating: '4.05', dues: 'Overdue', nextDue: 'Aug 15, 2026', since: 2022, lastReminded: 'Sep 18' },
  { id: 'm-cn', initials: 'CN', name: 'Chloe Ng', email: 'chloe.n@mail.com', phone: '0920 773 5510', type: 'Family', rating: '3.58', dues: 'Paid', nextDue: 'Feb 1, 2027', since: 2023, lastReminded: null },
  { id: 'm-ra', initials: 'RA', name: 'Ruth Abad', email: '', phone: '0917 110 8824', type: 'Senior', rating: '3.89', dues: 'Paid', nextDue: 'Apr 1, 2027', since: 2016, lastReminded: null },
]

export const INITIAL_SIGNUPS = [
  { id: 's-mc', initials: 'MC', name: 'Maya Cortez', email: 'maya.c@mail.com', phone: '0919 412 0093', plan: 'Standard' },
  { id: 's-jr', initials: 'JR', name: 'Jordan Rivera', email: 'jordan.r@mail.com', phone: '0917 702 1844', plan: 'Standard' },
  { id: 's-eh', initials: 'EH', name: 'Ellie Herrera', email: 'ellie.h@mail.com', phone: '0918 551 9230', plan: 'Junior' },
]

export const INITIAL_PAYMENTS_TO_VERIFY = [
  {
    id: 'pv-1',
    memberId: 'm-ts',
    memberName: 'Teodoro Santos',
    initials: 'TS',
    plan: 'Standard',
    amount: '3,600.00',
    method: 'GCash',
    reference: 'PF-STD-0214',
    submittedAt: '18m ago',
    proofLabel: 'gcash-receipt-0214.jpg',
  },
  {
    id: 'pv-2',
    memberId: 'm-sj',
    memberName: 'Sam Javier',
    initials: 'SJ',
    plan: 'Family',
    amount: '2,000.00',
    method: 'Maya',
    reference: 'PF-FAM-0198',
    submittedAt: '1h ago',
    proofLabel: 'maya-transfer-0198.png',
  },
]

export const INITIAL_RESULTS_TO_VERIFY = [
  { id: 'r-1', summary: 'Teodoro Santos d. Sam Javier 11–7' },
  { id: 'r-2', summary: 'Dana Villanueva d. Alex Moreno 11–9' },
]

export const INITIAL_WAITLIST = [
  { id: 'w-1', court: 'Court 2', time: '6pm', player: 'Lucia Fernandez' },
  { id: 'w-2', court: 'Court 4', time: '7pm', player: 'Ruth Abad' },
]

export const INITIAL_OFFICERS = [
  { id: 'o-am', initials: 'AM', name: 'Alex Moreno', detail: 'Club Admin · full access', role: 'Admin', locked: true },
  { id: 'o-ra', initials: 'RA', name: 'Ruth Abad', detail: 'Members & dues records', role: 'Treasurer', locked: false },
  { id: 'o-ts', initials: 'TS', name: 'Teodoro Santos', detail: 'Court bookings & availability', role: 'Scheduler', locked: false },
  { id: 'o-dv', initials: 'DV', name: 'Dana Villanueva', detail: 'Tournament setup & brackets', role: 'Tournament handler', locked: false },
]

export const INITIAL_ACTIVITY = [
  { id: 'a-1', actor: 'Ruth Abad', text: 'Payment recorded · Chloe Ng · ₱900.00', time: '12m', scope: 'treasurer' },
  { id: 'a-2', actor: 'Dana Villanueva', text: 'Result entered · Villanueva d. Santos 11–8', time: '40m', scope: 'tournament_handler' },
  { id: 'a-3', actor: 'Teodoro Santos', text: 'Booking cancelled · Court 3 · 5pm', time: '1h', scope: 'scheduler' },
  { id: 'a-4', actor: 'Ruth Abad', text: 'Member added · Enrique Sarmiento (Senior)', time: '3h', scope: 'treasurer' },
  { id: 'a-5', actor: 'Ruth Abad', text: 'Payment recorded · Ruth Abad · ₱900.00', time: '5h', scope: 'treasurer' },
]

export const SCHEDULE_DAYS = [
  { id: 'wed7', day: 'Wed', date: '7', label: 'Wed 7' },
  { id: 'thu8', day: 'Thu', date: '8', label: 'Thu 8' },
  { id: 'fri9', day: 'Fri', date: '9', label: 'Fri 9' },
  { id: 'sat10', day: 'Sat', date: '10', label: 'Sat 10' },
  { id: 'sun11', day: 'Sun', date: '11', label: 'Sun 11' },
  { id: 'mon12', day: 'Mon', date: '12', label: 'Mon 12' },
  { id: 'tue13', day: 'Tue', date: '13', label: 'Tue 13' },
]

export const SCHEDULE_HOURS = [
  '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm',
]

// Calibrated Wed 7 matrix: 26 Booked/Yours slots matching Dashboard KPI
const WED7_BASE = [
  ['Open', 'Open', 'Open', 'Booked', 'Booked', 'Closed'], // 7a (2)
  ['Open', 'Booked', 'Booked', 'Open', 'Open', 'Closed'], // 8a (2)
  ['Open', 'Open', 'Open play', 'Open play', 'Booked', 'Closed'], // 9a (1)
  ['Open', 'Booked', 'Booked', 'Open', 'Open', 'Closed'], // 10a (2)
  ['Booked', 'Open', 'Open', 'Open', 'Booked', 'Closed'], // 11a (2)
  ['Open', 'Open', 'Booked', 'Booked', 'Open', 'Closed'], // 12p (2)
  ['Booked', 'Open', 'Open', 'Open', 'Open', 'Closed'], // 1p (1)
  ['Open', 'Open', 'Booked', 'Booked', 'Open', 'Closed'], // 2p (2)
  ['Booked', 'Booked', 'Open', 'Open', 'Open', 'Closed'], // 3p (2)
  ['Open', 'Open', 'Open', 'Booked', 'Booked', 'Closed'], // 4p (2)
  ['Booked', 'Booked', 'Yours', 'Open', 'Open', 'Closed'], // 5p (3)
  ['Open play', 'Open play', 'Open', 'Booked', 'Booked', 'Closed'], // 6p (2)
  ['Open play', 'Open play', 'Booked', 'Open', 'Open', 'Closed'], // 7p (1)
  ['Open', 'Open', 'Open', 'Open', 'Booked', 'Closed'], // 8p (1)
  ['Open', 'Booked', 'Open', 'Open', 'Open', 'Closed'], // 9p (1) -> Total = 26
]

export function buildInitialCourtGrid() {
  const grid = {}
  SCHEDULE_DAYS.forEach((d, dayIdx) => {
    grid[d.id] = SCHEDULE_HOURS.map((hour, hIdx) => {
      return WED7_BASE[hIdx].map((cell, cIdx) => {
        if (d.id === 'wed7') return cell
        if (d.id === 'sat10' && cIdx < 3 && hIdx >= 1 && hIdx <= 8) return 'Tournament'
        if (d.id === 'fri9' && cIdx === 0 && hIdx === 1) return 'Yours'
        if (cIdx === 5 && d.id === 'thu8') return 'Closed'
        if (hIdx === 11 || hIdx === 12) return 'Open play'
        const seed = (dayIdx * 7 + hIdx * 3 + cIdx * 5) % 5
        return seed === 0 || seed === 2 ? 'Booked' : 'Open'
      })
    })
  })
  return grid
}

export const REPORTS_DATA = {
  '3mo': {
    label: 'Last 3 months · Aug – Oct 2026 · Figures are for Peñafrancia Pickleball Club only.',
    membership: {
      total: 235,
      active: 214,
      newPeriod: 24,
      lapsed: 6,
      rows: [
        { month: 'Aug', total: 225, active: 204, newCount: 10, lapsed: 2 },
        { month: 'Sep', total: 230, active: 209, newCount: 7, lapsed: 2 },
        { month: 'Oct', total: 235, active: 214, newCount: 7, lapsed: 2 },
      ],
    },
    dues: {
      collected: '₱164,250',
      dueSoon: 27,
      overdue: 19,
      rate: '81%',
      byMonth: [
        { month: 'Aug', collected: 56250, dueSoon: 17, overdue: 7 },
        { month: 'Sep', collected: 53550, dueSoon: 10, overdue: 11 },
        { month: 'Oct', collected: 54450, dueSoon: 27, overdue: 19 },
      ],
    },
    utilization: {
      totalBookings: 684,
      avgPct: '24%',
      peakHour: '5pm',
      underusedCount: 3,
      courts: [
        { court: 'Court 1', bookings: 122, util: 28, status: 'Underused' },
        { court: 'Court 2', bookings: 136, util: 32, status: 'Healthy' },
        { court: 'Court 3', bookings: 138, util: 33, status: 'Healthy' },
        { court: 'Court 4', bookings: 118, util: 26, status: 'Underused' },
        { court: 'Court 5', bookings: 110, util: 24, status: 'Underused' },
        { court: 'Court 6', bookings: 60, util: 12, status: 'Closed (Resurfacing)' },
      ],
      hourly: [12, 14, 15, 7, 9, 10, 11, 9, 8, 11, 22, 21, 19, 20, 10],
    },
    tournaments: {
      events: 2,
      totalEntries: 84,
      avgEvent: 42,
      avgDivision: 12,
      rows: [
        { name: 'Rainy Season Ladder', date: "Jul '26", entries: 36, divisions: 3, perDiv: 12 },
        { name: 'Summer Smash', date: "Aug '26", entries: 48, divisions: 4, perDiv: 12 },
      ],
    },
  },
  '6mo': {
    label: 'Last 6 months · May – Oct 2026 · Figures are for Peñafrancia Pickleball Club only.',
    membership: {
      total: 235,
      active: 214,
      newPeriod: 61,
      lapsed: 12,
      rows: [
        { month: 'May', total: 193, active: 175, newCount: 9, lapsed: 2 },
        { month: 'Jun', total: 205, active: 186, newCount: 14, lapsed: 2 },
        { month: 'Jul', total: 217, active: 196, newCount: 14, lapsed: 2 },
        { month: 'Aug', total: 225, active: 204, newCount: 10, lapsed: 2 },
        { month: 'Sep', total: 230, active: 209, newCount: 7, lapsed: 2 },
        { month: 'Oct', total: 235, active: 214, newCount: 7, lapsed: 2 },
      ],
    },
    dues: {
      collected: '₱321,300',
      dueSoon: 27,
      overdue: 19,
      rate: '78%',
      byMonth: [
        { month: 'May', collected: 49050, dueSoon: 15, overdue: 9 },
        { month: 'Jun', collected: 57150, dueSoon: 10, overdue: 10 },
        { month: 'Jul', collected: 50850, dueSoon: 17, overdue: 5 },
        { month: 'Aug', collected: 56250, dueSoon: 17, overdue: 7 },
        { month: 'Sep', collected: 53550, dueSoon: 10, overdue: 11 },
        { month: 'Oct', collected: 54450, dueSoon: 27, overdue: 19 },
      ],
    },
    utilization: {
      totalBookings: 1224,
      avgPct: '22%',
      peakHour: '5pm',
      underusedCount: 4,
      courts: [
        { court: 'Court 1', bookings: 206, util: 22, status: 'Underused' },
        { court: 'Court 2', bookings: 232, util: 27, status: 'Underused' },
        { court: 'Court 3', bookings: 244, util: 31, status: 'Healthy' },
        { court: 'Court 4', bookings: 206, util: 22, status: 'Underused' },
        { court: 'Court 5', bookings: 206, util: 21, status: 'Underused' },
        { court: 'Court 6', bookings: 130, util: 12, status: 'Closed (Resurfacing)' },
      ],
      hourly: [15, 16, 17, 8, 10, 12, 13, 10, 9, 12, 24, 23, 21, 22, 12],
    },
    tournaments: {
      events: 3,
      totalEntries: 124,
      avgEvent: 41,
      avgDivision: 12,
      rows: [
        { name: 'Founders Cup', date: "May '26", entries: 40, divisions: 3, perDiv: 13 },
        { name: 'Rainy Season Ladder', date: "Jul '26", entries: 36, divisions: 3, perDiv: 12 },
        { name: 'Summer Smash', date: "Aug '26", entries: 48, divisions: 4, perDiv: 12 },
      ],
    },
  },
  '12mo': {
    label: 'Last 12 months · Nov 2025 – Oct 2026 · Figures are for Peñafrancia Pickleball Club only.',
    membership: {
      total: 235,
      active: 214,
      newPeriod: 108,
      lapsed: 21,
      rows: [
        { month: 'May', total: 193, active: 175, newCount: 9, lapsed: 2 },
        { month: 'Jun', total: 205, active: 186, newCount: 14, lapsed: 2 },
        { month: 'Jul', total: 217, active: 196, newCount: 14, lapsed: 2 },
        { month: 'Aug', total: 225, active: 204, newCount: 10, lapsed: 2 },
        { month: 'Sep', total: 230, active: 209, newCount: 7, lapsed: 2 },
        { month: 'Oct', total: 235, active: 214, newCount: 7, lapsed: 2 },
      ],
    },
    dues: {
      collected: '₱618,450',
      dueSoon: 27,
      overdue: 19,
      rate: '82%',
      byMonth: [
        { month: 'May', collected: 49050, dueSoon: 15, overdue: 9 },
        { month: 'Jun', collected: 57150, dueSoon: 10, overdue: 10 },
        { month: 'Jul', collected: 50850, dueSoon: 17, overdue: 5 },
        { month: 'Aug', collected: 56250, dueSoon: 17, overdue: 7 },
        { month: 'Sep', collected: 53550, dueSoon: 10, overdue: 11 },
        { month: 'Oct', collected: 54450, dueSoon: 27, overdue: 19 },
      ],
    },
    utilization: {
      totalBookings: 2566,
      avgPct: '26%',
      peakHour: '6pm',
      underusedCount: 3,
      courts: [
        { court: 'Court 1', bookings: 460, util: 28, status: 'Underused' },
        { court: 'Court 2', bookings: 512, util: 33, status: 'Healthy' },
        { court: 'Court 3', bookings: 504, util: 32, status: 'Healthy' },
        { court: 'Court 4', bookings: 448, util: 26, status: 'Underused' },
        { court: 'Court 5', bookings: 422, util: 24, status: 'Underused' },
        { court: 'Court 6', bookings: 220, util: 13, status: 'Closed (Resurfacing)' },
      ],
      hourly: [18, 20, 21, 11, 13, 15, 16, 14, 12, 16, 28, 32, 29, 24, 15],
    },
    tournaments: {
      events: 5,
      totalEntries: 204,
      avgEvent: 41,
      avgDivision: 13,
      rows: [
        { name: 'New Year Kickoff', date: "Jan '26", entries: 36, divisions: 3, perDiv: 12 },
        { name: 'Bicol Spring Open', date: "Mar '26", entries: 44, divisions: 3, perDiv: 15 },
        { name: 'Founders Cup', date: "May '26", entries: 40, divisions: 3, perDiv: 13 },
        { name: 'Rainy Season Ladder', date: "Jul '26", entries: 36, divisions: 3, perDiv: 12 },
        { name: 'Summer Smash', date: "Aug '26", entries: 48, divisions: 4, perDiv: 12 },
      ],
    },
  },
}

export const INITIAL_CLUB_APPLICATIONS = [
  {
    id: 'app-1',
    clubName: 'Tinago Pickleball Club',
    shortName: 'Tinago',
    barangay: 'Brgy. Tinago',
    courts: 4,
    stage: 2,
    status: 'NCPA Verification',
    submittedAt: 'Oct 4, 2026',
  },
]
