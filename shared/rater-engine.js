'use strict';

(function (exports) {

  function loadSchema(json) {
    if (typeof json === 'string') json = JSON.parse(json);
    return json;
  }

  function lookupBand(bands, value) {
    for (var i = 0; i < bands.length; i++) {
      if (value >= bands[i].min && value < bands[i].max) return bands[i];
    }
    return bands[bands.length - 1];
  }

  function getFactorValue(factorDef, inputValue) {
    if (factorDef.type === 'categorical') {
      var opt = factorDef.options[inputValue];
      return opt ? opt.factor : 1.0;
    }
    if (factorDef.type === 'band') {
      var band = lookupBand(factorDef.bands, inputValue);
      return band ? band.factor : 1.0;
    }
    if (factorDef.type === 'numeric') {
      return inputValue !== undefined ? inputValue : 1.0;
    }
    return 1.0;
  }

  function rate(schema, input, overrides) {
    var o = overrides || {};
    var termYears = input.termYears || 1;

    var factorResults = [];
    var combinedFactor = 1.0;

    for (var i = 0; i < schema.ratingFactors.length; i++) {
      var fd = schema.ratingFactors[i];
      var key = fd.key;
      var raw = o[key] !== undefined ? o[key] : (input[key] !== undefined ? input[key] : fd.defaultValue);
      var factor = getFactorValue(fd, raw);
      if (o[key + '_factor'] !== undefined) factor = o[key + '_factor'];
      factorResults.push({ key: key, label: fd.label, inputValue: raw, factor: round4(factor) });
      combinedFactor *= factor;
    }

    var purePremium, lossModel;

    if (schema.modelType === 'rate-on-value') {
      var exposureBase = input[schema.exposureMeasure.key] || 0;
      var baseRate = o.baseRate !== undefined ? o.baseRate : schema.baseRate.value;
      var adjustedRate = baseRate * combinedFactor;
      var annualPurePremium = exposureBase * adjustedRate;
      purePremium = annualPurePremium * termYears;

      lossModel = {
        modelType: 'rate-on-value',
        exposureBase: round2(exposureBase),
        baseRate: round6(baseRate),
        combinedFactor: round4(combinedFactor),
        adjustedRate: round6(adjustedRate),
        annualPurePremium: round2(annualPurePremium),
        totalPurePremium: round2(purePremium),
        factors: factorResults
      };

    } else {
      var baseFrequency = o.baseFrequency !== undefined ? o.baseFrequency : schema.baseFrequency;
      var baseSeverity = o.baseSeverity !== undefined ? o.baseSeverity : schema.baseSeverity;

      var freqFactors = [];
      var sevFactors = [];
      var freqCombined = 1.0;
      var sevCombined = 1.0;

      for (var j = 0; j < factorResults.length; j++) {
        var fr = factorResults[j];
        var fd2 = schema.ratingFactors[j];
        if (fd2.appliesTo === 'severity') {
          sevFactors.push(fr);
          sevCombined *= fr.factor;
        } else {
          freqFactors.push(fr);
          freqCombined *= fr.factor;
        }
      }

      var adjustedFrequency = baseFrequency * freqCombined;
      var adjustedSeverity = baseSeverity * sevCombined;
      var annualPurePremiumFS = adjustedFrequency * adjustedSeverity;
      purePremium = annualPurePremiumFS * termYears;

      lossModel = {
        modelType: 'frequency-severity',
        baseFrequency: round4(baseFrequency),
        freqCombinedFactor: round4(freqCombined),
        adjustedFrequency: round4(adjustedFrequency),
        baseSeverity: round2(baseSeverity),
        sevCombinedFactor: round4(sevCombined),
        adjustedSeverity: round2(adjustedSeverity),
        annualPurePremium: round2(annualPurePremiumFS),
        totalPurePremium: round2(purePremium),
        frequencyFactors: freqFactors,
        severityFactors: sevFactors
      };
    }

    // --- Fixed costs ---
    var fixedCosts = schema.fixedCosts || {};
    var totalPolicyAdmin = (o.policyAdminPerYear !== undefined ? o.policyAdminPerYear : (fixedCosts.policyAdminPerYear || 0)) * termYears;
    var totalSystemOverhead = (o.systemOverheadPerYear !== undefined ? o.systemOverheadPerYear : (fixedCosts.systemOverheadPerYear || 0)) * termYears;

    var claimsPerYear = lossModel.modelType === 'frequency-severity' ? lossModel.adjustedFrequency : (fixedCosts.expectedClaimsPerYear || 0.05);
    var claimsHandlingPerClaim = o.claimsHandlingPerClaim !== undefined ? o.claimsHandlingPerClaim : (fixedCosts.claimsHandlingPerClaim || 0);
    var fraudReservePerClaim = o.fraudReservePerClaim !== undefined ? o.fraudReservePerClaim : (fixedCosts.fraudReservePerClaim || 0);
    var totalClaimsHandling = claimsPerYear * claimsHandlingPerClaim * termYears;
    var totalFraudReserve = claimsPerYear * fraudReservePerClaim * termYears;

    var obsolescenceRate = o.obsolescenceRate !== undefined ? o.obsolescenceRate : (fixedCosts.obsolescenceRate || 0);
    var exposureForObsolescence = lossModel.modelType === 'rate-on-value' ? lossModel.exposureBase : (input.assetValue || input[schema.exposureMeasure ? schema.exposureMeasure.key : ''] || 0);
    var totalObsolescence = exposureForObsolescence * obsolescenceRate * termYears;

    // --- Loss ratio adjustment scaler ---
    var lossRatioScaler = o.lossRatioScaler !== undefined ? o.lossRatioScaler : 1.0;
    purePremium = purePremium * lossRatioScaler;

    var totalFixed = totalPolicyAdmin + totalClaimsHandling + totalSystemOverhead + totalFraudReserve + totalObsolescence;
    var totalCost = purePremium + totalFixed;

    // --- Variable costs & premium derivation ---
    var commissionRate = o.commissionRate !== undefined ? o.commissionRate : (schema.variableCosts.commissionRate || 0);
    var reinsuranceRate = o.reinsuranceRate !== undefined ? o.reinsuranceRate : (schema.variableCosts.reinsuranceRate || 0);
    var profitMargin = o.profitMargin !== undefined ? o.profitMargin : (schema.targetProfitMargin || 0.05);

    var variableRate = commissionRate + reinsuranceRate;
    var divisor = 1 - variableRate - profitMargin;
    if (divisor <= 0) divisor = 0.01;

    var grossPremium = totalCost / divisor;
    var annualPremium = grossPremium / termYears;

    // --- P&L waterfall ---
    var commission = grossPremium * commissionRate;
    var reinsurance = grossPremium * reinsuranceRate;
    var netPremium = grossPremium - commission - reinsurance;
    var underwritingResult = netPremium - totalCost;

    // --- Ratios ---
    var lossRatio = grossPremium > 0 ? purePremium / grossPremium : 0;
    var expenseRatio = grossPremium > 0 ? (commission + reinsurance + totalFixed) / grossPremium : 0;
    var combinedRatio = lossRatio + expenseRatio;

    return {
      input: input,
      schema: { riskCode: schema.riskCode, label: schema.label, modelType: schema.modelType, currency: schema.currency || 'GBP' },

      lossModel: lossModel,

      costs: {
        policyAdmin: round2(totalPolicyAdmin),
        claimsHandling: round2(totalClaimsHandling),
        systemOverhead: round2(totalSystemOverhead),
        fraudReserve: round2(totalFraudReserve),
        obsolescence: round2(totalObsolescence),
        totalFixed: round2(totalFixed),
        totalCost: round2(totalCost)
      },

      costInputs: {
        policyAdminPerYear: fixedCosts.policyAdminPerYear || 0,
        claimsHandlingPerClaim: claimsHandlingPerClaim,
        systemOverheadPerYear: fixedCosts.systemOverheadPerYear || 0,
        fraudReservePerClaim: fraudReservePerClaim,
        obsolescenceRate: obsolescenceRate,
        lossRatioScaler: lossRatioScaler,
        commissionRate: commissionRate,
        reinsuranceRate: reinsuranceRate,
        profitMargin: profitMargin
      },

      grossPremium: round2(grossPremium),
      annualPremium: round2(annualPremium),

      waterfall: {
        grossPremium: round2(grossPremium),
        commission: round2(commission),
        reinsurance: round2(reinsurance),
        netPremium: round2(netPremium),
        expectedClaims: round2(purePremium),
        claimsHandling: round2(totalClaimsHandling),
        policyAdmin: round2(totalPolicyAdmin),
        systemOverhead: round2(totalSystemOverhead),
        fraudReserve: round2(totalFraudReserve),
        obsolescence: round2(totalObsolescence),
        underwritingResult: round2(underwritingResult)
      },

      ratios: {
        lossRatio: round4(lossRatio),
        expenseRatio: round4(expenseRatio),
        combinedRatio: round4(combinedRatio)
      }
    };
  }

  function round2(n) { return Math.round(n * 100) / 100; }
  function round4(n) { return Math.round(n * 10000) / 10000; }
  function round6(n) { return Math.round(n * 1000000) / 1000000; }

  exports.loadSchema = loadSchema;
  exports.rate = rate;
  exports.lookupBand = lookupBand;
  exports.getFactorValue = getFactorValue;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.RaterEngine = {}));
