'use strict';

var engine = require('./rater-engine');

var passed = 0;
var failed = 0;

function assert(label, actual, expected, tolerance) {
  tolerance = tolerance || 0.02;
  if (Math.abs(actual - expected) <= tolerance) {
    passed++;
  } else {
    failed++;
    console.error('FAIL: ' + label + ' — expected ' + expected + ', got ' + actual);
  }
}

// --- Rate-on-Value model (Aviation Hull H2) ---
var h2Schema = {
  riskCode: 'H2',
  label: 'Airline Hull — All Risks',
  modelType: 'rate-on-value',
  currency: 'USD',
  exposureMeasure: { key: 'fleetValue', label: 'Fleet Agreed Value ($)' },
  baseRate: { key: 'baseROL', label: 'Base ROL', value: 0.003 },
  ratingFactors: [
    { key: 'fleetType', label: 'Fleet Composition', type: 'categorical', appliesTo: 'rate',
      options: { wide_body: { label: 'Wide Body', factor: 0.85 }, narrow_body: { label: 'Narrow Body', factor: 1.00 }, mixed: { label: 'Mixed Fleet', factor: 0.95 }, ga: { label: 'General Aviation', factor: 1.40 } },
      defaultValue: 'narrow_body' },
    { key: 'safetyRating', label: 'Safety / IOSA', type: 'categorical', appliesTo: 'rate',
      options: { iosa_certified: { label: 'IOSA Certified', factor: 0.90 }, standard: { label: 'Standard', factor: 1.00 }, elevated_risk: { label: 'Elevated Risk', factor: 1.30 } },
      defaultValue: 'standard' },
    { key: 'lossRatio5yr', label: 'Loss History (5yr avg LR)', type: 'band', appliesTo: 'rate',
      bands: [
        { min: 0, max: 0.3, factor: 0.85, label: 'Good (<30%)' },
        { min: 0.3, max: 0.6, factor: 1.00, label: 'Average (30-60%)' },
        { min: 0.6, max: 1.0, factor: 1.25, label: 'Poor (60-100%)' },
        { min: 1.0, max: 99, factor: 1.60, label: 'Very Poor (>100%)' }
      ],
      defaultValue: 0.4 }
  ],
  fixedCosts: {
    policyAdminPerYear: 5000,
    claimsHandlingPerClaim: 25000,
    systemOverheadPerYear: 2000,
    fraudReservePerClaim: 0,
    expectedClaimsPerYear: 0.02,
    obsolescenceRate: 0
  },
  variableCosts: { commissionRate: 0.20, reinsuranceRate: 0.05 },
  targetProfitMargin: 0.05
};

var h2Result = engine.rate(h2Schema, {
  fleetValue: 3200000000,
  termYears: 1,
  fleetType: 'wide_body',
  safetyRating: 'iosa_certified',
  lossRatio5yr: 0.4
});

// baseRate 0.003 * 0.85 (wide) * 0.90 (iosa) * 1.00 (avg loss) = 0.002295
assert('H2 adjusted rate', h2Result.lossModel.adjustedRate, 0.002295, 0.000001);
// purePremium = 3.2bn * 0.002295 = 7,344,000
assert('H2 pure premium', h2Result.lossModel.totalPurePremium, 7344000, 1);
// fixed: 5000 + 25000*0.02 + 2000 + 0 + 0 = 7500
assert('H2 total fixed', h2Result.costs.totalFixed, 7500, 1);
// totalCost = 7344000 + 7500 = 7351500
assert('H2 total cost', h2Result.costs.totalCost, 7351500, 1);
// gross = 7351500 / (1 - 0.25 - 0.05) = 7351500 / 0.70 = 10,502,142.86
assert('H2 gross premium', h2Result.grossPremium, 10502142.86, 1);
// loss ratio = 7344000 / 10502142.86 = 0.6993
assert('H2 loss ratio', h2Result.ratios.lossRatio, 0.6993, 0.001);


