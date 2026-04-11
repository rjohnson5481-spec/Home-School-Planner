# HANDOFF — Bug Fix Session (2026-04-11)

## What was completed this session

Five bug fixes, five commits, all pushed to main.

---

### Fix 1 — Import merge mode (`8dc3b64`)
**Bug:** Importing a second PDF overwrote existing cell data (done state, notes)
even when "Replace existing schedule" toggle was OFF.

**Root cause:** `importCell` always wrote to Firestore regardless of whether a
cell already existed. `handleApplySchedule` used `forEach` with no await.

**Fix:**
- `useSubjects.js`: `importCell` now accepts `overwrite` boolean. When false,
  reads the cell first and skips the write if it already exists.
- `PlannerLayout.jsx`: `handleApplySchedule` changed from `forEach` to
  `await Promise.all(cells.map(...))`. Passes `wipe` as the `overwrite` arg.

---

### Fix 2 — Header mobile layout (`c3245df`)
**Bug:** Settings and sign-out icons not visible on mobile portrait / PWA —
too many elements in Row 1.

**Fix:** Header restructured to 3 rows:
- Row 1 (48px): Logo + school name (left), 4 icon buttons (right)
- Row 2 (~52px): ‹ week label › centered, border-top rgba(255,255,255,.07)
- Row 3 (32px): Student selector pills (unchanged)

Total header height: 132px.
- `DayStrip.css`: sticky `top` updated 80px → 132px
- `PlannerLayout.css`: `margin-top` updated 80px → 132px

---

### Fix 3 — Undo sick day messaging (`671e2d7`)
**Fix:** Removed incorrect "Monday → previous Friday" wording. Messages are
now conditional on `day`:
- Mon–Thu: "This will shift lessons back one day for the days they were shifted."
- Friday: "Sick day marker removed. Friday lessons were permanently deleted
  and cannot be restored."

---

### Fix 4 — Sick day sheet full week view (`ac148a0`)
**Bug:** Sheet only showed subjects for the sick day itself.

**Fix:** Sheet now loads and displays all lessons from the sick day through
Friday, grouped by day with gold headers. Checkboxes are per-subject.

New infrastructure:
- `firebase/planner.js`: `readDaySubjectsOnce` — one-time `getDocs` snapshot
- `useSubjects.js`: `loadWeekDataFrom(fromDay)` — reads days in parallel,
  returns `{ [dayIndex]: { [subject]: cellData } }`
- Wired through `App.jsx` → `PlannerLayout.jsx` → `SickDaySheet`
- `SickDaySheet.jsx`: full rewrite — loads remaining data on mount, grouped
  display, sick day tagged with "sick day" badge, Friday shows sick day only
- `SickDaySheet.css`: group headers, loading state, sick day tag

---

### Fix 5 — Delete subject from day (`9df25c1`)
**Feature:** "Remove from this day" button in the edit sheet.

- First tap: button turns red, shows "Tap again to confirm"
- Second tap: calls `removeSubject` for that subject on the current day
- Tap anywhere else: resets to default (document click listener)
- Only affects the current day — no other days impacted
- `removeSubject` is now wired through PlannerLayout (was passed from App
  but not destructured in PlannerLayout)

---

## What is currently incomplete

- **Not smoke-tested in browser** — verify:
  1. Fix 1: Import two PDFs without wipe toggle — second import skips existing cells
  2. Fix 2: Header shows 3 rows on mobile; all 4 icon buttons visible
  3. Fix 3: Undo confirmation shows correct message for Mon–Thu vs Friday
  4. Fix 4: Sick day sheet shows all remaining week lessons, grouped by day
  5. Fix 5: Edit sheet shows "Remove from this day" button with two-tap confirm

- CLAUDE.md header layout section references "2 rows, total 80px" — should be
  updated to "3 rows, total 132px" (Row 1: brand+buttons 48px, Row 2: week nav
  52px, Row 3: students 32px)

- **reward-tracker** — still needs migrating into monorepo structure

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md
2. Smoke-test all five fixes in the browser
3. Update CLAUDE.md header height note (80px → 132px, 2 rows → 3 rows)
4. Confirm with Rob: Phase 2 features or reward-tracker migration?
