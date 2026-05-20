'use strict';

(function (exports) {

  /**
   * Programme Engine — Global Programme Builder
   *
   * Sits on top of the rater engine. Takes per-risk-code gross premiums
   * and applies programme structure: layer towers, RI cessions, territory splits.
   *
   * Programme structure:
   *   programme = {
   *     lines: [{ riskCode, label, grossPremium, currency }],
   *     layers: [{ id, name, limit, attachment, rateOnLine, premium, riStructure[] }],
   *     territories: [{ code, label, share }]
   *   }
   *
   * Layer RI structure:
   *   riStructure = [{
   *     type: 'quota_share' | 'surplus' | 'xol_fac' | 'xol_treaty',
   *     share: 0.25,           // ceded share (25%)
   *     cedingCommission: 0.30, // commission returned by reinsurer
   *     slidingScale: null | { min, max, provisional, lossRatioMin, lossRatioMax }
   *   }]
   */

  // ── Helpers ────────────────────────────────────────────────────────

  function round2(n) { return Math.round(n * 100) / 100; }

  // ── Layer Premium Calculation ──────────────────────────────────────

  /**
   * Calculate premium for a single layer.
   * If layer.premium is set manually, use that.
   * Otherwise derive from rate-on-line: premium = limit * rateOnLine
   */
  function calcLayerPremium(layer) {
    if (layer.premium > 0) return layer.premium;
    if (layer.rateOnLine > 0 && layer.limit > 0) {
      return round2(layer.limit * layer.rateOnLine);
    }
    return 0;
  }

  /**
   * Calculate RI cessions for a layer.
   * Returns { grossPremium, cessions[], retainedPremium, totalCeded, totalCommissionBack }
   */
  function calcLayerRI(layer) {
    var grossPremium = calcLayerPremium(layer);
    var remaining = grossPremium;
    var cessions = [];
    var totalCeded = 0;
    var totalCommBack = 0;

    (layer.riStructure || []).forEach(function (ri) {
      var cededPremium = round2(remaining * ri.share);
      var commBack = round2(cededPremium * (ri.cedingCommission || 0));
      var netCost = round2(cededPremium - commBack);

      cessions.push({
        type: ri.type,
        share: ri.share,
        cedingCommission: ri.cedingCommission || 0,
        cededPremium: cededPremium,
        commissionBack: commBack,
        netCost: netCost,
        slidingScale: ri.slidingScale || null
      });

      totalCeded += cededPremium;
      totalCommBack += commBack;

      // For quota share / surplus, the remaining reduces for subsequent placements
      if (ri.type === 'quota_share' || ri.type === 'surplus') {
        remaining = round2(remaining - cededPremium);
      }
      // For XoL, premium is additional cost — doesn't reduce the layer premium
    });

    return {
      grossPremium: grossPremium,
      cessions: cessions,
      retainedPremium: round2(grossPremium - totalCeded),
      totalCeded: round2(totalCeded),
      totalCommissionBack: round2(totalCommBack),
      netRICost: round2(totalCeded - totalCommBack)
    };
  }

  // ── Tower Calculation ──────────────────────────────────────────────

  /**
   * Calculate full tower results across all layers.
   * Returns per-layer results + tower aggregates.
   */
  function calcTower(layers) {
    var results = [];
    var towerGross = 0;
    var towerRetained = 0;
    var towerCeded = 0;
    var towerCommBack = 0;

    layers.forEach(function (layer) {
      var r = calcLayerRI(layer);
      r.id = layer.id;
      r.name = layer.name;
      r.limit = layer.limit;
      r.attachment = layer.attachment;
      r.exhaustion = layer.attachment + layer.limit;
      r.rateOnLine = layer.rateOnLine || (layer.limit > 0 ? r.grossPremium / layer.limit : 0);
      results.push(r);

      towerGross += r.grossPremium;
      towerRetained += r.retainedPremium;
      towerCeded += r.totalCeded;
      towerCommBack += r.totalCommissionBack;
    });

    return {
      layers: results,
      totalGrossPremium: round2(towerGross),
      totalRetainedPremium: round2(towerRetained),
      totalCededPremium: round2(towerCeded),
      totalCommissionBack: round2(towerCommBack),
      netRICost: round2(towerCeded - towerCommBack),
      retentionRate: towerGross > 0 ? round2(towerRetained / towerGross) : 0
    };
  }

  // ── Territory Split ────────────────────────────────────────────────

  /**
   * Split a programme premium across territories.
   * territories = [{ code, label, share }]  where shares sum to 1.0
   */
  function splitTerritories(totalPremium, territories) {
    return territories.map(function (t) {
      return {
        code: t.code,
        label: t.label,
        share: t.share,
        premium: round2(totalPremium * t.share)
      };
    });
  }

  // ── Full Programme Calculation ─────────────────────────────────────

  /**
   * Calculate the full programme.
   *
   * Input:
   *   programme = {
   *     lines: [{ riskCode, label, grossPremium, currency }],
   *     layers: [{ id, name, limit, attachment, rateOnLine|premium, riStructure[] }],
   *     territories: [{ code, label, share }]
   *   }
   *
   * Returns:
   *   { lines, tower, territories, summary }
   */
  function calculate(programme) {
    // Sum line premiums
    var totalLinePremium = 0;
    programme.lines.forEach(function (line) {
      totalLinePremium += line.grossPremium || 0;
    });

    // Calculate tower
    var tower = calcTower(programme.layers || []);

    // Territory split on retained premium
    var terrSplit = splitTerritories(tower.totalRetainedPremium, programme.territories || []);

    // Summary
    var summary = {
      totalLinePremium: round2(totalLinePremium),
      totalTowerPremium: tower.totalGrossPremium,
      totalRetainedPremium: tower.totalRetainedPremium,
      totalCededPremium: tower.totalCededPremium,
      totalCommissionBack: tower.totalCommissionBack,
      netRICost: tower.netRICost,
      retentionRate: tower.retentionRate,
      lineCount: programme.lines.length,
      layerCount: (programme.layers || []).length,
      territoryCount: (programme.territories || []).length
    };

    return {
      lines: programme.lines,
      tower: tower,
      territories: terrSplit,
      summary: summary
    };
  }

  // ── Default Territories ────────────────────────────────────────────

  var DEFAULT_TERRITORIES = [
    { code: 'UK', label: 'United Kingdom', share: 0.30 },
    { code: 'US', label: 'United States', share: 0.25 },
    { code: 'EU', label: 'European Union', share: 0.25 },
    { code: 'ROW', label: 'Rest of World', share: 0.20 }
  ];

  // ── ILF Curve (simplified) ─────────────────────────────────────────

  /**
   * Increased Limits Factor — rough industry curve.
   * Returns the proportion of ground-up premium consumed up to `limit`.
   * Used to derive layer premiums from a total ground-up premium.
   *
   * groundUpPremium * (ILF(attachment + limit) - ILF(attachment)) = layer premium
   */
  function ilf(limit) {
    // Simplified ILF: premium = limit^0.5 (square root curve)
    // Normalised so ILF(1m) = 1.0
    if (limit <= 0) return 0;
    return Math.pow(limit / 1000000, 0.5);
  }

  function deriveLayerPremium(groundUpPremium, attachment, limit) {
    var ilfTop = ilf(attachment + limit);
    var ilfBottom = ilf(attachment);
    var ilfBase = ilf(1000000); // normalise to $1m primary
    if (ilfBase === 0) return 0;
    var factor = (ilfTop - ilfBottom) / ilfBase;
    return round2(groundUpPremium * factor);
  }

  // ── Exports ────────────────────────────────────────────────────────

  exports.calcLayerPremium = calcLayerPremium;
  exports.calcLayerRI = calcLayerRI;
  exports.calcTower = calcTower;
  exports.splitTerritories = splitTerritories;
  exports.calculate = calculate;
  exports.deriveLayerPremium = deriveLayerPremium;
  exports.ilf = ilf;
  exports.DEFAULT_TERRITORIES = DEFAULT_TERRITORIES;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.ProgrammeEngine = {}));
