# HANDOFF — v0.23.6 Phase 2 Session 8: Attendance Detail Sheet + HomeTab Cards

## What was completed this session

5 code commits + this docs commit on `main`:

```
1e9c720 chore: bump version to v0.23.6
ad198d6 feat: add per-student attendance cards to HomeTab (v0.23.6)
7f96aad feat: wire AttendanceDetailSheet into AcademicRecordsTab
4b37c27 refactor: remove attendance card, make stat tappable
897d5d1 feat: add AttendanceDetailSheet
```

### Commit 1 — AttendanceDetailSheet (`897d5d1`) — 77 JSX + 89 CSS

New bottom sheet (z-index 300) showing full attendance breakdown:
- Big gold number (48px, 700 weight) with "days completed" subtitle.
- Progress bar: gold gradient fill, width = attended/175 capped at 100%.
- Detail rows: Days Attended, Sick Days (red if > 0), Break Days (if > 0), School Days, Days Required (175).
- Note: "Sick days pulled automatically from Planner".
- Props: open, onClose, attendanceDays, schoolYearLabel, student.

### Commit 2 — RecordsMainView cleanup (`4b37c27`)

**RecordsMainView.jsx (197 → 173 lines):**
- Removed the entire `.ar-attendance-card` block (large detail card with progress bar, labels, detail row, and note).
- Made attendance stat card tappable: added `.ar-stat-card--tappable` class, onClick handler, role="button", tabIndex=0.
- Added "View details ›" hint (`.ar-stat-detail-hint`) below the stat value.
- Added `onAttendanceDetail` prop.
- Removed unused `attendancePct` variable.

**AcademicRecordsTab.css (263 → 266 lines):**
- Added `.ar-stat-card--tappable` (cursor: pointer, hover border + shadow).
- Added `.ar-stat-detail-hint` (10px, gold color, margin-top 6px).

### Commit 3 — Wiring (`7f96aad`)

**AcademicRecordsTab.jsx (241 → 252 lines):**
- Added `AttendanceDetailSheet` import.
- Added `attendanceDetailOpen` state.
- Passed `onAttendanceDetail` to RecordsMainView.
- Rendered `<AttendanceDetailSheet>` with `summary.attendanceDays`, `summary.activeSchoolYear?.label`, and `selectedStudent`.

### Commit 4 — HomeTab attendance cards (`ad198d6`)

**useHomeSummary.js (55 → 113 lines):**
- Added one-shot Firestore reads for attendance: school years, breaks, sick days.
- Finds active school year (date range or most recent), counts weekdays, subtracts break + sick days.
- Returns `attendance: { [studentName]: { attended, required: 175 } }`.
- School years read once, sick days collection read once, shared across both students.

**HomeTab.jsx (111 → 125 lines):**
- Destructures `attendance` from useHomeSummary.
- Renders two attendance cards after the points cards: gold value, "of 175 days" sub, thin gold gradient progress bar.

**HomeTab.css (267 → 282 lines):**
- Summary row now horizontally scrollable (overflow-x: auto, hidden scrollbar).
- `.home-summary-card` min-width: 80px (prevents collapse with 5 cards).
- Added `.home-attendance-value` (gold color), `.home-attendance-bar` (4px track), `.home-attendance-fill` (gold gradient fill).

### Commit 5 — Version bump (`1e9c720`)

- 0.23.5 → **0.23.6** across all 3 workspace package.json files.

Build green at every commit.

---

## File-size report (post-session)

All under 300:

| File | Lines |
|---|---|
| `components/AttendanceDetailSheet.jsx` | 77 |
| `components/AttendanceDetailSheet.css` | 89 |
| `components/RecordsMainView.jsx` | 173 |
| `tabs/AcademicRecordsTab.jsx` | 252 |
| `tabs/AcademicRecordsTab.css` | 266 |
| `hooks/useHomeSummary.js` | 113 |
| `tabs/HomeTab.jsx` | 125 |
| `tabs/HomeTab.css` | 282 |

---

## What is currently incomplete / pending

- **Browser smoke test** — not run. Walk:
  - Academic Records → attendance stat card shows "View details ›" hint.
  - Tap stat card → AttendanceDetailSheet opens with big gold number, progress bar, detail rows.
  - Sick Days row red if count > 0. Break Days row hidden if 0.
  - Close sheet → returns to Records tab.
  - Large attendance card no longer appears below the grade list.
  - HomeTab → summary row shows 5 cards: Lessons + Orion pts + Malachi pts + Orion Attend. + Malachi Attend.
  - Attendance cards show gold number + progress bar. Row scrolls horizontally on narrow phones.

- **Carry-overs (still open):**
  - `useAcademicSummary` still fetches grades redundantly.
  - Cascading-delete UX warnings.
  - iPad portrait breakpoint decision.
  - iPhone SE 300px grid overflow.
  - Planner Phase 2 features.
  - Import merge bug (inherited v0.22.3).
  - **CLAUDE.md drift** — academic-records still not documented after 8 sessions.
  - SchoolYearSheet.css at 298 lines.

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md.
2. Smoke test attendance detail sheet and HomeTab cards.
3. Probable next directions:
   - **CLAUDE.md sweep** — document academic-records.
   - **Remove redundant grades fetch from useAcademicSummary**.
   - **Phase 2 Session 9: Report Card generation**.

## Key file locations (touched this session)

```
packages/dashboard/
├── package.json                                                     # v0.23.6
├── src/
│   ├── hooks/
│   │   └── useHomeSummary.js                                        # 55 → 113 (attendance)
│   ├── tabs/
│   │   ├── HomeTab.jsx                                              # 111 → 125 (attendance cards)
│   │   ├── HomeTab.css                                              # 267 → 282 (scrollable row + bar)
│   │   ├── AcademicRecordsTab.jsx                                   # 241 → 252 (detail sheet wiring)
│   │   └── AcademicRecordsTab.css                                   # 263 → 266 (tappable stat)
│   └── tools/academic-records/
│       └── components/
│           ├── AttendanceDetailSheet.jsx                             # NEW — 77
│           ├── AttendanceDetailSheet.css                             # NEW — 89
│           └── RecordsMainView.jsx                                  # 197 → 173 (card removed)
packages/shared/package.json                                         # v0.23.6
packages/te-extractor/package.json                                   # v0.23.6
```

Net: 2 new files (166 lines), 7 modified, 3 version bumps. No App.jsx changes. No planner files changed.
