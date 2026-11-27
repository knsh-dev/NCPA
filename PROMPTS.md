# Prompts Used — PickleStack (NCPA) Development Log

Chronological log of the user prompts used to connect the Figma prototype, build the React + Tailwind CSS v4 + shadcn/ui application, audit and apply UX improvements, fix bugs, and prepare developer handoff documentation.

---

## 1. Figma Prototype Connection & Wireframe Context

**1.1** *(2026-11-26 12:27)*
```text
connect to figma for wireframe context
```

**1.2** *(2026-11-26 12:29)*
```text
continue
```

**1.3** *(2026-11-26 13:42)*
```text
https://www.figma.com/design/wdhm204T64xWYV16MHUCOb/PROTOTYPE?m=auto&t=p2WKgiXi2wm6DhqC-6
```
- **Outcome:** Retrieved Figma `PROTOTYPE` wireframe context (`Frame 2:2`, `Frame 3:4317`, `ScopeBar`, multi-role views, club pages, court grids, tournaments, members, and reports).

---

## 2. Initial Frontend Application Build

**2.1** *(2026-11-26 13:53)*
```text
build out the full app
```

**2.2** *(2026-11-26 13:58)*
```text
build out the full app ( frontend only, using tailwind and shadcn )
```
- **Outcome:** Built the frontend-only React 19 + Vite 8 + Tailwind CSS v4 + Radix/shadcn prototype across 13 routes (`HomePage`, `ClubPage`, `CourtsPage`, `TournamentsPage`, `TournamentDetailPage`, `LeaderboardPage`, `AuthPage`, `ClubApplyPage`, `ProfilePage`, `DashboardPage`, `MembersPage`, `ReportsPage`) backed by `AppContext` and `mockData.js`.

---

## 3. UX Audit & Heuristic Gap Analysis

**3.1** *(2026-11-26 16:07)*
```text
"Act as a Principal Product Designer and UX Researcher. Conduct a deep-dive UX audit and functional gap analysis on the system provided below.

System Context / Screens / Flows: [Insert screenshots, Figma links, code, or a detailed description of your current UI and workflows]
Target Users: [Insert user demographics, e.g., club members, older adults, volunteer officers, mobile-first users]

Analyze the interface and workflows to identify critical usability gaps, friction points, and missing system functions. Organize your findings into numbered sections (e.g., 3.1, 3.2, etc.).

For each core issue identified, structure your analysis strictly using these three parts:

Current issue: Describe the exact UI/UX friction, missing function, or workflow dead-end. Point out specific visual flaws (low contrast, unlabelled states), missing user feedback, cognitive overload, or rigid input constraints.

Proposed UX law: Map the issue to a foundational UX/psychology principle (e.g., Hick’s Law, Tesler’s Law, Doherty Threshold, Peak-End Rule, Zeigarnik Effect, Postel’s Law, Pareto Principle, Fitts's Law, Jakob's Law) and briefly define how it applies here.

Actionable re-design: Provide concrete, UI-level solutions. Specify exact component changes, micro-copy examples, state transitions (loading, empty, pending, confirmation), role-based views, and input forgiveness rules.

Final Section — Bonus: Consistency and data-integrity findings:
Conclude with a bulleted list of heuristic bugs that aren't tied to a single UX law, specifically checking for:

Conflicting metrics or counts across different screens/reports.

Misleading status badges, labels, or broken data visualizations (missing axes, unproportional charts).

Inconsistent navigation bars or mismatched authentication states across views.

Keep the tone objective, constructive, and grounded in specific UI details rather than generic advice."
```

**3.2** *(2026-11-26 16:09)*
```text
implement it
```

---

## 4. Applied UX Recommendations (Sections 3.1–3.8)

