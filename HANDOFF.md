# HANDOFF — v0.29.6 Desktop breakpoint lowered to 810px

## What was completed this session
- Global breakpoint change from 1024px → 810px and its paired
  max `1023px` → `809px` across the entire codebase.
- 3 JS/JSX files updated (matchMedia query + window.innerWidth
  comparison): PlannerLayout.jsx, SickDaySheet.jsx,
  RestoreDiffSheet.jsx.
- 40 CSS files updated — every `min-width: 1024px`,
  `max-width: 1023px`, and matching 400–1023 / ≥1024 comment
  now reads 810 / 809. 86 breakpoint values replaced
  one-for-one, no property values or colors touched.
- CLAUDE.md canonical breakpoints block + key-decisions block
  + multi-select decision line all updated to 810 / 809 /
  400–809.
- Four file-size math divisors (`/ 1024`) intentionally left
  alone:
  - packages/dashboard/src/tools/academic-records/components/CalendarImportSheet.jsx:49
  - packages/dashboard/src/tools/academic-records/components/CurriculumImportSheet.jsx:35
  - packages/dashboard/src/tools/planner/hooks/usePdfImport.js:40 / :50
- Version bump to v0.29.6.

## What is broken or incomplete
- Netlify Blobs auto-backup fix (v0.28.6) is deployed but
  unverified — confirm a backup appears in the Blobs store
  after the next scheduled run.
- PlannerTab.jsx still destructures sickDayIndices from
  useSubjects (now undefined) and passes a dead sickDayIndices
  prop to PlannerLayout. Harmless — clean up on the next
  PlannerTab touch.
- PlannerLayout.jsx is at 275 lines (under the 280 watch
  line). The next addition will likely cross it — extract
  before adding more.
- Two stale breakpoint references remain in JSX comments
  (outside the strict scope of this session's Fix 1 patterns):
  PlannerLayout.jsx:133 (`≥1024px`) and MultiSelectBar.jsx:8
  (`max-width: 1023px`). Behavior is unaffected. Sweep them
  on the next touch of each file.
- The key-decisions note in CLAUDE.md still reads "raised
  from 768px — S25 Ultra compatibility" — technically still
  true (810 > 768) but the surrounding context now describes
  a lowering. Leave the historical parenthetical for now.

## Next session must start with
1. Read CLAUDE.md and HANDOFF.md
2. Confirm on main, pull latest
3. Ask Rob what we are building today

## Key files changed recently
- packages/dashboard/src/tools/planner/components/PlannerLayout.jsx
- packages/dashboard/src/tools/planner/components/SickDaySheet.jsx
- packages/dashboard/src/firebase/RestoreDiffSheet.jsx
- 40 .css files under packages/dashboard/src/
- packages/dashboard/package.json
- packages/shared/package.json
- packages/te-extractor/package.json
- CLAUDE.md
