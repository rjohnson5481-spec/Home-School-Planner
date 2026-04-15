# HANDOFF — v0.22.12 CSS file splits (final 3 of 5)

## What was completed this session

Five-commit refactor wrapping up the CSS file-size cleanup. Every CSS
file in `packages/dashboard/src/` is now under the 300-line hard
limit. Five new files created, three large files slimmed.

### Commit 1 — `refactor: split UndoSickSheet.css from PlannerLayout.css`

**Files (3):**
- `packages/dashboard/src/tools/planner/components/UndoSickSheet.css` — NEW, 99 lines
- `packages/dashboard/src/tools/planner/components/PlannerLayout.css` — 360 → 260
- `packages/dashboard/src/tools/planner/components/PlannerLayout.jsx` — +1 import line

**Moved:** Entire "Undo Sick Day confirmation sheet" block (overlay,
sheet, slide-up `@keyframes undo-sick-up`, handle, header, title,
close + hover, body, msg, footer, cancel + hover, confirm + hover).
**No @media slice moved** — neither the `@media (min-width: 400px)
and (max-width: 1023px)` block nor the `@media (min-width: 1024px)`
block contained any `.undo-sick-*` rules. Verified via grep before
and after.

The undo-sick sheet's JSX is still inline in `PlannerLayout.jsx` (not
in a separate component file). `PlannerLayout.css` and `UndoSickSheet.css`
are both imported from the same JSX file, so the cascade resolves
identically to before the split.

### Commit 2 — `refactor: split SettingsRow.css and SettingsSubjects.css from SettingsTab.css`

**Files (4):**
- `packages/dashboard/src/tabs/SettingsRow.css` — NEW, 130 lines
- `packages/dashboard/src/tabs/SettingsSubjects.css` — NEW, 63 lines
- `packages/dashboard/src/tabs/SettingsTab.css` — 376 → **185** (under the 200-line target)
- `packages/dashboard/src/tabs/SettingsTab.jsx` — +2 import lines

**Moved to SettingsRow.css:** Row + row-icon + row-body + row-actions
block — all `.st-row*` classes (base + variants + hovers). Plus the
4 row-related rules from the large-phone @media block:
`.st-row { padding: 16px }`, `.st-row-title { font-size: 15px }`,
`.st-row-sub { font-size: 12px }`,
`.st-row-icon { width: 36px; height: 36px; font-size: 18px }`.
A new bounded `@media (min-width: 400px) and (max-width: 1023px)`
block was created in SettingsRow.css for these.

**Moved to SettingsSubjects.css:** Default Subjects sub-section —
`.st-subjects`, `.st-subjects-tabs`, `.st-subjects-tab`, `--active`,
`.st-subject-chip`, `.st-subject-remove` + hover, `.st-subjects-add`.
**No @media slice moved** — none of these classes appear in either
@media block.

**Stayed in SettingsTab.css:** Outer tab + grid + section label
(1–50), toggle + chevron + badge (173–221 in old file), inline input +
remove-confirm row + version block (286–352 in old file), plus the
remaining @media rules (section label / toggle / version on large
phone; tab padding + grid on desktop). Final size 185 lines —
comfortably under both the 300 hard limit AND the 200 target.

**Import order in SettingsTab.jsx** (from top to bottom):
`SettingsTab.css` → `SettingsRow.css` → `SettingsSubjects.css`. No
selector overlap between the three files; cascade order is irrelevant
for correctness but matches CLAUDE.md's "main → split" reading order.

### Commit 3 — `refactor: split AddSubjectSheetChrome.css and AddSubjectDayPicker.css from AddSubjectSheet.css`

**Files (4):**
- `packages/dashboard/src/tools/planner/components/AddSubjectSheetChrome.css`
  — NEW, 113 lines
- `packages/dashboard/src/tools/planner/components/AddSubjectDayPicker.css`
  — NEW, 87 lines
- `packages/dashboard/src/tools/planner/components/AddSubjectSheet.css`
  — 408 → 215
- `packages/dashboard/src/tools/planner/components/AddSubjectSheet.jsx`
  — +2 import lines

