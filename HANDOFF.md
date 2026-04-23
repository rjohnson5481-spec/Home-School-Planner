# HANDOFF — v0.30.2 PlannerLayout cell-toggle extraction

## What was completed this session
- useCellToggles hook created at
  `packages/dashboard/src/tools/planner/hooks/useCellToggles.js`.
  Owns all cell-toggle logic including the
  Firebase-direct `toggleCellDone(dayIndex, subject)`
  path that CalendarWeekView uses to check off cells on
  any day of the current week. Signature:
  `useCellToggles({ user, weekId, student, day, dayData,
  updateCell })` → `{ handleToggleDone, handleToggleFlag,
  toggleCellDone }`. 30 lines, no JSX, no component
  imports.
- PlannerLayout.jsx reduced from 275 → 261 lines.
  - Dropped the `readCell` / `updateCell as fbWriteCell`
    import from `../firebase/planner.js` — the project
    rule that "Firebase calls never live in components"
    is no longer violated here.
  - Deleted the three local helpers `handleToggleDone`,
    `handleToggleFlag`, and `onToggleDone` (the async
    Firebase-direct one).
  - Added `useCellToggles` call alongside the other
    hook calls.
  - `CalendarWeekView.onToggleDone` now receives
    `toggleCellDone`; `SubjectCard.onToggleDone` /
    `onToggleFlag` still receive `handleToggleDone` /
    `handleToggleFlag` (names unchanged, source is now
    the hook).
- Dead `wipeWeek` prop removed from the full chain:
  PlannerLayout destructure, PlannerTab destructure +
  prop pass, useSubjects function body, and useSubjects
  return value. Grep confirmed zero external consumers
  before the sweep, and zero remaining references after.
- Version bumped to v0.30.2 in both workspace
  package.json files. CLAUDE.md line 2 version stamp and
  the "Tools status" section header both updated to
  v0.30.2. Milestone suffix on line 2 preserved.

## What is broken or incomplete
- StudentDetailSheet header still renders a
  `{pts.points} pts` badge that always reads "0 pts"
  since HomeTab no longer passes a points prop. Last
  rewardTracker UI vestige — remove on next
  StudentDetailSheet touch.
- useSubjects.js and useSickDay.js both subscribe to
  sick days. Duplicate listener — collapse on the next
  useSubjects touch.
- CalendarWeekView.jsx calls Firebase and useAuth
  directly instead of going through props/hooks.
  Refactor on next touch.
- PDF helpers + `handleMoveCell` still live inside
  PlannerLayout.jsx via `usePlannerHelpers`. Further
  extraction on the next PlannerLayout touch if the file
  needs to shed more lines.
- Emoji maps are hardcoded for Orion/Malachi in 4 files.
  Deferred — needs a per-student emoji setting.
- Netlify Blobs auto-backup is running but still
  unverified — confirm a backup appears in the Blobs
  store after the next scheduled run.
- firebase/backup.js still reads/writes the
  rewardTracker collection so old backups continue to
  round-trip. Safe — trim when the backup format is next
  revisited.
- HomeTab still defines a no-op `handleAwardPoints` and
  passes it as `onAwardPoints` to StudentDetailSheet,
  which no longer reads it. Harmless — delete on the
  next HomeTab touch.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Confirm on main, pull latest
3. Ask Rob what we are building today

## Key files changed recently
- packages/dashboard/src/tools/planner/hooks/useCellToggles.js (new)
- packages/dashboard/src/tools/planner/components/PlannerLayout.jsx
- packages/dashboard/src/tools/planner/hooks/useSubjects.js
- packages/dashboard/src/tabs/PlannerTab.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- CLAUDE.md
