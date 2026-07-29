---
name: build-hub
description: Build instructions for Risk Code Hub modules — shared stylesheet/template, CSS variables, HTML skeleton, confidence badges, rater system + JSON schema, and the standard 9-module content spec. Use when building or editing a Risk Code Hub module/page, adding a new hub, or creating a rater.html/rate-tables file.
---

# Risk Code Hub — Build Instructions

## Shared Stylesheet & Template

All hub pages use a **shared stylesheet** and a **canonical template**. These are the ground truth for design — not memory, not previous hub files.

| File | Purpose |
|------|---------|
| `hub-styles.css` | Shared stylesheet — ALL structural CSS lives here |
| `_template.html` | Blank canonical page — copy this for every new module |
| `shared/` | Shared JS/CSS engine library for raters & programme builder (rater-engine.js, rater-ui.js, rater-styles.css, programme-engine.js, programme-ui.js, programme-styles.css) |
| `programme-builder.html` | Global Programme Builder — cross-hub multi-line programme tool |
| `methodology.html` | Research Methodology & Sources page |
| `generate-raters.js` | Node.js script — auto-generates rater.html files from hub-index.json + theme map |

**Before starting a new hub:** Read `_template.html` in full. It contains full instructions and all available CSS class names.

---

## Hub Structure (every hub, every page)

```
<link rel="stylesheet" href="../hub-styles.css">
<style>
  :root {
    --hub-primary:   #XXXXXX;
    --hub-dark:      #XXXXXX;
    --hub-light:     #XXXXXX;
    --hub-accent:    #c8a84b;   /* gold — standard unless hub genuinely differs */
    --header-gradient: linear-gradient(135deg, ... );
    --header-sub:    #XXXXXX;
  }
</style>
```

**No other inline CSS.** If a pattern isn't in `hub-styles.css`, add it there first, then use it.

### HTML skeleton — every page

```html
<header>
  <div class="breadcrumb"><a href="../index.html">Risk Code Hub</a> › <a href="overview.html">[Hub]</a> › [Page]</div>
  <div class="tag">Module NN — [Name]</div>
  <h1>[Hub] — [Module Title]</h1>
  <p>[Description]</p>
</header>
<nav>
  <a href="overview.html">Overview</a>
  <a href="history.html">History</a>
  <a href="timeline.html">Timeline</a>
  <a href="database.html">Loss Database</a>
  <a href="underwriting.html">Underwriting</a>
  <a href="rates-analysis.html">Rates &amp; ROE</a>
  <a href="risk-mitigation.html">Risk Mitigation</a>
  <a href="global-program.html">Global Programme</a>
  <a href="references.html">References</a>
</nav>
<main>...</main>
<footer><a href="../index.html">← Risk Code Hub</a> | [Hub] ([Code]) — [Module] | Version X.X · Month Year</footer>
```

- Nav: `class="active"` on the current page tab only
- No bottom nav-strips, no breadcrumb-only navigation
- `<nav>` always immediately follows `</header>`

---

## Confidence Badges — Lightweight Citations Standard

Every factual claim must carry one badge:

| Badge | Class | Meaning |
|-------|-------|---------|
| VER | `.b-v` | Verified — primary public source |
| EST | `.b-e` | Estimated — broker/market consensus |
| ILLUS | `.b-i` | Illustrative — constructed composite |
| GAP | `.b-g` | Data gap — publicly unavailable |

Usage: `<span class="badge b-v">VER</span>`

---

## Rater System (added May 2026)

Every hub now has an interactive rater. Each hub folder contains:
- `rater.html` — interactive rating tool, references `../shared/rater-engine.js` and `../shared/rater-styles.css`
- `rate-tables/<CODE>.json` — one JSON file per Lloyd's risk code (195 files total across all hubs)

**Rate table JSON schema:**
```json
{
  "riskCode": "PB",
  "label": "Product Recall",
  "modelType": "rate-on-value",
  "currency": "GBP",
  "exposureMeasure": { "key": "annualRevenue", "label": "...", "defaultValue": 50000000 },
  "baseRate": { "key": "baseRate", "label": "Base Rate", "value": 0.0015 },
  "ratingFactors": [ { "key": "...", "label": "...", "type": "categorical|band|numeric", ... } ],
  "minimumPremium": 5000
}
```

When building a new hub, also create `rater.html` + one `rate-tables/<CODE>.json` per risk code. Use `generate-raters.js` as reference for the hub theme colour map.

The nav does **not** include a Rater tab — rater.html is accessible from overview.html or directly, not via the standard 9-page nav.

---

## Standard Module Content (9 modules per hub)

| Module | File | Key content |
|--------|------|--------------|
| Overview | `overview.html` | Stats row (5–6 stats), risk code table, coverage taxonomy (6 cards), market participants, module nav grid |
| History | `history.html` | 5 eras, key figures, regulatory evolution |
| Timeline | `timeline.html` | 20 events, coloured dots/tags, legend |
| Loss Database | `database.html` | 35 events, JS filters (type + severity), expandable rows |
| Underwriting | `underwriting.html` | Rating formula box, factor cards, 2 worked examples, pre-bind checklist |
| Rates & ROE | `rates-analysis.html` | 3 Chart.js charts (Chart.js 4.4.1 from cdnjs), 4-era cycle, rate benchmark table, Bull/Base/Bear ROE |
| Risk Mitigation | `risk-mitigation.html` | Control cards, regulatory standards table (8 rows), before/during guidance |
| Global Programme | `global-program.html` | Coverage tower, admitted matrix, placement workflow, case study |
| References | `references.html` | 6 source category cards, 6 landmark cases, 20-row confidence audit, 5 data gaps |

---

## Index Files — Update After Each Hub

When a hub is complete, update ALL of these:
1. `hub-index.json` — status `"planned"` → `"complete"`, expanded description + keywords
2. `index.html` — HUB_DATA entry status + footer version/hub count
3. `build-tracker.html` — status + version
4. `CHANGELOG.md` — prepend new version entry
5. `project_recall_hub.md` (auto-memory) — version + hub status table
6. `MEMORY.md` (auto-memory) — version + hub list
7. `rater.html` + `rate-tables/<CODE>.json` — create rater for each risk code in the hub

---

## Version Numbering

Format: `v[major].[minor]` — minor increments by 1 per completed hub.
