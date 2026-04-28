# HANDOFF — v0.33.2 Fix: desktop hours footer bar

## What was completed this session
- Reverted the clunky per-column scroll approach
  from v0.33.1. Removed the viewport-anchored
  `.cwv-grid` height, the per-column body overflow,
  the `.cwv-col-foot` JSX wrapper, and the per-column
  `.cwv-col-hours` HRS row + supporting CSS.
- Implemented Option 1 from the placement mockup: a
  single hours footer bar below the calendar grid
  that spans all 5 weekdays. Each cell renders a
  small HRS label + the existing
  `CalendarHoursInput` (focus-guarded). The page
  scrolls naturally — no per-column scrollbars.
- Wrapped the grid + hours bar in a new
  `.cwv-calendar` container so the visual chrome
  (border / radius / background / 100px bottom
  margin clearing the PlannerActionBar) stays
  continuous regardless of `hoursEnabled` state.
- Footer bar only renders when `hoursEnabled`
  (compliance setting) is true. Mobile is untouched
  — all new rules live inside
  `@media (min-width: 810px)` and the component
  doesn't mount below 810px anyway.
- Same data wiring as before — `onSaveHours` /
  `onFlushHours` props from `useCompliance` hook,
  500ms debounced writes per dateString. Only
  placement of the input changed.

## What is broken or incomplete
Apply verify-before-carry-forward.
- StudentDetailSheet header pts.points badge
- PDF helpers + handleMoveCell still in PlannerLayout
- Emoji maps hardcoded for Orion/Malachi
- firebase/backup.js rewardTracker round-trip
- HomeTab handleAwardPoints no-op
- "School Year — Coming Soon" placeholder in SettingsTab
- Calendar import duplicate-subject bug
- Sick day cascade all-day-event bug
- Firebase data cleanup TODO from 2026-04-26 backup
  audit
- Attendance detail sheet still shows calendar math
  (158/175) while Records front card shows compliance
  data — minor inconsistency, deferred

Phase 4 multi-family launch readiness — required
before any external testing family signs in.
See CLAUDE.md for prerequisite cluster.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Verify on main, pull latest
3. Discuss: fix Attendance detail sheet
   inconsistency, OR begin Phase 4 kickoff

## Key files changed recently
- packages/dashboard/src/tools/planner/components/CalendarWeekView.jsx
- packages/dashboard/src/tools/planner/components/CalendarWeekView.css
- packages/dashboard/package.json
- packages/shared/package.json
- CLAUDE.md
