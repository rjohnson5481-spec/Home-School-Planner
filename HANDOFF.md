# HANDOFF — Session ending 2026-04-13 (sixth session)

## What was completed this session

### TE Extractor v0.20.2 — revert to direct Anthropic API calls

**Why:** Netlify Function proxy was causing gateway timeouts that could not be
resolved within Netlify Pro limits. The tool is family-internal and never public.

**Changes made:**

`packages/te-extractor/public/app.js`:
- VERSION bumped to '0.20.2'
- Added SYSTEM_PROMPT constant (was previously in the deleted Netlify Function)
- Replaced `callAPI()` — now calls `https://api.anthropic.com/v1/messages` directly
  using `import.meta.env.VITE_ANTHROPIC_API_KEY` with the `anthropic-dangerous-direct-browser-access: true` header
- Removed the old Netlify-specific 8 MB base64 size gate (no longer needed)
- Fixed version display double-v bug: `versionDisplay` span now gets `VERSION` (not `v${VERSION}`)
  since the surrounding HTML already reads "TE Extractor v<span>"

`packages/te-extractor/public/index.html`:
- Changed `<script src="app.js">` to `<script type="module" src="./app.js">`
  (required for `import.meta.env` to work after Vite processing)
- Removed hardcoded `v2.3` from `#sidebarVersion` — now empty, stamped by JS on load

`packages/te-extractor/vite.config.js` (new):
- Vite build added: root='public', base='/te-extractor/', publicDir=false
- Stable output filenames (no hashes) so service worker cache works correctly
- SVG assets output to `icons/` subdirectory to match manifest and HTML references

`packages/te-extractor/package.json`:
- Version → '0.20.2'
- Added `"type": "module"`
- Added `vite: "5.4.10"` devDependency (matches version used by planner)
- Build script: `vite build && cp public/manifest.json public/sw.js ../../dist/te-extractor/`

`netlify/functions/te-extractor.js` — deleted
`netlify/functions/te-extractor.json` — deleted

`CLAUDE.md`:
- Updated Anthropic API pattern section to document the TE Extractor exception
- Added VITE_ANTHROPIC_API_KEY to environment variables list
- Updated TE Extractor architecture notes
- Updated key decisions to note the TE Extractor exception

---

## CRITICAL — Rob must do this before testing

**Add `VITE_ANTHROPIC_API_KEY` to Netlify environment variables:**
1. Netlify → Site configuration → Environment variables
2. Add variable:
   - Key: `VITE_ANTHROPIC_API_KEY`
   - Value: same value as the existing `ANTHROPIC_API_KEY` variable
3. Trigger a manual redeploy after adding the variable
   (env vars are only injected at build time — the site must rebuild after adding them)

Without this step, the API key will be `undefined` at runtime and all extractions will fail.

---

## Current state

Committed and pushed to main. Netlify deploying.

---

## What to do first next session

1. Confirm `VITE_ANTHROPIC_API_KEY` was added to Netlify (see above).

2. Test extraction end-to-end with a real TE PDF:
   - Should complete without gateway timeout
   - Debug log tab (from earlier session, on claude/read-claude-docs-er59m branch)
     is NOT on main yet — that branch has a superset of today's changes;
     consider merging or cherry-picking that work

3. Smoke-test planner at /planner/ — confirm import wipe fix (8dc3b64) still
   works: import second PDF with toggle OFF, existing done/note data preserved.

4. reward-tracker: still needs migrating into monorepo structure.

---

## Known incomplete / not started

- reward-tracker: not migrated
- Academic Records: coming-soon placeholder only
- CLAUDE.md Layout section still says "2 rows, total 80px" — should be
  "3 rows, total 132px"
- Debug Log panel + mobile cache clear button + function timing logs
  (v0.20.1 work) are on branch `claude/read-claude-docs-er59m` but NOT on main.
  Those changes should be merged/applied to main after today's direct-API change
  is confirmed working. Note: the v0.20.1 work references `addDebugLog()` calls
  inside `callAPI()` — those will need to be adapted to the new direct API call shape.