// --- Frequency-Severity model (Extended Warranty) ---
var ewSchema = {
  riskCode: 'EW1',
  label: 'Extended Warranty — Smartphones',
  modelType: 'frequency-severity',
  currency: 'GBP',
  baseFrequency: 0.08,
  baseSeverity: 220,
  ratingFactors: [
    { key: 'brandTier', label: 'Brand Tier', type: 'categorical', appliesTo: 'frequency',
      options: { high: { label: 'High Reliability', factor: 0.75 }, mid: { label: 'Mid', factor: 1.00 }, low: { label: 'Low', factor: 1.30 } },
      defaultValue: 'mid' },
    { key: 'deviceAge', label: 'Device Age (days)', type: 'band', appliesTo: 'frequency',
      bands: [
        { min: 0, max: 30, factor: 1.00 },
        { min: 31, max: 90, factor: 1.10 },
        { min: 91, max: 180, factor: 1.20 },
        { min: 181, max: 365, factor: 1.40 }
      ],
      defaultValue: 0 },
    { key: 'priceBand', label: 'Device Price (£)', type: 'band', appliesTo: 'severity',
      bands: [
        { min: 0, max: 250, factor: 0.85 },
        { min: 250, max: 500, factor: 1.00 },
        { min: 500, max: 1000, factor: 1.10 },
        { min: 1000, max: 2000, factor: 1.25 }
      ],
      defaultValue: 800 }
  ],
  fixedCosts: {
    policyAdminPerYear: 6,
    claimsHandlingPerClaim: 18,
    systemOverheadPerYear: 3,
    fraudReservePerClaim: 8,
    obsolescenceRate: 0.008
  },
  variableCosts: { commissionRate: 0.32, reinsuranceRate: 0.02 },
  targetProfitMargin: 0.05
};

var ewResult = engine.rate(ewSchema, {
  termYears: 2,
  brandTier: 'mid',
  deviceAge: 0,
  priceBand: 800,
  assetValue: 800
});

// freq: 0.08 * 1.0 (mid) * 1.0 (new) = 0.08
assert('EW adj frequency', ewResult.lossModel.adjustedFrequency, 0.08);
// sev: 220 * 1.10 (500-1000) = 242
assert('EW adj severity', ewResult.lossModel.adjustedSeverity, 242);
// pure: 0.08 * 242 * 2 = 38.72
assert('EW pure premium', ewResult.lossModel.totalPurePremium, 38.72);
// fixed: admin 12 + claims 0.08*18*2=2.88 + overhead 6 + fraud 0.08*8*2=1.28 + obs 800*0.008*2=12.80 = 34.96
assert('EW total fixed', ewResult.costs.totalFixed, 34.96);
// total cost: 38.72 + 34.96 = 73.68
assert('EW total cost', ewResult.costs.totalCost, 73.68);
// gross = 73.68 / (1 - 0.34 - 0.05) = 73.68 / 0.61 = 120.79
assert('EW gross premium', ewResult.grossPremium, 120.79, 0.05);


// --- Test overrides ---
var ewOverride = engine.rate(ewSchema, {
  termYears: 2, brandTier: 'mid', deviceAge: 0, priceBand: 800, assetValue: 800
}, { baseFrequency: 0.10 });

assert('Override: higher freq', ewOverride.lossModel.adjustedFrequency, 0.10);
assert('Override: higher premium', ewOverride.grossPremium > ewResult.grossPremium ? 1 : 0, 1);


// --- Waterfall integrity ---
var wfCheck = h2Result.waterfall.netPremium - h2Result.waterfall.expectedClaims
  - h2Result.waterfall.claimsHandling - h2Result.waterfall.policyAdmin
  - h2Result.waterfall.systemOverhead - h2Result.waterfall.fraudReserve
  - h2Result.waterfall.obsolescence;
assert('Waterfall sums to UW result', wfCheck, h2Result.waterfall.underwritingResult, 1);

// --- Combined ratio = loss + expense ---
assert('CR = LR + ER', ewResult.ratios.combinedRatio, ewResult.ratios.lossRatio + ewResult.ratios.expenseRatio, 0.001);


// --- Tax stage: backward compatibility (no tax => customer == gross) ---
assert('No tax: customer premium == gross', h2Result.customerPremium, h2Result.grossPremium, 1);
assert('No tax: tax is zero', h2Result.waterfall.tax, 0, 0.01);

