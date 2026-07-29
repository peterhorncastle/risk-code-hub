# Inline Confidence Badge — Rollout Audit & Checklist Plan

**Created:** 2026-07-23 · **Owner:** Peter · **Status:** COMPLETE (v6.4, Jul 2026) — all tiers done
**Goal:** every hub uses the **inline confidence badge** system (`VER / EST / ILLUS / GAP`) as its primary evidence mechanism, consistently across all 9 modules and the references page.

---

## 1. The standard (what "inline" means)

Each factual claim carries a badge immediately after it:

| Badge | Class | Meaning |
|-------|-------|---------|
| `VER`   | `.b-v` | Verified — primary public source |
| `EST`   | `.b-e` | Estimated — broker/market consensus |
| `ILLUS` | `.b-i` | Illustrative — constructed composite |
| `GAP`   | `.b-g` | Data gap — publicly unavailable |

Markup: `<span class="badge b-v">VER</span>`

Every stat box, every key table figure, every worked example, and the first claim of each section should carry a badge. The references page carries the badge legend + a **Confidence Audit** table (~20 rows) + a **Data Gaps** section. This is already defined in `CLAUDE.md` and matches the reinsurance-general pilot.

---

## 2. What we are replacing (the "not inline" variant)

A batch of hubs built v4.3–v5.1 use a **numbered footnote** system instead: `<sup>[N]</sup>` markers in the body, with a references page using `VERIFIED / ESTIMATE / LEGAL / INDUSTRY` badges and numbered `[L1]–[L9]` / `[I1]–[I10]` source lists. These read differently and are the primary conversion target.

**Mapping when converting numbered → inline:**

| Old (numbered) | New (inline) |
|---|---|
| `[L#]` LEGAL source (statute, convention, judgment) | `VER` |
| `[I#]` INDUSTRY source (trade body, market report, disclosure) | `VER` if primary/verifiable, else `EST` |
| `VERIFIED` badge | `VER` |
| `ESTIMATE` badge | `EST` |
| constructed/worked figure | `ILLUS` |
| unavailable/undisclosed figure | `GAP` |

Keep the underlying sources — move them into the references Confidence Audit table rather than deleting them.

---

## 3. Hub audit — three tiers

Signals used: presence of `<sup>[` numbered markers + `LEGAL/INDUSTRY` badges (→ numbered system); density of inline `badge b-*` across the 9 modules (→ inline). Each hub's exact state is re-checked as **step 1** of its conversion (see §4), so treat borderline cases as "confirm on open."

### Tier 1 — Numbered `<sup>` citation system → CONVERT to inline (19 hubs)
Highest priority. These use footnotes + LEGAL/INDUSTRY throughout and only carry inline badges on the overview stat row.

| # | Hub | Folder | Status |
|---|-----|--------|--------|
| 1 | Extended Warranty | `extended-warranty/` | ✅ **done (Phase 1 pilot, Jul 2026)** — 76 markers converted, references rebuilt |
| 2 | Crime / Fidelity Commercial | `crime-commercial/` | ✅ done (v6.4, Jul 2026) |
| 3 | Employers Liability – UK | `employers-liability-uk/` | ✅ done (v6.4, Jul 2026) |
| 4 | Workers Compensation – USA | `workers-comp-us/` | ✅ done (v6.4, Jul 2026) |
| 5 | Workers Comp – International | `workers-comp-international/` | ✅ done (v6.4, Jul 2026) |
| 6 | Engineering & Construction | `engineering/` | ✅ done (v6.4, Jul 2026) |
| 7 | Motor – International | `motor-international/` | ✅ done (v6.4, Jul 2026) |
| 8 | Yachts | `yachts/` | ✅ done (v6.4, Jul 2026) |
| 9 | Medical Malpractice & Healthcare | `medical-malpractice/` | ✅ done (v6.4, Jul 2026) |
| 10 | Temporary Life & Permanent Health | `temp-life-health/` | ✅ done (v6.4, Jul 2026) |
| 11 | Terrorism & Political Violence | `terrorism-political-violence/` | ✅ done (v6.4, Jul 2026) |
| 12 | Event Cancellation & Contingency | `event-cancellation/` | ✅ done (v6.4, Jul 2026) |
| 13 | Livestock & Bloodstock | `livestock-bloodstock/` | ✅ done (v6.4, Jul 2026) |
| 14 | Fine Art, Specie & Jewellery | `fine-art-specie/` | ✅ done (v6.4, Jul 2026) |
| 15 | Nuclear | `nuclear/` | ✅ done (v6.4, Jul 2026) |
| 16 | Film & Entertainment | `film-entertainment/` | ✅ done (v6.4, Jul 2026) |
| 17 | Legal Expenses | `legal-expenses/` | ✅ done (v6.4, Jul 2026) |
| 18 | Difference in Conditions | `dic/` | ✅ done (v6.4, Jul 2026) |
| 19 | Aviation War & Confiscation | `aviation-war/` | ✅ done (v6.4, Jul 2026) |

