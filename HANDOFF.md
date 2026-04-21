# HANDOFF — v0.29.0 Friday overflow reverted to coming-soon toast

## What was completed this session
- FridayOverflowSheet removed — component + CSS deleted,
  useSickDay no longer gates the cascade on Friday content.
  Move/Delete/Cancel flow gone.
- Coming-soon toast — when Friday has any non-allday lesson
  at confirm time, the cascade runs normally and a gold-bordered
  toast reading "A month view and improved sick day cascading is
  coming soon." appears for 5 seconds (tap to dismiss early).
- Auto "Sick Day" All Day Event write preserved — completeSickDay
  still drops the allday label on the sick column after the
  cascade.
- Version bump to v0.29.0.

## What is broken or incomplete
- Netlify Blobs auto-backup fix (v0.28.6) is deployed but
  unverified — confirm a backup appears in the Blobs store
  after the next scheduled run (or invoke the function
  manually)
- PlannerTab.jsx still destructures sickDayIndices from
  useSubjects (now undefined) and passes a dead sickDayIndices
  prop to PlannerLayout. Harmless — clean up on the next
  PlannerTab touch.
- PlannerLayout.jsx is at 264 lines (over the 250 target, well
  under the 300 hard cap) — the coming-soon toast added a few
  lines. Trim on the next PlannerLayout touch.
- Month view is the queued feature that will also ship the
  proper Friday sick-day handling (move-to-next-Monday flow
  etc.). Do not re-add FridayOverflowSheet in the meantime.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Confirm on main, pull latest
3. Ask Rob what we are building today

## Key files changed recently
- packages/dashboard/src/tools/planner/hooks/useSickDay.js
- packages/dashboard/src/tools/planner/components/PlannerLayout.jsx
- packages/dashboard/src/tools/planner/components/FridayOverflowSheet.jsx (deleted)
- packages/dashboard/src/tools/planner/components/FridayOverflowSheet.css (deleted)
- packages/dashboard/package.json
- packages/shared/package.json
- packages/te-extractor/package.json
- CLAUDE.md
