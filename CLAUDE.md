# Risk Code Hub — Status

Build/style/template instructions (shared stylesheet, HTML skeleton, confidence badges, rater system, module spec, index-update checklist) now live in the `build-hub` skill — it loads automatically when building or editing a hub.

Version format: `v[major].[minor]` — minor increments by 1 per completed hub.
Current: **v6.4 — July 2026 — 62 hubs complete** (Reinsurance group COMPLETE; **inline-confidence rollout COMPLETE** — all 62 hubs on the VER/EST/ILLUS/GAP standard with a References/Confidence-Audit page; 0 `<sup>` footnotes remain platform-wide)

---

## Current Hub Status

62 hubs complete. The **Reinsurance group** is complete: `reinsurance-general/` (gateway), `reinsurance-cat-xol/` (Catastrophe XoL), `reinsurance-quota-share/` (Quota Share), `reinsurance-surplus/` (Surplus Treaty), `reinsurance-per-risk-xol/` (Per-Risk XoL), `reinsurance-stop-loss/` (Stop-Loss / Aggregate), `reinsurance-facultative/` (Facultative), `reinsurance-retrocession/` (Retrocession), `reinsurance-structured/` (Structured / Finite) and `reinsurance-ils/` (ILS / Alternative Capital) are complete — **the 10-hub Reinsurance group is finished**. Facultative uses purple (`#6a3a7a`) and a two-panel single-risk rater; Retrocession uses deep-maroon (`#7a2f3a`) and a two-panel retro rater (indemnity cat layer + binary ILW with the RoL÷prob multiple); Structured/Finite uses charcoal (`#4a4f57`) and a two-panel LPT + ADC rater (discounted-reserve LPT + normal reserve-stop-loss ADC); ILS uses cyan (`#0f8a9c`) and a two-panel cat-bond + collateralised-sidecar rater (expected-loss/multiple + collateralised cession). Cat XoL uses storm-blue (`#264b7a`) and a cat layer rater; Quota Share uses emerald (`#2f6b4a`) and a proportional-cession rater; Surplus uses teal (`#1f6f78`) and a two-panel surplus-cession rater; Per-Risk XoL uses slate-indigo (`#3b4a8a`) and a burning-cost/rate-on-line rater; Stop-Loss uses amber (`#9a6a1e`) and a normal-model aggregate stop-loss rater (E[(L−a)⁺]−E[(L−b)⁺], erf/Φ/φ in-browser, flagged as a teaching approximation). Reinsurance hubs repurpose the standard 9 modules and use a bespoke **layer-pricing** rater (proportional cession economics + XoL rate-on-line/burning-cost + aggregate stop-loss) rather than the shared rate-on-value engine. See `project_recall_hub.md` in auto-memory for full status table.

---

## Developer setup — working in Claude Code

**What this repo is.** A static site (GitHub Pages) of 62 insurance "hubs" (each a folder of 9 HTML modules + a rater) plus shared tooling. It has grown a real software core: a **tested pricing engine** and a **flexible-rater workbench**.

**Repo layout (key paths):**
- `index.html` — search landing (Fuse.js) with an inline `HUB_DATA` array (must be updated per hub) + footer hub count.
- `hub-index.json` — master search index (id, group, keywords, url, status per hub).
- `<class>/` — one folder per hub: `overview/history/timeline/database/underwriting/rates-analysis/risk-mitigation/global-program/references.html` + `rater.html` + `rate-tables/*.json`.
- `shared/` — `rater-engine.js` (pricing engine — **single source of truth**), `rater-engine.test.js`, `rater-styles.css`, `programme-*.js`.
- `hub-styles.css` — shared stylesheet; confidence-badge palette `.b-v/.b-e/.b-i/.b-g` = VER/EST/ILLUS/GAP.
- Docs: `CONFIDENCE-BADGE-ROLLOUT.md`, `CHANGELOG.md`, `build-tracker.html`, `methodology.html`.

**Flexible Rater tool has moved out.** The rater workbench, its design doc, the rating-factor catalogue and the client-loss-model concept now live in the sibling project `../flexible-rater/` (its own repo for Claude Code). This hub keeps its **own copy** of `shared/rater-engine.js` because 60 hub raters load it at runtime — but `../flexible-rater/shared/rater-engine.js` is the **canonical / development** copy. If the engine changes there, copy it back here so the hub raters stay in sync.

**Run the tests** (before and after touching anything pricing-related):
```
node shared/rater-engine.test.js      # expect: "26 passed, 0 failed"
```
Pure Node, no dependencies. Add a golden-master assertion for any new preset or behaviour.

**Local preview:** it's static — `python3 -m http.server` in the repo root, then browse `http://localhost:8000` (some `fetch()` needs a server, not `file://`).

**Deployment:** push to `main` → GitHub Pages via Actions → https://peterhorncastle.github.io/risk-code-hub/

**Per-hub change checklist:** update the hub's 9 modules + rater, then wire `hub-index.json`, the `HUB_DATA` array + footer count in `index.html`, `build-tracker.html`, and prepend a `CHANGELOG.md` entry. Every module needs ≥1 confidence badge; the references page carries the badge legend + audit table + data gaps. QA with a grep sweep (0 `<sup>[`, 0 orphan `LEGAL/INDUSTRY` badges).

## Quality standards
- **Pricing logic lives only in `shared/rater-engine.js` (ADR-001).** The workbench and any tool must call it, never re-implement pricing maths. Extend the engine *with tests*; don't fork it.
- Every engine change ships with a test; keep `rater-engine.test.js` green.
- **No `eval()` / `new Function()`** — whitelisted operations only. Parse imported JSON defensively (`try/catch`, validate, clamp) and render user-supplied text via `textContent`, never `innerHTML`.
- Guard-rails must be **loud** — the engine returns a `warnings[]` array (divisor ≥ 1 ⇒ premium undefined, negative exposure, base rate > 1); surface them, don't silently clamp.
- **Git:** feature branches + small focused commits + a PR as the review checkpoint before merging to `main` (the deploy branch). No secrets in code or git.
- New confidence claims use the VER/EST/ILLUS/GAP inline badges.
