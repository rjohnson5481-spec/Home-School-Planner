# HANDOFF — v0.25.3 Desktop Calendar: Remove Selection + Within-Day Reorder

## What was completed this session

2 code commits + this docs commit on `main`:

```
fff3915 chore: bump to v0.25.3
49cc023 feat: remove selection state, click-to-open + hold-to-drag, within-day reorder (v0.25.3)
```

### Commit 1 — Remove selection + within-day reorder (`49cc023`)

**CalendarWeekView.jsx (183→186 lines):**

Selection removed:
- Deleted `selected` Set state, `toggleSelect`, `clearSelection`.
- Deleted selection pill UI from top bar.
- Deleted multi-card drag logic — drag always moves single card.
- Click now calls `onEditCell` directly (was toggle selection).
- Removed `.cwv-card.selected` class, `.cwv-sel-check` badge.

Within-day reordering added:
- `dayOrder` state: `{ [dayIndex]: [subject, subject, ...] }` — tracks visual order per column.
- `getOrderedSubjects(daySubjects, dayOrder)` merges Firestore key order with local dayOrder.
- Drop on same column: reorders `dayOrder[di]` — card moves to end of list visually.
- Session-only — no Firestore write for order (subjects are unordered documents).
- Resets on week/student change.

Cross-day moves unchanged:
- Optimistic UI, error handling (red border 2s), `reload()` after move — all preserved.
- When a card moves cross-day, its entry is removed from source dayOrder.

**CalendarWeekView.css (111→93 lines):**
- Removed `.cwv-card.selected`, `.cwv-sel-check`, `.cwv-sel-pill`, `.cwv-sel-clear` rules.
- `.cwv-card.error` preserved.

### Commit 2 — Version bump (`fff3915`)
0.25.2 → **0.25.3** across all 3 packages.

Build green. Mobile completely untouched.

---

## Interaction model (v0.25.3)

| Action | Result |
|---|---|
| Click a card | Opens EditSheet |
| Click + hold + drag to another column | Moves card (optimistic) |
| Drop on same column | Reorders within day (visual only) |
| Click + hold done card | No drag (disabled) |
| Click all-day banner | Opens EditSheet |

---

## File-size report

| File | Lines |
|---|---|
| `CalendarWeekView.jsx` | 186 |
| `CalendarWeekView.css` | 93 |
| `PlannerLayout.jsx` | 347 (unchanged, needs split) |

---

## What is currently incomplete / pending

- **Browser smoke test** — not run. Walk:
  - Click card → EditSheet opens.
  - Hold + drag card to another day → moves instantly (optimistic).
  - Hold + drag card within same column → reorders visually.
  - Done cards: not draggable.
  - No selection UI anywhere.
  - Mobile: completely unchanged.

- **Not built yet:**
  - Drag overlay (ghost card while dragging)
  - PlannerLayout.jsx split (347 lines)

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md.
2. Smoke test click-to-open and drag-to-move on desktop.

## Key file locations

```
packages/dashboard/src/tools/planner/components/
├── CalendarWeekView.jsx                # 183 → 186
└── CalendarWeekView.css                # 111 → 93
```
