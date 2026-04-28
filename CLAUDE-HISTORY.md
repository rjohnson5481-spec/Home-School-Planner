# CLAUDE-HISTORY.md — Iron & Light Johnson Academy
## Phase History & Migration Notes

Read this file only when Rob explicitly requests historical context.
Do not read by default.

---

## Phase roadmap — project-wide

### Phase 1 — ✅ COMPLETE at v0.22.9
- Unified app shell with 6-tab bottom nav (mobile) + 200px left sidebar (desktop)
- Planner: per-day implicit subjects, PDF import, sick day cascade, month picker, batch add, large done checkbox, All Day Event
- Reward Tracker: award/deduct/spend sheets, log, cash conversion (15 pts = $1)
- HomeTab: morning summary with lessons + points for both students
- Unified Settings tab (dark mode, students, default subjects, clear cache, sign out)
- Custom domain homeschool.grasphislove.com
- Responsive: 400–1023 large-phone scaling band, 1024 desktop breakpoint (later raised to 810)
- TE Extractor: vanilla JS, served at /te-extractor/, links out from shell

### Phase 2 — ✅ COMPLETE at v0.24.1
- Academic Records tab — course catalog, enrollments, school years/quarters/breaks, grade entry, attendance, AI calendar import, Report/Transcript Generator, PDF generation, Firebase Storage, activities tracking, AI curriculum import
- Home tab rework — per-student cards, tappable mobile, expanded desktop
- Dynamic student lists everywhere (onSnapshot real-time)

### Desktop Redesign — ✅ COMPLETE at v0.27.4
- CalendarWeekView — 5-column Mon–Fri grid, today highlighted, drag-and-drop
- Backup system — Option C manual (export/diff restore/factory reset) + Option B auto 6-hour
- PDF diff import — Parse → Review → Publish flow
- Sick day desktop selector
- Restore from Backup diff engine — student selector, conflict highlighting

### Project split — ✅ COMPLETE at v0.30.0
- Reward Tracker, TE Extractor, and shared Tools tab removed entirely
- Moved to separate Johnson-Web-Tools project
- Planner becomes pure lesson planning + academic records tool
- Shell tabs reduced to 4: Home / Planner / Records / Settings
- Desktop breakpoint raised from 1024px to 810px (S25 Ultra compatibility)
- Large phone band rebound to 400–809px

### Phase 3 — 🔧 MID-REWORK (as of v0.32.1)
- School Days compliance — per-student tracking of state-required days/hours
- Sessions 1–4 shipped family-wide design before discovering per-student requirement
- v0.32.1 migrated data to per-student shape (expand-then-contract)
- Sessions 4.2–5 rework app code to match new shape
- See CLAUDE.md roadmap for active session plan

### Phase 4 — 🔒 NOT STARTED
- Multi-family launch readiness (uid scoping, cell uid field, query rewrite — must land first)
- Strip hardcoded "Iron & Light Johnson Academy" — brand-agnostic shell
- Student profiles migration (currently name strings)
- Stripe integration + Free/Pro feature gating
- Admin dashboard (Rob-only access)
- 50-state compliance database

### Phase 5 — 🔒 NOT STARTED
- Month view (unlocks Friday sick-day cascade fix)
- Multi-week lesson import
- ICS import for breaks/holidays
- Event & appointment planning
- Offline service worker
- Privacy policy
- Google Play TWA, iOS Median.co wrapper

---

## Build log — Phase 1 (v0.0 → v0.22.9, completed)