**Moved to AddSubjectSheetChrome.css:** Sheet shell — `.add-sheet-overlay`,
`.add-sheet`, `@keyframes add-sheet-up`, `.add-sheet-handle`,
`.add-sheet-header`, `.add-sheet-title`, `.add-sheet-close` + hover,
`.add-sheet-body` — PLUS the confirm button block
(`.add-sheet-confirm-btn` + `:hover:not(:disabled)` + `:disabled`).
Plus the 3 chrome/confirm rules from the large-phone @media block:
title (17px), body (padding/gap), confirm-btn (padding/font).

**Moved to AddSubjectDayPicker.css:** Day pills + per-day details —
`.add-sheet-day-pills`, `.add-sheet-day-pill`, `--active`,
`.add-sheet-day-short`, `.add-sheet-day-date`, `.add-sheet-details`,
`.add-sheet-detail-block` + `:last-child`, `.add-sheet-detail-label`,
`.add-sheet-detail-input` + `:focus`. Plus the 4 day-picker rules
from the large-phone @media block: day-pill (padding), day-short,
day-date, detail-input (raised to 16px for iOS zoom guard — comment
preserved in the new file).

**Stayed in AddSubjectSheet.css:** Body content sections — custom
input row, All Day Event section, quick-add presets, row header,
student pills, summary line — plus the remaining 7 @media rules
(input, add-btn, section-label, preset-btn, student-pill, summary,
allday-btn). Final size 215 lines.

**Import order in AddSubjectSheet.jsx** (top to bottom):
`AddSubjectSheet.css` → `AddSubjectSheetChrome.css` →
`AddSubjectDayPicker.css`. Disjoint selector sets across the three
files; the new files only collide with old AddSubjectSheet.css inside
the old @media block, and that's been carved cleanly per class.

### Commit 4 — `chore: bump version to v0.22.12`

- `packages/dashboard/package.json`:    0.22.11 → 0.22.12
- `packages/shared/package.json`:       0.22.11 → 0.22.12
- `packages/te-extractor/package.json`: 0.22.11 → 0.22.12

Build verified clean at every commit
(`@homeschool/dashboard@0.22.12`, `@homeschool/te-extractor@0.22.12`).

---

## Final file size report

**Every CSS file in `packages/dashboard/src/` is now under 300 lines.**
Largest is HomeTab.css at 266.

| File | Before | After | Status |
|---|---|---|---|
| AddSubjectSheet.css | 408 | **215** | ✅ |
| SettingsTab.css | 376 | **185** | ✅ (under 200 target) |
| PlannerLayout.css | 360 | **260** | ✅ |
| UploadSheet.css (v0.22.11) | 333 | 247 | ✅ |
| HomeTab.css (v0.22.11) | 324 | 266 | ✅ |

**New files created across both split sessions (v0.22.11 + v0.22.12):**

| File | Lines | Source |
|---|---|---|
| HomeHeader.css (v0.22.11) | 34 | from HomeTab.css |
| UploadResult.css (v0.22.11) | 89 | from UploadSheet.css |
| UndoSickSheet.css (v0.22.12) | 99 | from PlannerLayout.css |
| SettingsRow.css (v0.22.12) | 130 | from SettingsTab.css |
| SettingsSubjects.css (v0.22.12) | 63 | from SettingsTab.css |
| AddSubjectSheetChrome.css (v0.22.12) | 113 | from AddSubjectSheet.css |
| AddSubjectDayPicker.css (v0.22.12) | 87 | from AddSubjectSheet.css |

Top of the current ordered list (largest first):
```
266 HomeTab.css
260 PlannerLayout.css
247 UploadSheet.css
247 BottomNav.css
226 EditSheet.css
224 SickDaySheet.css
217 SubjectCard.css
215 AddSubjectSheet.css
214 ActionSheet.css
205 Header.css   (planner)
185 SettingsTab.css
... all others under 200 ...
```

---

## CLAUDE.md drift from this session

CLAUDE.md's "CSS files currently over 300 lines (known, pending split)"
list is now stale — all five entries are below 300. The list belongs
under the file-size-rules section and can be removed entirely or
replaced with a one-line "all CSS files currently under 300" note.

