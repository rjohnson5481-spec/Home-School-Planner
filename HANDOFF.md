# HANDOFF — v0.31.2 Phase 3 Session 3: Compliance UI moved to Academic Records

## What was completed this session
- Phase 3 Session 3 (structural refactor only — no
  behavioral change). Compliance UI relocated from
  Settings to Academic Records, where it conceptually
  belongs alongside school years, quarters, and breaks.
- `git mv` preserved file history:
  - `packages/dashboard/src/tabs/SettingsCompliance.jsx`
    → `packages/dashboard/src/tools/academic-records/components/ComplianceSection.jsx`
  - `packages/dashboard/src/tabs/SettingsCompliance.css`
    → `packages/dashboard/src/tools/academic-records/components/ComplianceSection.css`
  Both renames detected by git as 100%/94% similarity
  (relocation only, plus minimal internal updates).
- Internal updates to `ComplianceSection.jsx`:
  - Component renamed `SettingsCompliance` →
    `ComplianceSection`.
  - Import paths shifted up three levels to reach
    `firebase/compliance.js` and `constants/compliance.js`
    (from the new `tools/academic-records/components/`
    location).
  - CSS import updated to `./ComplianceSection.css`.
  - JSX class names left unchanged (`st-*` and `sc-*`
    prefixes both preserved). Settings CSS is loaded
    eagerly at app boot via `App.jsx` importing
    `SettingsTab`, so `st-toggle`, `st-card`, `st-row`,
    etc. remain globally available even when rendered
    inside Records. Per project rule "no gratuitous
    renames"; class restyling deferred.
- `RecordsMainView.jsx`: 179 → 183 lines. Added the
  `ComplianceSection` import, a `uid` prop, and the
  `<ComplianceSection uid={uid} />` render between the
  stats row and the `Grades — {selectedStudent}`
  section label.
- `AcademicRecordsTab.jsx`: 205 → 206 lines. Added
  `uid={uid}` prop pass to `<RecordsMainView ... />`.
- `SettingsTab.jsx`: 237 → 234 lines. Removed the
  `SettingsCompliance` import and the
  `<SettingsCompliance uid={uid} />` render line. No
  surrounding wrapper to clean up — `SettingsCompliance`
  rendered its own `<section>` element internally.
- `ComplianceSection.jsx` and `.css` line counts
  unchanged at 116 and 56 respectively (relocation,
  not rewrite).
- Grep `grep -rn "SettingsCompliance" packages/`
  returns zero matches in code after the move. Only
  hit anywhere in the repo was a single historical
  reference inside the prior HANDOFF's "Notes"
  section, which this rewrite supersedes.
- Version bumped to v0.31.2 (within-Phase-3 patch).
  Both workspace `package.json` files updated.
  CLAUDE.md line 2 milestone suffix updated to
  "Sessions 1–3 (settings + hours input + Records
  relocation)" and Tools status header bumped to
  (v0.31.2).

## Notes
- Placement choice: `<ComplianceSection>` sits
  between the stats row (Attendance / Courses /
  School Year cards) and the Grades section header
  inside `RecordsMainView`. Reasoning: visual flow
  reads as "year stats → requirements for this year
  → grades earned this year." Quick Actions remain at
  the bottom as before.
- Architecture decision: `RecordsMainView` is the
  presentational composer for the Records tab body;
  `AcademicRecordsTab` is a thin shell that owns
  state and threads it down. Compliance was wired
  into `RecordsMainView` (where the section flow
  lives), not directly into the tab file.
- File-size health: SettingsTab dropped 3 lines
  toward simpler scope; AcademicRecordsTab grew by
  one prop pass; RecordsMainView grew by one
  import + one render block. All well under the 250
  target / 300 hard limit.

## Manual verification protocol for Rob (after Netlify deploy)
1. Open Settings — confirm there is NO Compliance
   section anywhere in Settings (it should be gone).
2. Open Academic Records — confirm the Compliance
   section appears, in its new placement (between the
   stats cards and the Grades section heading).
3. Toggle "Track required school days" ON in the new
   location — value should save and persist on refresh.
4. Open the Planner — confirm the hours input row STILL
   appears when `hoursEnabled` is on (compliance data
   wiring still works through the move).
5. Toggle off in the new location — confirm the planner
   hours input disappears as before.

If anything else is different after the move, that's
a regression — the move was structural only.

## What is broken or incomplete
(Verified each carried-forward item still describes a
real condition in current code, per the
verify-before-carry-forward rule. Dropped one bullet:
"Phase 3 Session 3 next" — Session 3 was today.
Renumbered the remaining session bullets to match the
new 5-session-plus-deferred plan.)

- StudentDetailSheet header still renders a
  `{pts.points} pts` badge that always reads "0 pts"
  since HomeTab no longer passes a points prop. Last
  rewardTracker UI vestige — remove on next
  StudentDetailSheet touch.