✓ Firebase/Firestore layer (firebase/planner.js)
✓ Netlify Function — parse-schedule (BJU Homeschool Hub "Print By Day" format)
✓ Hooks (useWeek, useSubjects, usePdfImport, usePlannerUI)
✓ PlannerLayout + Header + DayStrip
✓ SubjectCard + EditSheet
✓ AddSubjectSheet + UploadSheet
✓ Bug fix: addSubject no longer pre-populates future days
✓ Data model redesign: per-day implicit subjects
✓ Bug fix: PDF import uses parsedData.weekId/student
✓ Feature: Delete Week
✓ Feature: Month picker
✓ Feature: Upload sheet — rich parse preview, wipe toggle, success state, debug log
✓ Feature: Sick Day — cascade shift algorithm, Firestore markers, red dot on DayStrip
✓ Visual Polish Sessions 1 & 2 — Ink & Gold tokens, header redesign, DayStrip floating pill, SubjectCard, sheets, action bar
✓ Settings sheet — dark mode toggle, students list, default subjects
✓ v0.19.0 — PWA theme_color #22252e; student delete; Header students from Firestore
✓ v0.21.0 — All Day Event (allday key); desktop responsive layout ≥768px
✓ v0.21.1 — 11-fix polish pass
✓ v0.21.2 — Fix allday key (was __allday__, rejected by Firestore); weekId normalized to Monday
✓ Session 16 — SubjectCard three-column layout; AddSubjectSheet multi-day/multi-student batch add
✓ v0.22.0 — Desktop shell polish: planner header hidden; desktop week nav in content; student state lifted to App.jsx
✓ v0.22.2 — Desktop CSS audit + consolidation; day-strip non-sticky on desktop
✓ v0.22.6 — Unified Settings tab; planner SettingsSheet retired
✓ v0.22.8 — Removed max-width: 480px on mobile
✓ v0.22.9 — Phase 1 complete; 400–1023px large-phone scaling band

---

## Build log — Desktop calendar (v0.25 → v0.27.4)

✓ v0.25.0 — CalendarWeekView built; replaces DayStrip layout at desktop
✓ v0.25.3 — Selection state removed; click to open / hold to drag
✓ v0.26.x — Backup system Option C (manual) built
✓ v0.26.x — Backup system Option B (scheduled Netlify function) built
✓ v0.27.0 — PDF diff import (Parse→Review→Publish) replaces immediate-write import
✓ v0.27.4 — PlannerLayout split: PlannerActionBar + UndoSickSheet extracted

---

## Build log — Backup/restore (v0.27 → v0.28.5)

✓ v0.27.5 — Export filename uses email username + date
✓ v0.27.6–v0.27.7 — Sick day desktop day selector; cascade wired to activeDay
✓ v0.27.8 — Full restore delete phase fixed — uses collectionGroup not nested walk
✓ v0.27.9 — Diff engine (generateRestoreDiff, applyRestoreDiff); RestoreDiffSheet mobile
✓ v0.28.0 — RestoreDiffCalendar desktop; mobile/desktop routing in RestoreDiffSheet
✓ v0.28.1 — Student selector in RestoreDiffCalendar
✓ v0.28.2–v0.28.3 — Undo sick day correct day from Firestore; desktop button fix
✓ v0.28.4 — Mobile sick day sheet restored to single day display
✓ v0.28.5 — useSickDay hook; Undo button driven by Firestore onSnapshot

---

## Build log — Project split (v0.29 → v0.30.0)

✓ v0.29.x — Mobile multi-select feature (long-press, MultiSelectBar, batch operations)
✓ v0.30.0 — Major project split. Reward Tracker, TE Extractor, and Tools tab removed entirely. Moved to separate Johnson-Web-Tools project. Shell tabs reduced to 4: Home / Planner / Records / Settings. Desktop breakpoint raised 1024 → 810px. Large phone band rebound to 400–809px.

---

## Build log — Cleanup + Phase 3 prep (v0.30.1 → v0.30.2)

✓ v0.30.1 — Cleanup of project-split leftovers. Removed Quick Award + Points UI from HomeTab and StudentDetailSheet. Removed useHomeSummary rewardTracker subscription. Removed dead sickDayIndices prop in PlannerTab. Deleted constants/tools.js. Fixed stale 1024→810 comments.
✓ v0.30.2 — PlannerLayout split. Extracted useCellToggles hook (handleToggleDone, handleToggleFlag, toggleCellDone). Removed Firebase rule violation in PlannerLayout. Swept dead wipeWeek prop. PlannerLayout 275→261 lines.

---

## Build log — Phase 3 School Days compliance (v0.31.0 → v0.32.1)

### Family-wide design (later discovered to be wrong)

