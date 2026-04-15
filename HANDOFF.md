# HANDOFF — v0.22.0 (desktop planner fixes)

## What was completed this session

### Fix 1 — Hide planner header on desktop
- `packages/dashboard/src/tools/planner/components/Header.css`:
  - Replaced the previous desktop media block (which lifted the week nav
    into row 1, hid the student row, etc.) with a single rule:
    `@media (min-width: 768px) { .header { display: none; } }`
  - Mobile layout (the 132px 3-row fixed header) is completely untouched.
  - Shell sidebar now provides branding, primary nav, and sign-out at
    desktop widths — the planner's own header is redundant there.

### Fix 2 — Desktop week nav in content area
- `packages/dashboard/src/tools/planner/components/PlannerLayout.jsx`:
  - Imports now include `formatWeekLabel` from `../constants/days.js`
  - New `<div className="planner-week-nav-desktop">` rendered inside
    `.planner-body`, directly above `<DayStrip>`. Contains `‹` button
    (onClick=prevWeek), the `formatWeekLabel(weekDates)` label, and `›`
    button (onClick=nextWeek).
- `PlannerLayout.css`:
  - `.planner-week-nav-desktop { display: none; }` by default (mobile)
  - Inside the existing `@media (min-width: 768px)` block:
    `display: flex; align-items: center; justify-content: center;
     gap: 16px; padding: 14px 28px 0; font-size: 15px; font-weight: 600;
     color: var(--text-primary);`
  - `.planner-week-nav-btn`: transparent button, no border, 18px,
    `color: var(--gold)`, 4px/8px padding, cursor pointer, Lexend.
    Hover → `var(--gold-light)`.

### Fix 3 — Student selector in desktop sidebar (lifted state)
This required lifting the active planner student out of the planner tool
and into the shell so the sidebar can both show and change it.

- `packages/dashboard/src/App.jsx`:
  - New `const [plannerStudent, setPlannerStudent] = useState('Orion')`
  - Calls `useSettings(user?.uid, plannerStudent)` at the shell level to
    get `students` and `subjectsByStudent`
  - Passes `student / setStudent / students / subjectsByStudent` down to
    `<PlannerTab>` and `students / activeStudent / onStudentChange` down
    to `<BottomNav>`.
- `packages/dashboard/src/tools/planner/hooks/usePlannerUI.js`:
  - Removed `student / setStudent` state from the hook (now lifted).
  - All other UI state (day, sheets, editTarget) unchanged.
- `packages/dashboard/src/tabs/PlannerTab.jsx`:
  - Accepts `student, setStudent, students, subjectsByStudent` props.
  - Dropped its internal `useSettings` call (shell owns it now).
  - Explicit `student={student}` and `setStudent={setStudent}` passed to
    `<PlannerLayout>` alongside the `{...ui}` spread.
  - Fallback effect (if `students` no longer contains the selected name)
    moved to use the lifted `setStudent` — same behavior as before.
- `packages/dashboard/src/components/BottomNav.jsx`:
  - New props: `students, activeStudent, onStudentChange`.
  - New JSX block: `.bn-students` — renders only when
    `activeTab === 'planner' && students?.length > 0`.
  - Label "STUDENT" + one `.bn-student-btn` per student. Active student
    gets gold-pale background + gold text, inactive renders muted white.
- `packages/dashboard/src/components/BottomNav.css`:
  - `.bn-students { display: none; }` base (mobile).
  - `@media (min-width: 768px) .bn-students`:
    - `display: block`, `padding: 10px 8px 12px`,
      `border-top: 1px solid rgba(255,255,255,0.08)`
  - `.bn-students-label`: 9px / 600 / uppercase / 0.1em tracking,
    `rgba(255,255,255,0.35)`, `padding: 0 10px; margin-bottom: 6px`.
  - `.bn-student-btn`: full-width, `padding: 8px 10px; border-radius: 8px;
    font-size: 12px;` — muted inactive, gold-pale + gold text when active.

### Fix 4 — Planner header icon buttons hidden on desktop
- Covered automatically by Fix 1 (entire `.header` hidden). Nothing else
  to do. Confirmed by inspection — those buttons were all inside `.header`.

