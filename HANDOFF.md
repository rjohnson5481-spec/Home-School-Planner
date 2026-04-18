# HANDOFF — v0.25.0 Desktop Calendar Week View

## What was completed this session

4 code commits + this docs commit on `main`:

```
845d3a2 chore: bump to v0.25.0
5d1f7f4 feat: wire CalendarWeekView into PlannerLayout desktop
912306a feat: add CalendarWeekView component
ae20e2d feat: add CalendarWeekView CSS shell (v0.25.0)
```

### Commit 1 — CSS (`ae20e2d`, 89 lines)
Desktop-only calendar grid styles: 5-column Mon-Fri layout with column headers (today gold circle), lesson cards (subject dot + status circle + lesson/note), all-day event banner, column add button, top bar with nav. Hides existing desktop week nav/DayStrip/planner-main when `.cwv-active` class is present.

### Commit 2 — Component (`912306a`, 92 lines)
`CalendarWeekView.jsx`: renders 5-column grid. Top bar with Today/prev/next/week label and "+ Add Lesson" button. Uses `loadWeekDataFrom(0)` to fetch all 5 days' data. Subject color assigned via hash from fixed 8-color palette. All-day events render as dark banners at top of column. Cards clickable to open EditSheet.

### Commit 3 — Wiring (`5d1f7f4`)
- Added `useIsDesktop()` hook (matchMedia listener, 2 lines).
- CalendarWeekView renders conditionally when `isDesktop` is true.
- `.cwv-active` class on `.planner` hides DayStrip, planner-main, desktop week nav, and sick banner via CSS.
- Mobile layout completely untouched — no base styles modified.
- `onEditCell` sets day + editTarget to reuse existing EditSheet.
- `onAddSubject` sets day + opens existing AddSubjectSheet.

### Commit 4 — Version bump (`845d3a2`)
0.24.1 → **0.25.0** across all 3 workspace package.json files.

Build green at every commit.

---

## File-size report

| File | Lines |
|---|---|
| `CalendarWeekView.jsx` | 92 |
| `CalendarWeekView.css` | 92 |
| `PlannerLayout.jsx` | 336 |

**Warning**: PlannerLayout.jsx at 336 lines (was 317 pre-session). Needs future split — suggested: extract sheet renders into PlannerSheets.jsx.

---

## What is currently incomplete / pending

- **Browser smoke test** — not run. Walk:
  - Desktop (≥1024px): planner shows 5-column calendar grid instead of DayStrip + card grid.
  - Today's date has gold circle. Lesson cards show subject dot, name, status, lesson text.
  - Click a card → EditSheet opens for that subject+day.
  - Click "+ add" at column bottom → AddSubjectSheet opens pre-set to that day.
  - "Today" button jumps to current week. Prev/next navigate weeks.
  - All-day events show as dark banners at top of column.
  - Done cards have opacity 0.55 + strikethrough.
  - Mobile (<1024px): completely unchanged — DayStrip + card grid as before.
  - Resize browser between mobile and desktop → layout switches correctly.

- **Not built yet (future sessions):**
  - Drag-and-drop between days (needs @dnd-kit/core)
  - PlannerLayout.jsx split (336 lines, over 300 limit)
  - Card right-click context menu
  - Week total/progress indicators

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md.
2. Smoke test desktop calendar view on various screen sizes.
3. Confirm mobile is completely unchanged.
4. Next: drag-and-drop, or PlannerLayout split.

## Key file locations (touched this session)

```
packages/dashboard/
├── package.json                                                     # v0.25.0
├── src/tools/planner/components/
│   ├── CalendarWeekView.jsx                                         # NEW — 92
│   ├── CalendarWeekView.css                                         # NEW — 92
│   └── PlannerLayout.jsx                                            # 317 → 336
packages/shared/package.json                                         # v0.25.0
packages/te-extractor/package.json                                   # v0.25.0
```
