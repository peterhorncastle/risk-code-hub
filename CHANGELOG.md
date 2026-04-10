# Risk Code Hub — Changelog

## v1.6 — April 2026
**Session: 10 April 2026**
- Cyber hub complete (Lloyd's codes CY, CZ, CG, CH)
- 7 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- Loss database: 35 incidents 2013–2024 — Change Healthcare ($1.5bn+), CrowdStrike outage ($5.4bn economic), NotPetya/Maersk ($300m+), NotPetya/Merck ($1.4bn), MOVEit/Clop (3,500+ orgs), Colonial Pipeline ($4.4m ransom), MGM Resorts ($100m), Kaseya/REvil (1,500+ MSP clients)
- History: 7 era blocks from Y2K/Tech PI (1995–2000) through Beazley first standalone product, retail/healthcare breach era, Target/Sony/nation-state attacks, WannaCry/NotPetya systemic risk discovery, RaaS crisis/hardening 2019–2022, to stabilisation/AI/Change Healthcare 2022–present
- Timeline: 18+ events with colour-coded dots (red=major loss, purple=nation-state, blue=criminal RaaS)
- Underwriting: CY/CZ/CG/CH coverage structures, sublimit architecture table, 12 rating factor cards, security control scoring framework (7 controls × Green/Amber/Red), ROL methodology with formula, two worked examples (UK manufacturer £79k; US healthcare system $1.7m)
- Rates analysis: Chart.js rate index 2015–2026 (large enterprise vs mid-market), 8 market phase table, sector ROL grid (8 sectors), stacked bar combined ratio chart, ROE scenarios (Bull 22.4%, Base 9.8%, Bear −18.5%)
- Risk mitigation: 9 security control tier cards, MFA type breakdown (FIDO2/TOTP/Push/SMS/Passkeys), backup 3-2-1 diagram with assessment table, 7-stage IR lifecycle, security scoring summary matrix
- Global programmes: 6 jurisdiction profiles (USA, UK, EU, Australia, Singapore, UAE), regulations table (GDPR/HIPAA/CCPA/NIS2/DORA/SEC), LMA 5564/5565 systemic war exclusion analysis, aggregation vectors table, ILS/parametric structures, global manufacturer case study
- Updated hub-index.json: cyber status "complete"
- Updated build-tracker.html: cyber complete; next hub TBD

## v1.5 — April 2026
**Session: 10 April 2026**
- Downstream / Onshore Energy hub complete (Lloyd's codes EA, EB, EF, PG)
- 7 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- Loss database: 35 incidents 1989–2024 — Texas City ($1.5bn), Buncefield (£900m), Katrina/Rita energy ($10bn), Amuay ($1.5bn), Harvey ($7–9bn), PES Philadelphia ($500m), Abqaiq drone attack, Freeport LNG ($400m), Colonial Pipeline, Winter Storm Uri, Nord Stream sabotage
- History: 6 eras from early petroleum fire insurance (1880s) through Flixborough, Bhopal, Texas City to energy transition bifurcation 2020s
- Underwriting: EA/EB/EF/PG coverage structures, 10 rating factor cards, ALOR/MPL methodology, two worked examples (UK refinery £2,538k total; US LNG terminal $6,624k total)
- Rates analysis: Chart.js 3-dataset pricing cycle 2000–2026 (EA orange, EB navy dashed); 9-phase market cycle; adequacy bar chart; ROE scenarios (Bull 19.4%, Base 8.1%, Bear −21.6%)
- Risk mitigation: PSM hierarchy, Baker Panel, HTHA warning (Tesoro Anacortes), NFPA/API/COMAH standards table, pipeline ILI/cyber controls, post-Harvey Nat-CAT resilience, risk quality scoring table
- Global programmes: 6 jurisdiction profiles (USA, UK, Germany/Netherlands, Middle East, India, LatAm), 4-layer limit tower diagram, fronting requirements table, captive/ILS/parametric structures; Shell SIL programme case study
- Updated hub-index.json: downstream-energy status "complete"; URL corrected to downstream-energy/index.html; keywords expanded
- Updated build-tracker.html: downstream-energy set to complete; next hub: Cyber (CY/CZ/CG/CH)

## v1.4 — April 2026
**Session: 10 April 2026**
- Renewable Energy – Onshore hub complete (Lloyd's codes R2, R4)
- 7 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- Loss database: 30 incidents 1981–2025 covering wind, solar, BESS, and biomass — incl. Vestas V90 serial (£220m+), Texas hail crisis 2019, APS Arizona BESS explosion, LG Energy Solution recall, Victorian Big Battery, Moss Landing catastrophe ($700m+)
- Underwriting: R2 and R4 coverage tables, technology-specific rating factors (wind/solar/BESS/biomass), ALOR methodology, BESS post-Moss Landing requirements, worked examples: 200MW wind (£402k total) and 300MW solar + BESS Texas construction (£1,474k total)
- Rates analysis: Chart.js 3-dataset line chart (wind green, solar gold dashed, BESS orange dotted, 2010–2026), rate adequacy bars, ROE scenarios (Bull 17.8%, Base 7.2%, Bear −18.4%)
- Risk mitigation: IEC/NFPA technical standards table, wind lightning & blade programme, solar hail mitigation (dual-glass), BESS thermal runaway checklist (post-Moss Landing), biomass fire prevention, wildfire defensibility
- Global programmes: 6 jurisdiction profiles (UK, US, Germany, Australia, India, LatAm), IRA mechanism deep-dive, BESS accumulation management controls, captive/ILS structures
- Full QA pass: all 22 checks passed — no issues found
- Updated hub-index.json: renewable-energy-onshore status set to "complete"
- Updated build-tracker.html: renewable-energy-onshore complete; downstream/onshore energy set to "next"

## v1.3 — April 2026
**Session: 10 April 2026**
- Renewable Energy – Offshore hub complete (Lloyd's codes R1, R3)
- 7 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- Loss database: 30 incidents 2001–2024 including Siemens Gamesa SG 8.0-167 serial defect (£400m+)
- Underwriting methodology: R1 and R3 coverage tables, serial defect warning, ALOR formula, two worked examples (R1 £3,757k; R3 £17,720k)
- Rates analysis: Chart.js pricing cycle 2010–2026 (R1 green, R3 blue dashed), correct Chart.js v4 callbacks applied; ROE scenarios (Bull 16.2%, Base 6.4%, Bear −22.6%)
- Risk mitigation: 7-standard certifications table, LEE blade management (4 cards), cable and substation risk cards, MWS checklist
- Global programmes: 6 jurisdiction profiles (UK, Germany, Netherlands, US, Taiwan, Australia), serial defect aggregation deep-dive, Jones Act implications, R3 programme sections table, captive/ART structures
- QA tool built: `qa-checklist.html` — interactive 5-section QA checklist with Chart.js v4 known-bug callout, severity ratings, localStorage persistence
- Full QA pass performed on all 8 hub files — no critical issues found
- Updated `hub-index.json`: renewable-energy-offshore status set to "complete"
- Updated `build-tracker.html`: renewable-energy-offshore marked complete

## v1.2 — April 2026
**Session: 9 April 2026**
- Upstream / Offshore Energy hub complete (Lloyd's codes EC, EM, EN, EG, EH, EY, EZ)
- 7 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- Loss database: 35 incidents 1977–2024 with filter/sort functionality
- Underwriting methodology: 4-section coverage table, factor cards, worked FPSO example ($9.13m total premium)
- Rates analysis: Chart.js pricing cycle 2000–2026, 7-phase market cycle, 3-scenario ROE (Bull 18.4%, Base 6.8%, Bear −14.8%)
- Risk mitigation: SMS maturity framework, well barrier philosophy, BOP standards, Piper Alpha and Macondo lessons
- Global programmes: key basin profiles (7 basins), fronting requirements, limit tower diagram, captive structures
- Updated `hub-index.json`: energy-offshore status set to "complete"
- Updated `build-tracker.html`: energy-offshore marked complete

## v1.1 — April 2026
**Session: 9 April 2026**
- Project renamed from Product Recall Hub to **Risk Code Hub**
- Created unified Risk Code Hub site structure at `/risk-code-hub/`
- Built AI search landing page (`index.html`) with Fuse.js natural-language search
- Created `hub-index.json` — master search index with all ~45 class hubs, keywords, and risk codes
- Created project plan document: `risk-code-hub-project-plan-v1.0-apr2026.docx`
- Defined ~60 class groupings covering all 195 active Lloyd's risk codes
- Identified 6 admin/non-insurance codes for exclusion: LJ, BD, TC, TD, ST, SA
- Excluded 12 terrorism sub-classification codes: 1T–8T, 1E–4E
- Set build priority: Energy (Offshore, Renewables, Onshore) → Cyber → D&O → Property → Casualty
- Architecture: static HTML site targeting GitHub Pages hosting

## v1.0 — March 2026
**Session: March 2026**
- Product Recall hub created (7 modules: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program)
- Hub covers food & beverage product recall insurance (Lloyd's risk code: PB)
- Searchable/sortable database of ~35 global recall events
- Full underwriting methodology, rates/ROE analysis and global programme structuring

---
*Version numbering: v[major].[minor] where major increments on structural changes, minor on each new hub added.*
*Next version: v1.2 when Energy Offshore hub is complete.*
