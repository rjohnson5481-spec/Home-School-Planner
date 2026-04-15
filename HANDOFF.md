# HANDOFF — v0.22.0 desktop layout fixes

## What was completed this session

All three fixes are additive via `@media (min-width: 768px)` — mobile
layout is untouched.

### Fix 1 — Week nav gap
- `packages/dashboard/src/tools/planner/components/PlannerLayout.css`:
  - `.planner-body` inside `@media (min-width: 768px)`:
    `margin-top: 48px` → `margin-top: 0`. The 48px came from when the
    planner had a single-row 48px desktop header — now that the header
    is `display: none` on desktop (shipped last session), that offset
    was leftover empty space above the week nav.
  - `.planner-week-nav-desktop` padding: `14px 28px 0` → `12px 28px 8px`.
    Tighter top padding, and a small `8px` bottom for breathing room
    above the day strip (the day strip also has its own `margin: 0 14px
    14px` via the App.css shell override, so total gap stays modest).

### Fix 2 — Day strip cut off on desktop
- `packages/dashboard/src/tools/planner/components/DayStrip.css`:
  - Root cause: the existing `@media (min-width: 768px)` block in
    DayStrip.css was designed for the **retired standalone planner
    sidebar mode** — it makes `.day-strip` a fixed 200px column on
    `left: 0` with `.day-strip-tab { flex: none; flex-direction: row;
    padding: 9px 10px; margin-bottom: 2px }` for vertical rows.
  - `App.css` reverts `.shell-content .day-strip` back to a horizontal
    container, but it never reverted the `.day-strip-tab` desktop rules.
    Result: inside the shell, 5 horizontal tabs with `flex: none` +
    `margin-bottom: 2px` + row-style padding didn't share width and
    caused the visible cut-off.
  - Added a `.shell-content`-scoped reset block at the end of DayStrip's
    desktop `@media`:
    - `.shell-content .day-strip-tab { flex: 1; flex-direction: column;
      justify-content: center; align-items: center; gap: 2px;
      padding: 6px 4px; margin-bottom: 0 }` — same as mobile base.
    - `.shell-content .day-strip-name` — `min-width: 0`, 11px,
      `var(--text-muted)`.
    - `.shell-content .day-strip-date` — 16px / 500 / `var(--text-primary)`,
      no underline.
    - Active, today, active+today, sick ::after — all reverted to the
      mobile visual treatment (dark pill, gold underline for today,
      red dot centered below the date).
  - Did not delete the sidebar-mode block to keep the diff minimal
    (still dead code; candidate for a future cleanup pass).

### Fix 3 — Hide top-right "+ Add" button on desktop
- `packages/dashboard/src/tools/planner/components/PlannerLayout.css`:
  - The task prompt suggested `.planner-add-btn` — but after reading
    `PlannerLayout.jsx` the correct class for the top-right "+ Add"
    inside `.planner-day-header` is `.planner-day-add-btn`.
    `.planner-add-btn` is the dashed "+ Add Subject" button at the
    bottom of the card list that we want to **keep** (as the prompt
    itself said).
  - Replaced the existing `.planner-day-add-btn` desktop styles (bg,
    colors, hover, etc.) with a single `.planner-day-add-btn { display:
    none }` inside the same `@media (min-width: 768px)` block. The
    day-header still renders the day title + subtitle — only the
    redundant button is removed.

Build verified clean (`@homeschool/dashboard@0.22.0`,
`@homeschool/te-extractor@0.22.0`).

---

## What is currently incomplete / pending

1. **Browser smoke test** — none of today's changes have been exercised
   in a browser. Walk through desktop:
   - Week nav sits flush near the top of the content area with only a
     small padding; no big empty 48px above it.
   - Day strip immediately follows the week nav and displays all 5 tabs
     (MON–FRI) sharing width across the content column. Active day is
     still a dark pill; today is still gold-underlined; sick day dot
     still centered below the date number.
   - Day-header still shows "Monday, April 13 · N subjects · X
     completed" — but no "+ Add" button on the right.
   - Bottom dashed "+ Add Subject" button still renders and works.
   - Mobile: 132px 3-row header still there, week nav on row 2, all 5
     day tabs shown in the floating pill strip as before.

2. **DayStrip sticky offset** (inherited) — `App.css` still sets
   `.shell-content .day-strip { top: 132px }` which was for when the
   planner header occupied 132px. With the header hidden on desktop,
   the day strip sticks at 132px from the top of the viewport, creating
   a visible 132px gap above it when scrolled. Not addressed today —
   still pending (should probably change to ~0 or a small value inside
   the shell override).

3. **Orphaned file** — `packages/dashboard/src/tools/planner/App.jsx`
   still references the retired `useSettings` + `ui.student` pattern.
   Dead code, tree-shaken out of the build. Safe to delete whenever.

4. **Import merge bug** (inherited from session 15) —
   `calm-whistling-clock.md` plan at `/root/.claude/plans/`.

5. **BottomNav.css minor bug** (inherited) — `.bn-signout` has
   `font-family` declared twice. Harmless.

6. **Chunk size** — dashboard JS bundle ~640 KB. Known/expected.

7. **CLAUDE.md updates** — still pending (carried from last session):
   - Session 16 notes (SubjectCard three-column layout; AddSubjectSheet
     batch-add model with `lessonDetails` arg; dark-mode token rule).
   - v0.22.0 notes (student state lifted to `App.jsx`; desktop sidebar
     hosts the Student selector; planner header hidden on desktop;
     desktop week nav lives inside `.planner-body`; day strip uses
     mobile-style horizontal layout inside the shell).
   - Today's notes: `.planner-body` margin-top 0 on desktop;
     `.planner-day-add-btn` hidden on desktop; `.shell-content`-scoped
     DayStrip tab overrides for horizontal sharing.

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md (standard).
2. Browser smoke test v0.22.0 on both mobile and desktop — verify the
   three desktop fixes above.
3. Fix the DayStrip sticky `top: 132px` remnant (item 2 above) while
   you're in the same area.
4. Delete orphaned `tools/planner/App.jsx` once confirmed unused.
5. Update CLAUDE.md with the accumulated notes from session 16 through
   today.
6. If import merge bug still repros: follow `calm-whistling-clock.md`.

---

## Key file locations (updated this session)

```
packages/dashboard/src/tools/planner/components/
├── PlannerLayout.css      # planner-body margin-top 0 on desktop;
│                          #   week nav padding 12/28/8;
│                          #   .planner-day-add-btn display:none
└── DayStrip.css           # .shell-content .day-strip-tab horizontal
                           #   flex:1 reset + color/underline reverts
```
