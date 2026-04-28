# HANDOFF — v0.32.0 Phase 3 Session 4: Compliance dashboard

## What was completed this session
- Phase 3 Session 4: Compliance dashboard component
  and cross-tab navigation. The user-visible feature:
  a "DAYS COMPLETED" / "HOURS COMPLETED" summary card
  appears on the Home tab and inside the Records
  Compliance sheet whenever compliance is enabled,
  with live progress against required values.
- New hook
  `packages/dashboard/src/hooks/useComplianceSummary.js`
  (130 lines). Fetches school-year-wide data via:
  - `subscribeCompliance` for settings (toggles +
    required + starting values).
  - One-shot `getDocs` of `users/{uid}/schoolYears`
    plus the active-school-year picker idiom from
    `useHomeSummary` (find-in-range, fall back to
    most-recent-by-startDate).
  - **Option α** for days completed: live
    `collectionGroup('subjects').where('done','==',
    true)` `onSnapshot` subscription. Client-side
    derives the dateString from each cell's path,
    excludes the `'allday'` subject, filters to the
    active school-year window, dedupes into a Set,
    and counts. `daysCompleted = startingDays +
    distinctDoneDates.size`.
  - Reused `subscribeSchoolDays` over the school-year
    range for hours. `hoursCompleted = startingHours
    + sum(hoursLogged)`.
  - Skips the days/hours subscriptions entirely when
    the corresponding toggle is off OR when no school
    year exists, so unused metrics don't pay reads.
