# Risk Code Hub — Changelog

## v2.4 — April 2026
**Session: 16 April 2026**
- PI E&O hub complete (Lloyd's codes E2/E3/E4/E5) — combined hub covering legal professions and accountants/auditors at `pi-eo/`
- Both `pi-legal` (E2/E3) and `pi-accountants` (E4/E5) index entries updated to point to single combined hub at `pi-eo/overview.html`
- 9 modules built: overview, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program, references
- Lightweight citations standard applied throughout (VER/EST/ILLUS/GAP)
- Professional/legal colour theme: `--pi:#2c4a7a`, `--pi-dark:#1a2d4a`, `--legal:#8b5e3c`, `--accounts:#2d6b4a`, `--risk:#c0572a`, `--gold:#c9a84c`; header `#1a2d4a → #2c4a7a → #1a3560`
- Code coverage: E2 (solicitors/law firms), E3 (barristers/alternative legal), E4 (accountants/auditors), E5 (tax/financial advisers)
- Overview stats row: ~£2bn UK PI GWP (EST); SRA minimum £2–3m (VER); 6-year run-off minimum (VER); ~40% conveyancing claims (EST); £3.4bn combined KPMG/EY audit exposure (EST); ~90% claims-made (EST)
- Code table: E2/E3/E4/E5 with regulator (SRA/BSB/FRC+ICAEW/FCA), minimum cover, policy basis; 6 coverage type cards (Solicitors PI, Barristers PI, Accountants PI, Tax/Financial Adviser PI, Run-off, Excess Layer); 4 regulatory framework cards (SRA, BSB, FRC/ICAEW, FCA); market overview table (5 segments with GWP estimates and key carriers)
- History: 7 era blocks — pre-1960 common law only; 1960-79 regulatory foundations (Law Society mandatory PI 1976, Hedley Byrne 1964); 1980-89 Lloyd's PI market grows (Big Bang, FSA 1986); 1990-99 Caparo/Hall v Simons, Lloyd's R&R hard market, ARP established; 2000-09 Enron effect, SOX, IFA/FOS wave; 2010-19 Jackson Reforms, BSPS, Carillion; 2020-present COVID claims, EY/Wirecard, ARGA audit reform
- Timeline: 20 events 1932–2024 — Donoghue v Stevenson (1932), Hedley Byrne (1964), Law Society mandatory PI (1976), Big Bang (1986), Caparo (1990), Lloyd's R&R (1992), ARP (1999), Hall v Simons (2000), Enron/Andersen (2001), FOS (2001), Legal Services Act ABS (2007), Jackson Reforms (2013), BHS/PwC (2016), BSPS (2017), Carillion/KPMG (2018), SRA limit increase (2019), EY/Wirecard (2020), Manchester Building Society v GT (2021), FCA BSPS enforcement (2022), ARGA (2024); all VER or EST
- Database: 35-event JS array 1964–2024 — filterable by type (legal/accounts/financial/regulatory/market), jurisdiction (UK/USA/Europe/Global), year band, min loss; sortable; VER/EST confidence chips; note on claims data opacity
- Underwriting: E2/E3 rating formula (fee income × base rate × work type × claims history); 6 factor cards (work type mix, firm size, claims history, SRA compliance, AML controls, excess layer loading); E4/E5 distinct formulae; 4-class practice area risk table; 8-step underwriting process; quality scoring matrix (6 areas × G/A/R); run-off calculation (200–350% of last premium); 2 worked examples: 8-partner firm E2 (~£76,500 ILLUS); Top-20 accountancy firm E4 (~£335,500 ILLUS)
- Rates: Chart.js UK PI rate index 1990–2026 (1990=100); 6 market cycles (Lloyd's formation, R&R hard, competition soft, Enron hard, Jackson soft, BSPS/COVID hard); sector rate grid 8 segments; Chart.js combined ratio bar chart 2014–2024 (spike 2020–21 = BSPS + COVID); ROE scenarios on £150m GWP: Bull +24.0% (80% CR), Base +9.0% (95% CR), Bear -14.0% (118% CR)
- Risk mitigation: 4 quality management cards (file management, supervision, financial controls, technical standards); 4 E4/E5 specific cards (audit quality, tax advice documentation, financial adviser suitability/QPTS, complaints handling); AML controls table (8 controls); top 10 risk actions; 10-standard reference table (SRA, BSB, FCA COBS, FRC ISAs, ISA 570, FCA PS21/3, ICAEW Ethics, BSB Handbook, GDPR, MLR 2017)
- Global programme: 6-layer programme tower; SRA QI scheme (4 cards: QI status, AMTC, ARP, run-off); international comparison table (UK QI vs US admitted vs Lloyd's excess); 4 firm-type cards (Magic Circle, mid-tier national, Big 4/Top 6, IFA networks); illustrative Top-50 law firm case study (30 partners, £18m fees, £40m total limit, ~£379,300 ILLUS); Lloyd's advantages (5 items)
- References: 4-tier badge legend; May 2025 cutoff; 18 primary sources (SRA AMTC, BSB, FRC, FCA, ICAEW, Caparo [1990], Hall v Simons [2000], Manchester BS v GT [2021], Jackson Review, SRA AML, MLR 2017, Marsh, WTW, FCA PS21/3, FCA BSPS Thematic Review, FRC KPMG notice, Companies Act 2006); per-module audit (8 modules); 6 data gap disclosures (E2–E5 GWP split, BSPS aggregate, Big 4 programme costs, EY/Wirecard final settlement, AI legal liability, SRA ARP premium data)
- Updated hub-index.json: both pi-legal and pi-accountants entries status "planned" → "complete"; URL updated to `pi-eo/overview.html`; keywords expanded
- Updated index.html HUB_DATA: both entries status → "complete"; footer v2.3→v2.4, 13→14 hubs complete

## v2.3 — April 2026
**Session: 16 April 2026**
- Transactional Liability hub complete (Lloyd's codes D8/D9/TA/TB/CD/CE) — full 9-module hub at `transactional-liability/`
- 9 modules built: overview, history, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program, references
- Lightweight citations standard applied throughout (VER/EST/ILLUS/GAP confidence badges)
- Deal/finance colour theme: `--tl:#1e3a5f`, `--tl-dark:#0d1f33`, `--deal:#c9a84c`, `--tax:#2563a8`, `--contingent:#6b3fa0`, `--warn:#d97706`; header gradient `#0d1f33 → #1e3a5f → #0a2040`
- Code coverage: D8 (buyer W&I), D9 (seller W&I), TA (tax liability known risk), TB (tax liability contingent), CD (contingent liability), CE (contingent risk — general)
- Overview stats row: ~$15bn annual W&I/R&W limits deployed (EST), 5,500+ W&I transactions 2023 (EST), ~3% avg W&I premium rate (EST), $5tn+ M&A peak 2021 (VER), 30+ years Lloyd's W&I market (EST), ~90% PE buyouts using W&I in Europe (EST)
- History: 7 era blocks — Pre-1990 escrow era; 1990-99 first Lloyd's policies (8–12% of limit, niche); 2000-07 European PE adoption, GWP grows to ~£300m; 2008-12 GFC first claims wave, financial statement rep exclusions; 2013-18 NBI revolution, US R&W explosion, premium falls to 2–2.5%; 2019-22 COVID ($300bn deal collapse), SPAC boom, hardening (15–25% rate rise), cyber rep exclusions; 2023-present all-time high claims frequency (~20–25% notification rate), AI reps, Pillar Two UTPR, PFAS CE
- Timeline: 20 events 1990–2024 — first Lloyd's W&I policy (1990), TRIPS/SOX/GDPR regulatory events, pre-GFC M&A peak (2007), GFC claims wave (2008), NBI structure emerges (2012), US R&W inflection (2014), TCJA GILTI/BEAT (2017), GDPR enforcement (2018), COVID MAC rep claims (2020), SPAC boom (2020), record M&A $5.8tn (2021), rate hardening/cyber exclusions (2022), all-time claims frequency (2023), Pillar Two (2023), PFAS CE surge (2024), AI reps (2024)
- Loss database: 35-event JS array 1990–2024 — filterable by type (wi/tax/contingent/regulatory/market), jurisdiction (USA/UK/Europe/Global/Asia-Pacific), year band, minimum loss and keyword; sortable columns; VER/EST confidence chips; info-box on data opacity of TL claims
- Underwriting: Claims-made basis; W&I rating formula (Base Rate × Deal Factor × Jurisdiction Factor × Sector Factor); 6 factor cards (deal type, jurisdiction, sector, deal size, retention, policy limit); NBI structure explainer; 8-step underwriting process table; TA/TB tax liability underwriting framework (7 tax risk categories with premiums); quality scoring matrix (6 areas × Green/Amber/Red); 2 worked examples: UK tech PE buyout £120m EV W&I (£828,000 ILLUS), UK TA group relief £8m (£320,000 ILLUS)
- Rates analysis: Chart.js W&I rate index 1995–2026 (1995=100); 6 market cycle cards (niche/formation, PE adoption, GFC claims, NBI race-to-bottom, COVID hardening, stabilisation); sector rate grid 8 segments; Chart.js combined ratio bar chart 2015–2024; ROE scenarios on £200m GWP: Bull +22.0% (82% CR), Base +6.0% (98% CR), Bear -21.0% (125% CR)
- Risk mitigation: 4 DD quality framework cards (financial QoE, legal, tax, IT/cyber); VDR completeness checklist table (15 document categories); 4 rep negotiation cards (broad vs narrow, knowledge qualifiers, materiality thresholds, disclosure letter); 4 tax risk control cards (pre-transaction clearances, BEPS Action 13 TP docs, limitation periods, tax counsel opinion); top 10 risk actions; 10-standard reference table
- Global programme: 6-layer programme tower (CD/CE, TB XL, TB primary, D8 XL, D8 primary, SIR); 4 deal structure cards (wrap, US R&W + non-US W&I, tax spine, D9 seller-side); US R&W vs European W&I comparison (11-feature table); transaction types by size table (5 deal types ILLUS); captive/alternative structures (annual facility, captive fronting, synthetic R&W, parametric tax); illustrative pan-European 5-country PE buyout (€420m EV, ~€3.6m total programme ILLUS); Lloyd's advantages (5 items)
- References: 4-tier badge legend; May 2025 cutoff; 18 primary sources; per-module confidence audit (8 modules); 6 data gap disclosures (GWP by code, claims frequency, average paid claim, tax claims opacity, NBI adoption date, Pillar Two UTPR)
- Updated hub-index.json: TL entry status "planned" → "complete"; expanded 35+ keywords
- Updated index.html HUB_DATA: TL entry status "planned" → "complete"; footer v2.2→v2.3, 12→13 hubs complete, Transactional Liability added to complete list

## v2.2 — April 2026
**Session: 16 April 2026**
- Environmental Liability hub complete (Lloyd's code EP) — full 9-module hub at `environmental-liability/`
- 9 modules built: overview, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program, references
- Lightweight citations standard applied throughout (VER/EST/ILLUS/GAP confidence badges)
- Green/earth colour theme: `--env:#2d6a4a`, `--env-dark:#1a3d1a`, `--earth:#7a4f2a`, `--water:#1a6a8a`, `--hazard:#c0572a`, `--gold:#c9a84c`; header gradient `#0d2d10 → #1a4a2a → #0d3020`
- Code coverage: EP (environmental impairment liability — PLL, CPL, NRD, RCC, EPL, Transportation)
- Overview stats row: ~$8bn global GWP (EST), ~3,200 Superfund sites (VER), EPA MCL 4ppt PFAS (VER), $400bn+ industry PFAS liability (EST), 39+ years standalone EIL market
- History: 7 era blocks 1969–present — pre-1970 common law/nuisance only; 1970s Clean Air/Water Acts + EPA (1970); 1980-85 CERCLA Superfund + Love Canal catalyst; 1986-95 absolute pollution exclusion ISO CGL, Exxon Valdez $900m+; 1996-2009 brownfields renaissance + EU ELD 2004; 2010-20 Deepwater Horizon $65bn+; 2020-present PFAS crisis (3M $10.3bn, DuPont $1.185bn, EPA MCL April 2024, East Palestine Feb 2023)
- Timeline: 20 events 1969–2024 with 6 dot colours (pollution, regulatory, nrd, chemical, pfas, industrial). Key events: Cuyahoga River fire (1969), Love Canal (1978), CERCLA (1980), Times Beach dioxin (1983), Bhopal (1984), ISO absolute pollution exclusion (1986), Sandoz Rhine spill (1986), Exxon Valdez (1989), OPA 90 (1990), PG&E Hinkley $333m (1996), EU ELD (2004), Deepwater Horizon (2010), Enbridge Kalamazoo $1.2bn (2010), Flint water crisis $600m (2014), VW Dieselgate $33bn (2015), Aliso Canyon methane (2015), GenX PFAS discovery (2018), Camp Lejeune Claims Act (2022), 3M PFAS $10.3bn (2023), DuPont $1.185bn (2023), EPA MCL 4ppt (2024)
- Loss database: 35-event JS array — filterable by type (pollution/regulatory/nrd/chemical/pfas/industrial), jurisdiction (USA/Europe/Global/Other), year band, minimum loss and keyword; sortable columns; VER/EST confidence chips per event
- Underwriting: Claims-made basis rationale; Phase I/II/III ESA framework (ASTM E1527-21); PLL rating formula (Base Rate × Site Factor × Industry Factor × Coverage Period Factor × Limits Factor); 6 underwriting factor cards; PLL vs CPL comparison table; 5-class industry risk banding (Class I pharma/R&D to Class V active hazardous waste sites); Phase I/II ESA review checklist; 2 worked examples: brownfield dry cleaner PLL (~$28,500 ILLUS), CPL contractor coverage (~$180,000 ILLUS); quality scoring matrix; exclusions table (gradual bio-degradation, known conditions, wilful pollution, asbestos/lead/LGO, nuclear, war)
- Rates analysis: Chart.js EIL rate index 1986–2026 (1986=100); 6 market cycles (creation 1986-91, maturation 1992-99, post-9/11 hardening 2000-06, brownfields softening 2007-11, PFAS/COVID repricing 2012-18, current selective hardening 2019-26); sector rate grid 8 segments (UST remediation lowest at 0.15–0.40% to hazardous waste sites highest at 0.55–1.20%); combined ratio table 2010–2026 (best ~85% in 2013, worst ~118% in 2021 PFAS year); Chart.js bar chart; ROE scenarios on $500m GWP: Bull +17.5% (78% CR), Base −4.2% (102% CR), Bear −29.0% (132% CR)
- Risk mitigation: Phase I/II/III site assessment controls; ISO 14001:2015 EMS framework (4 cards: context, planning, support, evaluation); SPCC Plan requirements (40 CFR Part 112); UST compliance (40 CFR Part 280); PFAS controls (AFFF replacement, source control, MCL compliance monitoring, liability assessment); contaminated site controls (ASR, MNA, institutional controls, deed restrictions); quality scoring matrix (6 areas); top 10 risk management actions; 10-standard reference table (ISO 14001, ASTM E1527-21, 40 CFR 112, 40 CFR 280, RCRA, OSHA 29 CFR 1910.120, ISO 14044 LCA, EPA PFAS Blueprint, EU ELD 2004/35/CE, UK EDR 2009)
- Global programme: 5-layer programme tower (CAT XL → XL Layer 2 → XL Layer 1 → EIL primary → SIR); portfolio/multi-site structure (Master EIL, per-site sublimits, scheduled vs blanket); US vs European regulatory table; transaction EIL (M&A PLL, RCC for pre-agreed cleanups, seller representations); captive/alternative structures; government and municipality coverage; illustrative petroleum retailer case study (85 gas stations, 42 states, PLL $1.8m + CPL $0.65m + RCC $0.75m + XL1 $0.92m + XL2 $0.85m = ~$4.97m total programme ILLUS); Lloyd's competitive advantages table (7 items)
- References: 4-tier badge legend; May 2025 knowledge cutoff; 18 primary sources with URLs; per-module confidence audit (8 modules); 6 data gap disclosures (global GWP by code, PFAS $400bn+ estimate, rate benchmark precision, EU ELD national claims data, Camp Lejeune final settlement, PFAS exclusion wording evolution)
- Updated hub-index.json: EP entry status "planned" → "complete"; expanded keywords (CERCLA, Superfund, Phase I/II ESA, PLL, CPL, NRD, RCC, PFAS, Deepwater Horizon, Love Canal, claims-made, EU ELD, OPA, RCRA, contractors pollution, remediation cost cap)
- Updated index.html HUB_DATA: EP entry status "planned" → "complete"; footer v2.1→v2.2, 11→12 hubs complete, Environmental Liability added to complete list

## v2.1 — April 2026
**Session: 16 April 2026**
- **Hub naming convention change:** All hub entry pages renamed from `index.html` → `overview.html` across all 11 completed hubs (12 files renamed). Rationale: eliminates confusion between root `index.html` (main search page) and per-hub overview pages. Root `index.html` unchanged — required for GitHub Pages. Internal nav/breadcrumb links updated across ~95 HTML files; `hub-index.json` and root `index.html` HUB_DATA URLs updated. Going forward all new hub overview pages must be named `overview.html`.
- Space hub complete (Lloyd's codes SC/SL/SO) — full 9-module hub at `space/`
- 9 modules built: index, history, timeline, database, underwriting, rates-analysis, risk-mitigation, global-program, references
- Dark space theme: `background:linear-gradient(135deg,#0a0a2a,#1a1a4a,#0d2240)` with radial glow; colours: `--space:#1a1a4a`, `--orbit:#4a90d9`, `--launch:#e05c2a`, `--sat:#2d8a6a`
- Code coverage: SC (pre-launch construction, $50–600m limits), SL (launch + LEOP 180 days, $100–600m), SO (in-orbit annual, $50–500m per satellite)
- Overview stats row: ~$700m GWP (EST), 2000+ active satellites (VER), 6500+ Starlink (VER), ~2% in-orbit annual rate (EST), ~$3.5bn 1998-99 losses (EST), $60bn+ industry (EST)
- History: 7 era blocks 1957–present — Sputnik/Early Bird first policy 1965, Intelsat/Outer Space Treaty/Liability Convention, Challenger/Arianespace expansion, 1998-99 catastrophe year (combined ratio ~500%), hard market recovery, Falcon 9 revolution (first flight 2010, first stage recovery December 2015), debris/ASAT/FCC reform era
- Timeline: 17 events 1986–2024 — Challenger (1986), Ariane 5 Cluster II loss ($370m, 1996), Long March 3B (1996), Galaxy 4 (1998), 1998-99 catastrophe cluster (~$3.5bn aggregate), Iridium bankruptcy (1999), Chinese ASAT (2007), Iridium-Cosmos collision (2009), Falcon 9 recovery (2015), Amos-6 explosion ($196m, 2016), Russia ASAT/Cosmos 1408 (2021), FCC 5-year deorbit rule (2023); all key events VER
- Loss database: 35 events JS array 1958–2024 — filterable by type (launch/orbit/debris/weather/regulatory/newspace), orbit (GEO/LEO/MEO/HEO/lunar/ground), year band and minimum loss; sortable columns; VER/EST confidence chips per event; notable entries: Palapa B2/Westar 6 ($180m), Challenger ($500m), 1999 catastrophe cluster, Telstar 401 solar storm ($230m), Amos-6 ($196m), Viasat-3 Americas ($420m)
- Underwriting: Launch formula (Insured Value × Base Rate × Vehicle Reliability Factor × Mission Complexity × Satellite Heritage); 6 SL factor cards (vehicle reliability 1.5–12%, reuse loading, LEOP complexity, bus heritage, launch site, orbit type); launch vehicle benchmark table (Falcon 9 1.5–3%, Ariane 6 3–6%, Atlas V 2–3.5%, Proton-M 4–8%, Long March 3B 3.5–6%, Electron 4–7%, Starship 8–15%+, New Glenn 5–10%); SO formula (Current Insured Value × Base In-Orbit Rate × Age Factor × Redundancy Factor × Orbit Environment); 4 SO factor cards; partial loss valuation table (transponder/capacity, life reduction, power degradation, CTL threshold); quality scoring matrix (6 areas × Green/Amber/Red); two worked examples: GEO SL Ariane 6 (~$13.5m ILLUS), GEO SO Boeing 601HP year 8 (~$4.1m ILLUS); exclusions (cyber/command, ASAT/war, deliberate sacrifice, wear & tear, commercial failure, experimental missions)
- Rates analysis: Chart.js GEO launch rate index 1995–2026 (1995=100); 6 market cycles (moderate 1990-97, catastrophe hard 1998–2001 with ~3–5× rate increase, recovery 2002–08, soft/ITAR 2009–14, Falcon 9 disruption 2015–20, selective hardening 2020–26); sector rate grid (8 segments: GEO mid-life SO 1.5–2.5% to deep space/lunar 4–12%+); combined ratio table 2000–2026 (best 65% in 2002, worst 140% in 2023 Viasat-3 year); Chart.js bar chart; ROE scenarios on $200m GWP: Bull +22.3% (72% CR), Base +6.0% (95% CR), Bear −29.4% (145% CR); capital allocation 120% GWP (binary/high-severity profile)
- Risk mitigation: Space debris mitigation (IADC guidelines, FCC 5-year deorbit, passivation, conjunction avoidance); debris compliance framework (4 cards: pre-launch, launch phase, in-orbit, non-compliance indicators); mega-constellation controls table (Starlink/OneWeb/Kuiper); Kessler syndrome warning box; ASAT & electronic warfare (kinetic ASAT, jamming/spoofing, co-orbital/proximity ops, 4 cards); satellite system redundancy by subsystem (power, ADCS, transponder, propulsion, OBC, single-point failure); partial loss threshold by redundancy table; ground segment cybersecurity (command link, MCC, telemetry, user terminal); Viasat KA-SAT cyberattack reference; cyber/space insurance interface warning box; ground security standards table (NIST, CCSDS, ECSS, ISO 27001, NSA/CISA); space weather monitoring (SEP, geomagnetic storms Dst, ESD/surface charging, SEE/SAA); space weather monitoring protocol table (5 threat types); Solar Cycle 25 market implication box; quality scoring matrix (6 areas); 10 standards reference table; top 10 operator risk actions
- Global programme: 7-layer programme tower (CAT XL/umbrella, XL Layer 2, XL Layer 1, SO in-orbit, SL launch+LEOP, SC construction, SIR); integrated lifecycle advantages info-box; major operator fleet table (Intelsat, SES, Viasat, Eutelsat); government/agency cards (NASA, ESA, UK Space Agency, DoD); mega-constellation portfolio cover (4 cards + constellation tier table); third-party liability section (surface/absolute, launch TPL, in-orbit collision, government backstop); FAA MPL framework box; captive/alternative structures (captive, parametric, LTA profit sharing, in-orbit life extension); illustrative GEO fleet case study (8-satellite mid-tier operator — construction $1.1m + launch $13.3m + SO fleet $15.3m + XL1 $1.75m + XL2 $1.8m + TPL $0.5m = ~$33.8m total programme ILLUS); Lloyd's competitive advantages table (7 items)
- References: 4-tier badge legend; knowledge cutoff box (May 2025); 18 primary sources with URLs (UN Treaties, IADC, FCC, ITU, ISO, UK Space Industry Act, US CSL Act, NSA/CISA, NOAA SWPC, Swiss Re, Marsh, Space-Track.org, ESA, Lloyd's, ECSS, Kessler original 1978 paper, NASA ODQN); per-module confidence audit table (8 modules); 6 data gap disclosures (GWP by code, 1998-99 aggregate losses, actual launch rate benchmarks, Viasat-3 settlement, mega-constellation pricing, combined ratio data)
- Updated hub-index.json: Space entry status "planned" → "complete"; expanded description and keywords
- Updated index.html HUB_DATA: Space entry status "planned" → "complete"; footer v2.0→v2.1, 10→11 hubs complete, Space added to complete list

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
