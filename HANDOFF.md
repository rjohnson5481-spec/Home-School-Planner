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
- PDF helpers + `handleMoveCell` still live inside
  PlannerLayout.jsx via `usePlannerHelpers`. Further
  extraction on the next PlannerLayout touch if the file
  needs to shed more lines.
- Emoji maps are hardcoded for Orion/Malachi in 4 files.
  Deferred — needs a per-student emoji setting.
- firebase/backup.js still reads/writes the
  rewardTracker collection so old backups continue to
  round-trip. Safe — trim when the backup format is next
  revisited.
- HomeTab still defines a no-op `handleAwardPoints` and
  passes it as `onAwardPoints` to StudentDetailSheet,
  which no longer reads it. Harmless — delete on the
  next HomeTab touch.
- Firebase data cleanup needed — 2026-04-26 backup
  audit identified stale and orphaned Firestore
  documents that should be deleted manually via the
  Firebase console (not via code, for safety):
  - Test cell "Billybob" subject in
    `users/{uid}/weeks/2026-04-06/students/Malachi/days/1/subjects/Billybob`
    (lesson text contains UI test prompts about edge
    cases).
  - Two future-dated test sick days for Orion at
    `users/{uid}/sickDays/2026-09-14` and
    `users/{uid}/sickDays/2026-09-17` (subjects don't
    match current presets, leftover from sick-day
    cascade testing).
  - Test reportNote for Orion Q1 at
    `users/{uid}/reportNotes/oWpzkNdCB1kvXGb8HMTk`
    (notes field reads "Test notes").
  - Orphaned grade at
    `users/{uid}/grades/I9oVfEbkdSAN8DXXROjc` — points
    to enrollment `5rq1SYtokiWaoUcGRTRT` which no
    longer exists (cascading-delete artifact, invisible
    in app UI).
  - Optional cosmetic: Summer Break entry inside the
    2025-2026 schoolYear runs 2026-07-20 to 2026-07-31
    but the school year ends 2026-07-15. Either extend
    the school year end date or delete the Summer
    Break entry. Not breaking anything; nice-to-have.

  After cleanup, export a fresh backup and re-audit to
  confirm deletions and verify real data intact.

  Do NOT delete the rewardTracker stale balance/log
  mismatch — `firebase/backup.js` still round-trips
  this collection per CLAUDE.md; leave for the next
  backup-format revision.

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
