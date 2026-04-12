# HANDOFF — Two Small Fixes (2026-04-12)

## What was completed this session

### Fix 1 — Undo Sick Day button always visible on sick days

**Bug:** "↩ Undo Sick Day" button only appeared when subjects were scheduled on
the sick day. After a sick day cascade the sick day cell is deleted, so the button
disappeared — making it impossible to undo.

**Fix:** `PlannerLayout.jsx` action bar restructured. `isSickDay` and `hasSubjects`
are now independent conditions:
- `isSickDay && !subjectsLoading` → shows "↩ Undo Sick Day" (no subjects requirement)
- `!isSickDay && hasSubjects && !subjectsLoading` → shows "Sick Day" + "Clear Week"

---

### Fix 2 — Duplicate "+ Add Subject" button on empty days

**Bug:** When a day had zero subjects, both the empty-state "+ Add Subject" button
and the regular dashed "+ Add Subject" button rendered at the same time.

**Fix:** Dashed add button guard changed from `!subjectsLoading` to
`!subjectsLoading && hasSubjects`. The empty state already has its own "+ Add Subject"
button, so the dashed one is only needed when subjects are present.

Both fixes: `PlannerLayout.jsx` — one commit.

---

## What is currently incomplete

- **Smoke-test still needed** for fixes from the prior bug fix session:
  - Fix 2: Header shows 3 rows on mobile; all 4 icon buttons visible
  - Fix 3: Undo sick day — correct message for Mon–Thu vs Friday
  - Fix 4: Sick day sheet shows full week grouped by day with gold headers
  - Fix 5: Edit sheet "Remove from this day" with two-tap confirm
  - Fix 1 (undo sick day button): NOW also includes today's visibility fix

- **CLAUDE.md header layout note is outdated:** says "2 rows, total 80px" — code
  uses 132px (3 rows). Only the doc is wrong.

- **reward-tracker** — still needs migrating into monorepo structure

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md
2. Smoke-test the undo sick day button on a real sick day
3. Smoke-test fixes 2–5 from prior session
4. Update CLAUDE.md header note (80px → 132px, 2 rows → 3 rows)
5. Confirm with Rob: Phase 2 features or reward-tracker migration?
