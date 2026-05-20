'use strict';

(function (exports) {

  var fmt2 = function (n) { return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var fmtPct1 = function (n) { return (n * 100).toFixed(1) + '%'; };

  var _engine;
  var _schemas;
  var _results = {};
  var _included = {};
  var _containerEl;

  function init(containerEl, schemas, engine) {
    if (!schemas || schemas.length === 0) return;
    _engine = engine;
    _schemas = schemas;
    _containerEl = containerEl;
    containerEl.innerHTML = '';
    containerEl.className = 'rater-container';

    // Combined totals banner (top)
    var totals = document.createElement('div');
    totals.className = 'combined-totals';
    totals.id = 'combined-totals';
    containerEl.appendChild(totals);

    // Calculate All button
    var calcAllWrap = document.createElement('div');
    calcAllWrap.className = 'calc-all-wrap';
    var calcAllBtn = document.createElement('button');
    calcAllBtn.className = 'rater-calc-all-btn';
    calcAllBtn.textContent = 'Calculate All Risk Codes';
    calcAllBtn.onclick = function () { calculateAll(); };
    calcAllWrap.appendChild(calcAllBtn);
    containerEl.appendChild(calcAllWrap);

    // Risk code sections
    schemas.forEach(function (schema, idx) {
      _included[idx] = true;
      var section = buildSection(schema, idx);
      containerEl.appendChild(section);
    });

    updateTotals();
  }

  function buildSection(schema, idx) {
    var section = document.createElement('div');
    section.className = 'rc-section';
    section.id = 'rc-section-' + idx;

    // Header bar with checkbox
    var hdr = document.createElement('div');
    hdr.className = 'rc-header';

    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = true;
    cb.id = 'rc-include-' + idx;
    cb.className = 'rc-checkbox';
    cb.onchange = function () {
      _included[idx] = cb.checked;
      section.classList.toggle('rc-excluded', !cb.checked);
      updateTotals();
    };

    var title = document.createElement('label');
    title.htmlFor = cb.id;
    title.className = 'rc-title';
    title.textContent = schema.riskCode + ' — ' + schema.label;

    var modelTag = document.createElement('span');
    modelTag.className = 'rc-model-tag';
    modelTag.textContent = (schema.modelType === 'rate-on-value' ? 'RoV' : 'F×S') + ' • ' + (schema.currency || 'GBP');

    hdr.appendChild(cb);
    hdr.appendChild(title);
    hdr.appendChild(modelTag);
    section.appendChild(hdr);

    // Body: form left, results right
    var body = document.createElement('div');
    body.className = 'rc-body';

    // Left: form
    var formCol = document.createElement('div');
    formCol.className = 'rc-form-col';

    var form = document.createElement('div');
    form.className = 'rater-form';
    var fields = buildFormFields(schema, idx);
    fields.forEach(function (f) { form.appendChild(f); });

    // Loss ratio scaler
    var scalerWrap = document.createElement('div');
    scalerWrap.className = 'rater-field rater-scaler-field';
    var scalerLabel = document.createElement('label');
    scalerLabel.htmlFor = 'rf-' + idx + '-lrScaler';
    scalerLabel.textContent = 'Loss Ratio Adjustment';
    var scalerRow = document.createElement('div');
    scalerRow.className = 'scaler-row';
    var scalerRange = document.createElement('input');
    scalerRange.type = 'range';
    scalerRange.id = 'rf-' + idx + '-lrScaler';
    scalerRange.min = '0.5';
    scalerRange.max = '2.0';
    scalerRange.step = '0.05';
    scalerRange.value = '1.0';
    scalerRange.className = 'scaler-range';
    var scalerVal = document.createElement('span');
    scalerVal.className = 'scaler-value';
    scalerVal.textContent = '1.00x';
    scalerRange.oninput = function () {
      scalerVal.textContent = parseFloat(scalerRange.value).toFixed(2) + 'x';
    };
    scalerRow.appendChild(scalerRange);
    scalerRow.appendChild(scalerVal);
    var scalerHint = document.createElement('div');
    scalerHint.className = 'field-hint';
    scalerHint.textContent = '0.50x–2.00x scales expected losses up/down';
    scalerWrap.appendChild(scalerLabel);
    scalerWrap.appendChild(scalerRow);
    scalerWrap.appendChild(scalerHint);
    form.appendChild(scalerWrap);

    var calcBtn = document.createElement('button');
    calcBtn.className = 'rater-calc-btn';
    calcBtn.textContent = 'Calculate';
    calcBtn.onclick = function () { calculateOne(idx); };
    form.appendChild(calcBtn);

    formCol.appendChild(form);
    body.appendChild(formCol);

    // Right: results
    var resultsCol = document.createElement('div');
    resultsCol.className = 'rc-results-col';
    resultsCol.id = 'rc-results-' + idx;

    var placeholder = document.createElement('div');
    placeholder.className = 'rc-results-placeholder';
    placeholder.textContent = 'Click Calculate to see results';
    resultsCol.appendChild(placeholder);

    body.appendChild(resultsCol);
    section.appendChild(body);

    return section;
  }

  function calculateOne(idx) {
    var schema = _schemas[idx];
    var section = document.getElementById('rc-section-' + idx);
    var form = section.querySelector('.rater-form');
    var input = readInputs(schema, form, idx);
    var scalerEl = form.querySelector('#rf-' + idx + '-lrScaler');
    var overrides = {};
    if (scalerEl) {
      overrides.lossRatioScaler = parseFloat(scalerEl.value) || 1.0;
    }
    var result = _engine.rate(schema, input, overrides);
    _results[idx] = result;
    renderSectionResults(idx, schema, result);
    updateTotals();
  }

  function calculateAll() {
    _schemas.forEach(function (schema, idx) {
      calculateOne(idx);
    });
  }

  function renderSectionResults(idx, schema, result) {
    var container = document.getElementById('rc-results-' + idx);
    container.innerHTML = '';
    var ccy = schema.currency || 'GBP';
    var sym = ccy === 'USD' ? '$' : ccy === 'EUR' ? '€' : '£';

    // Key metrics in compact grid
    var metrics = document.createElement('div');
    metrics.className = 'rc-metrics';

    metrics.appendChild(miniMetric('Gross Premium', sym + fmt2(result.grossPremium)));
    metrics.appendChild(miniMetric('Combined Ratio', fmtPct1(result.ratios.combinedRatio),
      result.ratios.combinedRatio > 1 ? 'loss' : result.ratios.combinedRatio > 0.95 ? 'tight' : 'profit'));
    metrics.appendChild(miniMetric('UW Result', sym + fmt2(result.waterfall.underwritingResult),
      result.waterfall.underwritingResult >= 0 ? 'profit' : 'loss'));
    var lrScaler = result.costInputs.lossRatioScaler || 1.0;
    metrics.appendChild(miniMetric('Loss Ratio', fmtPct1(result.ratios.lossRatio),
      lrScaler !== 1.0 ? 'scaled' : ''));
    metrics.appendChild(miniMetric('Net Premium', sym + fmt2(result.waterfall.netPremium)));
    metrics.appendChild(miniMetric('Expected Claims',
      sym + fmt2(result.waterfall.expectedClaims) + (lrScaler !== 1.0 ? ' (' + lrScaler.toFixed(2) + 'x)' : '')));

    container.appendChild(metrics);

    // Mini waterfall
    container.appendChild(buildMiniWaterfall(result, sym));
  }

  function miniMetric(label, value, status) {
    var el = document.createElement('div');
    el.className = 'rc-metric' + (status ? ' rc-metric-' + status : '');
    el.innerHTML = '<span class="rc-metric-label">' + label + '</span><span class="rc-metric-value">' + value + '</span>';
    return el;
  }

  function buildMiniWaterfall(result, sym) {
    var wf = result.waterfall;
    var panel = document.createElement('div');
    panel.className = 'rc-waterfall';

    var rows = [
      { label: 'Gross Premium', value: wf.grossPremium, cls: 'wf-header' },
      { label: 'Commission', value: -wf.commission, pct: result.costInputs.commissionRate },
      { label: 'Reinsurance', value: -wf.reinsurance, pct: result.costInputs.reinsuranceRate },
      { label: 'Net Premium', value: wf.netPremium, cls: 'wf-subtotal' },
      { label: 'Expected Claims', value: -wf.expectedClaims },
      { label: 'Claims Handling', value: -wf.claimsHandling },
      { label: 'Policy Admin', value: -wf.policyAdmin },
      { label: 'System Overhead', value: -wf.systemOverhead },
      { label: 'Fraud Reserve', value: -wf.fraudReserve },
      { label: 'Obsolescence', value: -wf.obsolescence },
      { label: 'UW Result (' + fmtPct1(1 - result.ratios.combinedRatio) + ')', value: wf.underwritingResult, cls: 'wf-result' }
    ];

    rows.forEach(function (r) {
      if (r.value === 0 && !r.cls) return;
      var row = document.createElement('div');
      row.className = 'wf-row' + (r.cls ? ' ' + r.cls : '');
      var valClass = r.cls === 'wf-result' ? (r.value >= 0 ? 'wf-value positive' : 'wf-value negative') : 'wf-value';
      row.innerHTML = '<span class="wf-label">' + r.label + '</span>' +
        (r.pct ? '<span class="wf-driver">' + fmtPct1(r.pct) + '</span>' : '') +
        '<span class="' + valClass + '">' + sym + fmt2(Math.abs(r.value)) + (r.value < 0 && r.cls !== 'wf-result' ? ' −' : '') + '</span>';
      panel.appendChild(row);
    });

    return panel;
  }

  function updateTotals() {
    var el = document.getElementById('combined-totals');
    var totalGross = 0;
    var totalNet = 0;
    var totalClaims = 0;
    var totalUW = 0;
    var totalCosts = 0;
    var count = 0;
    var ccy = _schemas[0].currency || 'GBP';
    var sym = ccy === 'USD' ? '$' : ccy === 'EUR' ? '€' : '£';

    _schemas.forEach(function (s, idx) {
      if (!_included[idx] || !_results[idx]) return;
      var r = _results[idx];
      totalGross += r.grossPremium;
      totalNet += r.waterfall.netPremium;
      totalClaims += r.waterfall.expectedClaims;
      totalUW += r.waterfall.underwritingResult;
      totalCosts += r.waterfall.commission + r.waterfall.reinsurance + r.waterfall.expectedClaims +
        r.waterfall.claimsHandling + r.waterfall.policyAdmin + r.waterfall.systemOverhead +
        r.waterfall.fraudReserve + r.waterfall.obsolescence;
      count++;
    });

    if (count === 0) {
      el.innerHTML = '<div class="totals-empty">Calculate risk codes below to see combined totals</div>';
      return;
    }

    var combinedRatio = totalGross > 0 ? totalCosts / totalGross : 0;
    var lossRatio = totalGross > 0 ? totalClaims / totalGross : 0;
    var uwPct = totalGross > 0 ? totalUW / totalGross : 0;

    el.innerHTML =
      '<div class="totals-grid">' +
        '<div class="totals-item totals-main">' +
          '<span class="totals-label">Combined Gross Premium</span>' +
          '<span class="totals-value">' + sym + fmt2(totalGross) + '</span>' +
        '</div>' +
        '<div class="totals-item">' +
          '<span class="totals-label">Combined Ratio</span>' +
          '<span class="totals-value ' + (combinedRatio > 1 ? 'totals-loss' : 'totals-profit') + '">' + fmtPct1(combinedRatio) + '</span>' +
        '</div>' +
        '<div class="totals-item">' +
          '<span class="totals-label">UW Result</span>' +
          '<span class="totals-value ' + (totalUW >= 0 ? 'totals-profit' : 'totals-loss') + '">' + sym + fmt2(totalUW) + ' (' + fmtPct1(uwPct) + ')</span>' +
        '</div>' +
        '<div class="totals-item">' +
          '<span class="totals-label">Loss Ratio</span>' +
          '<span class="totals-value">' + fmtPct1(lossRatio) + '</span>' +
        '</div>' +
        '<div class="totals-item">' +
          '<span class="totals-label">Risk Codes Included</span>' +
          '<span class="totals-value">' + count + ' / ' + _schemas.length + '</span>' +
        '</div>' +
      '</div>';
  }

  function buildFormFields(schema, idx) {
    var fields = [];

    if (schema.modelType === 'rate-on-value') {
      fields.push(makeField(schema.exposureMeasure.key, schema.exposureMeasure.label, 'number', schema.exposureMeasure.defaultValue || '', schema.exposureMeasure.hint || '', idx));
    }

    fields.push(makeField('termYears', 'Term (yrs)', 'number', '1', '', idx));

    schema.ratingFactors.forEach(function (fd) {
      if (fd.type === 'categorical') {
        var options = Object.keys(fd.options).map(function (k) {
          return { value: k, label: fd.options[k].label || k };
        });
        fields.push(makeSelectField(fd.key, fd.label, options, fd.defaultValue || '', fd.hint || '', idx));
      } else {
        fields.push(makeField(fd.key, fd.label, 'number', fd.defaultValue || '', fd.hint || '', idx));
      }
    });

    return fields;
  }

  function makeField(key, label, type, defaultVal, hint, idx) {
    var wrap = document.createElement('div');
    wrap.className = 'rater-field';
    var lbl = document.createElement('label');
    lbl.textContent = label;
    lbl.htmlFor = 'rf-' + idx + '-' + key;
    var inp = document.createElement('input');
    inp.type = type;
    inp.id = 'rf-' + idx + '-' + key;
    inp.name = key;
    inp.value = defaultVal;
    if (type === 'number') inp.step = 'any';
    wrap.appendChild(lbl);
    wrap.appendChild(inp);
    if (hint) {
      var h = document.createElement('div');
      h.className = 'field-hint';
      h.textContent = hint;
      wrap.appendChild(h);
    }
    return wrap;
  }

  function makeSelectField(key, label, options, defaultVal, hint, idx) {
    var wrap = document.createElement('div');
    wrap.className = 'rater-field';
    var lbl = document.createElement('label');
    lbl.textContent = label;
    lbl.htmlFor = 'rf-' + idx + '-' + key;
    var sel = document.createElement('select');
    sel.id = 'rf-' + idx + '-' + key;
    sel.name = key;
    options.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === defaultVal) o.selected = true;
      sel.appendChild(o);
    });
    wrap.appendChild(lbl);
    wrap.appendChild(sel);
    if (hint) {
      var h = document.createElement('div');
      h.className = 'field-hint';
      h.textContent = hint;
      wrap.appendChild(h);
    }
    return wrap;
  }

  function readInputs(schema, form, idx) {
    var input = {};
    if (schema.modelType === 'rate-on-value') {
      input[schema.exposureMeasure.key] = parseFloat(form.querySelector('#rf-' + idx + '-' + schema.exposureMeasure.key).value) || 0;
    }
    input.termYears = parseInt(form.querySelector('#rf-' + idx + '-termYears').value) || 1;

    schema.ratingFactors.forEach(function (fd) {
      var el = form.querySelector('#rf-' + idx + '-' + fd.key);
      if (!el) return;
      if (fd.type === 'categorical') {
        input[fd.key] = el.value;
      } else {
        input[fd.key] = parseFloat(el.value) || 0;
      }
    });
    return input;
  }

  exports.init = init;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.RaterUI = {}));
