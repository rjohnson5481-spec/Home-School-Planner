# HANDOFF — v0.22.9 CLAUDE.md sync

## What was completed this session

No code changes. Single-file session: surgical rewrite of CLAUDE.md so
every current-state claim matches the project as it actually ships at
v0.22.9. Several sessions of features (v0.22.3 → v0.22.9) had drifted
the doc; this session brings it fully current. Historical phase-log
entries (lines ~460–525, covering v0.19.0 through v0.22.2) were
preserved intact — those are history, not current state.

### Section-by-section edits applied

1. **Deployment** — added primary custom domain
   `homeschool.grasphislove.com` (live 2026-04-15) and
   `ironandlight.netlify.app` as Netlify-default fallback. Clarified
   no `/planner/*` or `/reward-tracker/*` routes exist — all tools
   are tabs inside the shell.

2. **File structure — planner tool** — removed the `planner.css` line
   (deleted in v0.22.4 per git history), removed inline line-count
   estimates (stale across the board), added `DebugSheet.{jsx,css}`
   which was missing, flagged `SettingsSheet.{jsx,css}` as RETIRED
   v0.22.6, noted the three CSS files currently over 300 lines
   (PlannerLayout 360, UploadSheet 333, AddSubjectSheet 408).

3. **Mobile layout + Responsive breakpoints — NEW SECTION** (inserted
   before the existing Desktop layout section). Documents: 16px
   horizontal padding; no `max-width: 480px`; `.planner-subjects`
   and `.rl-body` responsive grid at `minmax(300px, 1fr)`; the
   bounded `@media (min-width: 400px) and (max-width: 1023px)`
   large-phone scaling band; 16px iOS zoom guard on sheet inputs;
   three-tier deferred to Phase 4. Plus a canonical breakpoints
   table: `<400px` small, `400–1023` large phone, `≥1024` desktop.

4. **File size rules** — added an explicit "CLAUDE.md is exempt"
   clause at the top of the section (the rule applies to source
   files only). Added a flagged list of the five CSS files currently
   over 300 lines: AddSubjectSheet (408), SettingsTab (376),
   PlannerLayout (360), UploadSheet (333), HomeTab (324).

5. **Tools status** — bumped header `(v0.22.2)` → `(v0.22.9)`.
   Expanded per-tool summaries with current feature highlights
   (batch add, large checkbox, PDF import, unified Settings, etc.).
   Added Academic Records (Phase 2) and school-year / ND compliance
   (Phase 3) rows.

6. **Shell layout** — rewrote the "state lifted to App.jsx" section
   to enumerate the four lifted pieces (`activeTab`, `plannerStudent`,
   `colorMode` + `toggleDarkMode`, `students` + `subjectsByStudent`).
   Updated `.shell-content` padding-bottom to document the tri-level
   responsive behavior (56px base, 68px at ≥400px, 200px margin-left
   at ≥1024px).

7. **Bottom nav / sidebar tabs** — rewrote from 5 tabs to 6 tabs as
   of v0.22.6 (added Settings) and appended each tab's emoji icon.

8. **File structure — dashboard shell** — added the `SettingsTab.jsx`
   / `SettingsTab.css` entries, flagged `ToolCard.{jsx,css}`,
   `Header.{jsx,css}` (shell), and `Dashboard.{jsx,css}` as DEAD
   (not imported anywhere), noted `HomeTab.css 324` and
   `SettingsTab.css 376` as over the 300 limit. Added a trailing
   note that dead files are pending a cleanup session.

9. **Bottom nav design rules** — rewrote the height/icon/label block
   as a responsive tier (56/18/9 base, 68/24/12 at ≥400px,
   sidebar at ≥1024px). Added the bounding-query rationale so the
   next Claude instance knows why 400px is capped at 1023px.

10. **Key decisions** — removed the obsolete "Mobile-first,
    max-width 480px on all tools" line. Added eight new locked
    decisions: custom domain primary / Netlify fallback;
    1024px desktop breakpoint; 400–1023 large-phone band;
    no max-width on mobile; TE Extractor links out (React rewrite
    deferred to Phase 3); three-tier responsive deferred to Phase 4;
    CLAUDE.md exempt from 300-line rule; unified Settings
    (SettingsSheet retired v0.22.6); student state lifted to App.jsx.

