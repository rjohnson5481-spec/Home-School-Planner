# HANDOFF — v0.31.0 Phase 3 Session 1: Compliance foundation

## What was completed this session
- Phase 3 School Days Compliance feature kicked off
  (Session 1 of 4, with a deferred Session 5).
- `packages/dashboard/src/constants/compliance.js`
  created — path builders (`compliancePath`,
  `schoolDaysPath`, `schoolDayDocPath`) and
  `COMPLIANCE_DEFAULTS` ({ daysEnabled, requiredDays,
  startingDays, hoursEnabled, requiredHours,
  startingHours }).
- `packages/dashboard/src/firebase/compliance.js`
  created — four named exports:
  `subscribeCompliance(uid, cb)` (falls back to defaults
  when no doc), `saveCompliance(uid, settings)` (setDoc
  merge:true), `saveSchoolDayHours(uid, dateString,
  hours)`, and `subscribeSchoolDays(uid, startDate,
  endDate, cb)` (documentId range query). 49 lines, no
  business logic.
- `packages/dashboard/src/tabs/SettingsCompliance.jsx`
  +`.css` created as a separate component (extracted
  per the file-size rule — see "Notes" below). 116 + 56
  lines. Subscribes to compliance settings, renders two
  toggles (days, hours) and conditional number inputs
  for required + starting values, saves changes
  debounced 500ms via `saveCompliance`. Toggle-off
  preserves saved values; inputs only hide.
- `SettingsTab.jsx` wired the new component in via two
  one-line additions (import + `<SettingsCompliance
  uid={uid} />` after the Planner section in the left
  column). SettingsTab grew from 234 → 237 lines, well
  under the 250 target.
- Version bumped to v0.31.0 in both workspace
  `package.json` files. CLAUDE.md line 2 stamp updated
  with new milestone suffix and Tools status header
  updated to (v0.31.0). Minor bump rather than patch
  because this opens Phase 3.

## Notes
- File-size rule check: the prompt described an
  inline-into-SettingsTab approach. SettingsTab was
  already at 234 lines — adding ~80 lines inline would
  have pushed it past the 300-line hard limit. Followed
  the existing extract pattern (`<DataBackupSection
  uid={uid} />`) and put compliance in its own file.
  Same external behavior; cleaner separation; no
  file-size violation.
- The pre-existing "School Year — Coming Soon" badge
  row in SettingsTab's Planner section was left in
  place. It overlaps in intent with the new Compliance
  section ("Track academic year + ND compliance") and
  is now arguably redundant. Flagging for removal on
  the next SettingsTab touch — left untouched this
  session per the don't-touch-unrelated-content rule.
- No user-facing planner or Home tab impact yet.
  Sessions 2 and 3 add the per-day hours input and the
  dashboard surfaces.

## What is broken or incomplete
(Verified each carried-forward item still describes a
real condition in current code, per the new
verify-before-carry-forward rule in CLAUDE.md.)

- StudentDetailSheet header still renders a
  `{pts.points} pts` badge that always reads "0 pts"
  since HomeTab no longer passes a points prop. Last
  rewardTracker UI vestige — remove on next
  StudentDetailSheet touch.
- PDF helpers + `handleMoveCell` still live inside
  PlannerLayout.jsx via `usePlannerHelpers`. Further
  extraction on the next PlannerLayout touch if the
  file needs to shed more lines.
- Emoji maps are hardcoded for Orion/Malachi in 4
  files. Deferred — needs a per-student emoji setting.
- firebase/backup.js still reads/writes the
  rewardTracker collection so old backups continue to
  round-trip. Safe — trim when the backup format is
  next revisited.
- HomeTab still defines a no-op `handleAwardPoints`
  and passes it as `onAwardPoints` to
  StudentDetailSheet, which no longer reads it.
  Harmless — delete on the next HomeTab touch.
- "School Year — Coming Soon" placeholder row in
  SettingsTab is now redundant with the new
  Compliance section. Remove on the next SettingsTab
  touch.
- Phase 3 Session 2 next — hours input on each day in
  planner (DayStrip + CalendarWeekView), conditional
  on `compliance.hoursEnabled`. Writes to
  `users/{uid}/schoolDays/{dateString}.hoursLogged`
  via `saveSchoolDayHours`.
- Phase 3 Session 3 after that — compliance dashboard
  on the Home tab and Settings. Reads via
  `subscribeSchoolDays` + `subscribeCompliance`,
  computes `startingDays + distinctDoneDates` and
  `startingHours + sum(hoursLogged)`.
- Phase 3 Session 4 — replace academic records
  attendance calculation with compliance data when
  enabled (so the source of truth shifts from
  weekdays-minus-breaks-minus-sick to the live
  compliance counts).
- Phase 3 Session 5 (deferred) — planned days view
  (X planned vs Y required), only built if Rob
  greenlights after Sessions 2-4.
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
    longer exists (cascading-delete artifact,
    invisible in app UI).
  - Optional cosmetic: Summer Break entry inside the
    2025-2026 schoolYear runs 2026-07-20 to
    2026-07-31 but the school year ends 2026-07-15.
    Either extend the school year end date or delete
    the Summer Break entry. Not breaking anything;
    nice-to-have.

  After cleanup, export a fresh backup and re-audit to
  confirm deletions and verify real data intact.

  Do NOT delete the rewardTracker stale balance/log
  mismatch — `firebase/backup.js` still round-trips
  this collection per CLAUDE.md; leave for the next
  backup-format revision.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Verify on main, pull latest
3. Begin Session 2: hours input in planner DayStrip +
   CalendarWeekView, conditional on
   `compliance.hoursEnabled`

## Key files changed recently
- packages/dashboard/src/constants/compliance.js (new)
- packages/dashboard/src/firebase/compliance.js (new)
- packages/dashboard/src/tabs/SettingsCompliance.jsx (new)
- packages/dashboard/src/tabs/SettingsCompliance.css (new)
- packages/dashboard/src/tabs/SettingsTab.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- CLAUDE.md
