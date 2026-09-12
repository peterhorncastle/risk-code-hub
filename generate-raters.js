'use strict';
/*
 * generate-raters.js — regenerates each hub's rate-tables/*.json and a self-contained
 * rater.html for every hub in hub-index.json that has risk_codes.
 *
 * Each rater.html embeds its schema(s) INLINE (var schemas = [...]) so the page works
 * when opened via file:// (e.g. the Insurance Portal) with no server. The nav includes
 * the Programme Builder tab and the ← Risk Code Hub footer back-link.
 *
 * Safe to run: `node generate-raters.js`. It is byte-reproducing — regenerating with no
 * upstream data change leaves `git diff` empty. Always review `git diff` after running.
 */
var fs = require('fs');
var path = require('path');

var hubs = JSON.parse(fs.readFileSync(path.join(__dirname, 'hub-index.json'), 'utf8'));

var themes = {
  'product-recall':           { primary:'#1a4a8a', dark:'#0d2240', light:'#e8f0fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#1a4a8a 100%)', sub:'#b8cde4' },
  'energy-offshore':          { primary:'#1a4a8a', dark:'#0d2240', light:'#e8f0fa', accent:'#c8a84b', secondary:'#0a5c52', gradient:'linear-gradient(135deg,#0a1f3a 0%,#0d3d6b 60%,#0a5c52 100%)', sub:'#b8cde4' },
  'renewable-energy-offshore':{ primary:'#2a8c4a', dark:'#1a6035', light:'#e8f5ee', accent:'#c8a84b', secondary:'#1a4a8a', gradient:'linear-gradient(135deg,#0a1f3a 0%,#0d3d6b 55%,#1a6035 100%)', sub:'#b8cde4' },
  'renewable-energy-onshore': { primary:'#2a8c4a', dark:'#1a6035', light:'#e8f5ee', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a3d1a 0%,#2a8c4a 55%,#1a6035 100%)', sub:'#b8d8c8' },
  'energy-onshore':           { primary:'#1a4a8a', dark:'#0d2240', light:'#e8f0fa', accent:'#c8a84b', secondary:'#8b4513', gradient:'linear-gradient(135deg,#0d2240 0%,#1a4a8a 55%,#2d1a0a 100%)', sub:'#b8cde4' },
  'environmental-liability':  { primary:'#2d6a4a', dark:'#1a3d1a', light:'#e4f0ea', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2d10 0%,#1a4a2a 50%,#0d3020 100%)', sub:'#b8d8c8' },
  'cyber':                    { primary:'#1565c0', dark:'#0a3d7a', light:'#e8f0fe', accent:'#c8a84b', secondary:'#6a1b9a', gradient:'linear-gradient(135deg,#0d2240 0%,#1565c0 55%,#6a1b9a 100%)', sub:'#b8d0f8' },
  'directors-officers':       { primary:'#7b1a1a', dark:'#4e0d0d', light:'#fdf0f0', accent:'#c8a84b', secondary:'#4a148c', gradient:'linear-gradient(135deg,#0d2240 0%,#7b1a1a 55%,#4a148c 100%)', sub:'#f0c8c8' },
  'epli':                     { primary:'#7b1a1a', dark:'#4e0d0d', light:'#fdf0f0', accent:'#c8a84b', gradient:'linear-gradient(135deg,#4e0d0d 0%,#7b1a1a 55%,#5a1414 100%)', sub:'#f0c8c8' },
  'transactional-liability':  { primary:'#4a148c', dark:'#311b92', light:'#f3e5f5', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a0a3a 0%,#4a148c 55%,#311b92 100%)', sub:'#d1c4e9' },
  'pi-legal':                 { primary:'#37474f', dark:'#102027', light:'#eceff1', accent:'#c8a84b', gradient:'linear-gradient(135deg,#102027 0%,#37474f 50%,#263238 100%)', sub:'#cfd8dc' },
  'pi-accountants':           { primary:'#37474f', dark:'#102027', light:'#eceff1', accent:'#c8a84b', gradient:'linear-gradient(135deg,#102027 0%,#37474f 55%,#1a3a4a 100%)', sub:'#cfd8dc' },
  'pi-construction':          { primary:'#37474f', dark:'#102027', light:'#eceff1', accent:'#c8a84b', secondary:'#795548', gradient:'linear-gradient(135deg,#102027 0%,#37474f 50%,#263238 100%)', sub:'#cfd8dc' },
  'pi-technology':            { primary:'#1565c0', dark:'#0a3d7a', light:'#e8f0fe', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#1565c0 55%,#0a3d7a 100%)', sub:'#b8d0f8' },
  'pi-financial-institutions':{ primary:'#1a237e', dark:'#0d1642', light:'#e8eaf6', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d1642 0%,#1a237e 55%,#283593 100%)', sub:'#c5cae9' },
  'pi-miscellaneous':         { primary:'#455a64', dark:'#263238', light:'#eceff1', accent:'#c8a84b', gradient:'linear-gradient(135deg,#263238 0%,#455a64 55%,#37474f 100%)', sub:'#cfd8dc' },
  'crime-financial-institutions':{ primary:'#7b1e1e', dark:'#3d0000', light:'#faf5f5', accent:'#b8860b', gradient:'linear-gradient(135deg,#3d0000 0%,#7b1e1e 50%,#5a1414 100%)', sub:'#e8c8c8' },
  'crime-commercial':         { primary:'#7b1e1e', dark:'#3d0000', light:'#faf5f5', accent:'#c8a84b', gradient:'linear-gradient(135deg,#3d0000 0%,#7b1e1e 55%,#4a0f0f 100%)', sub:'#e8c8c8' },
  'property-commercial':      { primary:'#bf360c', dark:'#7f1d00', light:'#fbe9e7', accent:'#c8a84b', gradient:'linear-gradient(135deg,#3e1a00 0%,#bf360c 55%,#7f1d00 100%)', sub:'#ffccbc' },
  'engineering':              { primary:'#37474f', dark:'#102027', light:'#eceff1', accent:'#c8a84b', secondary:'#e65100', gradient:'linear-gradient(135deg,#102027 0%,#37474f 55%,#263238 100%)', sub:'#cfd8dc' },
  'general-liability-usa':    { primary:'#1565c0', dark:'#0a3d7a', light:'#e8f0fe', accent:'#c8a84b', secondary:'#b71c1c', gradient:'linear-gradient(135deg,#0d2240 0%,#1565c0 55%,#0a3d7a 100%)', sub:'#b8d0f8' },
  'general-liability-non-us': { primary:'#1565c0', dark:'#0a3d7a', light:'#e8f0fe', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#1565c0 55%,#1a4a8a 100%)', sub:'#b8d0f8' },
  'employers-liability-uk':   { primary:'#2e7d32', dark:'#1b5e20', light:'#e8f5e9', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#2e7d32 55%,#1b5e20 100%)', sub:'#a5d6a7' },
  'workers-comp-international':{ primary:'#2e7d32', dark:'#1b5e20', light:'#e8f5e9', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1b5e20 0%,#2e7d32 55%,#388e3c 100%)', sub:'#a5d6a7' },
  'workers-comp-us':          { primary:'#2e7d32', dark:'#1b5e20', light:'#e8f5e9', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#2e7d32 55%,#1b5e20 100%)', sub:'#a5d6a7' },
  'marine-hull':              { primary:'#0b3d6b', dark:'#061e35', light:'#e8f0fa', accent:'#c8a84b', secondary:'#1a6b8a', gradient:'linear-gradient(135deg,#061e35 0%,#0b3d6b 50%,#041525 100%)', sub:'#b8c8e8' },
  'marine-hull-war':          { primary:'#0b3d6b', dark:'#061e35', light:'#e8f0fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#061e35 0%,#0b3d6b 55%,#1a2a3a 100%)', sub:'#b8c8e8' },
  'marine-cargo':             { primary:'#0b3d6b', dark:'#061e35', light:'#e8f0fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#061e35 0%,#0b3d6b 55%,#0a5c52 100%)', sub:'#b8c8e8' },
  'marine-liability':         { primary:'#0b3d6b', dark:'#061e35', light:'#e8f0fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#061e35 0%,#0b3d6b 55%,#1a4a2a 100%)', sub:'#b8c8e8' },
  'yachts':                   { primary:'#0277bd', dark:'#01579b', light:'#e1f5fe', accent:'#c8a84b', gradient:'linear-gradient(135deg,#01579b 0%,#0277bd 55%,#0288d1 100%)', sub:'#b3e5fc' },
  'uk-household':             { primary:'#2d6a2d', dark:'#1a4a1a', light:'#e8f5e3', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#2d6a2d 55%,#1a4a1a 100%)', sub:'#b8d4b8' },
  'aviation':                 { primary:'#1a4a7a', dark:'#0d2d5a', light:'#eef3fa', accent:'#c8a84b', secondary:'#4a90d9', gradient:'linear-gradient(135deg,#0d2240 0%,#1a4a7a 55%,#003070 100%)', sub:'#b8cce0' },
  'personal-accident-health': { primary:'#00838f', dark:'#006064', light:'#e0f7fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#004d40 0%,#00838f 55%,#006064 100%)', sub:'#80deea' },
  'medical-malpractice':      { primary:'#c62828', dark:'#8e0000', light:'#ffebee', accent:'#c8a84b', gradient:'linear-gradient(135deg,#3e0000 0%,#c62828 55%,#8e0000 100%)', sub:'#ef9a9a' },
  'motor-uk':                 { primary:'#1565c0', dark:'#0a3d7a', light:'#e3f2fd', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#1565c0 55%,#0a3d7a 100%)', sub:'#90caf9' },
  'motor-international':      { primary:'#1565c0', dark:'#0a3d7a', light:'#e3f2fd', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#1565c0 55%,#1a4a8a 100%)', sub:'#90caf9' },
  'political-risk':           { primary:'#283593', dark:'#1a237e', light:'#e8eaf6', accent:'#c8a84b', secondary:'#c62828', gradient:'linear-gradient(135deg,#1a237e 0%,#283593 50%,#1565c0 100%)', sub:'#c5cae9' },
  'credit':                   { primary:'#283593', dark:'#1a237e', light:'#e8eaf6', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a237e 0%,#283593 55%,#303f9f 100%)', sub:'#c5cae9' },
  'terrorism-political-violence':{ primary:'#b71c1c', dark:'#7f0000', light:'#ffebee', accent:'#c8a84b', gradient:'linear-gradient(135deg,#3d0000 0%,#b71c1c 55%,#7f0000 100%)', sub:'#ef9a9a' },
  'event-cancellation':       { primary:'#6a1b9a', dark:'#4a148c', light:'#f3e5f5', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a0a3a 0%,#6a1b9a 55%,#4a148c 100%)', sub:'#ce93d8' },
  'agriculture':              { primary:'#33691e', dark:'#1b5e20', light:'#f1f8e9', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1b3a0a 0%,#33691e 55%,#1b5e20 100%)', sub:'#aed581' },
  'livestock-bloodstock':     { primary:'#33691e', dark:'#1b5e20', light:'#f1f8e9', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1b3a0a 0%,#33691e 55%,#2e7d32 100%)', sub:'#aed581' },
  'fine-art-specie':          { primary:'#4e342e', dark:'#3e2723', light:'#efebe9', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a0f0a 0%,#4e342e 55%,#3e2723 100%)', sub:'#bcaaa4' },
  'space':                    { primary:'#1a1a4a', dark:'#0a0a2a', light:'#e8e8ff', accent:'#c8a84b', secondary:'#4a90d9', gradient:'linear-gradient(135deg,#0a0a2a 0%,#1a1a4a 50%,#0d2240 100%)', sub:'#b8c8e8' },
  'nuclear':                  { primary:'#f57f17', dark:'#f9a825', light:'#fffde7', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#e65100 55%,#f57f17 100%)', sub:'#fff9c4' },
  'film-entertainment':       { primary:'#6a1b9a', dark:'#4a148c', light:'#f3e5f5', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a0a3a 0%,#6a1b9a 55%,#8e24aa 100%)', sub:'#ce93d8' },
  'extended-warranty':        { primary:'#8c4a15', dark:'#5c2f0c', light:'#fdf0e6', accent:'#c8a84b', secondary:'#b06020', gradient:'linear-gradient(135deg,#3d1c05 0%,#8c4a15 55%,#b06020 100%)', sub:'#e8c9a0' },
  'legal-expenses':           { primary:'#37474f', dark:'#263238', light:'#eceff1', accent:'#c8a84b', gradient:'linear-gradient(135deg,#263238 0%,#37474f 55%,#455a64 100%)', sub:'#cfd8dc' },
  'temp-life-health':         { primary:'#00838f', dark:'#006064', light:'#e0f7fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#006064 0%,#00838f 55%,#0097a7 100%)', sub:'#80deea' },
  'dic':                      { primary:'#bf360c', dark:'#7f1d00', light:'#fbe9e7', accent:'#c8a84b', gradient:'linear-gradient(135deg,#3e1a00 0%,#bf360c 55%,#e64a19 100%)', sub:'#ffccbc' },
  'aviation-war':             { primary:'#1a4a7a', dark:'#0d2d5a', light:'#eef3fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#1a4a7a 55%,#8b1a1a 100%)', sub:'#b8cce0' },
  'financial-lines-misc':     { primary:'#1a237e', dark:'#0d1642', light:'#e8eaf6', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d1642 0%,#1a237e 55%,#283593 100%)', sub:'#c5cae9' },

  // Folder-keyed palettes. themes[] is otherwise keyed on a hub's id, which
  // for these folders is the STUB's identity, not the real hub's - regenerating
  // against the id palette would repaint each rater in the wrong hub's colours
  // (downstream-energy orange -> generic navy). Values below are taken from the
  // live rater pages and match each hub's own overview.html.
  'agricultural-crop-forestry': { primary:'#2d6a2d', dark:'#1a3d1a', light:'#e8f5e3', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a3d1a 0%,#2d6a2d 50%,#3d7a3d 100%)', sub:'#b8d4b8' },
  'credit-contract-frustration': { primary:'#1a4a7a', dark:'#0d2b4a', light:'#e8f0f8', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2b4a 0%,#1a4a7a 50%,#2a5a8a 100%)', sub:'#9ab8d8' },
  'downstream-energy': { primary:'#c45c00', dark:'#8b3800', light:'#fff4e8', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#c45c00 60%,#8b3800 100%)', sub:'#f0cca0' },
  'general-liability-usa': { primary:'#7b1a1a', dark:'#4a0d0d', light:'#fdf0f0', accent:'#c8a84b', gradient:'linear-gradient(135deg,#4a0d0d 0%,#7b1a1a 50%,#8b2020 100%)', sub:'#e8b0a0' },
  'pi-eo': { primary:'#2c4a7a', dark:'#1a2d4a', light:'#f0f4f8', accent:'#c8a84b', gradient:'linear-gradient(135deg,#1a2d4a 0%,#2c4a7a 55%,#1a3d5a 100%)', sub:'#b0c4de' },
  'pi-eo-misc': { primary:'#5d4a7a', dark:'#3a2d50', light:'#f0ecf8', accent:'#c8a84b', gradient:'linear-gradient(135deg,#3a2d50 0%,#5d4a7a 50%,#4a3860 100%)', sub:'#c0b0d8' },
  'pi-tech': { primary:'#0f4c75', dark:'#0a2d45', light:'#f0f6fb', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0a2d45 0%,#0f4c75 55%,#0d3d5a 100%)', sub:'#a0c4d8' },
};

function makeROVSchema(code, label, currency, exposureKey, exposureLabel, exposureHint, baseRateValue, factors, fixedCosts, varCosts, profit) {
  return {
    riskCode: code, label: label, modelType: 'rate-on-value', currency: currency || 'GBP',
    exposureMeasure: { key: exposureKey, label: exposureLabel, defaultValue: fixedCosts._defaultExposure || 1000000, hint: exposureHint || '' },
    baseRate: { key: 'baseRate', label: 'Base Rate', value: baseRateValue },
    ratingFactors: factors,
    fixedCosts: { policyAdminPerYear: fixedCosts.admin || 5000, claimsHandlingPerClaim: fixedCosts.claims || 25000, systemOverheadPerYear: fixedCosts.overhead || 2000, fraudReservePerClaim: fixedCosts.fraud || 0, expectedClaimsPerYear: fixedCosts.expectedClaims || 0.03, obsolescenceRate: 0 },
    variableCosts: { commissionRate: varCosts.commission || 0.20, reinsuranceRate: varCosts.reinsurance || 0.05 },
    targetProfitMargin: profit || 0.05
  };
}

function catFactor(key, label, appliesTo, defaultVal, opts, hint) {
  var options = {};
  opts.forEach(function(o) { options[o[0]] = { label: o[1], factor: o[2] }; });
  return { key: key, label: label, type: 'categorical', appliesTo: appliesTo || 'rate', defaultValue: defaultVal, options: options, hint: hint || '' };
}

function bandFactor(key, label, appliesTo, defaultVal, bands, hint) {
  return { key: key, label: label, type: 'band', appliesTo: appliesTo || 'rate', defaultValue: defaultVal, bands: bands, hint: hint || '' };
}

// ===== SCHEMA DEFINITIONS PER RISK CODE =====

var schemas = {};

// --- Product Recall (PB) ---
schemas.PB = makeROVSchema('PB','Product Recall','GBP','annualRevenue','Annual Revenue (£)','Revenue of insured manufacturer',0.0015,
  [catFactor('industry','Industry Sector','rate','food',[['food','Food & Beverage',1.00],['pharma','Pharmaceutical',1.30],['automotive','Automotive',1.20],['consumer','Consumer Goods',0.90],['industrial','Industrial Products',0.80]]),
   catFactor('haccp','Food Safety System','rate','certified',[['certified','HACCP/BRC Certified',0.80],['partial','Partial Compliance',1.00],['none','No Certification',1.40]]),
   catFactor('distribution','Distribution Reach','rate','national',[['local','Local/Regional',0.75],['national','National',1.00],['international','International',1.20],['global','Global',1.40]]),
   bandFactor('recallHistory','Prior Recalls (5yr)','rate',0,[{min:0,max:1,factor:0.85},{min:1,max:3,factor:1.00},{min:3,max:5,factor:1.30},{min:5,max:99,factor:1.70}]),
   catFactor('coverScope','Coverage Scope','rate','standard',[['basic','Recall Costs Only',0.70],['standard','Recall + BI',1.00],['broad','Recall + BI + 3rd Party',1.25],['comprehensive','All Perils incl. Contamination',1.50]])],
  {admin:3000,claims:20000,overhead:1500,fraud:0,expectedClaims:0.02,_defaultExposure:50000000},{commission:0.25,reinsurance:0.05},0.05);

// --- Upstream/Offshore Energy ---
var energyFactors = [
  catFactor('assetType','Asset Type','rate','platform',[['drilling_rig','Drilling Rig',1.20],['platform','Production Platform',1.00],['fpso','FPSO',1.10],['subsea','Subsea Infrastructure',0.85],['pipeline','Pipeline',0.70]]),
  catFactor('geography','Operating Region','rate','north_sea',[['north_sea','North Sea',1.00],['gom','Gulf of Mexico',1.10],['west_africa','West Africa',1.25],['asia_pacific','Asia Pacific',0.95],['middle_east','Middle East',1.05],['arctic','Arctic',1.50]]),
  bandFactor('assetAge','Asset Age (years)','rate',10,[{min:0,max:10,factor:0.90},{min:10,max:20,factor:1.00},{min:20,max:30,factor:1.20},{min:30,max:50,factor:1.50}]),
  catFactor('safetyRecord','Safety Record','rate','good',[['excellent','Excellent (zero LTI 5yr)',0.80],['good','Good',0.90],['standard','Standard',1.00],['concerns','Concerns',1.25],['poor','Poor (major incident)',1.60]]),
  catFactor('natCat','Nat-Cat Exposure','rate','moderate',[['low','Low (sheltered/onshore)',0.85],['moderate','Moderate',1.00],['high','High (hurricane/typhoon zone)',1.30],['extreme','Extreme (GoM windstorm)',1.50]])];
schemas.EC = makeROVSchema('EC','Offshore Energy — Construction','USD','projectValue','Project Value ($)','Total construction value',0.0025,energyFactors,{admin:15000,claims:100000,overhead:5000,fraud:0,expectedClaims:0.02,_defaultExposure:500000000},{commission:0.18,reinsurance:0.08},0.05);
schemas.EM = makeROVSchema('EM','Offshore Energy — Operating','USD','assetValue','Asset Value ($)','Total insured value of operating assets',0.0018,energyFactors,{admin:15000,claims:100000,overhead:5000,fraud:0,expectedClaims:0.02,_defaultExposure:1000000000},{commission:0.18,reinsurance:0.08},0.05);
schemas.EN = makeROVSchema('EN','Offshore Energy — Excess','USD','layerLimit','Layer Limit ($)','Excess layer limit',0.0012,energyFactors,{admin:10000,claims:50000,overhead:3000,fraud:0,expectedClaims:0.01,_defaultExposure:500000000},{commission:0.15,reinsurance:0.10},0.05);
schemas.EG = makeROVSchema('EG','Energy — Onshore/Offshore BI','USD','biValue','BI Exposure ($)','Maximum indemnity period gross profit',0.0020,energyFactors,{admin:12000,claims:80000,overhead:5000,fraud:0,expectedClaims:0.02,_defaultExposure:200000000},{commission:0.18,reinsurance:0.08},0.05);
schemas.EH = makeROVSchema('EH','Energy — Liabilities','USD','cslLimit','CSL Limit ($)','Combined Single Limit',0.0035,energyFactors,{admin:10000,claims:60000,overhead:4000,fraud:0,expectedClaims:0.015,_defaultExposure:100000000},{commission:0.18,reinsurance:0.08},0.05);
schemas.EY = makeROVSchema('EY','Energy — Control of Well','USD','wellValue','Well Cost ($)','Cost of drilling well + re-drill',0.0040,energyFactors,{admin:8000,claims:50000,overhead:3000,fraud:0,expectedClaims:0.01,_defaultExposure:100000000},{commission:0.18,reinsurance:0.10},0.05);
schemas.EZ = makeROVSchema('EZ','Energy — Excess Liability','USD','layerLimit','Layer Limit ($)','Excess liability layer',0.0015,energyFactors,{admin:8000,claims:40000,overhead:3000,fraud:0,expectedClaims:0.01,_defaultExposure:200000000},{commission:0.15,reinsurance:0.10},0.05);

// --- Renewable Energy Offshore ---
var renewableFactors = [
  catFactor('technology','Technology Type','rate','offshore_wind',[['offshore_wind','Offshore Wind (fixed)',1.00],['floating_wind','Floating Offshore Wind',1.30],['tidal','Tidal/Wave',1.50],['substation','Offshore Substation',0.85]]),
  bandFactor('capacity','Capacity (MW)','rate',500,[{min:0,max:100,factor:0.80},{min:100,max:500,factor:1.00},{min:500,max:1000,factor:1.10},{min:1000,max:5000,factor:1.20}]),
  catFactor('phase','Project Phase','rate','operational',[['construction','Construction',1.40],['commissioning','Commissioning',1.20],['operational','Operational',1.00]]),
  catFactor('oem','OEM / Turbine Brand','rate','tier1',[['tier1','Tier 1 (Vestas/Siemens Gamesa)',0.90],['tier2','Tier 2 (GE/Goldwind)',1.00],['tier3','Tier 3 / Prototype',1.30]]),
  catFactor('geography','Location','rate','north_sea',[['north_sea','North Sea',1.00],['baltic','Baltic',0.90],['asia','Asia Pacific',1.10],['us_atlantic','US Atlantic',1.05]])];
schemas.R1 = makeROVSchema('R1','Renewable — Offshore Operational','GBP','assetValue','Asset Value (£)','Total insured value',0.0020,renewableFactors,{admin:8000,claims:50000,overhead:3000,fraud:0,expectedClaims:0.03,_defaultExposure:500000000},{commission:0.20,reinsurance:0.05},0.05);
schemas.R3 = makeROVSchema('R3','Renewable — Offshore Construction','GBP','projectValue','Project Value (£)','Total construction value',0.0035,renewableFactors,{admin:10000,claims:60000,overhead:4000,fraud:0,expectedClaims:0.03,_defaultExposure:800000000},{commission:0.20,reinsurance:0.08},0.05);

// --- Renewable Energy Onshore ---
var onshoreRenewableFactors = [
  catFactor('technology','Technology','rate','onshore_wind',[['onshore_wind','Onshore Wind',1.00],['solar_pv','Solar PV',0.75],['solar_csp','Solar CSP',1.10],['bess','Battery Storage (BESS)',1.40],['biomass','Biomass',1.20],['hydro','Hydro',0.80]]),
  bandFactor('capacity','Capacity (MW)','rate',100,[{min:0,max:50,factor:0.85},{min:50,max:200,factor:1.00},{min:200,max:500,factor:1.10},{min:500,max:5000,factor:1.20}]),
  catFactor('phase','Project Phase','rate','operational',[['construction','Construction',1.35],['operational','Operational',1.00]]),
  catFactor('natCat','Nat-Cat Exposure','rate','low',[['low','Low',0.85],['moderate','Moderate',1.00],['high','High (wildfire/hail/tornado)',1.30]]),
  catFactor('territory','Territory','rate','europe',[['europe','Europe',1.00],['north_america','North America',1.05],['asia','Asia',1.10],['latam','Latin America',1.15],['africa','Africa',1.20]])];
schemas.R2 = makeROVSchema('R2','Renewable — Onshore Operational','GBP','assetValue','Asset Value (£)','Total insured value',0.0015,onshoreRenewableFactors,{admin:5000,claims:30000,overhead:2000,fraud:0,expectedClaims:0.03,_defaultExposure:200000000},{commission:0.20,reinsurance:0.05},0.05);
schemas.R4 = makeROVSchema('R4','Renewable — Onshore Construction','GBP','projectValue','Project Value (£)','Total construction value',0.0028,onshoreRenewableFactors,{admin:8000,claims:40000,overhead:3000,fraud:0,expectedClaims:0.03,_defaultExposure:300000000},{commission:0.20,reinsurance:0.05},0.05);

// --- Downstream/Onshore Energy ---
var downstreamFactors = [
  catFactor('facilityType','Facility Type','rate','refinery',[['refinery','Refinery',1.00],['petrochemical','Petrochemical Plant',1.10],['pipeline','Pipeline/Terminal',0.80],['lng','LNG Terminal',1.15],['power_plant','Power Station',0.90]]),
  bandFactor('tiv','TIV ($m)','rate',500,[{min:0,max:100,factor:0.85},{min:100,max:500,factor:1.00},{min:500,max:2000,factor:1.10},{min:2000,max:99999,factor:1.20}]),
  catFactor('psmQuality','Process Safety Management','rate','strong',[['excellent','Excellent (OSHA VPP Star)',0.80],['strong','Strong',0.90],['standard','Standard',1.00],['weak','Weak/Findings',1.30]]),
  catFactor('natCat','Nat-Cat Exposure','rate','moderate',[['low','Low',0.85],['moderate','Moderate',1.00],['high','High (GoM/hurricane)',1.25],['extreme','Extreme',1.50]]),
  catFactor('lossHistory','Loss History (10yr)','rate','clean',[['clean','Clean',0.85],['attritional','Attritional only',1.00],['significant','Significant loss',1.30],['catastrophic','Catastrophic (VCE/explosion)',1.80]])];
schemas.EA = makeROVSchema('EA','Onshore Energy — Property','USD','tiv','Total Insured Value ($)','Property damage TIV',0.0012,downstreamFactors,{admin:15000,claims:100000,overhead:5000,fraud:0,expectedClaims:0.02,_defaultExposure:500000000},{commission:0.18,reinsurance:0.08},0.05);
schemas.EB = makeROVSchema('EB','Onshore Energy — BI','USD','biExposure','BI Exposure ($)','Maximum indemnity period GP',0.0018,downstreamFactors,{admin:12000,claims:80000,overhead:5000,fraud:0,expectedClaims:0.02,_defaultExposure:300000000},{commission:0.18,reinsurance:0.08},0.05);
schemas.EF = makeROVSchema('EF','Onshore Energy — Liability','USD','cslLimit','CSL Limit ($)','Combined Single Limit',0.0030,downstreamFactors,{admin:10000,claims:60000,overhead:4000,fraud:0,expectedClaims:0.015,_defaultExposure:100000000},{commission:0.18,reinsurance:0.08},0.05);
schemas.PG = makeROVSchema('PG','Power Generation','USD','assetValue','Asset Value ($)','Total insured value',0.0015,downstreamFactors,{admin:10000,claims:60000,overhead:4000,fraud:0,expectedClaims:0.02,_defaultExposure:300000000},{commission:0.20,reinsurance:0.05},0.05);

// --- Environmental Liability (EP) ---
schemas.EP = makeROVSchema('EP','Environmental Liability','GBP','siteRevenue','Site Revenue (£)','Annual revenue of insured operation',0.0020,
  [catFactor('industry','Industry Sector','rate','manufacturing',[['manufacturing','Manufacturing',1.00],['waste_mgmt','Waste Management',1.40],['mining','Mining/Extraction',1.30],['chemicals','Chemicals',1.50],['transport','Transport/Logistics',0.85],['property','Property Development',0.90]]),
   catFactor('siteCondition','Site Condition','rate','standard',[['greenfield','Greenfield/Clean',0.70],['standard','Standard',1.00],['brownfield','Brownfield',1.25],['contaminated','Known Contamination',1.60]]),
   catFactor('regulatory','Regulatory Compliance','rate','compliant',[['exemplary','Exemplary (ISO 14001)',0.80],['compliant','Fully Compliant',1.00],['minor_issues','Minor Issues',1.20],['enforcement','Enforcement Action',1.60]]),
   catFactor('coverScope','Coverage','rate','standard',[['cleanup_only','Cleanup Only',0.70],['standard','Cleanup + 3rd Party',1.00],['broad','Broad (incl. BI + NRD)',1.30]])],
  {admin:3000,claims:25000,overhead:1500,fraud:0,expectedClaims:0.02,_defaultExposure:20000000},{commission:0.22,reinsurance:0.05},0.05);

// --- Cyber (CY, CZ, CG, CH) ---
var cyberFactors = [
  catFactor('sector','Industry Sector','rate','manufacturing',[['healthcare','Healthcare',1.50],['financial','Financial Services',1.30],['retail','Retail / E-commerce',1.20],['manufacturing','Manufacturing',1.00],['professional','Professional Services',0.90],['education','Education',1.10],['government','Government / Public',1.05]]),
  catFactor('mfa','MFA Deployment','rate','deployed',[['full','Full (all systems)',0.75],['deployed','Email + Remote Access',0.90],['partial','Partial',1.10],['none','None / Unknown',1.60]]),
  catFactor('edr','EDR/XDR Coverage','rate','high',[['full','≥95% endpoints',0.80],['high','80-95% endpoints',0.90],['moderate','60-80% endpoints',1.00],['low','<60% endpoints',1.30]]),
  catFactor('backup','Backup Architecture','rate','good',[['immutable','3-2-1 with immutable/air-gap',0.75],['good','3-2-1 standard',0.90],['basic','Basic backup',1.10],['weak','Local only / untested',1.50]]),
  catFactor('patchMgmt','Patch Management','rate','good',[['excellent','Critical <72hrs',0.80],['good','Critical <30 days',1.00],['moderate','Critical <90 days',1.15],['poor','>90 days / ad-hoc',1.40]]),
  catFactor('priorLoss','Prior Cyber Incidents (3yr)','rate','clean',[['clean','None',0.90],['minor','Minor (no claim)',1.00],['breach','Data breach (resolved)',1.20],['ransomware','Ransomware attack',1.40]])];
schemas.CY = makeROVSchema('CY','Cyber — Primary','GBP','policyLimit','Policy Limit (£)','Primary limit of indemnity',0.012,cyberFactors,{admin:2000,claims:15000,overhead:1000,fraud:0,expectedClaims:0.05,_defaultExposure:5000000},{commission:0.25,reinsurance:0.05},0.05);
schemas.CZ = makeROVSchema('CZ','Cyber — Excess','GBP','layerLimit','Layer Limit (£)','Excess layer limit',0.006,cyberFactors,{admin:1500,claims:10000,overhead:800,fraud:0,expectedClaims:0.02,_defaultExposure:10000000},{commission:0.22,reinsurance:0.05},0.05);
schemas.CG = makeROVSchema('CG','Cyber — SME Package','GBP','policyLimit','Policy Limit (£)','SME coverage limit',0.015,cyberFactors,{admin:500,claims:5000,overhead:300,fraud:0,expectedClaims:0.04,_defaultExposure:1000000},{commission:0.30,reinsurance:0.03},0.05);
schemas.CH = makeROVSchema('CH','Cyber — Tech E&O','GBP','policyLimit','Policy Limit (£)','Tech E&O limit',0.010,cyberFactors,{admin:2000,claims:12000,overhead:1000,fraud:0,expectedClaims:0.03,_defaultExposure:5000000},{commission:0.25,reinsurance:0.05},0.05);

// --- D&O ---
var doFactors = [
  catFactor('companyType','Company Type','rate','private',[['public_us','US Public',1.50],['public_uk','UK/EU Public',1.20],['private','Private',1.00],['nonprofit','Non-Profit',0.80],['ipo','Pre-IPO / SPV',1.60]]),
  bandFactor('revenue','Annual Revenue ($m)','rate',500,[{min:0,max:100,factor:0.80},{min:100,max:500,factor:1.00},{min:500,max:2000,factor:1.15},{min:2000,max:99999,factor:1.30}]),
  catFactor('sector','Industry Sector','rate','general',[['financial','Financial Services',1.30],['tech','Technology',1.15],['pharma','Pharmaceutical/Biotech',1.25],['general','General Commercial',1.00],['energy','Energy/Mining',1.10]]),
  catFactor('litigation','Litigation History','rate','clean',[['clean','Clean (no SCA/derivative)',0.85],['minor','Minor claims only',1.00],['material','Material litigation',1.30],['severe','Severe (SEC/SFO investigation)',1.70]]),
  catFactor('governance','Corporate Governance','rate','strong',[['excellent','Excellent (independent board majority)',0.85],['strong','Strong',0.95],['standard','Standard',1.00],['weak','Weak (governance concerns)',1.25]])];
['D1','D2','D3','D4','D5','DA','DB','DD'].forEach(function(c,i) {
  var labels = ['D&O — Side A','D&O — Side B','D&O — Side C (Entity)','D&O — Excess Side A','D&O — Employment Practices','D&O — ABC Combined','D&O — Excess','D&O — Run-Off'];
  var rates = [0.004,0.006,0.008,0.003,0.005,0.007,0.003,0.005];
  schemas[c] = makeROVSchema(c,labels[i],'USD','towerLimit','Tower Limit ($)','D&O limit of indemnity',rates[i],doFactors,
    {admin:5000,claims:40000,overhead:3000,fraud:0,expectedClaims:0.015,_defaultExposure:25000000},{commission:0.22,reinsurance:0.05},0.05);
});

// --- EPLI ---
schemas.D6 = makeROVSchema('D6','EPLI — Primary','USD','policyLimit','Policy Limit ($)','Primary EPL limit',0.008,
  [catFactor('jurisdiction','Primary Jurisdiction','rate','us',[['us','United States',1.30],['uk','United Kingdom',1.00],['eu','EU',0.95],['apac','Asia Pacific',0.85]]),
   bandFactor('employees','Employee Count','rate',500,[{min:0,max:100,factor:0.75},{min:100,max:500,factor:1.00},{min:500,max:2000,factor:1.15},{min:2000,max:99999,factor:1.30}]),
   catFactor('sector','Industry','rate','general',[['retail_hospitality','Retail/Hospitality',1.20],['financial','Financial Services',1.15],['tech','Technology',1.05],['general','General',1.00],['manufacturing','Manufacturing',0.95]]),
   catFactor('turnover','Staff Turnover','rate','normal',[['low','Low (<10%)',0.85],['normal','Normal (10-20%)',1.00],['high','High (>20%)',1.20]]),
   catFactor('claimsHistory','EPL Claims (5yr)','rate','clean',[['clean','None',0.85],['minor','1-2 minor',1.00],['multiple','Multiple / significant',1.30]])],
  {admin:3000,claims:25000,overhead:1500,fraud:0,expectedClaims:0.03,_defaultExposure:10000000},{commission:0.22,reinsurance:0.05},0.05);
schemas.D7 = makeROVSchema('D7','EPLI — Excess','USD','layerLimit','Layer Limit ($)','Excess EPL layer',0.004,schemas.D6.ratingFactors ? doFactors : doFactors,
  {admin:2000,claims:15000,overhead:1000,fraud:0,expectedClaims:0.01,_defaultExposure:20000000},{commission:0.20,reinsurance:0.05},0.05);
schemas.D7.ratingFactors = schemas.D6.ratingFactors;

// --- Transactional Liability ---
var transFactors = [
  catFactor('dealType','Transaction Type','rate','private_ma',[['private_ma','Private M&A',1.00],['public_ma','Public M&A',1.30],['cross_border','Cross-Border',1.15],['carve_out','Carve-Out/Spin-Off',1.25],['real_estate','Real Estate',0.85]]),
  bandFactor('dealValue','Deal Value ($m)','rate',200,[{min:0,max:50,factor:0.85},{min:50,max:200,factor:1.00},{min:200,max:1000,factor:1.10},{min:1000,max:99999,factor:1.25}]),
  catFactor('jurisdiction','Target Jurisdiction','rate','uk',[['us','United States',1.25],['uk','United Kingdom',1.00],['eu','EU/EEA',1.05],['asia','Asia',1.10],['emerging','Emerging Markets',1.30]]),
  catFactor('sector','Target Sector','rate','general',[['financial','Financial/Regulated',1.20],['tech','Technology/IP-heavy',1.15],['healthcare','Healthcare',1.20],['general','General Commercial',1.00],['manufacturing','Manufacturing',0.90]]),
  catFactor('diligence','Due Diligence Quality','rate','comprehensive',[['comprehensive','Comprehensive (Big 4)',0.85],['standard','Standard',1.00],['limited','Limited/Expedited',1.25]])];
['D8','D9','TA','TB','CD','CE'].forEach(function(c,i) {
  var labels = ['W&I — Buy-Side','W&I — Sell-Side','Tax Liability','Tax Litigation','Contingent Liability','Contingent Excess'];
  var rates = [0.010,0.012,0.008,0.010,0.008,0.005];
  schemas[c] = makeROVSchema(c,labels[i],'USD','policyLimit','Policy Limit ($)','Limit of indemnity',rates[i],transFactors,
    {admin:5000,claims:30000,overhead:2000,fraud:0,expectedClaims:0.01,_defaultExposure:50000000},{commission:0.20,reinsurance:0.05},0.05);
});

// --- PI/E&O (common factors, varied by specialty) ---
function piFactors(specialtyOpts) {
  return [
    catFactor('firmSize','Firm Size','rate','mid',[['sole','Sole Practitioner',1.30],['small','Small (2-10)',1.10],['mid','Mid (11-50)',1.00],['large','Large (51-200)',0.90],['major','Major (200+)',0.85]]),
    catFactor('specialty','Specialty Area','rate',specialtyOpts[0][0],specialtyOpts),
    bandFactor('revenue','Annual Revenue/Fee Income (£m)','rate',5,[{min:0,max:1,factor:0.80},{min:1,max:5,factor:1.00},{min:5,max:20,factor:1.10},{min:20,max:100,factor:1.20},{min:100,max:99999,factor:1.30}]),
    catFactor('claimsHistory','Claims History (5yr)','rate','clean',[['clean','Clean',0.85],['minor','Minor/reserved',1.00],['material','Material claim',1.25],['severe','Multiple/severe',1.50]]),
    catFactor('jurisdiction','Primary Jurisdiction','rate','uk',[['uk','UK',1.00],['eu','EU',1.05],['us','US',1.30],['international','International/Multi',1.15]])];
}
// Legal PI
schemas.E2 = makeROVSchema('E2','PI — Solicitors','GBP','limit','Limit of Indemnity (£)','PI limit',0.008,piFactors([['conveyancing','Conveyancing',1.30],['commercial','Commercial',1.00],['litigation','Litigation',1.15],['family','Family',0.85],['criminal','Criminal Defence',0.80]]),{admin:1500,claims:10000,overhead:800,fraud:0,expectedClaims:0.04,_defaultExposure:3000000},{commission:0.28,reinsurance:0.03},0.05);
schemas.E3 = makeROVSchema('E3','PI — Barristers','GBP','limit','Limit of Indemnity (£)','PI limit',0.006,piFactors([['commercial','Commercial',1.00],['criminal','Criminal',0.80],['family','Family',0.85],['tax','Tax/Chancery',1.15]]),{admin:1000,claims:8000,overhead:500,fraud:0,expectedClaims:0.03,_defaultExposure:2000000},{commission:0.28,reinsurance:0.03},0.05);
// Accountants
schemas.E4 = makeROVSchema('E4','PI — Accountants (Audit)','GBP','limit','Limit of Indemnity (£)','PI limit',0.010,piFactors([['audit','Audit',1.30],['tax','Tax Advisory',1.00],['advisory','Corporate Advisory',1.10],['bookkeeping','Bookkeeping',0.70],['insolvency','Insolvency',1.25]]),{admin:1500,claims:12000,overhead:800,fraud:0,expectedClaims:0.04,_defaultExposure:5000000},{commission:0.28,reinsurance:0.03},0.05);
schemas.E5 = makeROVSchema('E5','PI — Accountants (Non-Audit)','GBP','limit','Limit of Indemnity (£)','PI limit',0.007,piFactors([['tax','Tax Advisory',1.00],['bookkeeping','Bookkeeping',0.70],['advisory','Advisory',1.05],['payroll','Payroll',0.80]]),{admin:1000,claims:8000,overhead:500,fraud:0,expectedClaims:0.03,_defaultExposure:2000000},{commission:0.28,reinsurance:0.03},0.05);
// Construction PI
schemas.E6 = makeROVSchema('E6','PI — Architects & Engineers','GBP','limit','Limit of Indemnity (£)','PI limit',0.012,piFactors([['structural','Structural Engineering',1.25],['architecture','Architecture',1.00],['mep','M&E/Building Services',1.10],['surveying','Surveying',1.15],['project_mgmt','Project Management',1.05]]),{admin:1500,claims:12000,overhead:800,fraud:0,expectedClaims:0.04,_defaultExposure:5000000},{commission:0.25,reinsurance:0.05},0.05);
schemas.E7 = makeROVSchema('E7','PI — Construction Consultants','GBP','limit','Limit of Indemnity (£)','PI limit',0.010,piFactors([['quantity_surveying','Quantity Surveying',1.00],['project_mgmt','Project Management',1.10],['health_safety','CDM/H&S',1.05],['planning','Planning Consultancy',0.90]]),{admin:1200,claims:10000,overhead:600,fraud:0,expectedClaims:0.03,_defaultExposure:3000000},{commission:0.25,reinsurance:0.05},0.05);
// Technology PI
schemas.F4 = makeROVSchema('F4','PI — Technology (Primary)','GBP','limit','Limit of Indemnity (£)','PI/E&O limit',0.008,piFactors([['software','Software Development',1.00],['cloud_saas','Cloud/SaaS',1.10],['it_consulting','IT Consulting',0.90],['managed_services','Managed Services',1.05],['ai_ml','AI/ML',1.20]]),{admin:1500,claims:12000,overhead:800,fraud:0,expectedClaims:0.03,_defaultExposure:5000000},{commission:0.25,reinsurance:0.05},0.05);
schemas.F5 = makeROVSchema('F5','PI — Telecom','GBP','limit','Limit of Indemnity (£)','PI/E&O limit',0.007,piFactors([['network','Network Operator',1.00],['isp','ISP/Broadband',0.90],['mobile','Mobile/Wireless',1.05],['data_centre','Data Centre',1.10]]),{admin:1500,claims:10000,overhead:800,fraud:0,expectedClaims:0.025,_defaultExposure:10000000},{commission:0.25,reinsurance:0.05},0.05);
// Financial Institutions PI
schemas.F2 = makeROVSchema('F2','PI — Financial Institutions (Primary)','GBP','limit','Limit of Indemnity (£)','PI limit',0.010,piFactors([['banking','Banking',1.20],['asset_mgmt','Asset Management',1.15],['insurance','Insurance Broking',1.00],['fintech','FinTech',1.10],['payments','Payments/Cards',1.05]]),{admin:3000,claims:20000,overhead:1500,fraud:0,expectedClaims:0.03,_defaultExposure:10000000},{commission:0.22,reinsurance:0.05},0.05);
schemas.F3 = makeROVSchema('F3','PI — Financial Institutions (Excess)','GBP','limit','Layer Limit (£)','Excess layer limit',0.005,piFactors([['banking','Banking',1.20],['asset_mgmt','Asset Management',1.15],['insurance','Insurance Broking',1.00],['fintech','FinTech',1.10]]),{admin:2000,claims:15000,overhead:1000,fraud:0,expectedClaims:0.01,_defaultExposure:25000000},{commission:0.20,reinsurance:0.05},0.05);
// Misc PI
['E8','E9','ED','EE'].forEach(function(c,i) {
  var labels = ['PI — Media & Entertainment','PI — Miscellaneous Professions','PI — Design Professionals','PI — Environmental Consultants'];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','limit','Limit of Indemnity (£)','PI limit',0.008,piFactors([['standard','Standard Risk',1.00],['elevated','Elevated Risk',1.20],['specialist','Specialist/Niche',1.10],['low','Low Risk',0.80]]),{admin:1200,claims:8000,overhead:600,fraud:0,expectedClaims:0.03,_defaultExposure:3000000},{commission:0.25,reinsurance:0.03},0.05);
});

// --- Crime/Fidelity ---
var crimeFactors = [
  catFactor('entityType','Entity Type','rate','corporate',[['financial_institution','Financial Institution',1.30],['corporate','Corporate/Commercial',1.00],['public_sector','Public Sector',0.85],['nonprofit','Non-Profit',0.90]]),
  bandFactor('employees','Employee Count','rate',500,[{min:0,max:100,factor:0.75},{min:100,max:500,factor:1.00},{min:500,max:2000,factor:1.10},{min:2000,max:99999,factor:1.25}]),
  catFactor('controls','Internal Controls','rate','strong',[['excellent','Excellent (SOX compliant)',0.80],['strong','Strong',0.90],['standard','Standard',1.00],['weak','Weak/Concerns',1.40]]),
  catFactor('sector','Industry','rate','general',[['banking','Banking/Securities',1.30],['insurance','Insurance',1.15],['general','General Commercial',1.00],['retail','Retail',1.10],['tech','Technology',1.05]]),
  catFactor('claimsHistory','Fidelity Claims (5yr)','rate','clean',[['clean','Clean',0.85],['minor','Minor',1.00],['material','Material loss',1.30]])];
schemas.BB = makeROVSchema('BB','Crime — Financial Institutions','GBP','policyLimit','Policy Limit (£)','Crime/fidelity limit',0.005,crimeFactors,{admin:3000,claims:20000,overhead:1500,fraud:0,expectedClaims:0.02,_defaultExposure:10000000},{commission:0.22,reinsurance:0.05},0.05);
schemas.BC = makeROVSchema('BC','Crime — Commercial','GBP','policyLimit','Policy Limit (£)','Crime/fidelity limit',0.004,crimeFactors,{admin:2000,claims:15000,overhead:1000,fraud:0,expectedClaims:0.02,_defaultExposure:5000000},{commission:0.25,reinsurance:0.03},0.05);

// --- Commercial Property ---
var propFactors = [
  catFactor('construction','Construction Type','rate','masonry_nc',[['fire_resistive','Fire Resistive (steel/concrete)',0.50],['modified_fr','Modified Fire Resistive',0.65],['masonry_nc','Masonry Non-Combustible',0.85],['joisted_masonry','Joisted Masonry',1.20],['frame','Frame (wood)',2.00]]),
  catFactor('occupancy','Occupancy Hazard','rate','light',[['office','Office/Retail (low)',0.80],['light','Light Commercial',1.00],['medium','Medium (light manufacturing)',1.30],['high','High (chemicals/plastics)',2.00]]),
  catFactor('protection','Fire Protection','rate','sprinklered',[['full_sprinkler','Full NFPA 13 Sprinklers',0.65],['sprinklered','Partial Sprinklers',0.85],['detection_only','Detection Only',1.00],['basic','Basic/Minimal',1.25]]),
  catFactor('natCat','Nat-Cat Zone','rate','low',[['very_low','Very Low',0.80],['low','Low',0.90],['moderate','Moderate',1.00],['high','High (flood/wind)',1.30],['severe','Severe (Zone AE/VE)',1.60]]),
  catFactor('claimsHistory','Claims History (5yr)','rate','clean',[['clean','Clean',0.85],['attritional','Attritional',1.00],['notable','Notable loss',1.25],['major','Major loss (>50% premium)',1.60]]),
  bandFactor('deductible','Deductible (£k)','rate',25,[{min:0,max:10,factor:1.10},{min:10,max:50,factor:1.00},{min:50,max:250,factor:0.90},{min:250,max:1000,factor:0.80},{min:1000,max:99999,factor:0.65}])];
['P2','P3','P4','P5','P6','P7','B2','B3','B4','B5'].forEach(function(c,i) {
  var labels = ['Property — Fire','Property — Industrial','Property — Commercial','Property — Residential','Property — Surplus Lines','Property — Specialty','BI — Standard','BI — Extended','BI — Contingent','BI — Excess'];
  var rates = [0.0010,0.0014,0.0010,0.0008,0.0016,0.0012,0.0045,0.0055,0.0035,0.0025];
  var eKey = i >= 6 ? 'biExposure' : 'tiv';
  var eLabel = i >= 6 ? 'BI Exposure (£)' : 'Total Insured Value (£)';
  schemas[c] = makeROVSchema(c,labels[i],'GBP',eKey,eLabel,i>=6?'Maximum indemnity period gross profit':'Total property value',rates[i],propFactors,
    {admin:3000,claims:15000,overhead:1500,fraud:0,expectedClaims:0.03,_defaultExposure:25000000},{commission:0.25,reinsurance:0.05},0.05);
});

// --- Engineering & Construction ---
schemas.CB = makeROVSchema('CB','Construction All Risks (CAR)','GBP','projectValue','Project Value (£)','Total contract value',0.0025,
  [catFactor('projectType','Project Type','rate','commercial',[['residential','Residential',0.85],['commercial','Commercial',1.00],['infrastructure','Infrastructure/Civil',1.15],['industrial','Industrial',1.10],['renovation','Renovation/Refurb',1.25]]),
   bandFactor('contractValue','Contract Value (£m)','rate',20,[{min:0,max:5,factor:0.85},{min:5,max:20,factor:1.00},{min:20,max:100,factor:1.10},{min:100,max:99999,factor:1.20}]),
   catFactor('groundConditions','Ground Conditions','rate','normal',[['good','Good/known',0.85],['normal','Normal',1.00],['difficult','Difficult (water table)',1.20],['unknown','Unknown/challenging',1.40]]),
   catFactor('contractor','Main Contractor Grade','rate','tier1',[['tier1','Tier 1 (major)',0.85],['tier2','Tier 2 (regional)',1.00],['tier3','Tier 3 (local)',1.15],['unrated','Unrated',1.35]]),
   catFactor('dsp','DSU/BI Included','rate','excluded',[['excluded','Excluded',1.00],['12m','12 months DSU',1.15],['24m','24 months DSU',1.30]])],
  {admin:5000,claims:30000,overhead:2000,fraud:0,expectedClaims:0.03,_defaultExposure:50000000},{commission:0.22,reinsurance:0.05},0.05);
schemas.CC = makeROVSchema('CC','Erection All Risks (EAR)','GBP','projectValue','Project Value (£)','Equipment/machinery value',0.0030,schemas.CB.ratingFactors,
  {admin:4000,claims:25000,overhead:1500,fraud:0,expectedClaims:0.03,_defaultExposure:30000000},{commission:0.22,reinsurance:0.05},0.05);

// --- General Liability USA ---
var glUsaFactors = [
  catFactor('sector','Industry Sector','rate','general',[['manufacturing','Manufacturing',1.10],['construction','Construction',1.30],['retail','Retail/Hospitality',1.15],['general','General Commercial',1.00],['professional','Professional Services',0.85]]),
  bandFactor('revenue','Annual Revenue ($m)','rate',50,[{min:0,max:10,factor:0.80},{min:10,max:50,factor:1.00},{min:50,max:200,factor:1.10},{min:200,max:99999,factor:1.25}]),
  catFactor('jurisdiction','US Jurisdiction','rate','mixed',[['favorable','Favorable (Delaware/VA)',0.85],['mixed','Mixed/National',1.00],['adverse','Adverse (NY/CA/FL)',1.20],['judicial_hellhole','Judicial Hellhole',1.50]]),
  catFactor('claimsHistory','Claims History (5yr)','rate','clean',[['clean','Clean',0.85],['attritional','Attritional only',1.00],['material','Material claim',1.25],['poor','Poor/litigious',1.50]]),
  catFactor('products','Products Exposure','rate','low',[['none','None/minimal',0.80],['low','Low',1.00],['moderate','Moderate',1.15],['high','High (consumer-facing)',1.35]])];
['UA','UC','UR','US'].forEach(function(c,i) {
  var labels = ['GL USA — Primary','GL USA — Umbrella','GL USA — Excess Casualty','GL USA — Surplus Lines'];
  var rates = [0.005,0.004,0.003,0.006];
  schemas[c] = makeROVSchema(c,labels[i],'USD','policyLimit','Policy Limit ($)','GL limit of liability',rates[i],glUsaFactors,
    {admin:3000,claims:20000,overhead:1500,fraud:0,expectedClaims:0.04,_defaultExposure:5000000},{commission:0.22,reinsurance:0.05},0.05);
});

// --- General Liability Non-US ---
['N','NC','NR','NS'].forEach(function(c,i) {
  var labels = ['GL Non-US — Primary','GL Non-US — Casualty','GL Non-US — Excess','GL Non-US — Specialty'];
  var rates = [0.004,0.003,0.002,0.005];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','policyLimit','Policy Limit (£)','GL limit',rates[i],
    [catFactor('sector','Industry Sector','rate','general',[['manufacturing','Manufacturing',1.10],['construction','Construction',1.25],['general','General Commercial',1.00],['professional','Professional Services',0.85]]),
     catFactor('territory','Territory','rate','uk',[['uk','UK',1.00],['eu','EU/EEA',1.05],['international','International/Multi',1.15],['developing','Developing Markets',1.25]]),
     bandFactor('revenue','Annual Revenue (£m)','rate',20,[{min:0,max:5,factor:0.80},{min:5,max:20,factor:1.00},{min:20,max:100,factor:1.10},{min:100,max:99999,factor:1.20}]),
     catFactor('claimsHistory','Claims History','rate','clean',[['clean','Clean',0.85],['attritional','Attritional',1.00],['material','Material',1.25]])],
    {admin:2000,claims:15000,overhead:1000,fraud:0,expectedClaims:0.03,_defaultExposure:5000000},{commission:0.25,reinsurance:0.05},0.05);
});

// --- Employers Liability UK ---
schemas.W3 = makeROVSchema('W3','Employers Liability — UK','GBP','annualWages','Annual Wage Roll (£)','Total annual payroll',0.0020,
  [catFactor('industry','Industry','rate','commercial',[['office','Office/Professional',0.60],['commercial','Commercial/Retail',1.00],['manufacturing','Manufacturing',1.30],['construction','Construction',1.60],['heavy_industry','Heavy Industry/Mining',2.00]]),
   bandFactor('employees','Employee Count','rate',200,[{min:0,max:50,factor:0.85},{min:50,max:200,factor:1.00},{min:200,max:1000,factor:1.10},{min:1000,max:99999,factor:1.20}]),
   catFactor('safetyRecord','Safety Record','rate','good',[['excellent','Excellent (zero RIDDOR 5yr)',0.80],['good','Good',0.90],['standard','Standard',1.00],['concerns','HSE concerns/notices',1.25],['prosecution','HSE prosecution',1.60]]),
   catFactor('claimsHistory','Claims History (5yr)','rate','clean',[['clean','Clean',0.85],['minor','Minor bodily injury',1.00],['material','Material claims',1.25],['disease','Disease claims (asbestos/noise)',1.50]])],
  {admin:1500,claims:10000,overhead:800,fraud:0,expectedClaims:0.04,_defaultExposure:10000000},{commission:0.28,reinsurance:0.03},0.05);

// --- Workers Comp ---
schemas.W4 = makeROVSchema('W4','Workers Comp — International','GBP','payroll','Annual Payroll (£)','Total payroll for covered territories',0.0025,
  [catFactor('territory','Territory','rate','eu',[['eu','EU/EEA',1.00],['asia','Asia',1.10],['latam','Latin America',1.20],['middle_east','Middle East',1.05],['africa','Africa',1.25]]),
   catFactor('industry','Industry','rate','commercial',[['office','Office/Professional',0.70],['commercial','Commercial',1.00],['manufacturing','Manufacturing',1.25],['construction','Construction',1.50]]),
   bandFactor('employees','Headcount','rate',200,[{min:0,max:50,factor:0.85},{min:50,max:200,factor:1.00},{min:200,max:1000,factor:1.10},{min:1000,max:99999,factor:1.20}]),
   catFactor('claimsHistory','Claims History','rate','clean',[['clean','Clean',0.85],['standard','Standard',1.00],['adverse','Adverse',1.25]])],
  {admin:2000,claims:12000,overhead:1000,fraud:0,expectedClaims:0.04,_defaultExposure:15000000},{commission:0.25,reinsurance:0.05},0.05);
['W5','W6'].forEach(function(c,i) {
  var labels = ['Workers Comp — US (Primary)','Workers Comp — US (Excess)'];
  schemas[c] = makeROVSchema(c,labels[i],'USD','payroll','Annual Payroll ($)','Total US payroll',i===0?0.0030:0.0015,
    [catFactor('stateClass','State Classification','rate','standard',[['favorable','Favorable (TX/VA)',0.85],['standard','Standard',1.00],['adverse','Adverse (CA/NY)',1.20],['monopolistic','Monopolistic State',1.10]]),
     catFactor('industry','Industry Class','rate','clerical',[['clerical','Clerical/Office',0.50],['retail','Retail/Service',0.80],['manufacturing','Manufacturing',1.00],['construction','Construction',1.40],['heavy','Heavy Industry',1.80]]),
     catFactor('expMod','Experience Modification','rate','unity',[['credit','Below Unity (<0.90)',0.85],['unity','Unity (0.90-1.10)',1.00],['debit','Above Unity (>1.10)',1.20],['high_debit','High Debit (>1.30)',1.40]]),
     catFactor('safetyProgram','Safety Program','rate','standard',[['excellent','Excellent (OSHA VPP)',0.80],['standard','Standard',1.00],['minimal','Minimal',1.15]])],
    {admin:3000,claims:15000,overhead:1500,fraud:0,expectedClaims:0.05,_defaultExposure:20000000},{commission:0.22,reinsurance:0.05},0.05);
});

// --- Marine Hull ---
var marineHullFactors = [
  catFactor('vesselType','Vessel Type','rate','bulk_carrier',[['container','Container Ship',1.00],['bulk_carrier','Bulk Carrier',0.90],['tanker','Tanker (crude/product)',1.10],['lng','LNG/LPG Carrier',1.05],['general_cargo','General Cargo',0.95],['ro_ro','Ro-Ro / Ferry',1.15],['offshore','Offshore Support',1.20],['tug','Tug/Workboat',1.10]]),
  bandFactor('vesselAge','Vessel Age (years)','rate',10,[{min:0,max:5,factor:0.85},{min:5,max:10,factor:1.00},{min:10,max:20,factor:1.15},{min:20,max:30,factor:1.35},{min:30,max:99,factor:1.60}]),
  catFactor('flag','Flag State','rate','tier1',[['tier1','Tier 1 (IACS member, white list)',0.90],['tier2','Tier 2 (grey list)',1.00],['tier3','Tier 3 (black list)',1.30],['foc','Flag of Convenience',1.15]]),
  catFactor('tradeArea','Trading Area','rate','worldwide',[['protected','Protected Waters',0.80],['coastal','Coastal',0.90],['worldwide','Worldwide (excl. war zones)',1.00],['ice_class','Ice Navigation',1.20],['high_risk','High Risk Areas (HRA)',1.15]]),
  catFactor('classification','Classification Society','rate','iacs',[['iacs_major','IACS Major (LR/DNV/BV)',0.90],['iacs_other','IACS Other',1.00],['non_iacs','Non-IACS',1.20]]),
  catFactor('claimsHistory','Claims History (5yr)','rate','clean',[['clean','Clean',0.85],['attritional','Attritional',1.00],['notable','Notable',1.20],['total_loss','Total Loss in window',1.60]])];
['B','T','TS','TX'].forEach(function(c,i) {
  var labels = ['Marine Hull — H&M','Marine Hull — IV/TLO','Marine Hull — War Risk Supplement','Marine Hull — Excess'];
  var rates = [0.0025,0.0015,0.0008,0.0010];
  schemas[c] = makeROVSchema(c,labels[i],'USD','insuredValue','Insured Value ($)','Agreed hull value',rates[i],marineHullFactors,
    {admin:5000,claims:30000,overhead:2000,fraud:0,expectedClaims:0.03,_defaultExposure:50000000},{commission:0.22,reinsurance:0.05},0.05);
});

// --- Marine Hull War ---
['W','WB','AW','WX'].forEach(function(c,i) {
  var labels = ['Marine War — Hull','Marine War — BI','Marine War — Additional War','Marine War — Excess'];
  var rates = [0.0005,0.0008,0.0004,0.0003];
  schemas[c] = makeROVSchema(c,labels[i],'USD','insuredValue','Insured Value ($)','Hull value',rates[i],
    [catFactor('warZone','War Risk Zone','rate','standard',[['safe','Safe Passage',0.70],['standard','Standard',1.00],['listed','JWC Listed Area',1.40],['high_risk','High Risk (Red Sea/Ukraine)',2.00],['active_conflict','Active Conflict Zone',3.00]]),
     catFactor('vesselType','Vessel Type','rate','cargo',[['cargo','Cargo (bulk/container)',1.00],['tanker','Tanker',1.10],['passenger','Passenger/Cruise',1.20],['special','Special Purpose',1.15]]),
     catFactor('duration','Voyage Duration','rate','single',[['single','Single Voyage',1.00],['annual','Annual Cover',0.85],['spot','Spot/Breach',1.50]])],
    {admin:3000,claims:20000,overhead:1000,fraud:0,expectedClaims:0.01,_defaultExposure:50000000},{commission:0.20,reinsurance:0.08},0.05);
});

// --- Marine Cargo ---
var cargoFactors = [
  catFactor('commodity','Commodity Type','rate','general',[['electronics','Electronics',1.40],['vehicles','Vehicles',1.20],['machinery','Machinery/Equipment',1.00],['steel','Steel/Metals',0.65],['bulk','Bulk Commodities',0.50],['general','General Cargo',1.00],['pharma','Pharmaceuticals',1.30],['perishable','Perishables',1.25],['project_cargo','Project Cargo',1.10]]),
  catFactor('iccClause','ICC Clause','rate','A',[['A','ICC (A) — All Risks',1.00],['B','ICC (B) — Named Perils',0.80],['C','ICC (C) — Major Perils',0.60]]),
  catFactor('tradeLane','Trade Route','rate','standard',[['transatlantic','Transatlantic',0.90],['standard','Standard International',1.00],['asia_europe','Asia-Europe',1.05],['red_sea','Red Sea Transit',1.30],['west_africa','West Africa',1.20],['high_risk','High Risk (piracy/war)',1.50]]),
  catFactor('packing','Packing Quality','rate','standard',[['professional','Professional (containerised)',0.85],['standard','Standard',1.00],['breakbulk','Break-Bulk',1.15],['open_deck','Open Deck/Project',1.25]]),
  catFactor('lossHistory','Loss History (5yr)','rate','good',[['excellent','Excellent (<30% LR)',0.80],['good','Good (30-50% LR)',0.90],['average','Average (50-65% LR)',1.00],['poor','Poor (>65% LR)',1.25]])];
['V','Q','VL','VX'].forEach(function(c,i) {
  var labels = ['Marine Cargo — Open Cover','Marine Cargo — Specific Voyage','Marine Cargo — Liability','Marine Cargo — Excess'];
  var rates = [0.0025,0.0035,0.0030,0.0012];
  var eKey = i===2 ? 'limit' : 'cargoValue';
  var eLabel = i===2 ? 'Liability Limit ($)' : (i===1 ? 'Cargo Value ($)' : 'Annual Cargo Value ($)');
  schemas[c] = makeROVSchema(c,labels[i],'USD',eKey,eLabel,i===0?'Estimated annual shipment value':'',rates[i],cargoFactors,
    {admin:3000,claims:15000,overhead:1500,fraud:0,expectedClaims:0.04,_defaultExposure:45000000},{commission:0.22,reinsurance:0.05},0.05);
});

// --- Marine Liability ---
['G','GC','GX'].forEach(function(c,i) {
  var labels = ['Marine Liability — P&I','Marine Liability — Charterers','Marine Liability — Excess'];
  var rates = [0.003,0.002,0.0015];
  schemas[c] = makeROVSchema(c,labels[i],'USD','limit','Limit of Liability ($)','P&I / liability limit',rates[i],
    [catFactor('vesselType','Vessel Type','rate','cargo',[['cargo','Cargo Vessel',1.00],['tanker','Tanker',1.15],['passenger','Passenger/Ferry',1.25],['offshore','Offshore Vessel',1.10],['tug','Tug/Workboat',1.05]]),
     bandFactor('grt','Gross Tonnage (GT)','rate',30000,[{min:0,max:5000,factor:0.70},{min:5000,max:30000,factor:1.00},{min:30000,max:80000,factor:1.15},{min:80000,max:999999,factor:1.30}]),
     catFactor('trade','Trading Pattern','rate','international',[['coastal','Coastal',0.85],['international','International',1.00],['tanker_trade','Tanker Trade (OPA 90)',1.20]]),
     catFactor('claimsHistory','Claims History','rate','clean',[['clean','Clean',0.85],['attritional','Attritional',1.00],['notable','Notable',1.20]])],
    {admin:3000,claims:20000,overhead:1500,fraud:0,expectedClaims:0.03,_defaultExposure:50000000},{commission:0.22,reinsurance:0.05},0.05);
});

// --- Yachts ---
schemas.O = makeROVSchema('O','Yacht Hull & Liability','GBP','hullValue','Hull Value (£)','Agreed hull value',0.010,
  [catFactor('yachtType','Yacht Type','rate','sailing',[['sailing_cruiser','Sailing Cruiser',1.00],['motor_yacht','Motor Yacht',0.90],['superyacht','Superyacht (>24m)',0.80],['racing','Racing Yacht',1.40],['catamaran','Catamaran',1.05]]),
   bandFactor('length','Length (metres)','rate',12,[{min:0,max:10,factor:0.85},{min:10,max:15,factor:1.00},{min:15,max:24,factor:1.10},{min:24,max:50,factor:1.20},{min:50,max:999,factor:1.30}]),
   catFactor('navigation','Navigation Limits','rate','coastal',[['inland','Inland Waters',0.75],['coastal','Coastal (within 60nm)',1.00],['offshore','Offshore/Blue Water',1.20],['transatlantic','Transatlantic',1.35]]),
   catFactor('experience','Skipper Experience','rate','experienced',[['professional','Professional/RYA Yachtmaster',0.85],['experienced','Experienced (10+ years)',1.00],['moderate','Moderate',1.15],['novice','Novice/New',1.40]]),
   catFactor('usage','Usage','rate','private',[['private','Private/Pleasure',1.00],['charter','Charter',1.20],['racing','Racing',1.35],['commercial','Commercial/Training',1.25]])],
  {admin:500,claims:3000,overhead:300,fraud:0,expectedClaims:0.05,_defaultExposure:250000},{commission:0.30,reinsurance:0.03},0.05);

// --- UK Household ---
schemas.HP = makeROVSchema('HP','UK Household Property','GBP','sumInsured','Sum Insured — Buildings (£)','Rebuilding cost',0.0008,
  [catFactor('propertyType','Property Type','rate','semi_detached',[['detached','Detached House',1.10],['semi_detached','Semi-Detached',1.00],['terraced','Terraced',0.95],['flat','Flat/Apartment',0.85],['bungalow','Bungalow',1.05]]),
   catFactor('construction','Construction','rate','standard',[['standard','Standard Brick/Tile',1.00],['timber','Timber Frame',1.20],['stone','Stone',1.05],['flat_roof','Flat Roof',1.15],['listed','Listed Building',1.30]]),
   catFactor('floodRisk','Flood Risk','rate','low',[['very_low','Very Low',0.85],['low','Low',1.00],['moderate','Moderate',1.20],['high','High',1.50],['very_high','Very High (Flood Re)',1.80]]),
   catFactor('subsidence','Subsidence Risk','rate','low',[['low','Low (bedrock)',0.90],['standard','Standard',1.00],['clay','Clay Soil',1.15],['high','High (mining/clay)',1.35]]),
   catFactor('claimsHistory','Claims (5yr)','rate','clean',[['clean','No claims',0.80],['one','1 claim',1.00],['two','2 claims',1.20],['three_plus','3+ claims',1.50]])],
  {admin:25,claims:200,overhead:15,fraud:50,expectedClaims:0.06,_defaultExposure:350000},{commission:0.30,reinsurance:0.03},0.05);

// --- Personal Accident & Health ---
var pahFactors = [
  catFactor('occupationClass','Occupation Class','rate','class2',[['class1','Class 1 — Professional/Desk',0.80],['class2','Class 2 — Supervisory/Light Manual',1.00],['class3','Class 3 — Skilled Manual',1.50],['class4','Class 4 — Heavy/Hazardous',2.50]]),
  bandFactor('age','Age (years)','rate',35,[{min:16,max:25,factor:0.70},{min:25,max:35,factor:1.00},{min:35,max:45,factor:1.30},{min:45,max:55,factor:1.80},{min:55,max:65,factor:2.80},{min:65,max:75,factor:4.50}]),
  catFactor('benefitType','Benefit Type','rate','add',[['add','AD&D Only',0.60],['ptd','PTD + AD&D',1.00],['ttd','TTD + PTD + AD&D',1.30],['income','Income Replacement',1.50]]),
  catFactor('territory','Territory','rate','uk',[['uk','UK Only',1.00],['europe','Europe',1.05],['worldwide_ex_us','Worldwide excl. US',1.15],['worldwide','Worldwide incl. US',1.35]]),
  catFactor('deferredPeriod','Deferred Period','rate','4_weeks',[['immediate','Immediate (1 week)',1.20],['4_weeks','4 weeks',1.00],['13_weeks','13 weeks',0.80],['26_weeks','26 weeks',0.65]])];
['KA','KB','KC','KG','KM','KP','KS','KT','KX'].forEach(function(c,i) {
  var labels = ['PA — Individual','PA — Group','PA — Sports/Leisure','PA — Group A&H','PA — Medical Expenses','PA — Personal Income','PA — Specific Sports','PA — Travel','PA — Excess/XL'];
  var rates = [0.003,0.0025,0.005,0.003,0.010,0.008,0.006,0.004,0.002];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','sumAssured','Sum Assured (£)','Total benefit amount',rates[i],pahFactors,
    {admin:500,claims:3000,overhead:300,fraud:200,expectedClaims:0.04,_defaultExposure:500000},{commission:0.28,reinsurance:0.03},0.05);
});

// --- Medical Malpractice ---
var medmalFactors = [
  catFactor('specialty','Medical Specialty','rate','general',[['general','General Practice/Primary',1.00],['surgical','Surgical',1.40],['obstetrics','Obstetrics/Gynaecology',1.60],['anaesthesia','Anaesthesia',1.25],['radiology','Radiology/Diagnostics',1.10],['psychiatry','Psychiatry',0.80],['dental','Dental',0.70]]),
  catFactor('facilityType','Facility Type','rate','hospital',[['hospital','Hospital/Acute',1.20],['clinic','Clinic/Outpatient',1.00],['care_home','Care/Nursing Home',1.10],['gp','GP Surgery',0.85],['pharmacy','Pharmacy',0.75]]),
  bandFactor('beds','Bed Count / Practitioners','rate',200,[{min:0,max:50,factor:0.80},{min:50,max:200,factor:1.00},{min:200,max:500,factor:1.15},{min:500,max:99999,factor:1.30}]),
  catFactor('jurisdiction','Jurisdiction','rate','uk',[['uk','UK (NHS/Private)',1.00],['eu','EU',1.05],['us','United States',1.50],['international','International',1.15]]),
  catFactor('claimsHistory','Claims History','rate','standard',[['clean','Clean (5yr)',0.80],['standard','Standard',1.00],['adverse','Adverse',1.30],['severe','Severe/never events',1.60]])];
['GH','GM','GN','GO','GQ','GT'].forEach(function(c,i) {
  var labels = ['MedMal — Hospitals','MedMal — Individual','MedMal — Nursing/Care','MedMal — Clinical Trials','MedMal — Excess','MedMal — Telemedicine'];
  var rates = [0.008,0.005,0.006,0.010,0.004,0.004];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','limit','Limit of Indemnity (£)','PI/medmal limit',rates[i],medmalFactors,
    {admin:2000,claims:15000,overhead:1000,fraud:0,expectedClaims:0.03,_defaultExposure:5000000},{commission:0.25,reinsurance:0.05},0.05);
});

// --- Motor UK ---
var motorFactors = [
  catFactor('vehicleGroup','Vehicle Group','rate','mid',[['economy','Economy (Group 1-10)',0.60],['mid','Mainstream (Group 11-25)',1.00],['performance','Performance (Group 26-40)',1.80],['supercar','Supercar (Group 41-50)',3.50],['ev','Electric Vehicle',1.10]]),
  bandFactor('driverAge','Primary Driver Age','rate',35,[{min:17,max:20,factor:3.50},{min:20,max:25,factor:1.80},{min:25,max:30,factor:1.20},{min:30,max:65,factor:1.00},{min:65,max:75,factor:1.15},{min:75,max:99,factor:1.50}]),
  catFactor('territory','Territory (Postcode)','rate','provincial',[['rural','Rural',0.80],['provincial','Provincial Town',1.00],['city','Major City',1.20],['inner_london','Inner London',1.60],['high_crime','High Crime Area',2.00]]),
  catFactor('use','Vehicle Use','rate','sdp',[['sdp','Social/Pleasure',1.00],['commuting','SDP + Commuting',1.10],['business','Business Class 1',1.20],['hire_reward','Hire/Reward/PHV',2.20],['courier','Courier/Delivery',2.50]]),
  catFactor('ncd','No Claims Discount','rate','5yr',[['max','9+ years protected',0.30],['5yr','5 years',0.45],['3yr','3 years',0.65],['1yr','1 year',0.85],['none','None',1.00],['loaded','Loaded (at-fault claims)',1.40]])];
['M2','M3','M4','M5','M6'].forEach(function(c,i) {
  var labels = ['Motor — Private Car','Motor — Commercial Vehicle','Motor — Motorcycle','Motor — Fleet','Motor — Specialist/Classic'];
  var rates = [0.040,0.035,0.045,0.018,0.025];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','vehicleValue','Vehicle Value (£)','Market value or agreed value',rates[i],motorFactors,
    {admin:30,claims:500,overhead:20,fraud:100,expectedClaims:0.08,_defaultExposure:25000},{commission:0.30,reinsurance:0.03},0.05);
});

// --- Motor International ---
['MF','MG','MH','MI','MP'].forEach(function(c,i) {
  var labels = ['Motor Int\'l — Private','Motor Int\'l — Commercial','Motor Int\'l — Fleet','Motor Int\'l — Specialist','Motor Int\'l — Excess'];
  schemas[c] = makeROVSchema(c,labels[i],'USD','vehicleValue','Vehicle Value ($)','Market value',[0.035,0.030,0.015,0.025,0.010][i],
    [catFactor('territory','Territory','rate','eu',[['eu','EU/EEA',1.00],['middle_east','Middle East',1.10],['asia','Asia',1.15],['latam','Latin America',1.25],['africa','Africa',1.30]]),
     catFactor('vehicleType','Vehicle Type','rate','car',[['car','Private Car',1.00],['lcv','LCV/Van',1.10],['hgv','HGV/Truck',1.30],['motorcycle','Motorcycle',1.20],['specialist','Specialist',1.15]]),
     catFactor('use','Use','rate','private',[['private','Private',1.00],['commercial','Commercial',1.15],['fleet','Fleet',0.90],['hire','Hire/Taxi',1.40]]),
     catFactor('claimsHistory','Claims History','rate','clean',[['clean','Clean',0.85],['standard','Standard',1.00],['adverse','Adverse',1.25]])],
    {admin:25,claims:400,overhead:15,fraud:50,expectedClaims:0.07,_defaultExposure:30000},{commission:0.28,reinsurance:0.05},0.05);
});

// --- Political Risk ---
schemas.PR = makeROVSchema('PR','Political Risk','USD','exposureValue','Exposure Value ($)','Investment/contract value at risk',0.0030,
  [catFactor('peril','Peril Type','rate','expropriation',[['expropriation','Expropriation/Confiscation',1.00],['cen','Contract/Export Non-payment',0.85],['currency','Currency Inconvertibility',0.80],['forced_divestiture','Forced Divestiture',1.10],['political_violence','Political Violence',1.20]]),
   catFactor('country','Country Risk Rating','rate','moderate',[['low','Low Risk (OECD)',0.70],['moderate','Moderate',1.00],['elevated','Elevated',1.30],['high','High (MIGA Category)',1.60],['extreme','Extreme',2.00]]),
   bandFactor('tenor','Policy Tenor (years)','rate',3,[{min:1,max:3,factor:1.00},{min:3,max:7,factor:1.15},{min:7,max:15,factor:1.35},{min:15,max:30,factor:1.60}]),
   catFactor('sector','Investment Sector','rate','infrastructure',[['infrastructure','Infrastructure',1.00],['extractive','Extractive/Mining',1.20],['financial','Financial Services',0.90],['agriculture','Agriculture',1.05],['energy','Energy',1.10]])],
  {admin:8000,claims:50000,overhead:3000,fraud:0,expectedClaims:0.01,_defaultExposure:100000000},{commission:0.18,reinsurance:0.10},0.05);

// --- Credit ---
['CR','CF','WT'].forEach(function(c,i) {
  var labels = ['Credit Insurance','Contract Frustration','Whole Turnover Credit'];
  schemas[c] = makeROVSchema(c,labels[i],'USD','creditExposure','Credit Exposure ($)','Total credit limit/contract value',[0.004,0.006,0.003][i],
    [catFactor('buyerRating','Buyer/Debtor Rating','rate','investment_grade',[['aaa_aa','AAA-AA',0.60],['investment_grade','Investment Grade (A-BBB)',1.00],['sub_ig','Sub-IG (BB-B)',1.50],['unrated','Unrated',1.30],['distressed','Distressed (CCC+)',2.50]]),
     catFactor('territory','Buyer Territory','rate','developed',[['developed','Developed (OECD)',0.85],['emerging','Emerging',1.00],['frontier','Frontier',1.20],['high_risk','High Risk',1.50]]),
     catFactor('sector','Industry Sector','rate','general',[['general','General Commercial',1.00],['construction','Construction',1.20],['commodities','Commodities/Trading',1.15],['technology','Technology',1.05],['retail','Retail',1.10]]),
     catFactor('tenor','Credit Tenor','rate','short',[['short','Short-term (<1yr)',1.00],['medium','Medium (1-3yr)',1.15],['long','Long-term (3-7yr)',1.35]])],
    {admin:3000,claims:20000,overhead:1500,fraud:0,expectedClaims:0.02,_defaultExposure:50000000},{commission:0.20,reinsurance:0.08},0.05);
});

// --- Terrorism & Political Violence ---
['TO','TU','TW','RS','RW','WL'].forEach(function(c,i) {
  var labels = ['Terrorism — Property','Terrorism — BI','Terrorism — War on Land','Terrorism — Strikes/Riots','Terrorism — War Risk','Terrorism — War Liability'];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','tiv','TIV / Exposure (£)','Total insured value or exposure base',[0.0005,0.0008,0.0010,0.0006,0.0012,0.0008][i],
    [catFactor('territory','Territory','rate','uk',[['uk','UK (Pool Re)',0.90],['eu','EU',1.00],['us','US (TRIA)',0.95],['middle_east','Middle East',1.40],['global','Global/Multi-territory',1.15]]),
     catFactor('assetType','Asset Type','rate','commercial',[['commercial','Commercial Property',1.00],['infrastructure','Critical Infrastructure',1.25],['retail','Retail/Hospitality',1.10],['industrial','Industrial',0.90],['government','Government',1.20]]),
     catFactor('location','Location Risk','rate','urban',[['rural','Rural',0.70],['suburban','Suburban',0.85],['urban','Urban',1.00],['city_centre','City Centre',1.20],['landmark','Landmark/High Profile',1.50]]),
     catFactor('cover','Coverage Scope','rate','property',[['property','Property Damage Only',1.00],['prop_bi','Property + BI',1.30],['full','Full Terror (incl. CBRN)',1.50]])],
    {admin:3000,claims:20000,overhead:1500,fraud:0,expectedClaims:0.005,_defaultExposure:100000000},{commission:0.20,reinsurance:0.10},0.05);
});

// --- Event Cancellation ---
['PC','PA','PN','PU','PZ'].forEach(function(c,i) {
  var labels = ['Event Cancellation','Event — Abandonment','Event — Non-Appearance','Event — Prize Indemnity','Event — Excess/Contingency'];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','eventCost','Event Cost / Prize (£)','Total insured event costs or prize value',[0.015,0.020,0.012,0.008,0.010][i],
    [catFactor('eventType','Event Type','rate','conference',[['conference','Conference/Exhibition',0.85],['concert','Concert/Festival',1.00],['sport','Sporting Event',1.10],['wedding','Wedding',0.80],['film','Film/TV Production',1.15],['award','Awards/Ceremony',0.90]]),
     catFactor('venue','Venue Type','rate','indoor',[['indoor','Indoor (purpose-built)',0.85],['indoor_converted','Indoor (converted)',1.00],['outdoor_covered','Outdoor (covered)',1.10],['outdoor_open','Outdoor (open-air)',1.25]]),
     catFactor('weatherExposure','Weather Exposure','rate','moderate',[['low','Low (indoor)',0.80],['moderate','Moderate',1.00],['high','High (outdoor summer)',1.20],['extreme','Extreme (winter/monsoon)',1.50]]),
     catFactor('cancellationScope','Cancellation Scope','rate','standard',[['named_perils','Named Perils',0.75],['standard','Standard (excl. communicable disease)',1.00],['broad','Broad (incl. government order)',1.25],['comprehensive','Comprehensive',1.50]])],
    {admin:500,claims:5000,overhead:300,fraud:0,expectedClaims:0.03,_defaultExposure:1000000},{commission:0.25,reinsurance:0.05},0.05);
});

// --- Agriculture ---
['HA','AG'].forEach(function(c,i) {
  var labels = ['Agriculture — Crop (Named Perils)','Agriculture — Multi-Peril Crop (MPCI)'];
  schemas[c] = makeROVSchema(c,labels[i],'USD','cropValue','Expected Crop Value ($)','Insured crop value/revenue',[0.060,0.080][i],
    [catFactor('cropType','Crop Type','rate','cereals',[['cereals','Cereals (wheat/barley)',1.00],['oilseeds','Oilseeds (soy/canola)',1.05],['fruits','Fruit/Vegetables',1.25],['cotton','Cotton',1.10],['sugar','Sugar Cane/Beet',0.90],['forestry','Forestry/Timber',0.75]]),
     catFactor('peril','Primary Peril','rate','multi',[['hail','Hail Only',0.60],['frost','Frost/Freeze',0.70],['drought','Drought',0.90],['multi','Multi-Peril',1.00],['revenue','Revenue Protection',1.20]]),
     catFactor('region','Region','rate','temperate',[['temperate','Temperate (EU/US Midwest)',1.00],['tropical','Tropical',1.15],['arid','Arid/Semi-Arid',1.25],['monsoon','Monsoon',1.30]]),
     catFactor('irrigation','Irrigation','rate','rainfed',[['irrigated','Fully Irrigated',0.75],['partial','Partially Irrigated',0.90],['rainfed','Rainfed',1.00]])],
    {admin:500,claims:3000,overhead:300,fraud:0,expectedClaims:0.10,_defaultExposure:5000000},{commission:0.25,reinsurance:0.08},0.05);
});

// --- Livestock & Bloodstock ---
['NB','NX'].forEach(function(c,i) {
  var labels = ['Livestock/Bloodstock — Primary','Livestock/Bloodstock — Excess'];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','animalValue','Animal Value (£)','Insured value of animal(s)',[0.040,0.020][i],
    [catFactor('animalType','Animal Type','rate','horse',[['thoroughbred','Thoroughbred Racehorse',1.30],['horse','Sport/Leisure Horse',1.00],['stallion','Stallion (stud)',1.15],['cattle','Cattle (dairy/beef)',0.80],['livestock','Other Livestock',0.75]]),
     catFactor('use','Use','rate','sport',[['racing','Racing',1.30],['sport','Sport/Competition',1.00],['breeding','Breeding',1.10],['pleasure','Pleasure/Leisure',0.85],['commercial','Commercial (dairy/beef)',0.75]]),
     catFactor('cover','Coverage','rate','mortality',[['mortality','Mortality Only',1.00],['full','Full (incl. loss of use)',1.40],['fertility','Fertility Cover',1.25],['transit','Transit Only',0.60]]),
     catFactor('vetRecord','Veterinary Record','rate','good',[['excellent','Excellent (full history)',0.85],['good','Good',1.00],['limited','Limited',1.15],['concerns','Concerns/pre-existing',1.40]])],
    {admin:200,claims:2000,overhead:100,fraud:0,expectedClaims:0.05,_defaultExposure:100000},{commission:0.30,reinsurance:0.03},0.05);
});

// --- Fine Art, Specie & Jewellery ---
['FA','GS','JB','CT'].forEach(function(c,i) {
  var labels = ['Fine Art','Specie/Bullion','Jewellers Block','Cash in Transit'];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','insuredValue','Insured Value (£)','Total agreed value',[0.003,0.002,0.005,0.008][i],
    [catFactor('itemType','Item Type','rate','art',[['old_masters','Old Masters/Museum Quality',0.80],['art','Contemporary Art',1.00],['antiques','Antiques/Collectibles',1.05],['jewellery','Jewellery/Gems',1.15],['bullion','Bullion/Precious Metals',0.85],['wine','Fine Wine',1.00]]),
     catFactor('location','Storage/Display','rate','museum',[['vault','Bank Vault/Secure Storage',0.70],['museum','Museum (climate controlled)',0.85],['gallery','Gallery/Showroom',1.00],['private','Private Residence',1.10],['transit','In Transit',1.25]]),
     catFactor('security','Security Level','rate','good',[['excellent','Excellent (CCTV+alarm+guard)',0.80],['good','Good (alarm+CCTV)',1.00],['standard','Standard',1.15],['basic','Basic',1.35]]),
     catFactor('transit','Transit Frequency','rate','occasional',[['static','Static Only',0.80],['occasional','Occasional Transit',1.00],['frequent','Frequent Transit/Exhibition',1.20],['touring','Touring Exhibition',1.40]])],
    {admin:500,claims:5000,overhead:300,fraud:0,expectedClaims:0.02,_defaultExposure:5000000},{commission:0.25,reinsurance:0.05},0.05);
});

// --- Space ---
['SC','SL','SO'].forEach(function(c,i) {
  var labels = ['Space — Launch','Space — In-Orbit (Satellite)','Space — Third-Party Liability'];
  schemas[c] = makeROVSchema(c,labels[i],'USD','insuredValue','Insured Value ($)','Satellite/launch value',[0.08,0.015,0.005][i],
    [catFactor('missionType','Mission Type','rate','geo_comms',[['geo_comms','GEO Communications',1.00],['leo_constellation','LEO Constellation',1.15],['earth_observation','Earth Observation',0.95],['scientific','Scientific/Government',0.90],['crewed','Crewed Mission',1.50]]),
     catFactor('launchVehicle','Launch Vehicle','rate','proven',[['proven','Proven (Falcon 9/Ariane)',0.85],['heritage','Heritage (Atlas/Soyuz)',1.00],['new','New/Limited Track Record',1.40],['reusable','Reusable (2nd+ flight)',0.80]]),
     catFactor('manufacturer','Satellite Manufacturer','rate','tier1',[['tier1','Tier 1 (Airbus/Boeing/SSL)',0.90],['tier2','Tier 2 (Thales/NorthropG)',1.00],['tier3','Tier 3 / New Space',1.25]]),
     catFactor('designLife','Design Life','rate','standard',[['short','Short (<5 years)',0.85],['standard','Standard (5-15 years)',1.00],['extended','Extended (>15 years)',1.20]])],
    {admin:20000,claims:100000,overhead:10000,fraud:0,expectedClaims:0.01,_defaultExposure:300000000},{commission:0.15,reinsurance:0.15},0.05);
});

// --- Nuclear ---
['NP','NL','NV'].forEach(function(c,i) {
  var labels = ['Nuclear — Property','Nuclear — Liability','Nuclear — Decommissioning'];
  schemas[c] = makeROVSchema(c,labels[i],'USD','insuredValue','Insured Value / Limit ($)','TIV or liability limit',[0.0012,0.0020,0.0008][i],
    [catFactor('facilityType','Facility Type','rate','pwr',[['pwr','PWR (Pressurised Water)',1.00],['bwr','BWR (Boiling Water)',1.05],['smr','SMR (Small Modular)',0.85],['research','Research Reactor',0.75],['fuel_cycle','Fuel Cycle Facility',1.15],['decommissioning','Decommissioning',0.90]]),
     catFactor('regulatory','Regulatory Standing','rate','good',[['excellent','Excellent (no findings)',0.80],['good','Good',1.00],['standard','Standard',1.10],['concerns','Regulatory Concerns',1.40]]),
     catFactor('operatingHistory','Operating History','rate','strong',[['exemplary','Exemplary (20+ yr clean)',0.85],['strong','Strong',1.00],['average','Average',1.10],['new','New Build/First-of-Kind',1.25]]),
     catFactor('territory','Territory','rate','developed',[['us','United States (NRC)',1.00],['uk','UK (ONR)',0.95],['eu','EU',1.00],['asia','Asia',1.10]])],
    {admin:25000,claims:200000,overhead:15000,fraud:0,expectedClaims:0.005,_defaultExposure:1000000000},{commission:0.15,reinsurance:0.15},0.05);
});

// --- Film & Entertainment ---
schemas.PF = makeROVSchema('PF','Film & Entertainment Production','GBP','productionBudget','Production Budget (£)','Total production budget',0.015,
  [catFactor('productionType','Production Type','rate','feature',[['feature','Feature Film',1.00],['tv_series','TV Series',0.90],['commercial','Commercial/Ad',0.75],['documentary','Documentary',0.80],['live_event','Live Event/Concert',1.15]]),
   catFactor('territory','Filming Territory','rate','uk',[['uk','UK/Studio',1.00],['us','US',1.05],['eu','Europe',1.00],['developing','Developing Country',1.25],['remote','Remote/Extreme',1.40]]),
   catFactor('stunts','Stunts/Special Effects','rate','minimal',[['none','None',0.80],['minimal','Minimal',1.00],['moderate','Moderate',1.15],['heavy','Heavy/Pyrotechnics',1.35],['extreme','Extreme/Aerial',1.50]]),
   catFactor('castDependency','Cast Dependency','rate','moderate',[['ensemble','Ensemble (no key person)',0.85],['moderate','Moderate',1.00],['single_star','Single Star dependent',1.20],['irreplaceable','Irreplaceable talent',1.40]])],
  {admin:2000,claims:10000,overhead:1000,fraud:0,expectedClaims:0.04,_defaultExposure:10000000},{commission:0.25,reinsurance:0.05},0.05);

// --- Legal Expenses ---
schemas.LE = makeROVSchema('LE','Legal Expenses Insurance','GBP','policyLimit','Policy Limit (£)','Legal costs limit',0.010,
  [catFactor('clientType','Client Type','rate','sme',[['individual','Individual/Consumer',0.80],['sme','SME',1.00],['corporate','Corporate',1.10],['commercial','Commercial Fleet/Block',0.90]]),
   catFactor('coverScope','Coverage Scope','rate','standard',[['employment','Employment Only',0.75],['standard','Standard (employment + contract + property)',1.00],['comprehensive','Comprehensive (all disputes)',1.25],['commercial','Commercial Disputes',1.15]]),
   catFactor('territory','Jurisdiction','rate','uk',[['uk','UK',1.00],['eu','EU',1.05],['international','International',1.20]]),
   catFactor('claimsHistory','Claims History','rate','clean',[['clean','Clean',0.85],['standard','Standard',1.00],['frequent','Frequent',1.25]])],
  {admin:200,claims:2000,overhead:100,fraud:0,expectedClaims:0.06,_defaultExposure:100000},{commission:0.30,reinsurance:0.03},0.05);

// --- Temp Life & Health ---
schemas.TL = makeROVSchema('TL','Temporary Life Insurance','GBP','sumAssured','Sum Assured (£)','Death benefit',0.002,
  [bandFactor('age','Age (years)','rate',40,[{min:18,max:30,factor:0.50},{min:30,max:40,factor:1.00},{min:40,max:50,factor:1.60},{min:50,max:60,factor:2.50},{min:60,max:70,factor:4.00},{min:70,max:85,factor:7.00}]),
   catFactor('smoking','Smoking Status','rate','non_smoker',[['non_smoker','Non-Smoker',1.00],['ex_smoker','Ex-Smoker (12m+)',1.20],['smoker','Smoker',1.60]]),
   catFactor('occupation','Occupation Class','rate','standard',[['sedentary','Sedentary/Office',0.90],['standard','Standard',1.00],['manual','Manual',1.30],['hazardous','Hazardous',1.80]]),
   bandFactor('term','Term (years)','rate',20,[{min:1,max:5,factor:0.70},{min:5,max:15,factor:0.90},{min:15,max:25,factor:1.00},{min:25,max:40,factor:1.10}])],
  {admin:50,claims:500,overhead:30,fraud:0,expectedClaims:0.005,_defaultExposure:500000},{commission:0.30,reinsurance:0.05},0.05);

// --- DIC ---
schemas.DC = makeROVSchema('DC','Difference in Conditions','GBP','tiv','TIV (£)','Total insured value',0.0008,
  [catFactor('primaryProgramme','Primary Programme Origin','rate','local',[['master','Master Programme (controlled)',0.85],['local','Local Market Programme',1.00],['freedom','Freedom of Service',1.05],['non_admitted','Non-Admitted',1.15]]),
   catFactor('gapRisk','DIC/DIL Gap Risk','rate','moderate',[['narrow','Narrow (minor differences)',0.80],['moderate','Moderate',1.00],['wide','Wide (significant gaps)',1.25],['unknown','Unknown/Unconfirmed',1.40]]),
   catFactor('territory','Territory','rate','international',[['eu','EU (adequate regulation)',0.90],['international','International',1.00],['developing','Developing Markets',1.15]]),
   catFactor('propertyType','Property Type','rate','commercial',[['commercial','Commercial',1.00],['industrial','Industrial',1.10],['special','Special/Complex',1.20]])],
  {admin:3000,claims:15000,overhead:1500,fraud:0,expectedClaims:0.02,_defaultExposure:50000000},{commission:0.22,reinsurance:0.05},0.05);

// --- Aviation War ---
schemas.RX = makeROVSchema('RX','Aviation War & Confiscation','USD','fleetValue','Fleet Value ($)','Total fleet agreed value',0.0003,
  [catFactor('operatorType','Operator Type','rate','airline',[['airline','Commercial Airline',1.00],['ga','General Aviation',1.10],['government','Government/Military',0.90],['cargo','Cargo Only',0.95]]),
   catFactor('routeExposure','Route Exposure','rate','standard',[['low_risk','Low Risk Routes Only',0.70],['standard','Standard International',1.00],['conflict_adjacent','Conflict-Adjacent Routes',1.30],['conflict_zone','Conflict Zone Transit',2.00]]),
   catFactor('confiscation','Confiscation Risk','rate','standard',[['low','Low',0.80],['standard','Standard',1.00],['elevated','Elevated',1.30],['sanctioned','Sanctioned Territory Exposure',2.00]]),
   catFactor('limitBasis','Limit Basis','rate','avnwar',[['avnwar','AVN52H Standard',1.00],['enhanced','Enhanced (CBRN sub)',1.15],['restricted','Restricted',0.85]])],
  {admin:8000,claims:50000,overhead:3000,fraud:0,expectedClaims:0.005,_defaultExposure:3200000000},{commission:0.18,reinsurance:0.10},0.05);

// --- Financial Lines Misc ---
['FM','TT','SB','FG'].forEach(function(c,i) {
  var labels = ['Mortgage Indemnity','Title Insurance','Surety Bond','Financial Guarantee'];
  schemas[c] = makeROVSchema(c,labels[i],'GBP','exposureValue','Exposure Value (£)','Insured amount/bond value',[0.003,0.002,0.008,0.004][i],
    [catFactor('transactionType','Transaction Type','rate','standard',[['residential','Residential',0.85],['commercial','Commercial',1.00],['development','Development/Construction',1.15],['infrastructure','Infrastructure/PPP',1.05]]),
     catFactor('counterpartyRating','Counterparty Quality','rate','investment_grade',[['strong','Strong (A+)',0.80],['investment_grade','Investment Grade',1.00],['sub_ig','Sub-IG',1.30],['unrated','Unrated',1.20]]),
     catFactor('tenor','Tenor','rate','medium',[['short','Short (<2yr)',0.85],['medium','Medium (2-5yr)',1.00],['long','Long (5-10yr)',1.20],['very_long','Very Long (>10yr)',1.40]]),
     catFactor('jurisdiction','Jurisdiction','rate','uk',[['uk','UK',1.00],['eu','EU',1.05],['us','US',1.10],['international','International',1.15]])],
    {admin:2000,claims:15000,overhead:1000,fraud:0,expectedClaims:0.02,_defaultExposure:10000000},{commission:0.22,reinsurance:0.05},0.05);
});


// ===== GENERATE FILES =====

var skipHubs = ['aviation','extended-warranty'];

// A hub's real folder is the first segment of its "url", not its id. For 9 hubs
// these differ (id "pi-legal" -> url "pi-eo/overview.html"), so keying on id
// wrote each rater into an orphan stub folder nothing links to, while the real
// hub kept a rater this generator never refreshed.
//
// Folders are therefore grouped, not iterated one entry at a time: pi-eo is
// served by TWO entries (pi-legal E2,E3 and pi-accountants E4,E5) whose codes
// must merge into a single rater. Writing per entry would have the second
// overwrite the first and drop E2/E3.
var folderNames = {
  // Folders serving more than one hub-index entry need a name covering both,
  // since neither entry's own name does. Matches the existing pi-eo pages.
  'pi-eo': 'Professional Indemnity E&O'
};

var groups = [];
var byFolder = {};
hubs.forEach(function (entry) {
  if (skipHubs.indexOf(entry.id) !== -1) return;
  var folder = (entry.url || (entry.id + '/')).split('/')[0];
  if (!byFolder[folder]) {
    byFolder[folder] = {
      id: entry.id,            // first entry's id: drives themes[] lookup
      folder: folder,
      name: folderNames[folder] || entry.name,
      risk_codes: []
    };
    groups.push(byFolder[folder]);
  }
  entry.risk_codes.forEach(function (code) {
    if (byFolder[folder].risk_codes.indexOf(code) === -1) {
      byFolder[folder].risk_codes.push(code);
    }
  });
});

groups.forEach(function(hub) {

  var hubDir = path.join(__dirname, hub.folder);
  var rtDir = path.join(hubDir, 'rate-tables');
  if (!fs.existsSync(rtDir)) fs.mkdirSync(rtDir, { recursive: true });

  var hubSchemas = [];
  var hubSchemaJson = [];
  hub.risk_codes.forEach(function(code) {
    var s = schemas[code];
    if (!s) {
      console.warn('No schema for ' + code + ' in hub ' + hub.id);
      return;
    }
    var schemaJson = JSON.stringify(s, null, 2);
    fs.writeFileSync(path.join(rtDir, code + '.json'), schemaJson);
    hubSchemas.push(code);
    hubSchemaJson.push(schemaJson);
  });

  if (hubSchemas.length === 0) return;

  var theme = themes[hub.folder] || themes[hub.id] || { primary:'#1a4a7a', dark:'#0d2d5a', light:'#eef3fa', accent:'#c8a84b', gradient:'linear-gradient(135deg,#0d2240 0%,#1a4a7a 55%,#003070 100%)', sub:'#b8cce0' };

  var codeList = hubSchemas.join(' · ');
  var inlineSchemas = hubSchemaJson.join(',\n');

  var hasReferences = fs.existsSync(path.join(hubDir, 'references.html'));

  var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <link rel="stylesheet" href="../hub-styles.css">\n  <link rel="stylesheet" href="../shared/rater-styles.css">\n  <title>' + hub.name + ' — Rater | Risk Code Hub</title>\n  <style>\n    :root {\n      --hub-primary:   ' + theme.primary + ';\n      --hub-dark:      ' + theme.dark + ';\n      --hub-light:     ' + theme.light + ';\n      --hub-accent:    ' + theme.accent + ';\n' + (theme.secondary ? '      --hub-secondary: ' + theme.secondary + ';\n' : '') + '      --header-gradient: ' + theme.gradient + ';\n      --header-sub:    ' + theme.sub + ';\n    }\n  </style>\n</head>\n<body>\n\n<header>\n  <div class="breadcrumb">\n    <a href="../index.html">Risk Code Hub</a> ›\n    <a href="overview.html">' + hub.name + '</a> ›\n    Rater\n  </div>\n  <div class="tag">Lloyd\'s Risk Code' + (hubSchemas.length > 1 ? 's' : '') + ' ' + codeList + '</div>\n  <h1>' + hub.name + ' — Rating Tool</h1>\n  <p>Factor-based rating engine for ' + hub.name.toLowerCase() + ' insurance products. Base vs proposed comparison with P&amp;L waterfall analysis.</p>\n</header>\n\n<nav>\n  <a href="overview.html">Overview</a>\n  <a href="history.html">History</a>\n  <a href="timeline.html">Timeline</a>\n  <a href="database.html">Loss Database</a>\n  <a href="underwriting.html">Underwriting</a>\n  <a href="rates-analysis.html">Rates &amp; ROE</a>\n  <a href="risk-mitigation.html">Risk Mitigation</a>\n  <a href="global-program.html">Global Programme</a>\n' + (hasReferences ? '  <a href="references.html">References</a>\n' : '') + '  <a href="rater.html" class="active">Rater</a>\n  <a href=\"../programme-builder.html?code=' + hub.risk_codes[0] + '\">Programme Builder</a>\n</nav>\n\n<div id="rater-root"></div>\n\n<footer>\n  <p>' + hub.name + ' <a href="../index.html" style="color:#c8a84b;text-decoration:none;font-weight:600;">&larr; Risk Code Hub</a> — Rating Tool &copy; 2026</p>\n</footer>\n\n<script src="../shared/rater-engine.js"></script>\n<script src="../shared/rater-ui.js"></script>\n<script>\n(function () {\n  var schemas = [\n' + inlineSchemas + '\n  ];\n  RaterUI.init(document.getElementById("rater-root"), schemas, RaterEngine);\n})();\n</script>\n</body>\n</html>';

  fs.writeFileSync(path.join(hubDir, 'rater.html'), html);
  console.log('Generated: ' + hub.folder + '/rater.html (' + hubSchemas.join(' ') + ')');
});

console.log('\nDone!');
