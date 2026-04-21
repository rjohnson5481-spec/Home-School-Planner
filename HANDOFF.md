# HANDOFF — v0.28.5 Sick day + backup restore complete

## What was completed this session
- Backup restore diff view complete — desktop calendar +
  mobile accordion, student selector, conflict highlighting
- Sick day desktop day selector fixed end to end
- Undo sick day button driven by Firestore not local state
- CLAUDE.md split into CLAUDE.md / CLAUDE-DESIGN.md /
  CLAUDE-HISTORY.md

## What is broken or incomplete
- Done circle in CalendarWeekView does nothing on desktop
- Duplicate subscribeSickDays in useSubjects + useSickDay
  — collapse on next useSubjects touch
- PDF helpers and handleMoveCell still in PlannerLayout.jsx
  — extract on next touch
- Netlify Blobs auto-backup not producing backups — needs
  diagnostic
- Home tab greeting always says Good Morning — should match
  time of day

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Confirm on main, pull latest
3. Ask Rob what we are building today

## Key files changed recently
- packages/dashboard/src/firebase/backup.js
- packages/dashboard/src/firebase/RestoreDiffSheet.jsx
- packages/dashboard/src/firebase/RestoreDiffCalendar.jsx
- packages/dashboard/src/tools/planner/hooks/useSickDay.js
- packages/dashboard/src/tools/planner/components/SickDaySheet.jsx
