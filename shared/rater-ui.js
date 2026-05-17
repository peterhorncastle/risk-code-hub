'use strict';

(function (exports) {

  var fmt2 = function (n) { return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var fmtPct = function (n) { return (n * 100).toFixed(2) + '%'; };
  var fmtPct1 = function (n) { return (n * 100).toFixed(1) + '%'; };

  function init(containerEl, schemas, engine) {
    if (!schemas || schemas.length === 0) return;

    containerEl.innerHTML = '';
    containerEl.className = 'rater-container';

    if (schemas.length > 1) {
      var tabs = document.createElement('div');
      tabs.className = 'rc-tabs';
      schemas.forEach(function (s, idx) {
        var btn = document.createElement('button');
        btn.textContent = s.riskCode + ' — ' + s.label;
        btn.dataset.idx = idx;
        if (idx === 0) btn.className = 'active';
        btn.onclick = function () {
          tabs.querySelectorAll('button').forEach(function (b) { b.className = ''; });
          btn.className = 'active';
          containerEl.querySelectorAll('.rater-panel').forEach(function (p) { p.className = 'rater-panel'; });
          containerEl.querySelector('#rater-panel-' + idx).className = 'rater-panel active';
        };
        tabs.appendChild(btn);
      });
      containerEl.appendChild(tabs);
    }

    schemas.forEach(function (schema, idx) {
      var panel = buildPanel(schema, idx, engine);
      if (idx === 0) panel.className = 'rater-panel active';
      containerEl.appendChild(panel);
    });
  }

  function buildPanel(schema, idx, engine) {
    var panel = document.createElement('div');
    panel.className = 'rater-panel';
    panel.id = 'rater-panel-' + idx;

    var header = document.createElement('h2');
    header.textContent = schema.riskCode + ' — ' + schema.label;
    panel.appendChild(header);

    var subtitle = document.createElement('p');
    subtitle.className = 'rater-subtitle';
    subtitle.textContent = (schema.modelType === 'rate-on-value' ? 'Rate on Value model' : 'Frequency × Severity model') + ' • ' + (schema.currency || 'GBP');
    panel.appendChild(subtitle);

    // Comparison toggle
    var toggleWrap = document.createElement('div');
    toggleWrap.className = 'comparison-toggle';
    var toggleCb = document.createElement('input');
    toggleCb.type = 'checkbox';
    toggleCb.id = 'compare-toggle-' + idx;
    var toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = toggleCb.id;
    toggleLabel.textContent = 'Show Base vs Proposed comparison';
    toggleWrap.appendChild(toggleCb);
    toggleWrap.appendChild(toggleLabel);
    panel.appendChild(toggleWrap);

    // Form
    var form = document.createElement('div');
    form.className = 'rater-form';
    var fields = buildFormFields(schema, idx);
    fields.forEach(function (f) { form.appendChild(f); });

    var calcBtn = document.createElement('button');
    calcBtn.className = 'rater-calc-btn';
    calcBtn.textContent = 'Calculate Premium';
    form.appendChild(calcBtn);
    panel.appendChild(form);

    // Results area
    var results = document.createElement('div');
    results.className = 'rater-results';
    results.id = 'rater-results-' + idx;
    panel.appendChild(results);

    // Disclaimer
    var disc = document.createElement('div');
    disc.className = 'rater-disclaimer';
    disc.textContent = 'Illustrative output only. Not a commercial quotation. Factors and assumptions are simplified for educational purposes.';
    panel.appendChild(disc);

    // Event handlers
    calcBtn.onclick = function () {
      var input = readInputs(schema, form, idx);
      var overrides = {};
      var showComparison = toggleCb.checked;

      if (showComparison) {
        overrides = readOverrides(schema, form, idx);
      }

      var baseResult = engine.rate(schema, input, {});
      var proposedResult = showComparison ? engine.rate(schema, input, overrides) : null;

      renderResults(results, schema, baseResult, proposedResult);
    };

    toggleCb.onchange = function () {
      form.querySelectorAll('.override-field').forEach(function (el) {
        el.style.display = toggleCb.checked ? 'flex' : 'none';
      });
    };

    return panel;
  }

  function buildFormFields(schema, idx) {
    var fields = [];

    // Exposure / primary input
    if (schema.modelType === 'rate-on-value') {
      fields.push(makeField(schema.exposureMeasure.key, schema.exposureMeasure.label, 'number', schema.exposureMeasure.defaultValue || '', schema.exposureMeasure.hint || '', idx));
    }

    // Term
    fields.push(makeField('termYears', 'Coverage Term (years)', 'number', '1', '', idx));

    // Rating factors
    schema.ratingFactors.forEach(function (fd) {
      if (fd.type === 'categorical') {
        var options = Object.keys(fd.options).map(function (k) {
          return { value: k, label: fd.options[k].label || k };
        });
        fields.push(makeSelectField(fd.key, fd.label, options, fd.defaultValue || '', fd.hint || '', idx));
      } else if (fd.type === 'band') {
        fields.push(makeField(fd.key, fd.label, 'number', fd.defaultValue || '', fd.hint || '', idx));
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
    // Override field (hidden by default)
    var ovr = document.createElement('div');
    ovr.className = 'override-field';
    ovr.style.display = 'none';
    var ovrLabel = document.createElement('label');
    ovrLabel.textContent = 'Proposed:';
    var ovrInp = document.createElement('input');
    ovrInp.type = type;
    ovrInp.id = 'rf-' + idx + '-' + key + '-ovr';
    ovrInp.name = key + '_ovr';
    ovrInp.placeholder = 'override';
    if (type === 'number') ovrInp.step = 'any';
    ovr.appendChild(ovrLabel);
    ovr.appendChild(ovrInp);
    wrap.appendChild(ovr);
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
    // Override field
    var ovr = document.createElement('div');
    ovr.className = 'override-field';
    ovr.style.display = 'none';
    var ovrLabel = document.createElement('label');
    ovrLabel.textContent = 'Proposed:';
    var ovrSel = sel.cloneNode(true);
    ovrSel.id = 'rf-' + idx + '-' + key + '-ovr';
    ovrSel.name = key + '_ovr';
    ovr.appendChild(ovrLabel);
    ovr.appendChild(ovrSel);
    wrap.appendChild(ovr);
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

  function readOverrides(schema, form, idx) {
    var overrides = {};

    if (schema.modelType === 'rate-on-value') {
      var baseRateOvr = form.querySelector('#rf-' + idx + '-' + schema.exposureMeasure.key + '-ovr');
      if (baseRateOvr && baseRateOvr.value) {
        overrides[schema.exposureMeasure.key] = parseFloat(baseRateOvr.value);
      }
    }

    schema.ratingFactors.forEach(function (fd) {
      var el = form.querySelector('#rf-' + idx + '-' + fd.key + '-ovr');
      if (!el || !el.value) return;
      if (fd.type === 'categorical') {
        overrides[fd.key] = el.value;
      } else {
        overrides[fd.key] = parseFloat(el.value);
      }
    });
    return overrides;
  }

  function renderResults(container, schema, base, proposed) {
    container.innerHTML = '';
    var ccy = schema.currency || 'GBP';
    var sym = ccy === 'USD' ? '$' : ccy === 'EUR' ? '€' : '£';

    // Metrics
    var metrics = document.createElement('div');
    metrics.className = 'rater-metrics';
    metrics.appendChild(metricCard('Gross Premium', sym + fmt2(base.grossPremium), proposed ? sym + fmt2(proposed.grossPremium) + ' proposed' : ''));
    metrics.appendChild(metricCard('Annual Premium', sym + fmt2(base.annualPremium), ''));
    metrics.appendChild(metricCard('Loss Ratio', fmtPct1(base.ratios.lossRatio), ''));
    metrics.appendChild(metricCard('Combined Ratio', fmtPct1(base.ratios.combinedRatio), base.ratios.combinedRatio > 1 ? 'Loss-making' : 'Profitable'));
    if (proposed) {
      var delta = proposed.grossPremium - base.grossPremium;
      var deltaPct = base.grossPremium > 0 ? (delta / base.grossPremium * 100).toFixed(1) : '0';
      metrics.appendChild(metricCard('Premium Change', (delta >= 0 ? '+' : '') + sym + fmt2(delta), deltaPct + '% vs base'));
    }
    container.appendChild(metrics);

    // Waterfalls
    var wfContainer = document.createElement('div');
    wfContainer.className = proposed ? 'wf-container' : 'wf-container single';
    wfContainer.appendChild(buildWaterfall(base, sym, proposed ? 'Base' : 'P&L Waterfall'));
    if (proposed) {
      wfContainer.appendChild(buildWaterfall(proposed, sym, 'Proposed'));
    }
    container.appendChild(wfContainer);

    // Factor breakdown table
    container.appendChild(buildFactorTable(schema, base, proposed, sym));
  }

  function metricCard(label, value, sub) {
    var card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = '<div class="metric-label">' + label + '</div><div class="metric-value">' + value + '</div>' + (sub ? '<div class="metric-sub">' + sub + '</div>' : '');
    return card;
  }

  function buildWaterfall(result, sym, title) {
    var panel = document.createElement('div');
    panel.className = 'wf-panel';
    var h3 = document.createElement('h3');
    h3.textContent = title;
    panel.appendChild(h3);

    var wf = result.waterfall;
    var rows = [
      { label: 'Gross Premium', value: wf.grossPremium, cls: 'wf-header' },
      { label: 'Commission', value: -wf.commission, driver: fmtPct1(result.costInputs.commissionRate) },
      { label: 'Reinsurance', value: -wf.reinsurance, driver: fmtPct1(result.costInputs.reinsuranceRate) },
      { label: 'Net Premium', value: wf.netPremium, cls: 'wf-subtotal' },
      { label: 'Expected Claims', value: -wf.expectedClaims },
      { label: 'Claims Handling', value: -wf.claimsHandling },
      { label: 'Policy Admin', value: -wf.policyAdmin },
      { label: 'System Overhead', value: -wf.systemOverhead },
      { label: 'Fraud Reserve', value: -wf.fraudReserve },
      { label: 'Obsolescence / Depreciation', value: -wf.obsolescence },
      { label: 'Underwriting Result', value: wf.underwritingResult, cls: 'wf-result' }
    ];

    rows.forEach(function (r) {
      if (r.value === 0 && !r.cls) return;
      var row = document.createElement('div');
      row.className = 'wf-row' + (r.cls ? ' ' + r.cls : '');
      var labelSpan = '<span class="wf-label">' + r.label + '</span>';
      var valClass = r.cls === 'wf-result' ? (r.value >= 0 ? 'wf-value positive' : 'wf-value negative') : 'wf-value';
      var valSpan = '<span class="' + valClass + '">' + sym + fmt2(Math.abs(r.value)) + (r.value < 0 && r.cls !== 'wf-result' ? ' −' : '') + '</span>';
      var driverSpan = r.driver ? '<span class="wf-driver">' + r.driver + '</span>' : '';
      row.innerHTML = labelSpan + driverSpan + valSpan;
      panel.appendChild(row);
    });

    return panel;
  }

  function buildFactorTable(schema, base, proposed, sym) {
    var section = document.createElement('div');
    section.className = 'rater-assumptions';
    var h3 = document.createElement('h3');
    h3.textContent = 'Rating Factor Breakdown';
    section.appendChild(h3);

    var table = document.createElement('table');
    table.className = 'assumptions-table';
    var thead = '<thead><tr><th>Factor</th><th>Input</th><th>Multiplier</th>';
    if (proposed) thead += '<th>Proposed Multiplier</th><th>Delta</th>';
    thead += '</tr></thead>';
    table.innerHTML = thead;

    var tbody = document.createElement('tbody');
    var baseFactors = base.lossModel.factors || (base.lossModel.frequencyFactors || []).concat(base.lossModel.severityFactors || []);
    var proposedFactors = proposed ? (proposed.lossModel.factors || (proposed.lossModel.frequencyFactors || []).concat(proposed.lossModel.severityFactors || [])) : [];

    baseFactors.forEach(function (bf, i) {
      var tr = document.createElement('tr');
      var pf = proposedFactors[i];
      var html = '<td>' + bf.label + '</td><td>' + bf.inputValue + '</td><td class="base-col">' + bf.factor.toFixed(4) + '</td>';
      if (proposed && pf) {
        var delta = pf.factor - bf.factor;
        var deltaClass = delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : '';
        html += '<td class="proposed-col">' + pf.factor.toFixed(4) + '</td>';
        html += '<td class="delta-col ' + deltaClass + '">' + (delta >= 0 ? '+' : '') + delta.toFixed(4) + '</td>';
      }
      tr.innerHTML = html;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    section.appendChild(table);
    return section;
  }

  exports.init = init;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.RaterUI = {}));
