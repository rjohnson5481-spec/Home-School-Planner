# HANDOFF — Session 15 (morning summary + desktop sidebar)

## What was completed this session

### Fix 1 — Dead tool card links wired to shell tabs
- `ToolCard.jsx`: added `onClick` prop — renders `<button>` instead of `<a>` when provided
- `ToolCard.css`: added `button.tool-card-link` reset styles
- `HomeTab.jsx`: accepts `onTabChange` prop; Planner + Rewards cards call `onTabChange`
- `App.jsx`: passes `onTabChange={setActiveTab}` to `<HomeTab>`

### Fix 2 — Morning summary dashboard
- New hook `packages/dashboard/src/hooks/useHomeSummary.js`:
  - Live onSnapshot subscriptions to: student settings list, today's subjects for
    active student, Orion's points, Malachi's points
  - Returns: `{ students, activeStudent, setActiveStudent, subjects, dayIndex, weekId, points }`
- `HomeTab.jsx`: complete rewrite — today's date, student selector pills, 3 summary cards
  (lessons done/total, Orion pts + cash value, Malachi pts + cash value), tappable lesson
  list (opens planner tab), quick action buttons (Open Planner, Award Points)
- `HomeTab.css`: complete rewrite — `.home-content`, `.home-summary-row`, `.home-summary-card`,
  `.home-lesson-list`, `.home-actions`

### Fix 3 — Dark mode toggle + sign-out on HomeTab
- Added `<header className="home-header">` to HomeTab:
  - Left: logo + "IRON & LIGHT / JOHNSON ACADEMY" (LIGHT in `#e8c97a`)
  - Right: dark mode toggle (🌙/☀️) using `useDarkMode` hook, sign-out (🚪) using `signOut`
    from `@homeschool/shared`
  - `color-mode` localStorage key — stays in sync with planner and reward tracker
  - Hidden on desktop via `@media (min-width: 768px)` (sidebar provides branding there)

### Fix 4 — CLAUDE.md netlify.toml section
- Removed `/planner/*` and `/reward-tracker/*` redirect docs (both retired session 14)
- Updated to reflect current 3-redirect config (`/api/*`, `/te-extractor/*`, `/*`)
- Added note that packages/planner and packages/reward-tracker are retired

### Feature — Desktop left sidebar
- `BottomNav.jsx`: added brand section (logo + name + tagline, desktop-only) and sign-out
  footer with version string (desktop-only). Both hidden on mobile via CSS.
- `BottomNav.css`: `@media (min-width: 768px)` — nav becomes 200px fixed left sidebar,
  full viewport height, brand at top, tabs stacked vertically (icon + label row),
  sign-out + `v0.21.2` at bottom
- `App.css`: desktop `.shell-content` gets `margin-left: 200px; padding-bottom: 0`
- `App.css`: `.shell-content .day-strip` overrides revert the planner's DayStrip from its
  desktop fixed-sidebar mode to sticky/horizontal — prevents two 200px sidebars at `left: 0`
- `App.css`: `.shell-content .planner-action-bar` corrected to `left: 200px; bottom: 0`
  (shell nav is now sidebar, no bottom bar to clear)

---

## What is currently incomplete / pending

1. **Verify desktop layout in browser** — not tested; confirm:
   - Sidebar visible at 200px left, content area shifted right
   - Planner DayStrip shows horizontal (not a sidebar) inside the shell
   - Planner action bar at correct position (bottom: 0, left: 200px)
   - HomeTab header hidden on desktop

2. **Import merge bug** — `calm-whistling-clock.md` plan at `/root/.claude/plans/`
   - Rob reported: second PDF import with "Replace existing schedule" OFF still overwrites data
   - Next step: add console.logs to `UploadSheet.jsx`, `PlannerLayout.jsx`, `useSubjects.js`
     in `packages/dashboard/src/tools/planner/` (the shell copy — NOT any retired package)
   - Confirm still reproducible, then fix

3. **BottomNav.css minor bug** — `.bn-signout` has `font-family` declared twice
   (once `inherit`, once emoji stack). Harmless, fix next session.

4. **Chunk size** — JS bundle ~635 KB. Known/expected. Address with dynamic imports
   if load time is a concern.

5. **CLAUDE.md needs updating** — Add HomeTab architecture, desktop sidebar decisions,
   and update tools status for dashboard.

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md (standard)
2. Test desktop layout in browser — confirm sidebar + planner layout
3. Update CLAUDE.md with session 15 decisions (HomeTab arch, desktop sidebar, tools status)
4. If import merge bug confirmed by Rob: follow `calm-whistling-clock.md` plan

---

## Key file locations (updated this session)

```
packages/dashboard/src/
├── App.css                       # desktop: margin-left 200px + planner DayStrip overrides
├── App.jsx                       # passes onTabChange to HomeTab
├── components/
│   ├── BottomNav.jsx             # brand + tabs + sign-out footer (desktop sidebar)
│   ├── BottomNav.css             # desktop sidebar media query
│   ├── ToolCard.jsx              # onClick prop support added
│   └── ToolCard.css              # button.tool-card-link reset added
├── hooks/
│   └── useHomeSummary.js         # NEW — live Firestore for home tab
└── tabs/
    ├── HomeTab.jsx               # morning summary + brand header
    └── HomeTab.css               # morning summary styles
```