**4.1** *(2026-11-26 16:30)*
```text
Section 3: UX Recommendations (Different Laws to Apply)
3.1 Slot discovery is slow and not obviously bookable
Current issue: To find a playable slot, a player picks one of six court tabs and scans 7 days × 15 hours. The club heatmap shows all courts but its cells are small, not tappable, and labelled only every two hours. “Open” and “Booked” differ mainly by a pale fill against a white outline, which is low contrast for older adults. No slot says “Book”.
Proposed UX law: Hick’s Law (decision time grows with the number and complexity of choices).
Actionable re-design:
Add a “Find a slot” bar above the grid with three chips: Day, Time of day (Morning / Afternoon / Evening) and Duration. It returns the three earliest matches, such as “Today 5:00p · Court 4”, each with a Book button.
Default to a Day view with all six courts as rows, and keep Week as the secondary view. Show an hour summary on mobile (“4 of 6 courts open”).
Make every Open cell say “Book” on hover or tap and open a bottom sheet (court, time, fee, Confirm). Label every hour. Add a pattern or bolder border to Booked cells so they do not rely on fill alone.
3.2 Dues and membership payment depends on the treasurer’s memory and chats
Current issue: There is no online checkout, so payment happens off-platform and a treasurer records it afterward. “Choose Standard” on the plan cards does not show what happens next. Reports note that dues are “recorded manually”, and treasurers cross-check screenshots and messages by hand.
Proposed UX law: Tesler’s Law (every system has irreducible complexity; the question is who carries it).
Actionable re-design:
Keep manual payment, but move the complexity into the system. After “Choose Standard”, show a payment sheet with the amount, the club’s GCash/Maya number or QR, an auto-generated reference code (for example PF-STD-0214), and an “Upload proof” field. Status becomes “Awaiting verification”.
Add a “Payments to verify” group in the dashboard’s Needs action panel, with the proof thumbnail, amount and reference and a one-tap Confirm. Confirm updates dues status, next-due date, receipt and audit log in one step.
Auto-schedule reminders instead of the manual “Remind overdue” sweep.
3.3 High-stakes actions give no visible feedback
Current issue: Approve, Verify, Promote and “Remind overdue” trigger consequential changes (a member is admitted, a rating changes, a waitlisted player gets a court, messages are sent) but the design shows no loading, success or undo states. “Remind overdue” does not say who will receive messages. On variable mobile data this feels like a double-tap risk.
Proposed UX law: Doherty Threshold (productivity soars when system and user interact in under about 400 ms).
Actionable re-design:
Acknowledge instantly: the button shows a spinner and disables, the row updates optimistically and moves to a Done state with a 5-second Undo toast.
Use skeleton rows for tables and filter changes on the leaderboard instead of blank flashes.
“Remind overdue” opens a preview (“Send to 19 members by SMS/email?”) and shows live progress (“Sent 12 of 19”).
For bookings, hold the chosen slot for 5 minutes with a visible countdown to prevent double-booking.
3.4 Flows end abruptly, with no confirmation or payoff
Current issue: Tournament cards show 58/64 teams but no register call-to-action or resulting state. Joining a club, booking a slot and registering have no designed finish. Verified match results update the ladder but give players no feedback on what changed.
Proposed UX law: Peak-End Rule (people judge an experience by its peak and its end).
Actionable re-design:
Build a confirmation screen with a clear check mark and summary (“Court 2 · Fri Oct 9 · 6–7p”), cancellation deadline, what to bring, Add to calendar and Share to group chat (Messenger/Viber).
For tournaments: “You’re team 59 of 64. Bracket posts Oct 22.” Add a “Register” button to each Upcoming card.
After an officer verifies a result, notify both players with the payoff: “Win recorded. Rating 4.21 → 4.24, rank 7 → 6.” Create a welcome message when a membership is approved.
3.5 Onboarding is multi-step and easy to abandon
Current issue: Onboarding spans several steps and days: create a profile, pick a tier, wait for officer approval (the dashboard shows pending signups such as Maya Cortez), pay, set skill level and notifications. Members showing “Pending approval” with a blank next-due date have no visible next step. Nothing prompts users to finish.
Proposed UX law: Zeigarnik Effect (people remember and are driven to complete unfinished tasks).
Actionable re-design:
Add a persistent setup checklist on the player home: “Account setup 3 of 5: ✓ Profile, ✓ Choose Standard, ○ Pay ₱3,600, ○ Set play level, ○ Notifications.” Include a “Resume” banner on return visits.
For pending approval, show a status page: what happens next and expected review time.
Save drafts, and send a nudge by SMS or email: “You’re 2 steps from booking your first court.”
For officers, show a persistent badge count on Needs action in the nav.
3.6 Forms and search are strict about format
Current issue: Search is “name or email” only, and the second filter on Members is labelled just “All”. Score entry (“11–7”), Add member, phone numbers (for example 0917 201 4410) and amounts are likely format-sensitive. Names include Filipino nicknames and diacritics (Peñafrancia typed as Penafrancia). Many older members may not use email.
Proposed UX law: Postel’s Law (be conservative in what you send, liberal in what you accept).
Actionable re-design:
Make search accent-insensitive and tolerant of partial names, nicknames and typos. Include phone number in the search.
Accept phone formats 09171234567, +63 917 123 4567 and 0917-123-4567 and normalize them. Accept ₱900, 900 and 900.00. Accept score input as “11-7”, “11 7” or “11–7” and show a plain-language confirmation.
Let officers add a member with a mobile number only, since not every member has email. Relabel the second filter (for example “All member types”).
Errors state how to fix the problem and never clear what the user typed.
3.7 The officer dashboard tries to serve every role at once
Current issue: One scroll holds ten or more modules: KPIs, six quick actions, approvals, court grid, court availability, tournaments, treasury, officers and roles, audit log and an announcement form. Court state appears three times (dashboard grid, availability toggles, Courts page). The page itself says role tabs preview what each officer sees, but no role tabs are visible. A treasurer or scheduler does most of their work in a small subset.
Proposed UX law: Pareto Principle (roughly 80 percent of effects come from 20 percent of causes).
Actionable re-design:
Make the dashboard role-aware. Treasurer lands on Payments to verify and Overdue. Scheduler lands on Waitlist and Today’s court grid. Tournament handler lands on Registrations and Brackets.
Move rarely used modules (Officers and roles, Audit log, Post announcement) behind a secondary tab or drawer. Fold Court availability toggles into the court grid header.
Keep “Needs action” fixed at top-left with a total count. Cut quick actions to three role-relevant ones plus “More”.
3.8 Bonus: Consistency and data-integrity findings
These are not tied to one law but would be caught in any heuristic review.
Overdue counts disagree across screens. Members shows 2 overdue (among 10 rows), the Dashboard shows 19, and Reports shows 47. The Reports total appears to sum monthly snapshots, so the same member may be counted repeatedly. Label it “member-months” or use the latest snapshot. Make the Members cards reflect the whole club, not the visible page.
“Idle” courts carry a “Closed” badge. In Court utilization, all six courts read Idle and the KPI uses the same wrench “Closed” pill used for maintenance. Court 6 also shows the highest bookings (439) with 18% utilization. Use “Underused” and check the denominator.
Charts lack axes and values. The Membership legend lists “Lapsed” but no lapsed bars are visible. Add y-axis labels and direct value labels.
Navigation is inconsistent. Officer screens show different nav sets (Dashboard / My Club / Courts, versus Dashboard / My Club / Members, versus the full set of seven). The Ratings page shows a signed-in “You” row under the logged-out nav (Log in / Join), and Events is association-wide in the nav but club-scoped in its header.
The dues donut appears broken. It renders as a segmented ring with red ticks rather than proportional segments for 168 / 27 / 19. Please verify.
```
- **Outcome:** Implemented all Section 3 UX enhancements (`3.1`–`3.8`) across utilities, mock data, context, navigation, player pages, officer dashboard, members, leaderboard, profile, and reports.

