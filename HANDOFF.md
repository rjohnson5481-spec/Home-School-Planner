# HANDOFF — Session ending 2026-04-14 (session 13 close, v0.21.2)

## What was completed this session — v0.21.2

### Fix 1 ✅ — SVG icons replaced with emojis in Header.jsx
Replaced the three inline SVG elements in `packages/planner/src/components/Header.jsx`
with emojis to match the existing calendar button style:
- Upload/Import SVG → ⬆️
- Settings SVG → ⚙️
- Sign out SVG → 🚪
- Calendar 📅 — already emoji, left untouched

### All v0.21.2 production verifications cleared ✅
- All Day Event saves and reappears after page reload
- Week 2026-04-06 correctly shows data migrated from 2026-04-07
- PDF import weekId in the debug log is a Monday, not a Tuesday
- Import merge toggle OFF preserves existing done/note data

---

## What to do first next session

### 1. Fix — Import sheet preview shows wrong week label (cosmetic)
After a PDF import, the "Week of Apr 14" label in the upload sheet preview
shows the pre-normalized weekId (Tuesday Apr 14) instead of the corrected
Monday (Apr 13). The Firestore writes go to the correct week — this is
display-only. Fix is in `UploadSheet.jsx` or `PlannerLayout.jsx` — find
where the weekId is passed into the preview label and run it through
`mondayWeekId()` before display.

### 2. Desktop sidebar — full browser test still deferred
Desktop layout tested on phone only. A full browser test at ≥768px
to verify the sidebar, card grid, and action bar alignment is still pending.

### 3. Verify Firestore security rules (session 9 item — still unchecked)
Confirm rules allow reads/writes to `/users/{uid}/teExtractor/extractions/items/{docId}`.

---

## Known incomplete / not started

- Subject count badges in desktop sidebar DayStrip NOT implemented
- reward-tracker: not migrated
- Academic Records: coming-soon placeholder only
- app.js in te-extractor ~970+ lines — violates 300-line limit
