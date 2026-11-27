# PickleStack — Naga City Pickleball Association (NCPA)

Multi-club web prototype for the **Naga City Pickleball Association**, built with React 19, Vite 8, Tailwind CSS v4, and Radix UI / shadcn-style primitives.

> **Scope:** Frontend-only interactive prototype backed by in-memory React Context state (`AppContext`) and calibrated mock data (`mockData.js`), designed to match the [Figma PROTOTYPE](https://www.figma.com/design/wdhm204T64xWYV16MHUCOb/PROTOTYPE) alongside UX improvements documented in [DESIGN_HANDOFF.md](./DESIGN_HANDOFF.md).

---

## Features & Role Views

Use the **Demo role switcher** in the top navigation bar (or **Log in** on `/auth`) to preview all six roles:

| Role | Default Screen | Key Capabilities |
| --- | --- | --- |
| **Guest (`guest`)** | Directory (`HomePage`) | Browse Naga City clubs (List & stylized Map views), public tournaments, association leaderboard, or apply to register a new club. |
| **Player (`player`)** | My Club (`ClubPage`) | Setup checklist (`Account setup X of 5`), GCash/Maya payment proof submission, court discovery (**Find a slot** + Day/Week agenda + 5-min hold timer + `.ics` calendar export), tournament registration, match score entry (`11-7`, `11 7`, `11–7`), and rating history chart. |
| **Club Admin (`admin`)** | Club Dashboard (`DashboardPage`) | Role-focused `Overview` and `Manage & log` tabs, `Action queue` (payment proofs, signups, results, waitlist) with spinner + 5-second Undo toasts, inline `C1–C6` court availability toggles, member roster, officer assignment, announcements, and reports. |
| **Treasurer (`treasurer`)** | Club Dashboard | Payment proof verification (`Payments to verify`), manual payment recording (`₱900`, `900.00`), overdue member follow-up with live send progress (`Sent X of Y`), and mobile-optional member creation. |
| **Scheduler (`scheduler`)** | Club Dashboard | Today's court grid, one-tap `C1–C6` maintenance closure with reason capture, waitlisted booking promotions, and full court schedule overrides. |
| **Tournament Handler (`tournament_handler`)** | Club Dashboard | Create club/public tournaments, verify submitted match results, and view division brackets, schedules, and standings. |

---

## Tech Stack

- **Framework:** React `^19.3.1`, Vite `^8.3.6`
- **Styling:** Tailwind CSS `^4.3.5` (`@tailwindcss/vite`), `class-variance-authority`, `clsx`, `tailwind-merge`
- **UI Primitives:** Radix UI (`dialog`, `dropdown-menu`, `select`, `tabs`, `checkbox`, `progress`, `slot`) + `lucide-react` icons
- **Fonts:** `Bricolage Grotesque`, `Figtree`, and `DM Mono` (via Google Fonts in `frontend/index.html`)
- **Linting:** `oxlint` `^1.90.0`

---

## Project Structure

```text
NCPA/
├── DESIGN_HANDOFF.md            # Developer design tokens, redlines, assets, and prototype parity guide
├── README.md
└── frontend/
    ├── index.html               # Google Fonts + page entry
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx              # State-driven page router (13 views)
        ├── index.css            # Tailwind v4 @theme tokens & base typography
        ├── context/
        │   └── AppContext.jsx   # Global prototype state, undo toasts, role/club switching
        ├── data/
        │   └── mockData.js      # Clubs, courts grid, tournaments, members, leaderboard, reports
        ├── lib/
        │   └── utils.js         # cn(), fuzzyMatch(), normalizePhone(), normalizeAmount(), parseScoreInput(), downloadIcsEvent()
        ├── components/
        │   ├── ui/              # button, badge, card, dialog, dropdown-menu, input, progress, select, table, tabs, checkbox
        │   └── shared/          # Header, Footer, ScopeBar, SectionHead, ClubMark, FormPills, TournamentCard, ToastBanner
        └── pages/               # HomePage, ClubPage, CourtsPage, TournamentsPage, TournamentDetailPage,
                                 # LeaderboardPage, AuthPage, ClubApplyPage, ProfilePage, DashboardPage, MembersPage, ReportsPage
```

---

## Getting Started

Run commands from `frontend/` (or use `--prefix frontend` from the repo root):

```bash
# Install dependencies
npm --prefix frontend install

# Start local Vite dev server
npm --prefix frontend run dev

# Lint with oxlint
npm --prefix frontend run lint

# Build production bundle to frontend/dist/
npm --prefix frontend run build

# Preview production build locally
npm --prefix frontend run preview
```

---

## Related Documentation

- **[DESIGN_HANDOFF.md](./DESIGN_HANDOFF.md):** Complete color/typography tokens, layout & radius redlines, component specs, SVG/chart asset reference, input-forgiveness contracts, and Prototype-vs-Code parity notes.