CLAUDE.md's planner file-structure tree still mentions
`PlannerLayout.css (360 lines — over 300 limit, pending split)`,
`AddSubjectSheet.css (408 lines — over 300)`, and
`UploadSheet.css (333 lines — over 300)`. Those parenthetical line
counts are now stale and the "over 300" notes are wrong. Same for
the dashboard shell tree's notes on `HomeTab.css (324 lines — over
300 limit)` and `SettingsTab.css (376 lines — over 300 limit)`.
Worth a CLAUDE.md sweep on next opportunity — none of this affects
runtime.

The new files (HomeHeader, UploadResult, UndoSickSheet, SettingsRow,
SettingsSubjects, AddSubjectSheetChrome, AddSubjectDayPicker) aren't
documented in CLAUDE.md's file-structure trees yet. Same sweep can
add them.

---

## What is currently incomplete / pending

1. **Browser smoke test** — not run. Priority checks:
   - Settings tab — all rows render with the same look (the row
     styles now live in SettingsRow.css). Toggle the dark-mode
     toggle to confirm tokens still resolve. Expand "Default
     Subjects" to confirm the subjects sub-section renders (now
     in SettingsSubjects.css).
   - Planner — open Sick Day, mark a day sick, then tap "Undo Sick
     Day" to bring up the undo confirmation sheet. Confirm it slides
     up correctly and the cancel/confirm buttons style correctly
     (UndoSickSheet.css).
   - Add Subject sheet — open it, confirm sheet shell + header (chrome),
     custom input row, presets, day pills + per-day detail inputs
     (day picker), student pills, summary, and the bottom Confirm
     button all render correctly. Test on a wide phone (≥400px) to
     make sure the iOS zoom-guard 16px detail-input still applies.

2. **CLAUDE.md drift** — see section above. One CLAUDE.md update
   would clean up the over-300 list and refresh the file trees with
   the new split files + their line counts. Low priority; runtime
   unaffected.

3. **Carry-overs (untouched this session):**
   - iPad portrait breakpoint decision (still falls into large-phone band)
   - iPhone SE 300px grid overflow
   - Planner Phase 2 features (auto-roll, week history, copy last week, export PDF)
   - Academic Records tab (Coming Soon placeholder)
   - Import merge bug (inherited from v0.22.3)

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md (standard).
2. Browser smoke test v0.22.12 — Settings rows / Subjects sub-section,
   Undo Sick Day sheet, Add Subject sheet (all sub-sections).
3. Decide direction: CLAUDE.md cleanup sweep (post-split file sizes
   + new file inventory) OR start Phase 2 work (Academic Records,
   planner Phase-2 features).

---

## Key file locations (touched this session)

```
packages/dashboard/
├── package.json                                                    # v0.22.12
├── src/
│   ├── tabs/
│   │   ├── SettingsTab.jsx                                         # +2 imports (SettingsRow, SettingsSubjects)
│   │   ├── SettingsTab.css                                         # 376 → 185
│   │   ├── SettingsRow.css                                         # NEW — 130
│   │   └── SettingsSubjects.css                                    # NEW — 63
│   └── tools/planner/components/
│       ├── PlannerLayout.jsx                                       # +1 import (UndoSickSheet)
│       ├── PlannerLayout.css                                       # 360 → 260
│       ├── UndoSickSheet.css                                       # NEW — 99
│       ├── AddSubjectSheet.jsx                                     # +2 imports (Chrome, DayPicker)
│       ├── AddSubjectSheet.css                                     # 408 → 215
│       ├── AddSubjectSheetChrome.css                               # NEW — 113
│       └── AddSubjectDayPicker.css                                 # NEW — 87
packages/shared/package.json                                        # v0.22.12
packages/te-extractor/package.json                                  # v0.22.12
```

Total: 12 source files touched (5 created, 3 split + slimmed, 3 jsx
imports added, 1 read-only confirm), plus 3 package.json version bumps.
After v0.22.11 + v0.22.12 combined: **all 5 over-limit files are now
under the limit**, with 7 new modular CSS files created.
