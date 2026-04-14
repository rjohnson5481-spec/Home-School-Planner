# HANDOFF — Session 16

## What was completed this session

### App shell foundation — dashboard promoted to unified shell

Four commits landed:

**1. `BottomNav.jsx` + `BottomNav.css` (f8369ff)**
- Five-tab persistent nav bar: 🏠 Home · 📅 Planner · 🏅 Rewards · 📄 TE Extractor · 🎓 Records
- Always `#22252e` background. Active tab: `#e8c97a` with `rgba(201,168,76,0.15)` pill behind icon.
- Inactive: `rgba(255,255,255,0.45)`. Height 56px fixed. Safe area inset bottom.
- TE Extractor tab uses `window.location.href` — the others set React tab state.

**2. Tab placeholder components (8e4c874)**
- `HomeTab.jsx` — existing tool card grid rendered without the old Header component.
  Tool cards (Planner → /planner/, Reward Tracker → /reward-tracker/, TE Extractor, Academic Records) all intact.
- `PlannerTab.jsx`, `RewardsTab.jsx` — "migration in progress" placeholders.
- `AcademicRecordsTab.jsx` — "coming soon" placeholder.
- Shared `PlaceholderTab.css` for the three non-home placeholders.

**3. `App.jsx` shell wiring + `App.css` (d829576)**
- App.jsx: replaced `<Dashboard />` render with full shell layout.
- `activeTab` state (default `'home'`), passed to `BottomNav` as `onTabChange`.
- `app-shell` + `shell-content` CSS classes in App.css.
- `shell-content` has `padding-bottom: calc(56px + env(safe-area-inset-bottom))`.

**4. CLAUDE.md documentation (2cd94ca)**
- New "Dashboard — app shell architecture" section with full file structure.
- Bottom nav design rules documented.
- Migration plan noted.

---

## What is currently incomplete / pending

1. **Tool migration — NEXT SESSION**
   - `PlannerTab.jsx`: embed planner code from `packages/planner/src/` into the dashboard shell.
     The planner at `/planner/` stays deployed for now; migration adds it as a tab.
   - `RewardsTab.jsx`: embed reward tracker from `packages/reward-tracker/src/`.
   - Decision to make at start of migration: keep tools as separate builds OR merge into dashboard build.
     Current CLAUDE.md says separate builds stay — tabs in shell will likely iframe or redirect for now.
     Confirm with Rob at start of next session before touching anything.

2. **HomeTab evolution** — tool card grid is placeholder. Replace with morning summary dashboard
   (today's date, what's on the schedule, reward points, etc.) once tools are migrated.

3. **Dark mode toggle missing from shell** — HomeTab has no dark mode button. The old Header.jsx had
   the dark mode toggle; it's now unused. Need to add dark mode toggle somewhere in the shell
   (possibly in HomeTab or as a small button in the bottom nav area). Not urgent.

4. **Sign out button missing from shell** — Header.jsx had the sign-out button; it's now unused.
   Need to add sign-out somewhere accessible in the shell. Not urgent.

5. **Reward-tracker production verification** (from session 15) — still pending:
   - Confirm blank-white-page fix (Firestore path) is working
   - Confirm cash value shows cents
   - Confirm dark mode toggle works and persists

6. **Firestore security rules** — confirm `/users/{uid}/rewardTracker/**` is covered.

7. **Planner import merge bug** — `calm-whistling-clock.md` plan still unexecuted.

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md (standard)
2. **DECISION POINT before writing any code**: confirm with Rob — do we migrate planner/reward-tracker
   INTO the dashboard build (one bundled app), or do we keep them as separate Vite builds and have
   the shell tabs navigate externally? This is architecturally significant and must be confirmed first.
3. Address sign-out + dark mode missing from shell (small fix, 2-3 lines each)
4. Then proceed with tool migration per Rob's decision

---

## Architecture decision pending (do NOT assume)
The current `packages/planner` and `packages/reward-tracker` are separate Vite builds with their
own `index.html`, `vite.config.js`, and Netlify redirects. Migrating them INTO the dashboard shell
means merging their source into `packages/dashboard/src/` and removing their separate builds.
This is a significant change to the build config and netlify.toml.

The alternative is "fake migration" — the Planner and Rewards tabs in the shell simply do
`window.location.href = '/planner/'` / `window.location.href = '/reward-tracker/'` instead of
rendering real content. This is simpler and avoids touching build config, but doesn't give the
unified-app feel Rob described.

Rob must confirm which approach before any code is written next session.
