# HANDOFF — v0.32.5 Phase 3 Session 4.5: Per-student planner hours input

## What was completed this session
- Phase 3 Session 4.5: planner hours input reworked
  to read and write per-student data.
- saveSchoolDayHours now writes
  hoursByStudent.{student}: value using setDoc +
  merge:true (creates doc if missing, preserves
  other students' hours on the same day).
- useCompliance reads hoursByStudent[student] for
  the currently-selected student (treats undefined
  as 0). Added student to hook signature and dep
  arrays. if (!student) guard added.
- PlannerLayout threads student to useCompliance.
- HoursInputRow (mobile) + CalendarWeekView
  (desktop) renamed hoursLogged prop to hours for
  semantic accuracy. No behavior change.
- constants/compliance.js data-model comment updated
  to reflect current per-student shapes.
- grep hoursLogged packages/: zero matches.
- No visual UI changes — input placement, debounce,
  and hoursEnabled gate unchanged.
- Verified in Firebase Console: per-student writes
  land correctly at hoursByStudent.{name};
  merge:true creates new docs and preserves other
  students on the same day.

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
- Firestore subjects.done index auto-creation note
- Firebase data cleanup TODO from 2026-04-26 backup
  audit (subjectLists, teExtractor, rewardTracker
  collections also visible in console — stale,
  manual cleanup only)

Phase 3: all per-student data-write surfaces done.
Session 5 is the final session — integration sweep
that switches Records Attendance card and Home
per-student progress rows to source from
useComplianceSummary instead of calendar math when
daysEnabled is true. See CLAUDE.md for the plan.

Phase 4 multi-family launch readiness — still
required before any external testing family signs in.
See CLAUDE.md for prerequisite cluster.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Verify on main, pull latest
3. Begin Session 5: Records Attendance card sources
   from daysCompletedByStudent[selectedStudent] when
   daysEnabled. Home per-student progress row sources
   from same. Calendar math stays as fallback when
   daysEnabled is false.

## Key files changed recently
- packages/dashboard/src/firebase/compliance.js
- packages/dashboard/src/constants/compliance.js
- packages/dashboard/src/tools/planner/hooks/useCompliance.js
- packages/dashboard/src/tools/planner/components/PlannerLayout.jsx
- packages/dashboard/src/tools/planner/components/HoursInputRow.jsx
- packages/dashboard/src/tools/planner/components/CalendarWeekView.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- CLAUDE.md