// --- Golden master: Cyber SME rate-on-value (workbench Phase-1 preset) ---
var cyberSchema = {
  riskCode: 'CY-WB', label: 'Cyber SME (workbench preset)', modelType: 'rate-on-value', currency: 'GBP',
  exposureMeasure: { key: 'policyLimit', label: 'Policy limit (£)' },
  baseRate: { key: 'baseRate', value: 0.015 },
  ratingFactors: [
    { key: 'sector', label: 'Sector', type: 'categorical', appliesTo: 'rate', defaultValue: 'healthcare',
      options: { healthcare: { label: 'Healthcare', factor: 1.5 }, manufacturing: { label: 'Manufacturing', factor: 1.0 } } },
    { key: 'mfa', label: 'MFA', type: 'categorical', appliesTo: 'rate', defaultValue: 'emailRA',
      options: { emailRA: { label: 'Email + remote access', factor: 0.9 }, none: { label: 'None', factor: 1.6 } } }
  ],
  fixedCosts: { policyAdminPerYear: 250, claimsHandlingPerClaim: 0, systemOverheadPerYear: 0, fraudReservePerClaim: 0, expectedClaimsPerYear: 0.05, obsolescenceRate: 0 },
  variableCosts: { commissionRate: 0.20, reinsuranceRate: 0 },
  targetProfitMargin: 0.08
};
var cy = engine.rate(cyberSchema,
  { policyLimit: 1000000, termYears: 1, sector: 'healthcare', mfa: 'emailRA' },
  { lossRatioScaler: 1.10, taxRate: 0.12 });
// base 0.015 * 1.5 * 0.9 = 0.02025 ; pure (unscaled) = 20,250
assert('Cyber unscaled pure premium', cy.lossModel.totalPurePremium, 20250, 1);
// loadings x1.10 => expected claims 22,275
assert('Cyber loaded expected claims', cy.waterfall.expectedClaims, 22275, 1);
// gross = (22275 + 250) / (1 - 0.20 - 0.08) = 22525 / 0.72 = 31,284.72
assert('Cyber gross premium', cy.grossPremium, 31284.72, 1);
// customer = gross * 1.12 (12% IPT) = 35,038.89
assert('Cyber customer premium (12% IPT)', cy.customerPremium, 35038.89, 1);
assert('Cyber tax amount', cy.waterfall.tax, 3754.17, 1);
assert('Cyber no guard-rail warnings', cy.warnings.length, 0, 0.5);

// --- Guard-rails (S5A) ---
var divBad = engine.rate(cyberSchema,
  { policyLimit: 1000000, termYears: 1, sector: 'healthcare', mfa: 'emailRA' },
  { commissionRate: 0.6, reinsuranceRate: 0.3, profitMargin: 0.2 });
assert('Guard-rail: divisor<=0 raises a warning', divBad.warnings.length > 0 ? 1 : 0, 1);

var negExp = engine.rate(cyberSchema,
  { policyLimit: -5000, termYears: 1, sector: 'healthcare', mfa: 'emailRA' });
assert('Guard-rail: negative exposure raises a warning',
  negExp.warnings.some(function (w) { return /negative/i.test(w); }) ? 1 : 0, 1);


// --- Commercial flex / rate adequacy (rung 6a) ---
// Backward compatibility: no flex => charged == technical, adequacy 100%
assert('No flex: rate adequacy 100%', cy.ratios.rateAdequacy, 1.0, 0.001);
assert('No flex: gross == technical', cy.grossPremium, cy.technicalPremium, 1);

// Flex +10% loading (technical premium held at 31,284.72)
var flexUp = engine.rate(cyberSchema,
  { policyLimit: 1000000, termYears: 1, sector: 'healthcare', mfa: 'emailRA' },
  { lossRatioScaler: 1.10, taxRate: 0.12, flexRate: 0.10 });
assert('Flex: technical premium unchanged by flex', flexUp.technicalPremium, 31284.72, 1);
assert('Flex +10%: charged gross premium', flexUp.grossPremium, 34413.19, 1);
assert('Flex +10%: rate adequacy 110%', flexUp.ratios.rateAdequacy, 1.10, 0.001);
assert('Flex +10%: customer premium (then 12% IPT)', flexUp.customerPremium, 38542.78, 1);
assert('Flex +10% (a loading) raises no deficiency warning', flexUp.warnings.length, 0, 0.5);