✓ v0.31.0 — Phase 3 Session 1. Settings UI for compliance. Created constants/compliance.js (path builders, COMPLIANCE_DEFAULTS), firebase/compliance.js (subscribeCompliance, saveCompliance, saveSchoolDayHours, subscribeSchoolDays), SettingsCompliance.jsx.
✓ v0.31.1 — Phase 3 Session 2. Planner hours input. Created useCompliance hook, HoursInputRow.jsx + .css for mobile, CalendarHoursInput inline subcomponent for desktop column footers.
✓ v0.31.2 — Phase 3 Session 3. Compliance moved Settings → Records via git mv. SettingsCompliance.jsx → ComplianceSection.jsx in academic-records/components/.
✓ v0.31.3 — Phase 3 Session 3.5. Inline collapse pattern (turned out to be wrong; superseded).
✓ v0.31.4 — Phase 3 Session 3.6. Modal sheet matching CourseCatalogSheet pattern. ComplianceSection.jsx → ComplianceSheet.jsx. Wired through AcademicRecordsTab (complianceSheetOpen useState) and AcademicRecordsSheets.jsx.
✓ v0.32.0 — Phase 3 Session 4. Compliance dashboard. Created useComplianceSummary hook (Option α: live collectionGroup('subjects').where('done','==',true)), ComplianceCard.jsx + .css with variant="home"|"sheet". Cross-tab navigation via pendingRecordsAction useState in App.jsx.

### Per-student rework (data shape complete; app code rework pending)

✓ v0.32.1 — Phase 3 Session 4.1. Per-student data migration. After discovering Sessions 1–4 were built family-wide but ND state law requires per-student tracking, ran a one-time migration script from Rob's local Windows environment using firebase-admin. Migration changes:
  - settings/compliance: ADDED requiredByStudent map seeded per student from old top-level requiredDays / requiredHours. Top-level fields PRESERVED (expand-then-contract; deleted in Session 4.4).
  - schoolDays/{date}: REPLACED with { hoursByStudent: {} }. Old hoursLogged values discarded (test data).
  - User discovery via collectionGroup('settings') because users/{uid} parent doc doesn't exist in Firestore.
  - Local development environment established on Windows 11 (Node 20+, repo cloned at C:\Users\rjohn\Code\Home-School-Planner, service account JSON at C:\Users\rjohn\Downloads\firebase-service-account.json).

Sessions remaining (4.2 → 5) — see CLAUDE.md roadmap for active plan.

---

## Migration — completed
- Planner: embedded inside PlannerTab — /planner/ separate build removed (session 14)
- Reward Tracker: embedded inside RewardsTab — /reward-tracker/ separate build removed (session 14)
- HomeTab: replaced tool card grid with morning summary dashboard
- TE Extractor: removed in v0.30.0 (was vanilla JS, kept external until project split)
- Reward Tracker: removed in v0.30.0
- Compliance data shape: family-wide → per-student (v0.32.1, partial — old top-level fields still present until Session 4.4)

## Orphaned Firestore data (do not migrate — manual cleanup only)
Old paths from before the per-day redesign — still in Firestore but no longer read/written:
  /users/{uid}/subjectLists/{studentName}
  /users/{uid}/weeks/{weekId}/students/{studentName}/subjects/{subjectName}/days/{0-4}
Can be manually deleted from Firebase console. No migration script needed.

Backup audit 2026-04-26 also identified stale items for manual cleanup:
  - Test cell "Billybob" subject
  - Two future-dated test sick days for Orion (2026-09-14, 2026-09-17)
  - Test reportNote for Orion Q1 (oWpzkNdCB1kvXGb8HMTk)
  - Orphaned grade pointing to deleted enrollment (I9oVfEbkdSAN8DXXROjc)
  - Summer Break entry inconsistency (runs past school year end)

---

## Dashboard shell architecture detail

### Shell layout — state lifted to App.jsx
App.jsx owns:
- activeTab (string, default 'home')
- plannerStudent (string, default 'Orion')
- colorMode + toggleDarkMode (via useDarkMode)
- students + subjectsByStudent — from useSettings(uid, plannerStudent)

