# HANDOFF — v0.29.5 Hide PlannerActionBar during multi-select

## What was completed this session
- PlannerActionBar is now wrapped in `{!multiSelect.isSelectMode && (...)}`
  so it renders only when select mode is inactive. MultiSelectBar is
  the sole action surface while selecting; BottomNav is already
  covered by the bar's z-index 110.
- On desktop `isSelectMode` is always false so PlannerActionBar still
  renders exactly as before — no visible change at ≥1024px.
- Version bump to v0.29.5.

## What is broken or incomplete
- Netlify Blobs auto-backup fix (v0.28.6) is deployed but
  unverified — confirm a backup appears in the Blobs store
  after the next scheduled run (or invoke the function
  manually).
- PlannerTab.jsx still destructures sickDayIndices from
  useSubjects (now undefined) and passes a dead sickDayIndices
  prop to PlannerLayout. Harmless — clean up on the next
  PlannerTab touch.
- PlannerLayout.jsx is at 275 lines (under the 280 watch
  line). The next addition will likely cross it — extract
  before adding more.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Confirm on main, pull latest
3. Ask Rob what we are building today

## Key files changed recently
- packages/dashboard/src/tools/planner/components/PlannerLayout.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- packages/te-extractor/package.json
- CLAUDE.md