// Flex −15% discount => rate adequacy 85%, deficiency guard-rail fires
var flexDown = engine.rate(cyberSchema,
  { policyLimit: 1000000, termYears: 1, sector: 'healthcare', mfa: 'emailRA' },
  { lossRatioScaler: 1.10, taxRate: 0.12, flexRate: -0.15 });
assert('Flex −15%: rate adequacy 85%', flexDown.ratios.rateAdequacy, 0.85, 0.001);
assert('Flex −15%: charged gross premium', flexDown.grossPremium, 26592.01, 1);
assert('Flex −15%: rate adequacy = 1 + flexRate identity',
  flexDown.ratios.rateAdequacy, 1 + flexDown.costInputs.flexRate, 0.0001);
assert('Flex −15%: deficiency warning fires',
  flexDown.warnings.some(function (w) { return /below technical|rate adequacy/i.test(w); }) ? 1 : 0, 1);
assert('Flex: commercialFlex waterfall row = gross − technical',
  flexDown.waterfall.commercialFlex, flexDown.grossPremium - flexDown.technicalPremium, 1);


// ================= Phase 2b — Reinsurance =================

// --- normCdf against textbook values ---
assert('normCdf(0) = 0.5', engine.normCdf(0), 0.5, 0.0001);
assert('normCdf(1) = 0.8413', engine.normCdf(1), 0.8413, 0.0005);
assert('normCdf(1.96) = 0.975', engine.normCdf(1.96), 0.975, 0.0005);
assert('normCdf(-1) = 0.1587', engine.normCdf(-1), 0.1587, 0.0005);

// --- lognormalExcess: E[(L−0)+] = mean; decreasing in attachment ---
assert('lognormalExcess at d=0 equals mean', engine.lognormalExcess(6500000, 0.15, 0), 6500000, 1);
assert('lognormalExcess decreasing in attachment',
  engine.lognormalExcess(6500000, 0.15, 7000000) > engine.lognormalExcess(6500000, 0.15, 8000000) ? 1 : 0, 1);

// --- XoL layer (worked example C: £40m xs £35m, AAL £2.4m) ---
var xolSchema = { riskCode: 'XOL', label: 'Property Cat XoL', modelType: 'xol', currency: 'GBP', ratingFactors: [],
  fixedCosts: {}, variableCosts: { commissionRate: 0.10, reinsuranceRate: 0 }, targetProfitMargin: 0.05 };
var xol = engine.rate(xolSchema,
  { attachment: 35000000, limit: 40000000, expectedLossToLayer: 2400000, termYears: 1 },
  { lossRatioScaler: 1.35 });
assert('XoL pure premium = EL to layer', xol.lossModel.totalPurePremium, 2400000, 1);
assert('XoL loss-on-line 6%', xol.layer.lossOnLine, 0.06, 0.0001);
assert('XoL technical premium (risk load 1.35 + 15% gross-up)', xol.technicalPremium, 3811764.71, 1);
assert('XoL rate-on-line', xol.layer.rateOnLine, 0.0953, 0.0005);
assert('XoL payback years', xol.layer.payback, 10.49, 0.05);
var xolBad = engine.rate(xolSchema, { attachment: 35000000, limit: 40000000, expectedLossToLayer: 45000000, termYears: 1 });
assert('XoL guard-rail: EL exceeds limit warns',
  xolBad.warnings.some(function (w) { return /exceeds the limit/i.test(w); }) ? 1 : 0, 1);

// --- Aggregate stop-loss (lognormal): 75%–90% loss-ratio layer, ELR 65%, CV 15% ---
var slSchema = { riskCode: 'SL', label: 'Agg Stop-Loss', modelType: 'stop-loss', currency: 'GBP', ratingFactors: [],
  fixedCosts: {}, variableCosts: { commissionRate: 0.10, reinsuranceRate: 0 }, targetProfitMargin: 0.05 };
var sl = engine.rate(slSchema,
  { subjectPremium: 10000000, expectedLossRatio: 0.65, lossRatioCV: 0.15, attachmentLR: 0.75, limitLR: 0.15, termYears: 1 },
  { lossRatioScaler: 1.0 });
