# HANDOFF — v0.19.1 Green-purge audit (2026-04-12)

## What was completed this session

### v0.19.1 — green color audit + patch bump

**Grep run across all *.json, *.html, *.css, *.jsx, *.js, *.toml:**
```
grep -r "#2d5a3d\|#3b5c3a" ...
```
**Result: zero matches.** The previous session (v0.19.0 Fix 1) already replaced
every `#2d5a3d` occurrence in `manifest.json` and both `index.html` files.
No further replacements were needed.

**Version bumped:** `0.19.0` → `0.19.1` in both package.json files (`764b5a8`).

---

## What is currently incomplete

- Smoke-test still needed for all v0.19.0 fixes (code-only, not browser-verified):
  - PWA install banner shows `#22252e` charcoal (not green)
  - Settings sheet shows one "School Year & Compliance" section (not two)
  - Student ✕ delete button works; hidden when only 1 student remains
  - Header student pills update live after students added/removed in Settings
  - AddSubjectSheet quick-picks show per-student Firestore subjects
- reward-tracker — still needs migrating into monorepo structure
- Phase 2 features (do not build until Rob confirms)

---

## What the next session should start with

1. Read CLAUDE.md + HANDOFF.md
2. Smoke-test all v0.19.0 fixes in browser (list above)
3. Confirm with Rob: Phase 2 features or reward-tracker migration?
