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
    if (schema.modelType === 'quota-share') return rateQuotaShare(schema, input, o);
    var termYears = input.termYears || 1;
    var warnings = [];

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
      if (exposureBase < 0) warnings.push('Exposure base is negative.');
      if (baseRate > 1) warnings.push('Base rate exceeds 100% of exposure — check units.');
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

    } else if (schema.modelType === 'xol') {
      // Excess-of-loss layer: expected loss to the layer is modelled input (AAL to layer)
      var xAttach = input.attachment !== undefined ? input.attachment : (schema.attachment || 0);
      var xLimit = input.limit !== undefined ? input.limit : (schema.limit || 0);
      var xEL = o.expectedLossToLayer !== undefined ? o.expectedLossToLayer
        : (input.expectedLossToLayer !== undefined ? input.expectedLossToLayer : (schema.expectedLossToLayer || 0));
      if (xLimit <= 0) warnings.push('Layer limit must be positive.');
      if (xEL < 0) warnings.push('Expected loss to layer is negative.');
      if (xLimit > 0 && xEL > xLimit) warnings.push('Expected loss to layer exceeds the limit — check inputs.');
      purePremium = xEL * termYears;

      lossModel = {
        modelType: 'xol',
        attachment: round2(xAttach),
        limit: round2(xLimit),
        expectedLossToLayer: round2(xEL),
        lossOnLine: xLimit > 0 ? round4(xEL / xLimit) : 0,
        annualPurePremium: round2(xEL),
        totalPurePremium: round2(purePremium)
      };

    } else if (schema.modelType === 'stop-loss') {
      // Aggregate stop-loss: E[(L−a)+] − E[(L−b)+] on a lognormal aggregate loss
      var slP = input.subjectPremium !== undefined ? input.subjectPremium : (schema.subjectPremium || 0);
      var slELR = o.expectedLossRatio !== undefined ? o.expectedLossRatio
        : (input.expectedLossRatio !== undefined ? input.expectedLossRatio : (schema.expectedLossRatio || 0));
      var slCV = input.lossRatioCV !== undefined ? input.lossRatioCV : (schema.lossRatioCV || 0.1);
      var slAttachLR = input.attachmentLR !== undefined ? input.attachmentLR : (schema.attachmentLR || 0);
      var slLimitLR = input.limitLR !== undefined ? input.limitLR : (schema.limitLR || 0);
      if (slP <= 0) warnings.push('Subject premium must be positive.');
      if (slLimitLR <= 0) warnings.push('Stop-loss layer width (limitLR) must be positive.');
      var slMeanLoss = slP * slELR;
      var slA = slP * slAttachLR;
      var slB = slP * (slAttachLR + slLimitLR);
      var slLimitAmt = slP * slLimitLR;
      var slEL = lognormalExcess(slMeanLoss, slCV, slA) - lognormalExcess(slMeanLoss, slCV, slB);
      if (slEL < 0) slEL = 0;
      purePremium = slEL * termYears;

      lossModel = {
        modelType: 'stop-loss',
        subjectPremium: round2(slP),
        expectedLossRatio: round4(slELR),
        lossRatioCV: round4(slCV),
        attachment: round2(slA),
        exit: round2(slB),
        limit: round2(slLimitAmt),
        expectedAggregateLoss: round2(slMeanLoss),
        expectedLossToLayer: round2(slEL),
        lossOnLine: slLimitAmt > 0 ? round4(slEL / slLimitAmt) : 0,
        annualPurePremium: round2(slEL),
        totalPurePremium: round2(purePremium)
      };

    } else if (schema.modelType === 'cat-bond') {
      // Cat bond: spread = multiple × expected loss; multiple applied via lossRatioScaler (stage-3 load)
      var cbPrincipal = input.principal !== undefined ? input.principal : (schema.principal || 0);
      var cbELpct = o.expectedLossPct !== undefined ? o.expectedLossPct
        : (input.expectedLossPct !== undefined ? input.expectedLossPct : (schema.expectedLossPct || 0));
      if (cbPrincipal <= 0) warnings.push('Cat-bond principal must be positive.');
      if (cbELpct < 0) warnings.push('Expected loss % is negative.');
      var cbEL = cbPrincipal * cbELpct;
      purePremium = cbEL * termYears;

      lossModel = {
        modelType: 'cat-bond',
        principal: round2(cbPrincipal),
        expectedLossPct: round4(cbELpct),
        expectedLoss: round2(cbEL),
        annualPurePremium: round2(cbEL),
        totalPurePremium: round2(purePremium)
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

    var taxRate = o.taxRate !== undefined ? o.taxRate : (schema.taxRate || 0);
    var variableRate = commissionRate + reinsuranceRate;
    var divisor = 1 - variableRate - profitMargin;
    if (divisor <= 0) { divisor = 0.01; warnings.push('Commission + reinsurance + profit ≥ 100% — premium undefined (divisor ≤ 0).'); }

    var technicalPremium = totalCost / divisor;   // required (technical) price pre-tax — rungs 1–7

    // --- Commercial flex / override (rung 6a): discretionary ± vs technical ---
    var flexRate = o.flexRate !== undefined ? o.flexRate : 0;
    var chargedFactor = 1 + flexRate;
    if (chargedFactor <= 0) { chargedFactor = 0; warnings.push('Commercial flex ≤ −100% — charged premium is zero or negative.'); }
    var grossPremium = technicalPremium * chargedFactor;   // actual charged premium (pre-tax)
    var rateAdequacy = technicalPremium > 0 ? grossPremium / technicalPremium : 0;

    var customerPremium = grossPremium * (1 + taxRate);
    var tax = customerPremium - grossPremium;
    var annualPremium = grossPremium / termYears;

    // --- P&L waterfall (on the actual charged premium) ---
    var commission = grossPremium * commissionRate;
    var reinsurance = grossPremium * reinsuranceRate;
    var netPremium = grossPremium - commission - reinsurance;
    var underwritingResult = netPremium - totalCost;

    // --- Ratios ---
    var lossRatio = grossPremium > 0 ? purePremium / grossPremium : 0;
    var expenseRatio = grossPremium > 0 ? (commission + reinsurance + totalFixed) / grossPremium : 0;
    var combinedRatio = lossRatio + expenseRatio;

    // --- Commercial-flex guard-rails: a discount below technical must never hide (S5A) ---
    if (flexRate < 0 && rateAdequacy < 0.90) warnings.push('Commercial flex: charged premium is ' + Math.round((1 - rateAdequacy) * 100) + '% below technical (rate adequacy ' + Math.round(rateAdequacy * 100) + '%).');
    if (flexRate < 0 && combinedRatio > 1) warnings.push('Combined ratio ' + Math.round(combinedRatio * 100) + '% exceeds 100% after commercial flex — underwriting loss at the charged price.');

    // --- Reinsurance layer / instrument KPIs (rate-on-line, payback, loss-on-line, cat multiple) ---
    var layer = null;
    if (lossModel.modelType === 'xol' || lossModel.modelType === 'stop-loss') {
      var lim = lossModel.limit;
      var elAnnual = lossModel.expectedLossToLayer;
      var rol = lim > 0 ? annualPremium / lim : 0;
      layer = {
        attachment: round2(lossModel.attachment),
        limit: round2(lim),
        expectedLossToLayer: round2(elAnnual),
        lossOnLine: lim > 0 ? round4(elAnnual / lim) : 0,
        rateOnLine: round4(rol),
        payback: rol > 0 ? round2(1 / rol) : 0
      };
    } else if (lossModel.modelType === 'cat-bond') {
      var prin = lossModel.principal;
      var elA = lossModel.expectedLoss;
      var spreadPct = prin > 0 ? annualPremium / prin : 0;
      layer = {
        principal: round2(prin),
        expectedLoss: round2(elA),
        expectedLossPct: round4(lossModel.expectedLossPct),
        spread: round4(spreadPct),
        multiple: elA > 0 ? round2(annualPremium / elA) : 0,
        expectedProfitPct: round4(spreadPct - lossModel.expectedLossPct)
      };
    }

    return {
      input: input,
      schema: { riskCode: schema.riskCode, label: schema.label, modelType: schema.modelType, currency: schema.currency || 'GBP' },

      lossModel: lossModel,
      layer: layer,

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
        profitMargin: profitMargin,
        flexRate: flexRate
      },

      technicalPremium: round2(technicalPremium),
      grossPremium: round2(grossPremium),
      customerPremium: round2(customerPremium),
      annualPremium: round2(annualPremium),
      warnings: warnings,

      waterfall: {
        technicalPremium: round2(technicalPremium),
        commercialFlex: round2(grossPremium - technicalPremium),
        grossPremium: round2(grossPremium),
        tax: round2(tax),
        customerPremium: round2(customerPremium),
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
        combinedRatio: round4(combinedRatio),
        rateAdequacy: round4(rateAdequacy)
      }
    };
  }

  // Standard normal CDF — Zelen & Severo rational approximation (A&S 26.2.17), |err| < 7.5e-8
  function normCdf(x) {
    var b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429, p = 0.2316419, c = 0.39894228;
    var neg = x < 0;
    var ax = Math.abs(x);
    var t = 1 / (1 + p * ax);
    var phi = c * Math.exp(-ax * ax / 2);
    var poly = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
    var cdf = 1 - phi * poly;
    return neg ? 1 - cdf : cdf;
  }

  // E[(L−d)+] for L ~ lognormal with the given mean and coefficient of variation (stop-loss cost above d)
  function lognormalExcess(mean, cv, d) {
    if (mean <= 0) return 0;
    if (d <= 0) return mean;
    var sigma = Math.sqrt(Math.log(1 + cv * cv));
    if (sigma <= 0) return Math.max(0, mean - d);   // degenerate (cv = 0): deterministic loss
    var mu = Math.log(mean) - sigma * sigma / 2;
    var d1 = (mu + sigma * sigma - Math.log(d)) / sigma;
    var d2 = d1 - sigma;
    return mean * normCdf(d1) - d * normCdf(d2);
  }

  // Quota share (proportional cession) — reinsurer's expected economics on the ceded share
  function rateQuotaShare(schema, input, o) {
    var warnings = [];
    var termYears = input.termYears || 1;
    function pick(key, def) {
      return o[key] !== undefined ? o[key] : (input[key] !== undefined ? input[key] : (schema[key] !== undefined ? schema[key] : def));
    }
    var subjectPremium = pick('subjectPremium', 0);
    var share = pick('cededShare', 0);
    var elr = pick('expectedLossRatio', 0);
    var cedingComm = pick('cedingCommission', 0);
    var brokerage = pick('brokerage', 0);
    var profitComm = pick('profitCommission', 0);
    var mgmtExpenseRate = pick('reinsurerExpenseRate', 0);

    if (subjectPremium < 0) warnings.push('Subject premium is negative.');
    if (share < 0 || share > 1) warnings.push('Ceded share should be between 0% and 100%.');

    var cededPremium = subjectPremium * share * termYears;
    var expectedLosses = cededPremium * elr;
    var cedingCommissionAmt = cededPremium * cedingComm;
    var brokerageAmt = cededPremium * brokerage;
    var mgmtExpenseAmt = cededPremium * mgmtExpenseRate;
    // Profit commission: a share of the reinsurer's profit after a management-expense allowance, returned to the cedant
    var pcBase = cededPremium - cedingCommissionAmt - expectedLosses - mgmtExpenseAmt;
    var profitCommissionAmt = profitComm * Math.max(0, pcBase);
    var reinsurerResult = cededPremium - cedingCommissionAmt - brokerageAmt - expectedLosses - mgmtExpenseAmt - profitCommissionAmt;

    var lossRatio = cededPremium > 0 ? expectedLosses / cededPremium : 0;
    var expenseRatio = cededPremium > 0 ? (cedingCommissionAmt + brokerageAmt + mgmtExpenseAmt + profitCommissionAmt) / cededPremium : 0;
    var combinedRatio = lossRatio + expenseRatio;
    var marginPct = cededPremium > 0 ? reinsurerResult / cededPremium : 0;

    if (combinedRatio > 1) warnings.push('Combined ratio ' + Math.round(combinedRatio * 100) + '% exceeds 100% — the cession is expected to lose money for the reinsurer.');

    return {
      input: input,
      schema: { riskCode: schema.riskCode, label: schema.label, modelType: 'quota-share', currency: schema.currency || 'GBP' },
      lossModel: {
        modelType: 'quota-share',
        subjectPremium: round2(subjectPremium),
        cededShare: round4(share),
        cededPremium: round2(cededPremium),
        expectedLossRatio: round4(elr),
        expectedLosses: round2(expectedLosses)
      },
      layer: null,
      cession: {
        cededPremium: round2(cededPremium),
        cedingCommission: round2(cedingCommissionAmt),
        brokerage: round2(brokerageAmt),
        managementExpense: round2(mgmtExpenseAmt),
        expectedLosses: round2(expectedLosses),
        profitCommission: round2(profitCommissionAmt),
        reinsurerResult: round2(reinsurerResult)
      },
      technicalPremium: round2(cededPremium),
      grossPremium: round2(cededPremium),
      customerPremium: round2(cededPremium),
      annualPremium: round2(cededPremium / termYears),
      warnings: warnings,
      waterfall: {
        cededPremium: round2(cededPremium),
        cedingCommission: round2(cedingCommissionAmt),
        brokerage: round2(brokerageAmt),
        managementExpense: round2(mgmtExpenseAmt),
        expectedLosses: round2(expectedLosses),
        profitCommission: round2(profitCommissionAmt),
        reinsurerResult: round2(reinsurerResult)
      },
      ratios: {
        lossRatio: round4(lossRatio),
        expenseRatio: round4(expenseRatio),
        combinedRatio: round4(combinedRatio),
        marginPct: round4(marginPct)
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
  exports.normCdf = normCdf;
  exports.lognormalExcess = lognormalExcess;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.RaterEngine = {}));