### Tier 2 — Little / no inline badges → ADD inline (≈17 hubs)
Older core hubs built before the badge standard. Overview stat rows and body prose carry no (or almost no) confidence badges; needs badges added across all 9 modules + references rebuilt.

| # | Hub | Folder | Status |
|---|-----|--------|--------|
| 1 | Product Recall | `product-recall/` | ✅ done (v6.4, Jul 2026) |
| 2 | Upstream / Offshore Energy | `energy-offshore/` | ✅ done (v6.4, Jul 2026) |
| 3 | Downstream / Onshore Energy | `downstream-energy/` | ✅ done (v6.4, Jul 2026) |
| 4 | Renewable Energy – Offshore | `renewable-energy-offshore/` | ✅ done (v6.4, Jul 2026) |
| 5 | Renewable Energy – Onshore | `renewable-energy-onshore/` | ✅ done (v6.4, Jul 2026) |
| 6 | Environmental Liability | `environmental-liability/` | ✅ done (v6.4, Jul 2026) |
| 7 | Cyber | `cyber/` | ✅ done (v6.4, Jul 2026) |
| 8 | Directors & Officers (D&O) | `d-and-o/` | ✅ done (v6.4, Jul 2026) |
| 9 | Directors & Officers (legacy dup?) | `directors-officers/` | ✅ both converted (v6.4); dedupe still optional |
| 10 | Employment Practices Liability | `epli/` | ✅ done (v6.4, Jul 2026) |
| 11 | Transactional Liability (W&I / Tax) | `transactional-liability/` | ✅ done (v6.4, Jul 2026) |
| 12 | PI E&O – Legal & Accountants | `pi-eo/` | ✅ done (v6.4, Jul 2026) |
| 13 | PI E&O – Technology & Telecom | `pi-tech/` | ✅ done (v6.4, Jul 2026) |
| 14 | Mortgage / Title / Surety / FG | `financial-lines-misc/` | ✅ done (v6.4, Jul 2026) |
| 15 | Aviation | `aviation/` | ✅ done (v6.4, Jul 2026) |
| 16 | Personal Accident & Health | `personal-accident-health/` | ✅ done (v6.4, Jul 2026) |
| 17 | Marine Hull War | `marine-hull-war/` | ✅ done (v6.4, Jul 2026) |

### Tier 3 — Already on the inline system (verify + top-up only, ≈16 hubs)
These already use inline `VER/EST/ILLUS/GAP` in the body. A light pass to confirm coverage density and references-page format is enough.

`agricultural-crop-forestry/`, `credit-contract-frustration/`, `crime-financial-institutions/`, `general-liability-non-us/`, `general-liability-usa/`, `marine-cargo/`, `marine-hull/`, `marine-liability/`, `motor-uk/`, `pi-construction/`, `pi-eo-misc/`, `pi-financial-institutions/`, `political-risk/`, `property-commercial/`, `space/`, `uk-household/`

**Done:** `reinsurance-general/` (pilot — full inline standard).

---

## 4. Per-hub conversion checklist (repeatable)

Run these steps for each hub, one hub per pass:

1. **Audit current state.** Grep the hub for `<sup>\[` (numbered markers) and `badge b-` (inline density). Note which modules already carry badges. Decide Tier 1 (convert) vs Tier 2 (add).
2. **Body claims.** Walk all 9 modules (overview, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program, references). For every stat box, key table figure, worked-example result, and lead section claim, ensure a badge is present.
   - *Tier 1:* replace each `<sup>[N]</sup>` with the mapped badge (§2); do not lose the source — carry it to the audit table.
   - *Tier 2:* add the appropriate badge (VER for sourced facts, EST for market estimates, ILLUS for constructed figures, GAP for gaps).
3. **References page.** Rebuild `references.html` to the standard: badge legend (VER/EST/ILLUS/GAP), a **Confidence Audit** table (~20 rows: claim → value → confidence → basis), and a **Data Gaps** section. Retire the LEGAL/INDUSTRY legend and numbered source list (fold sources into the audit table).
4. **Consistency.** Remove any orphaned `<sup>[` markers. Confirm badge classes match `hub-styles.css` (`b-v/b-e/b-i/b-g`).
5. **Dark-text audit.** Confirm no change breaks the `DESIGN_RULES.md` dark-container text rules (badges already carry their own colour, so cascade is unaffected).
6. **QA gate (per hub):**
   - [ ] Every one of the 9 modules has ≥1 confidence badge
   - [ ] No `<sup>[` markers remain
   - [ ] references.html has legend + audit table + data gaps
   - [ ] Stat boxes and worked-example results all badged
   - [ ] Spot-render in browser — badges visible, no dark-on-dark
