# PickleStack (NCPA) — Developer Design Handoff & Prototype Parity Guide

> **Figma Source:** [PROTOTYPE](https://www.figma.com/design/wdhm204T64xWYV16MHUCOb/PROTOTYPE)  
> **Coded App:** `frontend/` (React 19 · Vite 8 · Tailwind CSS v4 `@theme` · Radix UI / shadcn primitives · `lucide-react`)  
> **Scope:** Naga City Pickleball Association (NCPA) multi-club web application (Public Directory, Player Flows, Officer & Admin Operations, Reports).

---

## 1. Architecture, Routes & Role Access Matrix

Navigation is state-driven inside `AppContext` (`page`, `role`, `selectedClubId`) and rendered in [App.jsx](file:///c:/Users/kenshin%20jay/NCPA/frontend/src/App.jsx).

| Route (`page`) | Component | Primary Entry / Roles | Header Nav Label |
| --- | --- | --- | --- |
| `home` | `HomePage` (`initialView="list"`) | `guest` default landing | `About` |
| `clubs` | `HomePage` (`initialView="map"`) | `guest` directory map view | `Clubs` |
| `club` | `ClubPage` | All roles (`player` default landing) | `My Club` |
| `courts` | `CourtsPage` | `player`, `admin`, `scheduler` | `Courts` |
| `events` | `TournamentsPage` | `guest`, `player`, `admin`, `tournament_handler` | `Events` |
| `tournament-detail` | `TournamentDetailPage` | Clicked from event card / `Register` CTA | _(highlights `Events`)_ |
| `ratings` | `LeaderboardPage` | `guest`, `player`, `admin`, `tournament_handler` | `Ratings` |
| `auth` | `AuthPage` | `guest` Log in / Create account | `Log in` / `Join` |
| `club-apply` | `ClubApplyPage` | Home hero CTA (`Run a club?`) | — |
| `profile` | `ProfilePage` | Avatar menu (`Player profile & ratings`) | — |
| `dashboard` | `DashboardPage` | `admin`, `treasurer`, `scheduler`, `tournament_handler` | `Dashboard` (+ badge) |
| `members` | `MembersPage` | `admin`, `treasurer` | `Members` |
| `reports` | `ReportsPage` | `admin` (plus `treasurer` shortcut from Dashboard) | `Reports` |

### Role Persona Defaults (`ROLES` in `mockData.js`)
| Role ID | Display Label | Persona | Default Landing |
| --- | --- | --- | --- |
| `guest` | `Guest (Public)` | Unauthenticated visitor | `home` |
| `player` | `Player` | Alex Moreno (`AM`) | `club` (`pf`) |
| `admin` | `Club Admin` | Alex Moreno (`AM`) | `dashboard` (`pf`) |
| `treasurer` | `Treasurer` | Ruth Abad (`RA`) | `dashboard` (`pf`) |
| `scheduler` | `Scheduler` | Teodoro Santos (`TS`) | `dashboard` (`pf`) |
| `tournament_handler` | `Tournament handler` | Dana Villanueva (`DV`) | `dashboard` (`pf`) |

---

## 2. Design Tokens & Redlines

Defined in [index.css](file:///c:/Users/kenshin%20jay/NCPA/frontend/src/index.css) and loaded in [index.html](file:///c:/Users/kenshin%20jay/NCPA/frontend/index.html).

### 2.1 Color System

| CSS Token | Hex Value | Visual Name | Usage |
| --- | --- | --- | --- |
| `--color-background` | `#f5f1e6` | Court Cream | Page canvas, secondary fills, header text |
| `--color-card` / `--color-popover` | `#fbf8f1` | Warm Ivory | Cards, dialogs, inputs, selects, header active nav pill |
| `--color-foreground` | `#1e2a1f` | Deep Pine Ink | Primary headings, body text, strong labels |
| `--color-primary` | `#2f5233` | Deep Forest | Sticky header, hero surface, primary CTAs, active tabs |
| `--color-accent` | `#6b8f57` | Sage Moss | Eyebrow labels, links, outline borders, chart bars |
| `--color-secondary` | `#c9d6b8` | Pale Sage | Avatar fills, `"Booked"` / `"Yours"` court fill, `"Sage"` badge |
| `--color-muted` | `#ede7d6` | Warm Sand | Hover states, `"Closed"` court block `#ece7d8` |
| `--color-muted-foreground` | `#5e6b5a` | Muted Olive | Secondary metadata, table headers, subtle hints |
| `--color-warning` | `#d9b44a` | Amber Gold | `"Open play"` slots, pending alerts, kitchen accent |
| `--color-destructive` | `#b0453a` | Terracotta Red | Overdue status, decline/cancel actions, validation text |
| `--color-border` / `--color-input` | `#ddd6c4` | Limestone Border | 1px card/table/input hairlines (`* { border-color }`) |

### 2.2 Typography Scale

| Role | Family | Tailwind / CSS Spec | Tracking & Leading | Where Used |
| --- | --- | --- | --- | --- |
| Hero Display `h1` | `Bricolage Grotesque` | `36px` mobile / `60px` `sm:` (`text-4xl sm:text-6xl`), `font-extrabold` (800) | `leading-[1.03]`, `tracking-tight` | `HomePage` hero |
| Page `h1` | `Bricolage Grotesque` | `30px` / `34px` (`text-3xl sm:text-[34px]`), `font-extrabold` (800) | `leading-tight` | `ScopeBar`, `LeaderboardPage`, `ClubApplyPage` |
| Section `h2` | `Bricolage Grotesque` | `24px` / `26px` (`text-2xl sm:text-[26px]`), `font-extrabold` (800) | `leading-tight` | `SectionHead`, `ReportsPage` cards |
| Card / Modal Title `h3` | `Bricolage Grotesque` | `18px–20px` (`text-lg` / `text-xl`), `font-bold` (700) | `leading-snug` | `CardTitle`, `DialogTitle`, Dashboard modules |
| Brand Wordmark | `Bricolage Grotesque` | `17px` `font-extrabold` + `10px` subtitle `font-medium` | `-0.425px` title / `1.8px` subtitle | `Header` (`PickleStack / ASSOCIATION · NAGA`) |
| Eyebrow | `Figtree` | `11px–12px` (`text-[11px]` / `text-xs`), `font-semibold`, `uppercase` | `tracking-[1.4px]` to `1.68px` | `SectionHead`, `ScopeBar` club label, Dashboard cards |
| Body & Controls | `Figtree` | `14px` (`text-sm`) / `15px` (`text-[15px]` inputs & `lg` buttons) | Default (`1.5–1.6`) | Forms, paragraphs, nav links |
| Tabular Numbers | `DM Mono` | `.font-mono-num` (`font-variant-numeric: tabular-nums`), `400/500` | `10px–16px` | Ratings, court hours, ref codes, countdowns, table counts |

### 2.3 Layout, Spacing & Radius Redlines

- **Page Container:** `mx-auto max-w-[1280px] px-4 pt-10` (1280px max width, 16px horizontal gutter, 40px top margin; 64px footer margin `mt-16`).
- **Sticky Header:** `h-16` (64px height), `sticky top-0 z-40`, `#2f5233` surface.
- **Responsive Column Grids (`lg:` >= 1024px):**
  - Directory & Club Detail: `grid-cols-1 lg:grid-cols-12` (`8` main / `4` sidebar, `gap-8` = 32px).
  - Officer Dashboard Overview: `grid-cols-1 lg:grid-cols-12` (`7` Needs Action + Court Grid / `5` Dues Snapshot + Tournaments, `gap-4` = 16px).
  - Manage & Log Tab / Reports Chart+Table: `6 + 6` split (`gap-4` / `gap-6`).
- **Corner Radii & Stroke Weights:**
  - Auth split shell: `rounded-[24px]` (24px)
  - Cards, Tables & Modals: `rounded-2xl` (16px), `1px solid #ddd6c4`
  - Buttons, Tabs container, Inputs & Selects: `rounded-xl` (12px)
  - Small pills / Tab triggers / `sm` buttons: `rounded-lg` (8px)
  - Micro squares (`FormPills`, heatmap cells): `rounded-[4px]` (4px) / `rounded-[3px]` (3px)
  - Badges & status chips: `rounded-full`

---

## 3. Component Specifications & State Matrix

### 3.1 Core UI Primitives (`frontend/src/components/ui/`)

| Component | Exact Geometry & Specs | Variants & Interactive States |
| --- | --- | --- |
| **Button** (`button.jsx`) | `default`: `h-11 px-4 rounded-xl text-sm font-semibold`<br>`sm`: `h-8 px-3 rounded-lg text-xs`<br>`lg`: `h-12 px-6 rounded-xl text-[15px]`<br>`icon`: `h-8 w-8 rounded-lg` | `default` (`#2f5233` → hover `#244128`), `cream` (`#f5f1e6` → `#ede7d6`), `outline` (`border-[#6b8f57]`), `subtle` (`border-[#ddd6c4]`), `ghost`, `destructive` (`border-[#b0453a]/50 text-[#b0453a]`).<br>Focus: `ring-2 ring-[#2f5233]/40` · Disabled: `opacity-40`. |
| **Badge** (`badge.jsx`) | `px-2.5 py-0.5 rounded-full border text-xs font-semibold leading-5 gap-1` | `default`, `sage` (`#c9d6b8`), `booked` (`#c9d6b8/80` + `#b7cbb0`), `openPlay` (`#d9b44a`), `tournament` (`#2f5233`), `closed` (`#f5f1e6`), `overdue` (`#b0453a` text/border), `neutral`, `darkOutline`. |
| **Input / Textarea** (`input.jsx`) | `Input`: `h-11 px-3 py-2 rounded-xl text-[15px]`<br>`Textarea`: `min-h-[96px] px-3 py-2.5 rounded-xl text-[15px]` | Border `#ddd6c4`, bg `#fbf8f1`. Focus: `ring-2 ring-[#2f5233]/35 border-[#6b8f57]`. Placeholder: `#5e6b5a/70`. |
| **Select** (`select.jsx`) | Trigger `h-11 rounded-xl px-3 text-[15px]`; Content `rounded-xl shadow-lg max-h-72` | Items `rounded-lg py-2 pl-8 pr-3 text-sm`, hover/focus `bg-[#c9d6b8]/45`, green `Check` indicator. |
| **Tabs** (`tabs.jsx`) | List `p-1 gap-1 rounded-xl border bg-[#fbf8f1]`; Trigger `h-9 px-3 rounded-lg text-sm font-semibold` | Active trigger: `bg-[#2f5233] text-[#f5f1e6]`. |
| **Card** (`card.jsx`) | `rounded-2xl border border-[#ddd6c4] bg-[#fbf8f1]`, body padding `p-5` (`p-4` compact KPIs, `p-6` report blocks) | Interactive cards hover: `hover:border-[#6b8f57]`. |
| **Table** (`table.jsx`) | Outer wrapper `rounded-2xl border bg-[#fbf8f1] overflow-x-auto` | `thead`: `bg-[#f5f1e6]/70`, `th`: `h-10 px-4 text-xs uppercase tracking-[0.6px]`, `tr`: `hover:bg-[#f5f1e6]/45`, `td`: `px-4 py-3`. |
| **Dialog** (`dialog.jsx`) | `max-w-lg w-[calc(100%-2rem)] rounded-2xl p-6 shadow-xl`; Overlay `bg-[#1e2a1f]/45 backdrop-blur-[2px]` | Close `X` button top-right (`right-4 top-4`). |
| **Progress** (`progress.jsx`) | Track `h-1.5 rounded-full bg-[#f5f1e6]`; Indicator `bg-[#6b8f57]` | Smooth `translateX` fill based on `value` (0–100). |
| **Checkbox** (`checkbox.jsx`) | `h-4 w-4 rounded-[4px] border-[#767676] bg-white` | Checked: `border-[#2f5233] bg-[#2f5233] text-[#f5f1e6]`. |

### 3.2 Domain Components & Visual Feedback States

- **`ClubMark` (`ClubMark.jsx`)**: `xs` (`24×24`, `r=6px`, `10px`), `sm` (`36×36`, `r=8px`, `12px`), `md` (`64×64`, `r=16px`, `24px`), `lg` (`80×80`, `r=16px`, `28px`) in `outline`, `filled`, or `cream`.
- **`FormPills` (`FormPills.jsx`)**: 5 squares (`20×20`, `r=4px`, `10px` DM Mono); `W` = solid `#2f5233` cream text, `L` = bordered `#a9ada1` muted text.
- **`ToastBanner` (`ToastBanner.jsx`)**: Fixed `bottom-5 right-5 z-50 max-w-md rounded-xl shadow-lg`. Success/neutral use `#2f5233` bg (`3600ms` auto-dismiss, extended to `5000ms` when an `Undo` button is attached). Error uses `#fbf8f1` bg + `#b0453a` border/text.
- **Court Slot Cell States (`CourtsPage.jsx` & `ClubPage.jsx`):**
  - `Open`: `#fbf8f1` + hover `#2f5233` border + `"Book"` pill reveal on hover (`"Book"` always shown on mobile cards).
  - `Booked`: `#c9d6b8/65` + `2px` `#8ba483` border + `-45deg` diagonal stripe hatch (`rgba(47,82,51,0.08)` / `0.14` on ClubPage) for non-color-only legibility.
  - `Yours`: `#c9d6b8` + `2px` `#2f5233` border + check icon.
  - `Open play`: `#d9b44a` + users icon.
  - `Tournament`: `#2f5233` + cream text + trophy icon.
  - `Closed`: `#f5f1e6/80` + wrench icon.
- **Async Action & Skeleton States:**
  - Dashboard `Action queue` rows (`Approve`, `Confirm`, `Verify`, `Promote`): `280ms` spinner (`Loader2 animate-spin`) + disabled → `220ms` `"Done"` check → row settles + 5s `Undo` toast.
  - Leaderboard filters/search: `240ms` 5-row `animate-pulse` skeleton shimmer.
  - Members `Remind overdue`: step-progress bar (`Sent X of Y`) before closing.

---

## 4. Assets, Custom SVGs & Data Visualizations

### 4.1 Brand & Map Vectors (Inline Code Assets)
| Asset | File & Coordinates | Spec |
| --- | --- | --- |
| **PickleLogoIcon** | [Header.jsx](file:///c:/Users/kenshin%20jay/NCPA/frontend/src/components/shared/Header.jsx#L19-L36) | `32×32` SVG (`viewBox="0 0 32 32"`): `#f5f1e6` circle (`r=15`) + 6 perforated holes (`r=2`, `#2f5233`). |
| **Naga City Stylized Map** | [HomePage.jsx](file:///c:/Users/kenshin%20jay/NCPA/frontend/src/pages/HomePage.jsx#L232-L306) | `h-[340px]` `#eef1e5` canvas, `viewBox="0 0 800 360"`, `#c8d9e6` quadratic Naga River (`strokeWidth=22`), Maharlika Hwy & cross road strokes, landmarks, and clickable `%`-positioned club pill pins (`mapPos`). |
| **Court Line Motif** | [HomePage.jsx](file:///c:/Users/kenshin%20jay/NCPA/frontend/src/pages/HomePage.jsx#L58-L65), [AuthPage.jsx](file:///c:/Users/kenshin%20jay/NCPA/frontend/src/pages/AuthPage.jsx#L78-L85) | CSS `linear-gradient` 50% centerline + 33%/66% kitchen lines at `opacity-20` over `#2f5233`. |
| **QR Payment Graphic** | [ClubPage.jsx](file:///c:/Users/kenshin%20jay/NCPA/frontend/src/pages/ClubPage.jsx#L628-L645) | `80×80` container (`p-2 bg-white rounded-xl`), deterministic `viewBox="0 0 36 36"` finder pattern in `#2f5233`. |

### 4.2 Custom Charts
- **Dues Snapshot Ring (`DashboardPage.jsx`)**: `96×96` SVG (`viewBox="0 0 100 100"`), `-rotate-90`, `r=38`, `strokeWidth=14`, proportional `strokeDasharray` arcs (`#6b8f57` Paid, `#d9b44a` Due soon, `#b0453a` Overdue) + centered member count.
- **12-Month Rating Curve (`ProfilePage.jsx`)**: Responsive SVG (`viewBox="0 0 640 180"`, `padX=28`, `padY=18`, domain `3.6–4.4`), dashed `#ddd6c4` gridlines, `#c9d6b8` (`45%` opacity) area fill, `2.5px` `#2f5233` line, node circles with `<title>` tooltips.
- **Reports Bar Charts (`ReportsPage.jsx`)**: Vertical bar charts with explicit left Y-axis ticks (`max`, `mid`, `0`) for Membership New vs. Lapsed (`#6b8f57` / `#b0453a/75`), Dues Collected, Bookings per Court, Hourly Demand (`#c9d6b8`), and Tournament Participation.

### 4.3 Static Files & Icon Library
- **Static Files:** `frontend/public/favicon.svg`, `frontend/public/icons.svg`, `frontend/src/assets/hero.png`, `frontend/src/assets/react.svg`, `frontend/src/assets/vite.svg`.
- **Icons:** All UI icons come from `lucide-react` (`14px–20px`, `h-3.5 w-3.5` inside badges/sm buttons, `h-4 w-4` default actions, `h-8 w-8` confirmation modals).

---

## 5. Prototype vs. Code Parity Audit

The coded application matches the Figma `PROTOTYPE` visual language (`Frame 2:2`, `Frame 3:4317`, `ScopeBar`, card anatomy, palette, typography, and report grids) while incorporating **intentional Section 3 UX enhancements**:

| Area | High-Fidelity Prototype Baseline | Coded Result & Parity Status | Rationale / Notes |
| --- | --- | --- | --- |
| **Brand, Palette & Fonts** | Warm Cream `#f5f1e6`, Ivory `#fbf8f1`, Forest `#2f5233`, Sage `#6b8f57`, Gold `#d9b44a`, Terracotta `#b0453a`; Bricolage + Figtree + DM Mono | **Exact match** in `index.css` & `index.html` | Pixel-faithful color & typography tokens across all 13 routes. |
| **Hero & Directory (`HomePage`)** | `Frame 2:2` split hero + 2×2 stat grid; `Frame 3:4317` stylized Naga map & club cards | **Exact visual match** + accent-insensitive `fuzzyMatch` search | Typing `"Penafrancia"` matches `"Peñafrancia"`. |
| **Club Page (`ClubPage`)** | `ScopeBar`/Hero + 6-court heatmap + Events + 4 Plan cards + FAQ + Top 5 + News | **Visual match + UX 3.1/3.2/3.5**: every-hour `am/pm` labels, striped Booked cells, `"Book"` hover, QR payment sheet on `Choose <Plan>`, and 5-step onboarding banner (`Account setup X of 5`) | Eliminates dead-end plan selection and clarifies Booked vs. Open slots. |
| **Court Schedule (`CourtsPage`)** | Week/Day views with 6 courts × 15 hours | **UX 3.1/3.3/3.4 upgrade**: Day view default, **Find a slot** bar (top 3 matches), `"Book"` hover/tap, mobile `"X of 6 courts open"` summary, 5-min hold countdown, `.ics` + Share confirmation sheet | Reduces 105-slot scanning friction (Hick's Law) & gives clear booking payoff. |
| **Tournaments (`TournamentsPage`, `TournamentDetailPage`)** | Tournament cards with `registered/max`, Division eligibility check, Bracket/Schedule/Standings tabs | **UX 3.4 upgrade**: Direct `Register` CTA on Upcoming cards + Peak-End confirmation dialog (`"You're team X of Y"`, bracket date, `.ics`, Share) | Gives tournament registration a clear start and end. |
| **Members & Leaderboard (`MembersPage`, `LeaderboardPage`, `ProfilePage`)** | Club-wide summary cards, sortable member table, head-to-head modal, 12-mo rating chart | **UX 3.3/3.6 upgrade**: `fuzzyMatch` + phone search/display, mobile-only Add Member (email optional), `"All member types"` filter, `Sent X of Y` reminder progress, 240ms Leaderboard skeletons, forgiving score input (`11-7`, `11 7`, `11–7`) | Tolerates PH phone/peso/name variations without clearing invalid inputs. |
| **Officer Dashboard (`DashboardPage`)** | 10-module single scroll with role-preview pill switcher and CSS conic donut | **UX 3.2/3.3/3.7/3.8 refinement**: `Overview` vs. `Manage & log` tabs, top-left `Needs action` + `Payments to verify` proof queue, 3 primary actions + `More` menu, inline `C1–C6` pills in Court Grid header, proportional SVG donut, role switch via top header menu | Keeps 80% daily workflows above the fold while retaining all admin capabilities. |
| **Reports (`ReportsPage`)** | 4 report sections with `3 mo / 6 mo / 12 mo` tabs & CSV/PDF exports | **Reconciled UX 3.8**: Y-axis scales, Court 6 utilization reconciled, `"Underused"` badge replacing `"Low demand"`, chronological chart/table alignment | Resolves misleading status badges and chart proportion bugs. |

---

## 6. Engineering Input-Forgiveness & Data Contracts (`src/lib/utils.js`)

| Helper | Accepted Inputs | Canonical Output / Behavior |
| --- | --- | --- |
| `normalizeText(str)` | Diacritics / mixed case (e.g. `"Peñafrancia"`) | NFD-normalized lowercase ASCII (`"penafrancia"`). |
| `fuzzyMatch(target, query)` | Partial tokens, missing accents, 1-char typos (tokens `>= 4` chars) | `true` / `false` via Levenshtein ≤ 1 token matching. |
| `normalizePhone(raw)` | `09171234567`, `+63 917 123 4567`, `0917-123-4567`, `9171234567` | `"0917 123 4567"` or `null` (never clears invalid input). |
| `normalizeAmount(raw)` | `"₱900"`, `"900"`, `"900.00"`, `"1,200"` | `"900.00"` (`toFixed(2)`) or `null`. |
| `parseScoreInput(raw)` | `"11-7"`, `"11 7"`, `"11–7"` | `{ yours, theirs, formatted: "11–7", won }` or `null`. |
| `downloadIcsEvent(...)` | `{ title, description, location }` | Downloads a valid `VCALENDAR` `.ics` file. |
