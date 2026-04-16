# Risk Code Hub — Changelog

## v2.0 — April 2026
**Session: 16 April 2026**
- UK Household Property hub complete (Lloyd's code HP) — full 9-module hub at `uk-household/`
- 9 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program, references
- Lightweight citations standard applied throughout (VER/EST/ILLUS/GAP confidence badges inline on all claims)
- Hub context: Lloyd's HP is specialist market — HNW, non-standard construction (listed, thatched, timber frame, pre-cast concrete), flood-risk, let/holiday/unoccupied properties. Standard mass market (Direct Line, Aviva, Admiral) is outside Lloyd's scope.
- Coverage structure: buildings (BCIS agreed/rebuild value), contents (new-for-old, blanket HNW), fine art/jewellery (scheduled, agreed value), liability (occupiers, employer's, personal up to £50m HNW), legal expenses, home emergency, all-risks extension
- History: 9 era blocks from 1666 Great Fire (Nicholas Barbon, Fire Office) through mutual era, building society/mortgage tie, mass-market emergence, Great Storm 1987 (£2bn), subsidence crisis 1989–1995 (£3bn cumulative), PCW revolution, summer 2007 floods (£3bn), Flood Re 2016, FCA GIPP January 2022, BCIS inflation and net zero retrofit risks 2022–present
- Timeline: 18 events 1987–2024 — Great Storm 1987 (£2bn), Burns Day 1990 (£3bn), subsidence crisis, autumn 2000 floods (£1bn), 2007 floods (£3bn), direct line vs PCW era, Flood Re 2016, Desmond/Eva/Frank 2015 (£1.3bn), FCA GIPP 2022, Storm Eunice (£400m), summer 2022 subsidence (40.3°C), Storm Babet 2023, Storm Ciaran 2023
- Claims database: 35 events as searchable JS array — filter by peril type (storm/flood/subsidence/fire/regulatory), region, year band, minimum loss; sort by year/event/peril/loss; VER/EST confidence column per event
- Underwriting: BCIS rebuild cost basis formula; 6 factor cards (base rate, occupancy, EA Zone 2/3 flood loadings, BGS shrink-swell subsidence, tree proximity); non-standard construction table (7 types: thatched, listed, timber frame, pre-cast concrete, steel frame, flat roof, converted); contents rating (SI basis, single article limits, all-risks); HNW methodology comparison (standard vs HNW: agreed value, blanket cover, fine art thresholds, fine art/jewellery rating table); Flood Re mechanics table (eligibility, council tax band cession estimates, £250 excess, 2039 transition); post-2009 cliff-edge warning box; quality scoring matrix (6 control areas × Green/Amber/Red); two worked examples: Oxfordshire Grade II farmhouse (~£5,240 + IPT) and Kensington Grade II* townhouse (~£19,235 + IPT); exclusions table (7 items including EV charging gap)
- Rates analysis: Chart.js estimated rate index 2000–2026 (2000=100); 7 market cycle phases (post-2000 flood hardening, PCW softening, 2007 flood reset, benign 2009–2014, Flood Re 2016 structural change, GIPP reform 2022, BCIS inflation hardening); FCA GIPP deep-dive box (6m customers, £1.2bn loyalty penalty, 3m home, structural market reset); combined ratio table 2010–2026 (15 rows: 87% best year 2016, 110% worst year 2023); sector rate grid (7 segments from standard £0.90/£1k to unoccupied £3–£8/£1k); ROE scenarios on £500m GWP: Bull +27.6% (88% CR), Base +8.8% (99% CR), Bear −23.6% (118% CR); Chart.js combined ratio bar chart (green/red colour-coded by breakeven)
- Risk mitigation: flood resilience (PFR framework, CIRIA C790 — resistance: flood doors, air brick covers, non-return valves, sump/pump, raised electrics; resilience: flood-resilient flooring, lime plaster, raised white goods); EA/JBA flood monitoring; subsidence management (tree management, drainage, foundation investigation, underpinning); fire controls (standard, thatched, listed building specific); security (BS EN 50131 alarm, BS 3621 locks, SBD, CCTV, safe grades); non-standard maintenance obligations; net zero retrofit emerging risks (heat pump fires, solar PV arc faults, EV charging thermal runaway, EWI/cladding BR 135); top 10 risk actions for HP insureds; standards table (10 standards: SBD, BS3621, BS EN 50131, BS5839-6, CIRIA C790, MCS, OZEV/OLEV, BR135, BGS, EA Flood Map)
- Global programmes: UHNW multi-property programme tower (6 layers: SIR → primary UK → local admitted overseas → XL1 → XL2 → umbrella); 6 jurisdiction profiles (UK, France with Cat Nat, Italy with earthquake exclusion, Switzerland with KGV cantonal monopoly, USA with NFIP/surplus lines/California wildfire, Caribbean with hurricane/demand surge); landlord portfolio structures (4 tiers: single BTL → portfolio → large → property company/captive); captive structures for UHNW (segregated account/PCC, single-parent captive, family office risk pool with thresholds and cost estimates); UHNW illustrative case study (5 properties UK/France/Italy/New York — ~£61,300 indicative programme premium); DIC structuring table (4 applications: France Cat Nat gaps, Italy earthquake, US deductible differences, worldwide fine art blanket); Lloyd's programme advantages table
- References: 4-tier confidence badge legend; 10 primary sources with citation URLs (FCA PS21/5, Water Act 2014, Flood Re scheme, EA Flood Map, HMRC IPT, ABI, BCIS, BGS, Lloyd's, MHCLG EHS, Met Office, CIRIA, JBA, RICS); per-module confidence audit table (7 modules × 5 columns); 5 known data gap disclosures; version history
- Updated hub-index.json: HP entry added (Property group, status complete, url uk-household/index.html)
- Updated index.html HUB_DATA: HP entry added; footer updated v1.9→v2.0, 9→10 hubs complete
- Methodology page already exists at methodology.html (built v1.9); nav link added across all HP modules

## v1.9 — April 2026
**Session: 15 April 2026**
- Aviation hub complete (Lloyd's codes H2, H3, L2, L3, AO, AP) — combined into single hub at `aviation/`
- 8 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- History module was already built in previous session; timeline, database also pre-existing; underwriting, rates-analysis, risk-mitigation, global-program built this session
- Coverage structure: H2 airline hull (agreed value, all risks), H3 GA/corporate hull, L2 airline CSL liability (Montreal Convention, $1.5bn–$2.5bn CSL standard), L3 GA/corporate liability, AO aerospace products liability (claims-made, OEM exposure rating), AP airport owners & operators
- Loss database: 35 major events 1974–2024 — Tenerife (1977, 583 killed), Lockerbie (1988, $500m), 9/11 (2001, $2.5bn), MH370 (2014, $630m), MH17 (2014, war risk), 737 MAX crashes (2018–2019, $1.2bn AO), Russia leasing dispute (2022, $8bn+ unresolved), Haneda collision (2024), Boeing door plug blowout (2024)
- History: 7 era blocks from Lloyds of London first aviation policy 1911 through WWI/WWII, jet age, Chicago Convention, Montreal Convention 1999, 9/11 market collapse, 737 MAX/COVID reset, to Russia leasing dispute and GPS spoofing 2024
- Timeline: 18+ events with colour-coded dots (crash/war/product/atm/leasing/cyber)
- Underwriting: H2 hull ROL formula (0.25%–1.50% fleet value); L2 liability seat-departure methodology; AO products exposure rating; AP passenger throughput rating; 12 rating factor cards (hull/liability/products/airport); quality scoring matrix (6 control areas × Green/Amber/Red); two worked examples (IOSA European airline $10.7m and corporate Falcon 8X/helicopter $1.82m); key exclusions table (8 exclusions including war risk AVN48B, wear & tear, cyber/GPS spoofing)
- Rates analysis: Chart.js H2 hull and L2 liability rate index 2000–2026 (2000=100); 8-phase market cycle table (1997 soft through 2022 Russia dispute); combined ratio Chart.js bar chart 2010–2026 (red=above 100%); sector ROL grid (8 operator types from 0.20% network airline to 3.50% EMS helicopter); ROE scenarios: Bull +18.4%, Base +9.8%, Bear −19.2% (on $500m GWP portfolio)
- Risk mitigation: 9 control tier cards (SMS/CRM/MRO/FDM/FRMS/security/products QMS/airports/training) with underwriting rate credit indicators; IOSA 7-section breakdown with underwriting relevance; aviation risk quality scoring matrix; standards reference table (9 standards: ICAO, IOSA, IS-BAO, BARS, EASA 145, AS9100, MSG-3, ACI APEX, IATA DGR); GPS spoofing dark box (2024 state-sponsored attacks); mental health/Germanwings warning; top 7 actions for insureds
- Global programmes: 7-layer tower (SIR → primary H2+L2 → 3 excess liability layers → war risk AVN52H → AO products); 6 jurisdiction profiles (USA, UK, EU, China, UAE/Gulf, Brazil/LatAm); limit scenarios table (7 scenarios from turbulence injuries $50m to 9/11-equivalent government backstop); war risk structuring section (AVN52E 7-day cancellation, government backstop history); special structuring table (6 transaction types: M&A, operating lease, S&LB, codeshare, ACMI wet lease, Chapter 11); Emirates illustrative case study ($85m–$120m estimated annual programme cost)
- Updated hub-index.json: consolidated aviation-hull + aviation-liability into single "aviation" entry, status "complete", url "aviation/index.html", expanded keywords
- Updated index.html HUB_DATA: aviation entry "complete" with correct url; footer updated to v1.9 — 9 hubs complete

## v1.8 — April 2026
**Session: 14 April 2026**
- Employment Practices Liability (EPLI) hub complete (Lloyd's codes D6, D7)
- 8 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- Coverage structure: wrongful termination, discrimination (Title VII/ADEA/ADA/FEHA), sexual harassment, retaliation (fastest-growing category), failure to promote, pay equity; third party EPL extension; wage & hour defence sublimit (typically sub-limited or excluded); claims-made basis
- Loss database: 35 claims 1994–2024 — Coca-Cola racial discrimination ($192.5m), Texaco ($176m), Novartis Pharma ($175m), Goldman Sachs pay equity ($215m), Bank of America/Merrill Lynch ($160m), Google gender pay ($118m), Sterling Jewelers/Signet ($175m), McDonald's Easterbrook clawback ($105m), Tesla racial harassment ($137m before reduction), Activision Blizzard ($54m), Morgan Stanley ($54m)
- History: 7 era blocks from Civil Rights Act 1964 and EPLI market creation post-Civil Rights Act 1991, through Anita Hill/Clarence Thomas hearings, Faragher/Ellerth (1998), GFC wrongful termination wave (2008–2010), wage & hour California era (2009–2016), #MeToo (2017–2019), COVID FMLA/retaliation surge (2020), to AI hiring tools and pay transparency laws (2024)
- Timeline: 18 events 1986–2024 with colour-coded dots (statutory/SCOTUS/settlement/regulatory/cultural/international)
- Underwriting: 12 rating factor cards; D6 vs D7 coverage structure comparison table; sector rate index (financial services/media Very High → professional services Lower); California FEHA/PAGA/SB 1343 warning box; two worked examples: US tech company D6 ($838k, 850 employees, San Francisco + NYC) and UK financial services D7 (£229k, 320 employees, FCA-regulated, 1 prior ET claim); Faragher/Ellerth affirmative defence checklist
- Rates analysis: Chart.js rate index 2000–2026 (large employer D6 / SME D6 / D7 UK, 2000=100); 8-phase market cycle table; settlement severity distribution chart; ROE scenarios: Bull 19.2%, Base 9.4%, Bear −13.6%; IBNR and reserve development context (shorter tail than D&O; class action exception)
- Risk mitigation: 9 HR control cards with rate credit indicators; Faragher/Ellerth 5-step affirmative defence process; EPLI risk quality scoring matrix (6 control areas × Green/Amber/Red); termination best practices 7-step checklist; retaliation warning box (fastest-growing EPLI claim type); #MeToo underwriting transformation context (executive conduct warranty, clawback coverage, culture attestation)
- Global programmes: 4-layer programme tower (SIR → D6 primary $5m → D7 local admitted → DIC top-up); 6 jurisdiction profiles (USA/UK/EU/Australia/Canada/Asia-Pacific); employment event structuring table (acquisition/RIF/spin-off/Chapter 11/IPO/C-suite change); UK Employment Rights Bill 2024 warning (day-one unfair dismissal rights, +25–40% D7 exposure); TechScale Global cross-border case study (US ADEA class action + UK ET cluster + Germany works council)
- Updated hub-index.json: EPLI status "complete"; expanded keywords
- Updated index.html HUB_DATA and footer (v1.8)

## v1.7 — April 2026
**Session: 14 April 2026**
- Directors & Officers (D&O) hub complete (Lloyd's codes D1, D2, D3, D4, D5, DA, DB, DD)
- 8 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program
- Coverage structure: Side A (personal, non-indemnified, nil SIR always), Side B (company reimbursement), Side C (entity securities, listed only), EPL (DA/DB), Fiduciary (DD), Side A DIC/XS
- Loss database: 35 claims 2001–2024 — Enron ($2.85bn), WorldCom ($6.13bn), Tyco ($2.92bn), AIG GFC ($450m), Lehman, WaMu FDIC, BP Deepwater Horizon ($175m), VW Dieselgate (€9bn shareholder), Theranos ($926m), Boeing ($237m derivative), FTX ($8bn+), SVB 2023, Cornell ERISA excessive fee class action
- History: 7 era blocks from Securities Acts 1933/1934 and Cuthbert Heath first Lloyd's D&O policy (1934), through S&L crisis, PSLRA 1995, Enron/WorldCom/SOX 2002, GFC/Dodd-Frank 2010, to cyber D&O, SPAC boom 2020–2021, ESG/greenwashing claims, FTX and AI governance 2022–present
- Timeline: 16 events 2001–2024 with colour-coded dots (major/fraud/regulatory/FI/ESG/SPAC)
- Underwriting: 12 rating factor cards; D1–DD coverage structure table; 8 key exclusions (insured vs insured, personal profit, fraud, BI/PD, prior litigation, ERISA, professional services, pollution); ROL formula; two worked examples: UK FTSE 250 Industrial D3 (£5,180 total) and US NASDAQ Tech D1 ($411,025 total with Side A DIC); SPAC warning box; FI D&O (D5) context box
- Rates analysis: Chart.js dual-line rate index 2012–2026 (D1 crimson / D3 purple / D2 blue, 2012=100); 8-phase market cycle table; settlement size distribution chart (7 buckets <$10m to $500m+); ROE scenarios: Bull 20.1%, Base 10.6%, Bear −14.8%; long-tail reserving context (3–4 year average time to settlement)
- Risk mitigation: 8 governance best practice cards with rate credit indicators; 6-control governance scoring table (Green/Amber/Red); securities disclosure obligations grid; EPL 5-control mitigation table; ERISA/Fiduciary excessive fee best practices; "storm warnings" doctrine box
- Global programmes: 6-layer programme tower (SIR → primary $25m → 3 excess layers → Side A DIC $50m); 6 jurisdiction profiles (USA, UK, EU, Australia, Canada, Asia-Pacific); M&A transaction table (6 event types: acquisition, IPO, SPAC, Chapter 11, spin-off); run-off gap warning; Rio Tinto cross-jurisdiction case study (LSE+ASX dual-listed, simultaneous SEC/DOJ/FCA/ASIC action)
- Updated hub-index.json: d-and-o status "complete"; url "d-and-o/index.html"; expanded keywords

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