- New component
  `packages/dashboard/src/components/ComplianceCard.jsx`
  + `.css` (84 + 73 lines). One component with
  `variant="home" | "sheet"` prop. Reuses the
  `.ar-stat-card` / `.ar-stat-label` / `.ar-stat-value`
  / `.ar-stat-sub` classes from
  `AcademicRecordsTab.css` (loaded globally via
  App.jsx's eager AcademicRecordsTab import). Adds a
  thin gold gradient progress bar matching
  `.home-progress-fill-attendance`. Renders one card
  per enabled metric (1 or 2 cards side-by-side),
  empty-state copy when no school year exists, and
  returns null when neither toggle is enabled.
- `packages/dashboard/src/App.jsx` (61 → 75 lines).
  Added `pendingRecordsAction` `useState` (values
  `'compliance' | null`). HomeTab now receives
  `setActiveTab` and `setPendingRecordsAction`;
  AcademicRecordsTab receives `pendingRecordsAction`
  + `setPendingRecordsAction`. No new context — just
  prop drilling, matching the existing pattern.
- `packages/dashboard/src/tabs/HomeTab.jsx`
  (122 → 128 lines). Imports `useComplianceSummary`
  + `ComplianceCard`, calls the hook, renders
  `<ComplianceCard summary variant="home"
  onCardClick={...}>` between `.home-header-bar` and
  `.home-students`. The click handler chains
  `setActiveTab('academic')` +
  `setPendingRecordsAction('compliance')`.
- `packages/dashboard/src/tools/academic-records/components/ComplianceSheet.jsx`
  (135 → 139 lines). Imports `useComplianceSummary`
  + `ComplianceCard`, calls the hook (sheet's own
  subscription is fine — Firestore dedupes identical
  onSnapshot queries), renders `<ComplianceCard
  summary variant="sheet" />` at the top of the sheet
  body, above the helper paragraph.
- `packages/dashboard/src/tabs/AcademicRecordsTab.jsx`
  (209 → 219 lines). Destructures
  `pendingRecordsAction` + `setPendingRecordsAction`
  props. Adds a `useEffect` that runs when
  `pendingRecordsAction` changes — if the value is
  `'compliance'`, calls `setComplianceSheetOpen(true)`
  and clears the action via
  `setPendingRecordsAction(null)`. The clear prevents
  the sheet from re-opening if the user closes it.
- Versions consistent at v0.32.0 across all four
  locations (`packages/dashboard/package.json`,
  `packages/shared/package.json`, CLAUDE.md line 2,
  CLAUDE.md `## Tools status (v0.32.0)`). Minor bump
  (not patch) because Session 4 lands a new
  user-facing feature, not a refactor or fix.

## Notes
- Recovery context: this session was originally
  authored across two attempts. The first attempt
  hit a network timeout during the HANDOFF.md
  rewrite step — same failure mode as the Session
  3.6 timeout from two weeks ago. All seven code
  commits + the version bump landed locally
  (`ee97863`, `5dde973`, `a4bc477`, `11d1ff6`,
  `d392537`, `c07e960`, `845c35e`). This HANDOFF
  rewrite is the missing eighth step. No code
  changes were made in the recovery — only this
  file was authored, committed, and pushed
  alongside the seven preexisting code commits.
- File-size targets: useComplianceSummary 130/130
  lines (at target), ComplianceCard.jsx 84/110
  (under), ComplianceCard.css 73/100 (under). All
  edited files comfortably under the 300-line hard
  limit (HomeTab 128/300, ComplianceSheet 139/300,
  AcademicRecordsTab 219/300, App.jsx 75/300).
- Hook deduplication: `useComplianceSummary` is
  called in two places (HomeTab + ComplianceSheet),
  but in practice only one mount runs at any given
  time because App.jsx renders the active tab only.
  Even when both ran, Firestore's client SDK
  deduplicates identical `onSnapshot` queries on
  the same document or query reference, so
  read-cost is paid once server-side.

## Manual verification protocol for Rob (after Netlify deploy)
1. Open Records → "Track Compliance" is still in
   Quick Actions, sheet still opens with toggles
   (Session 3.6 behavior unchanged).
2. Enable "Track required school days," set
   `requiredDays` and `startingDays`, close the
   sheet.
3. Go to Home → ComplianceCard appears between the
   greeting bar and the per-student cards. Shows
   "DAYS COMPLETED" big number, "of N days
   required" sub-line, gold progress bar.
4. Tap the ComplianceCard on Home → app switches
   to Records tab AND auto-opens the Compliance
   sheet.
5. Inside the open sheet → ComplianceCard appears
   at the top of the sheet body, above the helper
   text. Same metrics as on Home.
6. Adjust required values inside the sheet → both
   the in-sheet card and the Home card reflect
   changes (verify by closing the sheet and
   navigating back to Home).
7. Mark a lesson done in the planner → after a
   short delay (live subscription), `daysCompleted`
   ticks up by 1.
   **First-run note:** the new query may trigger a
   one-time Firestore single-field index creation
   for `subjects.done`. If the browser console shows
   a "create index" link, click it once, wait 1–2
   minutes for the index to build, then refresh.
   Subsequent runs use the index transparently.
8. Disable both compliance toggles → ComplianceCard
   disappears from both surfaces immediately
   (live `subscribeCompliance` listener).
9. With no active school year (delete the active
   one), enable compliance → ComplianceCard shows
   the empty-state copy: "Set up a school year in
   Academic Records to track compliance progress."
10. Re-enable a school year → ComplianceCard
    reverts to normal display.

Anything else differing from "new dashboard appears
in two places + Home card opens Records sheet" is a
regression.

## What is broken or incomplete
(Verified each carried-forward item still describes
a real condition in current code. Updated the Phase 3
session roadmap to reflect Session 4 as done. Added
one new finding from this session.)

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
  files. Deferred — needs a per-student emoji
  setting.
- firebase/backup.js still reads/writes the
  rewardTracker collection so old backups continue
  to round-trip. Safe — trim when the backup format
  is next revisited.
- HomeTab still defines a no-op `handleAwardPoints`
  reference (now harmless) — wait, this was actually
  removed in the v0.30.1 cleanup; verified in
  current code there is no `handleAwardPoints` left.
  **Dropping this carry-forward bullet — condition
  resolved.**
- "School Year — Coming Soon" placeholder row in
  SettingsTab is even more redundant now that
  Compliance has a full dashboard in Records.
  Remove on the next SettingsTab touch.
- Calendar import does not allow more than one of
  the same subject per day. If a student does extra
  work (e.g., three Reading 3 lessons in one day for
  accelerated remediation), the import flow rejects
  or silently dedupes the duplicate cells. Need to
  allow multiple cells with the same subject name on
  the same day. Likely fix lives in the PDF import
  or batch-add path — investigate
  `handleBatchAddSubject` in `usePlannerHelpers` and
  the `importCell` write logic (which probably uses
  subject name as the cell key). May require a
  key-shape change from `{subject}` to
  `{subject}-{instance}` or similar to allow
  duplicates without overwriting.
- Sick day cascade does not skip over existing
  all-day events. When sick day is confirmed for a
  day, the expected behavior is:
  1. Lessons on the sick day cascade forward by one
     position.
  2. A "Sick Day" all-day event is created on that
     day (this part is already working).
  3. The cascade must skip over any later day that
     already has an all-day event — those days stay
     clear of regular lessons because the all-day
     event blocks them.

  Concrete example: this week has Co-op as an
  all-day event on Wednesday. If a sick day fires
  on Monday, Monday's lessons should land on
  Tuesday, and Tuesday's lessons should jump past
  Wednesday and land on Thursday. Wednesday stays
  clear (Co-op preserved). Currently the cascade
  likely increments `dayIndex` by one without
  checking for existing all-day events on the
  destination day.

  Likely fix lives in `performSickDay` in
  `useSubjects.js` (planner). The cascade loop
  needs to check whether the destination day
  already has an `'allday'` cell before writing —
  if so, skip to the next day.
- Sheet-skeleton CSS duplication —
  `ComplianceSheet.css` (121 lines) and
  `CourseCatalogSheet.css` (261 lines) duplicate
  the overlay / panel / handle / header / close /
  slide-up-animation chrome. No action needed
  today, but if a future session adds a third
  Quick Actions sheet that wants the same
  skeleton, consider extracting a shared CSS
  partial.
- Phase 3 Session 5 next — Replace Academic Records
  attendance calculation with Compliance data when
  `daysEnabled` is true. Today `useAcademicSummary`
  derives attendance as `weekdays − breaks − sick
  days` (calendar math). When `daysEnabled` is true,
  the source of truth shifts to
  `useComplianceSummary`'s `daysCompleted` (distinct
  dates with done cells). When disabled, the
  calendar-math fallback stays. Likely a single-file
  edit to `useAcademicSummary`.
