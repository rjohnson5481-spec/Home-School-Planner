# HANDOFF — v0.29.4 Mobile multi-select

## What was completed this session
- useMultiSelect hook (planner/hooks/useMultiSelect.js) — owns
  isSelectMode + selectedKeys + deleteConfirmPending plus the
  enter/toggle/selectAll/exit + handleMarkDone/handleMoveToDay/
  handleDelete actions. Reads/writes Firestore via planner.js
  helpers; resets on weekId/student/day change; auto-clears
  delete-confirm after 3s.
- MultiSelectBar (planner/components/MultiSelectBar.{jsx,css})
  — mobile-only fixed-bottom bar at z-index 110 (covers
  BottomNav). Five buttons (Select All / Mark Done / Move to
  Day / Delete / Cancel) plus a "N selected" gold count line.
  Move to Day opens an above-bar picker with the 4 non-current
  days. Delete pulses red and reads "Confirm?" while
  deleteConfirmPending. All styles under @media (max-width:
  1023px); 56px base, 68px in the 400–1023 large-phone band.
- SubjectCard now supports long-press (500ms hold, 8px move
  tolerance, suppresses the post-press tap), isSelectMode
  routing (taps + checkbox + flag all call onSelect), and a
  gold checkmark badge in the top-right corner when isSelected.
  All new CSS in @media (max-width: 1023px). The 'allday' card
  is never selectable.
- PlannerLayout calls useMultiSelect, threads four new props
  through every regular SubjectCard, and renders MultiSelectBar
  conditionally on !isDesktop && isSelectMode.
- Version bump to v0.29.4.

## What is broken or incomplete
- Netlify Blobs auto-backup fix (v0.28.6) is deployed but
  unverified — confirm a backup appears in the Blobs store
  after the next scheduled run (or invoke the function
  manually).
- PlannerTab.jsx still destructures sickDayIndices from
  useSubjects (now undefined) and passes a dead sickDayIndices
  prop to PlannerLayout. Harmless — clean up on the next
  PlannerTab touch.
- PlannerLayout.jsx is at 273 lines (under the 280 watch
  line, but the next addition will likely cross it — extract
  before adding more).
- MultiSelectBar covers BottomNav but PlannerActionBar (Sick
  Day / Clear Week / Import) sits above the nav and may still
  be visible while select mode is active. Smoke test on a
  real device and decide whether to hide it during select
  mode in the next pass.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Confirm on main, pull latest
3. Ask Rob what we are building today

## Key files changed recently
- packages/dashboard/src/tools/planner/hooks/useMultiSelect.js (new)
- packages/dashboard/src/tools/planner/components/MultiSelectBar.jsx (new)
- packages/dashboard/src/tools/planner/components/MultiSelectBar.css (new)
- packages/dashboard/src/tools/planner/components/SubjectCard.jsx
- packages/dashboard/src/tools/planner/components/SubjectCard.css
- packages/dashboard/src/tools/planner/components/PlannerLayout.jsx
- packages/dashboard/package.json
- packages/shared/package.json
- packages/te-extractor/package.json
- CLAUDE.md
