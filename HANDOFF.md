# HANDOFF — v0.28.9 Sick day: Friday overflow + auto allday

## What was completed this session
- FridayOverflowSheet — new Move to Monday / Delete & Start
  Fresh / Cancel interstitial shown between Sick Day confirm
  and the cascade when the current student has any non-allday
  lesson on Friday. Move to Monday writes to next week's day 0
  then clears Friday; Delete & Start Fresh clears Friday;
  Cancel aborts the sick day entirely.
- Auto "Sick Day" All Day Event — useSickDay writes
  { lesson: 'Sick Day', note: '', done: false, flag: false }
  at the 'allday' key on the sick column after the cascade,
  but only if no allday cell already exists on that day.
- Version bump to v0.28.9

## What is broken or incomplete
- Netlify Blobs auto-backup fix (v0.28.6) is deployed but
  unverified — confirm a backup appears in the Blobs store
  after the next scheduled run (or invoke the function
  manually)
- PlannerTab.jsx still destructures sickDayIndices from
  useSubjects (now undefined) and passes a dead
  sickDayIndices prop to PlannerLayout. Harmless — clean up
  on the next PlannerTab touch.
- PlannerLayout.jsx is at 256 lines (over the 250 target,
  well under the 300 hard cap) — the Friday overflow wiring
  pushed it 6 lines over. Trim on the next PlannerLayout
  touch.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Confirm on main, pull latest
3. Ask Rob what we are building today

## Key files changed recently
- packages/dashboard/src/tools/planner/components/FridayOverflowSheet.jsx (new)
- packages/dashboard/src/tools/planner/components/FridayOverflowSheet.css (new)
- packages/dashboard/src/tools/planner/hooks/useSickDay.js
- packages/dashboard/src/tools/planner/components/PlannerLayout.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- packages/te-extractor/package.json
- CLAUDE.md