- PDF helpers + `handleMoveCell` still live inside
  PlannerLayout.jsx via `usePlannerHelpers`.
  PlannerLayout is at 278/300 lines (22-line
  headroom). Must extract before adding any new code
  to PlannerLayout.
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
  SettingsTab is now even more redundant — Compliance
  has fully moved to Academic Records, so the
  placeholder's "Track academic year + ND compliance"
  copy points at functionality that lives elsewhere
  now. Remove on the next SettingsTab touch.
- Calendar import does not allow more than one of the
  same subject per day. If a student does extra work
  (e.g., three Reading 3 lessons in one day for
  accelerated remediation), the import flow rejects or
  silently dedupes the duplicate cells. Need to allow
  multiple cells with the same subject name on the
  same day. Likely fix lives in the PDF import or
  batch-add path — investigate `handleBatchAddSubject`
  in `usePlannerHelpers` and the `importCell` write
  logic (which probably uses subject name as the cell
  key). May require a key-shape change from
  `{subject}` to `{subject}-{instance}` or similar to
  allow duplicates without overwriting.
- Sick day cascade does not skip over existing all-day
  events. When sick day is confirmed for a day, the
  expected behavior is:
  1. Lessons on the sick day cascade forward by one
     position.
  2. A "Sick Day" all-day event is created on that day
     (this part is already working).
  3. The cascade must skip over any later day that
     already has an all-day event — those days stay
     clear of regular lessons because the all-day event
     blocks them.

  Concrete example: this week has Co-op as an all-day
  event on Wednesday. If a sick day fires on Monday,
  Monday's lessons should land on Tuesday, and
  Tuesday's lessons should jump past Wednesday and
  land on Thursday. Wednesday stays clear (Co-op
  preserved). Currently the cascade likely increments
  `dayIndex` by one without checking for existing
  all-day events on the destination day, so lessons
  can land on top of Co-op or other all-day events.

  Likely fix lives in `performSickDay` in
  `useSubjects.js` (planner). The cascade loop needs
  to check whether the destination day already has an
  `'allday'` cell before writing — if so, skip to the
  next day. End-of-week behavior (what happens if the
  cascade falls off Friday) should match whatever the
  current cascade does today, not be redesigned in
  this fix.
- Phase 3 Session 4 next — Compliance dashboard
  component (`ComplianceCard`) plus
  `useComplianceSummary` hook. Mount in Records (as
  the detailed view) and on the Home tab (as a glance
  summary). Days metric: `startingDays + count of
  distinct dates with any done cell within active
  school year`. Hours metric: `startingHours +
  sum(hoursLogged across schoolDays in same range)`.
  Recommended query is Option α from the design
  diagnostic: live `collectionGroup('subjects')
  .where('done','==',true)` + `subscribeSchoolDays`
  over the school-year range. New hook lives at
  `packages/dashboard/src/hooks/useComplianceSummary.js`;
  new component at
  `packages/dashboard/src/components/ComplianceCard.jsx`
  + `.css`.
- Phase 3 Session 5 — Replace Academic Records
  attendance calculation with Compliance data when
  enabled. Today `useAcademicSummary` derives
  attendance as `weekdays − breaks − sick days`
  (calendar math). When `daysEnabled` is true, the
  source of truth shifts to the Compliance count
  (distinct dates with done cells). When disabled,
  the calendar-math fallback stays.
- Phase 3 Session 6 (deferred) — Planned days view
  (X planned vs Y required), only built if Rob
  greenlights after Sessions 4–5.
- **Multi-family launch readiness — Phase 4
  prerequisite cluster.** Before any external testing
  family signs in, the following MUST land:
  1. Tighten Firestore rule R2 to uid-scope
     `collectionGroup('subjects')` reads (already
     documented from the security audit — current
     rule is auth-only, not uid-scoped).
  2. Add `uid` field to subject cell writes with a
     backfill migration so Option α dashboard queries
     don't read across families.
  3. Rewrite the (Session 4) compliance dashboard
     query to filter on `uid`.

  Without these, multi-family launch causes a data
  leak (one family can read another's lesson cells)
  AND quadratic read-cost scaling (each family pays
  for every other family's done cells on every
  dashboard load).

  Estimated effort: ~3 sessions of focused work.
  Treat as Phase 4 kickoff prerequisites, not future
  optimizations. Reason for urgency: Rob plans
  testing families in coming months, not 6+ months
  out.
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
3. Begin Session 4: design `ComplianceCard` component
   and `useComplianceSummary` hook (Option α query for
   days-completed, reuse `subscribeSchoolDays` for
   hours-completed). Mount in Records (the detail
   view) and on the Home tab (the summary glance).

## Key files changed recently
- packages/dashboard/src/tools/academic-records/components/ComplianceSection.jsx (renamed from tabs/SettingsCompliance.jsx)
- packages/dashboard/src/tools/academic-records/components/ComplianceSection.css (renamed from tabs/SettingsCompliance.css)
- packages/dashboard/src/tools/academic-records/components/RecordsMainView.jsx
- packages/dashboard/src/tabs/AcademicRecordsTab.jsx
- packages/dashboard/src/tabs/SettingsTab.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- CLAUDE.md
