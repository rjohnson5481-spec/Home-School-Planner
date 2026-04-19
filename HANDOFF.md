# HANDOFF — v0.27.6 Sick Day Desktop Day Selector

## What was completed this session

2 code commits + this docs commit on `main`:

```
9228ae9 chore: bump version to v0.27.6
05cf0f6 fix: sick day desktop day selector (v0.27.6)
```

### Commit 1 — Sick Day desktop day selector (`05cf0f6`)
Files: `SickDaySheet.jsx`, `SickDaySheet.css`

Added a desktop-only Mon/Tue/Wed/Thu/Fri pill row above the subject list and changed the desktop layout to show only the picked day's subjects (no cascade preview, no checkbox duplicates).

`SickDaySheet.jsx`:
- New `useIsDesktop()` hook (matchMedia `(min-width: 1024px)`).
- `activeDay` state (defaults to `day` prop).
- `allDaysData` state seeded with the sick day's `dayData`, then filled by `loadWeekDataFrom(0)` so any picked pill has its subjects ready. Mobile-Friday case (no cascade preview needed) skips the fetch — preserves the original no-spinner behavior.
- Pill row renders Mon-Fri; clicking a pill sets `activeDay` and resets `selected` to that day's subjects (allday key filtered out).
- Display logic split: desktop renders a single group for `activeDay`; mobile keeps the original cascade preview (sick day + D+1..4).
- Sheet title uses `DAY_NAMES[activeDay]` on desktop, `dayName` (the sick-day prop) on mobile.
- Friday warning suppressed on desktop (cascade preview only shown on mobile).
- `onConfirm([...selected], activeDay)` — passes the picked day as a 2nd arg.

`SickDaySheet.css`:
- New `.sick-day-pills` block: `display: none` base, flips to `display: flex` inside `@media (min-width: 1024px)`. 5 equal-width Ink-and-Gold pills (`.sick-day-pill`, active state uses `--ink` bg + `--gold-light` text).

Mobile behavior is byte-for-byte unchanged — pills are hidden, cascade preview still rendered, footer button still calls `onConfirm` with the same selected subjects (the new 2nd arg is ignored by current parent code).

### Commit 2 — Version bump (`9228ae9`)
0.27.5 → **0.27.6** across all 3 packages (dashboard, shared, te-extractor).

---

## Known gap — pill day is NOT yet wired through to the cascade

The pills in the sheet now control which day's subjects are visible AND which subjects are checked, AND the picked day is passed to `onConfirm` as a 2nd arg. **But** the parent's `handleSickDayConfirm` (in `PlannerLayout.jsx`) and the `performSickDay` function (in `useSubjects.js`) currently take only `(selectedSubjects)` and run the cascade against the parent-state `day`, ignoring the 2nd arg.

Net effect on desktop today: picking a pill correctly updates the sheet display + subject selection, but **clicking "Shift selected lessons" still cascades from whatever the parent's `day` is** (defaults to `getTodayDayIndex()`, which is Monday on weekends). If the user picked a different pill, the operation will write a sick-day marker for the wrong day and may no-op for subjects that don't exist on the parent's `day`.

This was left as a gap because the user explicitly said "Do not touch any other files" for this fix. To complete the wire-up next session (~5 lines across 2 files):

1. `packages/dashboard/src/tools/planner/components/PlannerLayout.jsx` line 81:
   ```js
   async function handleSickDayConfirm(selectedSubjects, sickDayIndex) {
     await performSickDay(selectedSubjects, sickDayIndex);
     setShowSickDay(false);
   }
   ```

2. `packages/dashboard/src/tools/planner/hooks/useSubjects.js` `performSickDay`:
   - Accept `sickDayIndex = day` as 2nd param.
   - Replace every `day` reference inside the function (5 spots: lines 102, 103, 120, 124, plus the `dayData[subject]` startData read which needs to fall back to `dbReadCell(uid, weekId, student, sickDayIndex, subject)` when `sickDayIndex !== day`).

Mobile is unaffected by this gap — the DayStrip already updates the parent's `day` before the sheet opens, so `activeDay === day` and the 2nd arg matches.

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md.
2. **Close the parent-cascade gap above** so the desktop pill actually controls which day gets sick-shifted (5-line change across 2 files).
3. Smoke test on desktop:
   - Open Sick Day from a non-Monday day → pills show, picked day's subjects display correctly, no duplicates.
   - Pick a different pill → display updates, selected set resets to that day's subjects.
   - Confirm → cascade should run from the picked day, sick-day marker written for the picked day's date.
4. Smoke test on mobile (≤1023px):
   - Pills hidden, cascade preview unchanged, Friday warning still appears.

## Key file locations

```
packages/dashboard/src/tools/planner/components/SickDaySheet.jsx     # 130 → 166 (desktop pills + activeDay state)
packages/dashboard/src/tools/planner/components/SickDaySheet.css     # 224 → 262 (.sick-day-pills, desktop @media block)
packages/dashboard/package.json                                       # 0.27.6
packages/shared/package.json                                          # 0.27.6
packages/te-extractor/package.json                                    # 0.27.6
```