7. **Record.** Tick the hub in §3, add a CHANGELOG line, bump version, update memory.

---

## 5. Suggested sequencing

1. **Pilot one Tier 1 hub first** (recommend `extended-warranty/` — self-contained, single code) and have Peter review the converted result before batching the rest — same pilot-first approach used for the reinsurance group.
2. **Batch the remaining Tier 1 hubs** (18) — mechanical, mapping-driven, lower risk once the pilot pattern is agreed.
3. **Tier 2 hubs** (17) — more effort (net-new annotation + source-finding); do the highest-traffic classes first (Cyber, D&O, Energy, Product Recall).
4. **Tier 3 sweep** (16) — quick verification/top-up.
5. Fold the standard into any future hub build via `CLAUDE.md` (already specifies it) so no new hub regresses.

**Open decision for Peter:** confirm whether `d-and-o/` and `directors-officers/` are duplicates (one may be a legacy folder to retire rather than convert).

---

## 6. Progress tracker

| Tier | Hubs | Converted | Remaining |
|------|------|-----------|-----------|
| Tier 1 — convert from numbered | 19 | 19 | 0 |
| Tier 2 — add inline | 19 | 19 | 0 |
| Tier 3 — verify/top-up | 15 | 15 | 0 |
| **Total (excl. reinsurance pilot)** | **53** | **53** | **0 — COMPLETE** |

*Phase 1 pilot: Extended Warranty converted 2026-07-23 (76 markers → inline badges; references rebuilt to audit standard).*

*Update this table and the §3 status boxes as each hub is completed.*

---

## 7. Resumable Job Card — "Continue the inline-confidence rollout"

**Trigger phrase:** "continue the inline confidence rollout" / "convert the next hub(s) to inline badges".

**Status at last save (2026-07-23):** Phase 1 pilot complete — `extended-warranty/` fully converted and approved as the reference implementation. 18 Tier-1 hubs, 17 Tier-2 hubs, 16 Tier-3 hubs remain.

**Reference implementation to copy:** `extended-warranty/` — study its 9 modules + `references.html` to see the exact target state before converting the next hub.

**How to execute (per hub, no extra context needed):**
1. Pick the next unticked hub from §3 (work Tier 1 → Tier 2 → Tier 3; within a tier, top-down).
2. Grep the hub for `<sup>\[` and `badge b-` to gauge the starting state.
3. Apply the **mapping rule**: legal / regulatory / court / statute / disclosed-figure claims → `VER`; market-size, loss-ratio, margin, rate, revenue, fraud-%, cost-inflation estimates → `EST`; constructed worked examples / ROE scenarios → `ILLUS`; explicitly unknown / undisclosed data → `GAP`.
4. Badge markup (canonical, matches `hub-styles.css`): `<span class="badge b-v">VER</span>` · `b-e` EST · `b-i` ILLUS · `b-g` GAP. Add a leading space before the badge.
5. Tier 1: replace each `<sup>[N]</sup>` with the mapped badge (carry the underlying source into the references audit table). Tier 2: add badges to stat boxes, key table figures, worked-example results and lead section claims.
6. Rebuild `references.html` to the standard (see §4 step 3): 4-badge legend, ~20-row Confidence Audit table, retained sources retagged VER/EST, Data Gaps section. Use `extended-warranty/references.html` as the template.
7. Ensure every one of the 9 modules carries ≥1 badge (add a confidence note to `database.html` if it has none).
8. **QA gate:** 0 `<sup>[` left · 0 orphan `b-leg`/`b-ind`/`LEGAL`/`INDUSTRY` · every module badged · references has legend+audit+gaps.
9. Tick the hub in §3, decrement §6, add a CHANGELOG line, update memory.

**Batching guidance:** after the first 1–2 additional Tier-1 conversions, these are safe to batch several per session (mechanical). Tier 2 needs light source-finding, so pace those.

**Open decision still pending:** confirm whether `d-and-o/` and `directors-officers/` are duplicates (retire one instead of converting both).

**Notes for the executor:** the sandbox `bash` was unavailable in the pilot session — the whole conversion was done with the Read/Edit/Grep file tools, batching multiple Edits per file. That works fine; don't block on bash.