assert('Stop-loss expected aggregate loss', sl.lossModel.expectedAggregateLoss, 6500000, 1);
assert('Stop-loss geometry: attachment + limit = exit', sl.lossModel.attachment + sl.lossModel.limit, sl.lossModel.exit, 1);
assert('Stop-loss expected loss to layer (E[(L−a)+]−E[(L−b)+])', sl.lossModel.expectedLossToLayer, 87678.60, 5);
assert('Stop-loss rate-on-line', sl.layer.rateOnLine, 0.0688, 0.0005);
var slBad = engine.rate(slSchema, { subjectPremium: 0, expectedLossRatio: 0.65, lossRatioCV: 0.15, attachmentLR: 0.75, limitLR: 0.15 });
assert('Stop-loss guard-rail: zero subject premium warns', slBad.warnings.length > 0 ? 1 : 0, 1);

// --- Cat bond: multiple × EL = spread (profit override 0 for a clean multiple) ---
var cbSchema = { riskCode: 'CB', label: 'Cat Bond', modelType: 'cat-bond', currency: 'USD', ratingFactors: [],
  fixedCosts: {}, variableCosts: { commissionRate: 0, reinsuranceRate: 0 }, targetProfitMargin: 0 };
var cb = engine.rate(cbSchema,
  { principal: 100000000, expectedLossPct: 0.02, termYears: 1 },
  { lossRatioScaler: 2.5, profitMargin: 0, commissionRate: 0 });
assert('Cat-bond spread premium = multiple × EL', cb.grossPremium, 5000000, 1);
assert('Cat-bond spread % of principal', cb.layer.spread, 0.05, 0.0001);
assert('Cat-bond multiple = spread ÷ EL', cb.layer.multiple, 2.5, 0.01);
assert('Cat-bond investor expected profit %', cb.layer.expectedProfitPct, 0.03, 0.0001);

// --- Quota share (proportional cession): 30% of £20m, 60% LR, 25% ceding + 2% broke + 20% PC ---
var qs = engine.rate({ riskCode: 'QS', label: 'Quota Share', modelType: 'quota-share', currency: 'GBP' },
  { subjectPremium: 20000000, cededShare: 0.30, expectedLossRatio: 0.60, cedingCommission: 0.25, brokerage: 0.02, profitCommission: 0.20, reinsurerExpenseRate: 0.03, termYears: 1 });
assert('QS ceded premium', qs.grossPremium, 6000000, 1);
assert('QS expected losses', qs.cession.expectedLosses, 3600000, 1);
assert('QS profit commission (20% of profit after mgmt allowance)', qs.cession.profitCommission, 144000, 1);
assert('QS reinsurer result', qs.cession.reinsurerResult, 456000, 1);
assert('QS combined ratio', qs.ratios.combinedRatio, 0.924, 0.001);
assert('QS margin %', qs.ratios.marginPct, 0.076, 0.001);
var qsBad = engine.rate({ riskCode: 'QS', label: 'QS', modelType: 'quota-share', currency: 'GBP' },
  { subjectPremium: 20000000, cededShare: 0.30, expectedLossRatio: 0.85, cedingCommission: 0.30, brokerage: 0.02, profitCommission: 0, reinsurerExpenseRate: 0.03, termYears: 1 });
assert('QS guard-rail: unprofitable cession (combined > 100%) warns',
  qsBad.warnings.some(function (w) { return /lose money|exceeds 100/i.test(w); }) ? 1 : 0, 1);
var qsShare = engine.rate({ riskCode: 'QS', label: 'QS', modelType: 'quota-share', currency: 'GBP' },
  { subjectPremium: 20000000, cededShare: 1.5, expectedLossRatio: 0.60 });
assert('QS guard-rail: share outside 0–100% warns',
  qsShare.warnings.some(function (w) { return /share/i.test(w); }) ? 1 : 0, 1);


// --- Guard-rails: unrealistic reinsurance layers ---
var xolNegAtt = engine.rate(xolSchema, { attachment: -1000000, limit: 40000000, expectedLossToLayer: 2400000, termYears: 1 });
assert('XoL guard-rail: negative attachment warns',
  xolNegAtt.warnings.some(function (w) { return /attachment cannot be negative/i.test(w); }) ? 1 : 0, 1);