### Bottom nav tabs (4 tabs since v0.30.0)
1. home → HomeTab. Icon: 🏠
2. planner → PlannerTab. Icon: 📅
3. records → AcademicRecordsTab. Icon: 🎓
4. settings → SettingsTab. Icon: ⚙️

(Pre-v0.30.0 had 6 tabs including rewards 🏅 and te 📄 — both removed in project split.)

---

## All Day Event — data model detail
- Stored as 'allday' key in per-day subjects collection
- Path: /users/{uid}/weeks/{weekId}/students/{student}/days/{dayIndex}/subjects/allday
- Fields: { lesson: eventName, note: eventNote, done: false, flag: false }
- hasAllDayEvent() and getAllDayEvent() helpers in firebase/planner.js
- Always filter 'allday' from regular subject lists using .filter(s => s !== 'allday')
- SubjectCard renders full-width #22252e banner when subject === 'allday'
- IMPORTANT: __allday__ (double-underscore) rejected by Firestore — renamed to allday in v0.21.2

---

## Academic Records — grading scales
Letter (A–F): A=90-100, B=80-89, C=70-79, D=60-69, F=0-59
E/S/N/U: E=Excellent, S=Satisfactory, N=Needs Work, U=Unsatisfactory
Grade entry saves both percent (number) and letter — both stored in Firestore.
Cascading deletes not implemented — console.warn fires on parent deletes.

---

## Phase 3 design pivot — for posterity

The compliance feature went through a substantial pivot mid-build. Sessions 1–4 (v0.31.0 through v0.32.0) shipped a family-wide design: one set of required values, one count of completed days, one set of hours per family per day. This passed multiple design diagnostics and shipped to production.

The pivot came when Rob clarified that ND state law requires per-student tracking — each child individually needs to meet 175 days and 800 hours of instruction. The family-wide model was structurally wrong, not just suboptimal. After realizing this:

- Sessions 1–4 were declared known-wrong but kept running until properly rolled back
- Session 4.1 migrated the data shape to per-student (expand-then-contract: new requiredByStudent map added alongside old top-level fields, which will be deleted in Session 4.4 once new code reads the new shape)
- Sessions 4.2–5 rework the app code to match the new data shape

Lessons captured: spec questions about "is this per-X or per-Y" are foundational, not edge cases. The diagnostic process found many real issues but missed this one because it was framed as "how does compliance work" rather than "what does compliance count, exactly, per what." Future feature work for multi-actor systems (per-student, per-family, per-something) starts by enumerating the actor axis explicitly before any other design decisions.

---

## Operational incidents — for posterity

### 2026-04-28 — Service account credential leak (recovered)
During initial setup of Rob's local development environment for the Session 4.1 migration, the contents of the Firebase service account JSON were displayed in a screenshot pasted into chat. The credential was rotated immediately:
- Old key deleted in GCP Console
- New key generated
- Netlify FIREBASE_SERVICE_ACCOUNT env var updated
- Netlify redeployed (so scheduled-backup function picks up new credential)
- Local file at C:\Users\rjohn\Downloads\firebase-service-account.json replaced

The leaked credential is dead. The credentials operating rule (CLAUDE.md) was formalized as a result: never display service account JSON contents in any context; verification commands must show only file shape, never content.

### 2026-04-28 — HANDOFF rewrite timeouts (resolved by process change)
Three sessions in two weeks (Session 3.6, Session 4, and a recovery attempt for Session 4.1) hit network timeouts during the final HANDOFF.md rewrite step. Root cause: HANDOFF rewrites were the largest single output operation in any session and grew over time as I (Claude) inappropriately stuffed forward-looking content into HANDOFF when it belonged in CLAUDE.md.

Two structural fixes:
1. HANDOFF separation rule: substantial sessions (4+ files or 5+ commits) end at version bump push; HANDOFF rewrite runs as a separate prompt afterward. Smaller sessions keep HANDOFF inline.
2. HANDOFF content rule: HANDOFF is a state snapshot (what happened, what's broken, what's next). Roadmap, session plans, design decisions, and process rules belong in CLAUDE.md.

After applying both rules, HANDOFF dropped from 379 lines to 39 lines and timeouts stopped.