### Fix 5 — Version bump to v0.22.0
- `packages/dashboard/package.json`: 0.21.2 → 0.22.0
- `packages/shared/package.json`:    0.1.0  → 0.22.0
- `packages/te-extractor/package.json`: 0.20.4 → 0.22.0
- UI version displays all read directly from `package.json`:
  - `BottomNav.jsx` → `pkg.version` (sidebar footer)
  - `Header.jsx` (planner, mobile) → `version` import
  - `SettingsSheet.jsx` (planner) → `version` import
  All three display `v0.22.0` automatically — no string edits required.

Build verified clean at each step. `@homeschool/dashboard@0.22.0`,
`@homeschool/te-extractor@0.22.0`. VITE env warnings on te-extractor
are expected (Netlify injects at deploy).

---

## What is currently incomplete / pending

1. **Browser smoke test** — none of v0.22.0 has been run in a browser:
   - Mobile: planner header still 132px, student pills row still works,
     week nav in row 2 still clickable, no visual regression.
   - Desktop: planner header totally hidden, week nav visible above
     DayStrip in the content column, sidebar "Student" section appears
     only on Planner tab and changes update the planner view.
   - Switching tabs (Home → Planner → Rewards): sidebar student section
     hides/shows correctly.
   - Dark mode: sidebar student pills still readable.

2. **Orphaned file** — `packages/dashboard/src/tools/planner/App.jsx` is
   not imported anywhere (shell uses `PlannerTab.jsx` directly) and still
   references the old `useSettings` call + `ui.student` pattern. Dead
   code; Vite tree-shakes it. Safe to delete in a future cleanup pass —
   not touched this session to keep the diff minimal.

3. **DayStrip sticky offset on desktop** — `App.css` still has
   `.shell-content .day-strip { top: 132px }` from when the planner
   header occupied that space. The header is now hidden on desktop, so
   this offset creates empty visual space above the sticky DayStrip when
   scrolling. Not urgent, but worth revisiting next session.

4. **Import merge bug** (inherited from session 15) —
   `calm-whistling-clock.md` plan at `/root/.claude/plans/`. Not touched.

5. **BottomNav.css minor bug** (inherited) — `.bn-signout` has
   `font-family` declared twice. Harmless.

6. **Chunk size** — dashboard JS bundle ~640 KB. Known/expected.

7. **CLAUDE.md updates** — still needs:
   - Session 16 notes: SubjectCard three-column layout; AddSubjectSheet
     batch-add model with `lessonDetails` arg; dark-mode token rule
     (`text-secondary` vs `text-muted`, `text-primary` vs `ink`).
   - v0.22.0 notes: student state lifted to `App.jsx`; desktop sidebar
     hosts the Student selector; planner header hidden on desktop;
     desktop week nav lives inside `.planner-body`.

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md (standard)
2. Browser smoke test v0.22.0 on both mobile and desktop widths
3. Update CLAUDE.md with the accumulated session 16 / v0.22.0 notes
4. Consider deleting orphaned `tools/planner/App.jsx` + fixing
   DayStrip sticky offset on desktop (item 3 above)
5. If import merge bug still repros: follow `calm-whistling-clock.md` plan

---

## Key file locations (updated this session)

```
packages/dashboard/
├── package.json                                   # v0.22.0
├── src/
│   ├── App.jsx                                    # lifted plannerStudent + useSettings
│   ├── components/
│   │   ├── BottomNav.jsx                          # new .bn-students block
│   │   └── BottomNav.css                          # + desktop student section styles
│   ├── tabs/
│   │   └── PlannerTab.jsx                         # accepts lifted props
│   └── tools/planner/
│       ├── hooks/usePlannerUI.js                  # dropped student state
│       └── components/
│           ├── Header.css                         # desktop: .header display:none
│           ├── PlannerLayout.jsx                  # + desktop week nav JSX + formatWeekLabel import
│           └── PlannerLayout.css                  # + .planner-week-nav-desktop styles
packages/shared/package.json                       # v0.22.0
packages/te-extractor/package.json                 # v0.22.0
```