11. **Dark mode token rule** — reformatted into "chrome literals OK"
    vs. "tricky spots" with the specific `var(--text-primary) not
    --ink` and `var(--text-secondary) not --text-muted` rules
    promoted to clearer bullets.

12. **Reward Tracker Firestore data model** — added the path-segment
    rationale (no `students/` between `rewardTracker/` and
    `{studentName}` because Firestore document paths must have an
    even number of segments — that was the v0.21.2 fix).

13. **Phase roadmap — NEW SECTION** (inserted between the planner
    Phase 2 list and the TE Extractor architecture notes). Cross-cutting
    project-wide roadmap:
    - **Phase 1 ✅ COMPLETE at v0.22.9** — unified app shell, planner,
      reward tracker, HomeTab, unified Settings, custom domain,
      responsive scaling, TE Extractor (vanilla).
    - **Phase 2 🔒** — Academic Records, planner Phase-2 items
      (auto-roll, week history, copy last week, export PDF).
    - **Phase 3 🔒** — School year + ND compliance, TE Extractor
      React rewrite.
    - **Phase 4 🔒** — three-tier responsive typography, brand-agnostic
      shell (remove hardcoded "Iron & Light Johnson Academy"),
      50-state compliance database.

---

## File size note

CLAUDE.md is now 785 lines (up from 686). Per the new exemption
clause it's documented in: this is fine. CLAUDE.md is a reference
document; its value is completeness, not brevity.

## Deliberately NOT changed

- Planner Phase 1 log entries (✓1 through ✓33). Those record the
  session-by-session history of the planner build and are
  intentionally preserved — rewriting them would misrepresent
  what was shipped at each version.
- The `**Layout (current, v0.22+)**` design-system subsection
  (now around line 690). Still accurate — v0.22.9 is still in the
  v0.22 series.
- Phase 2 (planner) list. Still the same four items.
- TE Extractor architecture notes + Firebase CDN pattern. Unchanged.
- All token tables, font rules, header/DayStrip/cards/buttons
  design-system blocks. Still accurate.

---

## What is currently incomplete / pending

1. **Cleanup session for dead files** — ToolCard.{jsx,css},
   components/Header.{jsx,css}, Dashboard.{jsx,css},
   tools/planner/components/SettingsSheet.{jsx,css}. All flagged
   in CLAUDE.md, none imported. Delete in a dedicated cleanup pass.

2. **CSS files over 300 lines** — five files listed in CLAUDE.md's
   new subsection. Priority split target is HomeTab.css (324), the
   only one that crossed in v0.22.9. Suggested split targets are
   noted in v0.22.9 HANDOFF.

3. **iPad portrait breakpoint decision** — carried from v0.22.7/8/9.
   iPad portrait (~810px) currently falls into the large-phone band
   (mobile shell). If Rob wants iPad portrait to flip to the desktop
   sidebar, the threshold needs another revisit.

4. **Spec literal vs. intent follow-up from v0.22.9** —
   `.action-stepper-value 32px` (base 40) and `.rh-back-btn 14px`
   (base 18) both shrink at ≥400px. Flagged in v0.22.9 HANDOFF for
   Rob's review.

5. **iPhone SE grid overflow** (carried from v0.22.8) —
   `minmax(300px, 1fr)` could overflow SE's 288px content area.

6. **Planner Phase 2 features** — auto-roll flagged lessons, week
   history, copy last week, export PDF.

7. **Academic Records tab** — currently a placeholder.

8. **Import merge bug** (inherited from v0.22.3) — still open.

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md (standard). CLAUDE.md is now
   current through v0.22.9 — it can be trusted as the source of
   truth for project structure, responsive strategy, and locked
   decisions.
2. Confirm the task: feature work (Academic Records? Planner
   Phase 2? TE Extractor React rewrite?) vs. maintenance
   (dead-file cleanup, CSS file splits, iPad portrait decision,
   v0.22.9 spec-literal follow-ups).

---

## Key file locations (touched this session)

```
CLAUDE.md                                                           # full sync to v0.22.9; 785 lines (exemption documented)
HANDOFF.md                                                          # this file
```

No source files were modified. No version bump this session (CLAUDE.md
rewrite is docs-only; the live version stays v0.22.9).