- Phase 3 Session 6 (deferred) — Planned days view
  (X planned vs Y required), only built if Rob
  greenlights after Session 5.
- **Multi-family launch readiness — Phase 4
  prerequisite cluster. THIS SESSION GRADUATES THE
  DEBT FROM THEORETICAL TO ACTUAL.** The new
  `collectionGroup('subjects').where('done','==',
  true)` query in `useComplianceSummary` is the
  first line in the live app that reads ALL
  families' done cells (no `uid` field exists on
  cells today, so the query can't filter by uid
  server-side). Acceptable only because the app is
  currently single-family. Before any external
  testing family signs in, the following MUST land:
  1. Tighten Firestore rule R2 to uid-scope
     `collectionGroup('subjects')` reads (already
     documented from the security audit — current
     rule is auth-only, not uid-scoped).
  2. Add `uid` field to subject cell writes with a
     backfill migration for existing cells.
  3. Rewrite `useComplianceSummary`'s days query to
     filter by `where('uid', '==', currentUid)`.

  Without these, multi-family launch causes (a) a
  data leak (one family can read another's lesson
  cells via `collectionGroup`) and (b) quadratic
  read-cost scaling (each family pays for every
  other family's done cells on every dashboard
  load).

  Estimated effort: ~3 sessions of focused work.
  Treat as Phase 4 kickoff prerequisites, not future
  optimizations. Reason for urgency: Rob plans
  testing families in coming months, not 6+ months
  out.
- **NEW from Session 4: Firestore `subjects.done`
  single-field index may need one-time
  auto-creation.** The first user who runs
  ComplianceCard against a database that lacks the
  index may see a "create index" link in the
  browser console. Click once, wait 1–2 minutes,
  refresh — subsequent runs use the index
  transparently. Worth flagging for Phase 4
  onboarding flow: testing families should not see
  this as their first impression. Either pre-create
  the index in the Firebase console before
  onboarding any family, or document the
  click-and-wait step in onboarding instructions.
- Firebase data cleanup needed — 2026-04-26 backup
  audit identified stale and orphaned Firestore
  documents that should be deleted manually via the
  Firebase console (not via code, for safety):
  - Test cell "Billybob" subject in
    `users/{uid}/weeks/2026-04-06/students/Malachi/days/1/subjects/Billybob`
    (lesson text contains UI test prompts about
    edge cases).
  - Two future-dated test sick days for Orion at
    `users/{uid}/sickDays/2026-09-14` and
    `users/{uid}/sickDays/2026-09-17` (subjects
    don't match current presets, leftover from
    sick-day cascade testing).
  - Test reportNote for Orion Q1 at
    `users/{uid}/reportNotes/oWpzkNdCB1kvXGb8HMTk`
    (notes field reads "Test notes").
  - Orphaned grade at
    `users/{uid}/grades/I9oVfEbkdSAN8DXXROjc` —
    points to enrollment `5rq1SYtokiWaoUcGRTRT`
    which no longer exists (cascading-delete
    artifact, invisible in app UI).
  - Optional cosmetic: Summer Break entry inside
    the 2025-2026 schoolYear runs 2026-07-20 to
    2026-07-31 but the school year ends 2026-07-15.
    Either extend the school year end date or
    delete the Summer Break entry. Not breaking
    anything; nice-to-have.

  After cleanup, export a fresh backup and re-audit
  to confirm deletions and verify real data intact.

  Do NOT delete the rewardTracker stale balance/log
  mismatch — `firebase/backup.js` still round-trips
  this collection per CLAUDE.md; leave for the next
  backup-format revision.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Verify on main, pull latest
3. Begin Session 5: replace `useAcademicSummary`'s
   attendance count with `useComplianceSummary`'s
   `daysCompleted` when `daysEnabled` is true.
   Single-file edit (probably). When `daysEnabled`
   is false, attendance falls back to the existing
   calendar-math behavior.

## Key files changed recently
- packages/dashboard/src/hooks/useComplianceSummary.js (new)
- packages/dashboard/src/components/ComplianceCard.jsx (new)
- packages/dashboard/src/components/ComplianceCard.css (new)
- packages/dashboard/src/App.jsx
- packages/dashboard/src/tabs/HomeTab.jsx
- packages/dashboard/src/tabs/AcademicRecordsTab.jsx
- packages/dashboard/src/tools/academic-records/components/ComplianceSheet.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- CLAUDE.md
