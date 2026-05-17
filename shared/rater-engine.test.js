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


console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