---

## 5. UI Refinements, Bug Fixes & Formatting

**5.1** *(2026-11-26 17:05 — with screenshot attachment of the dashboard officer role pill bar)*
```text
remove this 
```
- **Outcome:** Removed the redundant `Club Admin | Treasurer | Scheduler | Tournament handler` switcher bar from `DashboardPage.jsx` (keeping role switching in `Header.jsx`).

**5.2** *(2026-11-26 18:10)*
```text
find bugs and error and fix it
```
- **Outcome:** Fixed undo rollback bugs in `AppContext.jsx`, eliminated the `set-state-in-effect` lint warning and Week-view waitlist date mismatch in `CourtsPage.jsx`, fixed onboarding key mismatches in `ProfilePage.jsx` / `ClubPage.jsx`, fixed `TournamentDetailPage.jsx` division fallback IDs, added interval cleanup in `MembersPage.jsx`, scoped `DashboardPage.jsx` courts to `currentClub.courtsCount`, and enforced required password validation on signup in `AuthPage.jsx`.

**5.3** *(2026-11-26 19:20)*
```text
change the time name " am instead of a, same as pm "
```
- **Outcome:** Replaced all user-facing abbreviated `a`/`p` hour labels with `am`/`pm` across `mockData.js`, `CourtsPage.jsx`, `ClubPage.jsx`, `DashboardPage.jsx`, and `ReportsPage.jsx`.

---

## 6. Documentation & Developer Handoff

**6.1** *(2026-11-27 16:41 – 16:43)*
```text
make Design Handoff Documents, Handoff File: The developer handoff (Figma/Zeplin/etc.) is perfectly organized with specs, assets, and redlines. Prototype vs. Code: The coded result matches the high-fidelity prototype with pixel-perfect precision.
```
- **Outcome:** Created [DESIGN_HANDOFF.md](./DESIGN_HANDOFF.md).

**6.2** *(2026-11-27 16:51)*
```text
add ReadMe
```
- **Outcome:** Created root [README.md](./README.md) and updated `frontend/README.md`.

**6.3** *(2026-11-27 16:58)*
```text
add documentation of the prompts used
```
- **Outcome:** Added this `PROMPTS.md` prompt log and linked it from `README.md`.