var xolZeroEL = engine.rate(xolSchema, { attachment: 35000000, limit: 40000000, expectedLossToLayer: 0, termYears: 1 });
assert('XoL guard-rail: zero expected loss to layer warns',
  xolZeroEL.warnings.some(function (w) { return /priced on risk load/i.test(w); }) ? 1 : 0, 1);

// EL (900k) < limit (1m) so the EL>limit rail stays silent — this isolates the rate-on-line rail
var xolHotRoL = engine.rate(xolSchema, { attachment: 5000000, limit: 1000000, expectedLossToLayer: 900000, termYears: 1 });
assert('XoL guard-rail: rate-on-line > 100% warns',
  xolHotRoL.warnings.some(function (w) { return /rate-on-line exceeds 100/i.test(w); }) ? 1 : 0, 1);
// regression: the clean worked example (C) trips none of the new rails
assert('XoL clean layer: no new guard-rail warnings', xol.warnings.length, 0, 0.5);

var slNegAtt = engine.rate(slSchema, { subjectPremium: 10000000, expectedLossRatio: 0.65, lossRatioCV: 0.15, attachmentLR: -0.1, limitLR: 0.15, termYears: 1 });
assert('Stop-loss guard-rail: negative attachment LR warns',
  slNegAtt.warnings.some(function (w) { return /attachment.*negative/i.test(w); }) ? 1 : 0, 1);

var cbLowMult = engine.rate(cbSchema, { principal: 100000000, expectedLossPct: 0.02, termYears: 1 },
  { lossRatioScaler: 0.8, profitMargin: 0, commissionRate: 0 });
assert('Cat-bond guard-rail: multiple below 1x warns',
  cbLowMult.warnings.some(function (w) { return /multiple is below 1/i.test(w); }) ? 1 : 0, 1);
// regression: the clean cat bond (multiple 2.5) does not trip the rail
assert('Cat-bond clean: multiple >= 1 raises no warning',
  cb.warnings.some(function (w) { return /multiple is below 1/i.test(w); }) ? 1 : 0, 0);

// --- Phase 3: catastrophe load ---
var catCy = engine.rate(cyberSchema,
  { policyLimit: 1000000, termYears: 1, sector: 'healthcare', mfa: 'emailRA' },
  { lossRatioScaler: 1.10, catLoadRate: 0.20 });
// attritional 20,250 × 1.10 = 22,275 ; + 20% cat = 26,730 (cat portion 4,455)
assert('Cat load: expected claims include the 20% cat uplift', catCy.waterfall.expectedClaims, 26730, 1);
assert('Cat load: cat portion recorded', catCy.waterfall.catLoad, 4455, 1);
assert('Cat load: backward-compatible (default 0, no cat line)', cy.waterfall.catLoad, 0, 0.01);

// --- Phase 3: capital / ROE solver (profit% = targetROE × capitalRatio) ---
assert('ROE solver: 15% ROE on 60%-of-premium capital → 9% profit', engine.solveProfitMargin(0.15, 0.60), 0.09, 1e-9);
assert('ROE solver: zero capital → zero profit', engine.solveProfitMargin(0.15, 0), 0, 1e-9);

// --- Phase 3: credibility (square-root rule + blend) ---
assert('Credibility Z at the full standard = 1', engine.credibilityZ(1082, 1082), 1, 1e-9);
assert('Credibility Z at zero exposure = 0', engine.credibilityZ(0, 1082), 0, 1e-9);
assert('Credibility Z square-root rule (¼ of full → 0.5)', engine.credibilityZ(270.5, 1082), 0.5, 1e-6);
assert('Credibility Z caps at 1 above the full standard', engine.credibilityZ(5000, 1082), 1, 1e-9);
assert('Credibility blend = Z·experience + (1−Z)·complement', engine.credibilityBlend(100, 80, 0.7), 94, 1e-9);
assert('Credibility blend clamps Z to [0,1]', engine.credibilityBlend(100, 80, 1.5), 100, 1e-9);

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
