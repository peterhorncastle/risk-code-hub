'use strict';

(function (exports) {

  var fmt2 = function (n) { return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var fmtPct1 = function (n) { return (n * 100).toFixed(1) + '%'; };

  var _engine;       // ProgrammeEngine
  var _raterEngine;  // RaterEngine
  var _allSchemas;   // { hubName: [schema, ...], ... }
  var _container;

  // Programme state
  var _lines = [];       // [{ id, riskCode, label, grossPremium, currency, hubName, schema, inputs }]
  var _layers = [];      // [{ id, name, limit, attachment, rateOnLine, premium, riStructure[] }]
  var _territories = []; // [{ code, label, share }]
  var _nextLineId = 1;
  var _nextLayerId = 1;

  // ── Init ───────────────────────────────────────────────────────────

  function init(containerEl, allSchemas, raterEngine, programmeEngine) {
    _container = containerEl;
    _engine = programmeEngine;
    _raterEngine = raterEngine;
    _allSchemas = allSchemas;
    _territories = JSON.parse(JSON.stringify(programmeEngine.DEFAULT_TERRITORIES));

    containerEl.innerHTML = '';
    containerEl.className = 'prog-container';

    // Summary banner
    var summary = document.createElement('div');
    summary.id = 'prog-summary';
    summary.className = 'prog-summary';
    containerEl.appendChild(summary);

    // Main layout: 3 columns
    var main = document.createElement('div');
    main.className = 'prog-main';

    // Col 1: Lines (risk codes)
    var linesCol = document.createElement('div');
    linesCol.className = 'prog-col prog-lines-col';
    linesCol.innerHTML = '<h2>Risk Code Lines</h2>';
    var addLineBtn = document.createElement('button');
    addLineBtn.className = 'prog-add-btn';
    addLineBtn.textContent = '+ Add Risk Code';
    addLineBtn.onclick = function () { addLine(); };
    linesCol.appendChild(addLineBtn);
    var linesContainer = document.createElement('div');
    linesContainer.id = 'prog-lines';
    linesCol.appendChild(linesContainer);
    main.appendChild(linesCol);

    // Col 2: Layer tower
    var towerCol = document.createElement('div');
    towerCol.className = 'prog-col prog-tower-col';
    towerCol.innerHTML = '<h2>Layer Tower</h2>';
    var addLayerBtn = document.createElement('button');
    addLayerBtn.className = 'prog-add-btn';
    addLayerBtn.textContent = '+ Add Layer';
    addLayerBtn.onclick = function () { addLayer(); };
    towerCol.appendChild(addLayerBtn);
    var towerContainer = document.createElement('div');
    towerContainer.id = 'prog-tower';
    towerCol.appendChild(towerContainer);
    main.appendChild(towerCol);

    // Col 3: Territories + results
    var rightCol = document.createElement('div');
    rightCol.className = 'prog-col prog-right-col';
    rightCol.innerHTML = '<h2>Territory Split</h2>';
    var terrContainer = document.createElement('div');
    terrContainer.id = 'prog-territories';
    rightCol.appendChild(terrContainer);
    var resultsHeader = document.createElement('h2');
    resultsHeader.textContent = 'Programme Results';
    resultsHeader.style.marginTop = '24px';
    rightCol.appendChild(resultsHeader);
    var resultsContainer = document.createElement('div');
    resultsContainer.id = 'prog-results';
    rightCol.appendChild(resultsContainer);
    main.appendChild(rightCol);

    containerEl.appendChild(main);

    // Calculate button
    var calcWrap = document.createElement('div');
    calcWrap.className = 'prog-calc-wrap';
    var calcBtn = document.createElement('button');
    calcBtn.className = 'prog-calc-btn';
    calcBtn.textContent = 'Calculate Programme';
    calcBtn.onclick = function () { calculateProgramme(); };
    calcWrap.appendChild(calcBtn);
    containerEl.appendChild(calcWrap);

    // Initial render
    renderTerritories();
    updateSummary(null);

    // Add default primary layer
    addLayer('Primary', 10000000, 0);
  }

  // ── Lines (Risk Codes) ─────────────────────────────────────────────

  function addLine() {
    var line = {
      id: _nextLineId++,
      hubName: '',
      riskCode: '',
      label: '',
      grossPremium: 0,
      currency: 'GBP',
      schema: null,
      inputs: {}
    };
    _lines.push(line);
    renderLines();
  }

  function removeLine(id) {
    _lines = _lines.filter(function (l) { return l.id !== id; });
    renderLines();
  }

  function renderLines() {
    var container = document.getElementById('prog-lines');
    container.innerHTML = '';

    if (_lines.length === 0) {
      container.innerHTML = '<div class="prog-empty">No risk codes added yet</div>';
      return;
    }

    _lines.forEach(function (line) {
      var card = document.createElement('div');
      card.className = 'prog-line-card';
      card.id = 'prog-line-' + line.id;

      // Header with hub/code selector and remove button
      var hdr = document.createElement('div');
      hdr.className = 'prog-line-header';

      // Hub selector
      var hubSel = document.createElement('select');
      hubSel.className = 'prog-select';
      hubSel.innerHTML = '<option value="">Select Hub...</option>';
      var hubNames = Object.keys(_allSchemas).sort();
      hubNames.forEach(function (h) {
        var opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        if (h === line.hubName) opt.selected = true;
        hubSel.appendChild(opt);
      });
      hubSel.onchange = function () {
        line.hubName = hubSel.value;
        line.riskCode = '';
        line.schema = null;
        line.grossPremium = 0;
        renderLines();
      };
      hdr.appendChild(hubSel);

      // Risk code selector
      if (line.hubName && _allSchemas[line.hubName]) {
        var codeSel = document.createElement('select');
        codeSel.className = 'prog-select';
        codeSel.innerHTML = '<option value="">Select Code...</option>';
        _allSchemas[line.hubName].forEach(function (s) {
          var opt = document.createElement('option');
          opt.value = s.riskCode;
          opt.textContent = s.riskCode + ' — ' + s.label;
          if (s.riskCode === line.riskCode) opt.selected = true;
          codeSel.appendChild(opt);
        });
        codeSel.onchange = function () {
          var schema = _allSchemas[line.hubName].find(function (s) { return s.riskCode === codeSel.value; });
          if (schema) {
            line.riskCode = schema.riskCode;
            line.label = schema.label;
            line.schema = schema;
            line.currency = schema.currency || 'GBP';
          }
          renderLines();
        };
        hdr.appendChild(codeSel);
      }

      // Remove button
      var removeBtn = document.createElement('button');
      removeBtn.className = 'prog-remove-btn';
      removeBtn.textContent = 'x';
      removeBtn.onclick = function () { removeLine(line.id); };
      hdr.appendChild(removeBtn);

      card.appendChild(hdr);

      // If schema selected, show mini rater form + premium
      if (line.schema) {
        var body = document.createElement('div');
        body.className = 'prog-line-body';

        var form = buildMiniForm(line);
        body.appendChild(form);

        // Premium display
        var premDisp = document.createElement('div');
        premDisp.className = 'prog-line-premium';
        premDisp.id = 'prog-line-premium-' + line.id;
        var sym = line.currency === 'USD' ? '$' : line.currency === 'EUR' ? '€' : '£';
        if (line.grossPremium > 0) {
          premDisp.innerHTML = '<span class="prem-label">Gross Premium</span><span class="prem-value">' + sym + fmt2(line.grossPremium) + '</span>';
        } else {
          premDisp.innerHTML = '<span class="prem-hint">Click Calculate Line to price</span>';
        }
        body.appendChild(premDisp);

        card.appendChild(body);
      }

      container.appendChild(card);
    });
  }

  function buildMiniForm(line) {
    var schema = line.schema;
    var form = document.createElement('div');
    form.className = 'prog-mini-form';

    // Exposure field
    if (schema.modelType === 'rate-on-value') {
      form.appendChild(miniField(line.id, schema.exposureMeasure.key, schema.exposureMeasure.label,
        'number', line.inputs[schema.exposureMeasure.key] || schema.exposureMeasure.defaultValue || '', line));
    }

    // Rating factors (compact)
    schema.ratingFactors.forEach(function (fd) {
      if (fd.type === 'categorical') {
        var options = Object.keys(fd.options).map(function (k) {
          return { value: k, label: fd.options[k].label || k };
        });
        form.appendChild(miniSelect(line.id, fd.key, fd.label, options,
          line.inputs[fd.key] || fd.defaultValue || '', line));
      } else {
        form.appendChild(miniField(line.id, fd.key, fd.label, 'number',
          line.inputs[fd.key] || fd.defaultValue || '', line));
      }
    });

    // Calculate line button
    var calcBtn = document.createElement('button');
    calcBtn.className = 'prog-calc-line-btn';
    calcBtn.textContent = 'Calculate Line';
    calcBtn.onclick = function () { calculateLine(line); };
    form.appendChild(calcBtn);

    return form;
  }

  function miniField(lineId, key, label, type, defaultVal, line) {
    var wrap = document.createElement('div');
    wrap.className = 'prog-field';
    var lbl = document.createElement('label');
    lbl.textContent = label;
    var inp = document.createElement('input');
    inp.type = type;
    inp.value = defaultVal;
    inp.id = 'pf-' + lineId + '-' + key;
    if (type === 'number') inp.step = 'any';
    inp.onchange = function () { line.inputs[key] = type === 'number' ? parseFloat(inp.value) || 0 : inp.value; };
    if (!(key in line.inputs)) line.inputs[key] = type === 'number' ? (parseFloat(defaultVal) || 0) : defaultVal;
    wrap.appendChild(lbl);
    wrap.appendChild(inp);
    return wrap;
  }

  function miniSelect(lineId, key, label, options, defaultVal, line) {
    var wrap = document.createElement('div');
    wrap.className = 'prog-field';
    var lbl = document.createElement('label');
    lbl.textContent = label;
    var sel = document.createElement('select');
    sel.id = 'pf-' + lineId + '-' + key;
    options.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === defaultVal) o.selected = true;
      sel.appendChild(o);
    });
    sel.onchange = function () { line.inputs[key] = sel.value; };
    if (!(key in line.inputs)) line.inputs[key] = defaultVal;
    wrap.appendChild(lbl);
    wrap.appendChild(sel);
    return wrap;
  }

  function calculateLine(line) {
    if (!line.schema) return;
    var input = Object.assign({}, line.inputs);
    input.termYears = 1;
    var result = _raterEngine.rate(line.schema, input, {});
    line.grossPremium = result.grossPremium;
    renderLines();
  }

  // ── Layer Tower ────────────────────────────────────────────────────

  function addLayer(name, limit, attachment) {
    var layer = {
      id: _nextLayerId++,
      name: name || 'Layer ' + _nextLayerId,
      limit: limit || 5000000,
      attachment: attachment || 0,
      rateOnLine: 0,
      premium: 0,
      riStructure: []
    };
    _layers.push(layer);
    renderTower();
  }

  function removeLayer(id) {
    _layers = _layers.filter(function (l) { return l.id !== id; });
    renderTower();
  }

  function addRI(layerId) {
    var layer = _layers.find(function (l) { return l.id === layerId; });
    if (!layer) return;
    layer.riStructure.push({
      type: 'quota_share',
      share: 0.25,
      cedingCommission: 0.30
    });
    renderTower();
  }

  function removeRI(layerId, riIdx) {
    var layer = _layers.find(function (l) { return l.id === layerId; });
    if (!layer) return;
    layer.riStructure.splice(riIdx, 1);
    renderTower();
  }

  function renderTower() {
    var container = document.getElementById('prog-tower');
    container.innerHTML = '';

    if (_layers.length === 0) {
      container.innerHTML = '<div class="prog-empty">No layers defined</div>';
      return;
    }

    // Sort layers by attachment (highest first for visual tower)
    var sorted = _layers.slice().sort(function (a, b) { return b.attachment - a.attachment; });

    sorted.forEach(function (layer) {
      var card = document.createElement('div');
      card.className = 'prog-layer-card';

      // Header
      var hdr = document.createElement('div');
      hdr.className = 'prog-layer-header';

      var nameInp = document.createElement('input');
      nameInp.type = 'text';
      nameInp.value = layer.name;
      nameInp.className = 'prog-layer-name';
      nameInp.onchange = function () { layer.name = nameInp.value; };

      var removeBtn = document.createElement('button');
      removeBtn.className = 'prog-remove-btn';
      removeBtn.textContent = 'x';
      removeBtn.onclick = function () { removeLayer(layer.id); };

      hdr.appendChild(nameInp);
      hdr.appendChild(removeBtn);
      card.appendChild(hdr);

      // Layer fields
      var fields = document.createElement('div');
      fields.className = 'prog-layer-fields';

      fields.appendChild(layerField('Limit', layer.limit, function (v) { layer.limit = v; }));
      fields.appendChild(layerField('Attachment (xs)', layer.attachment, function (v) { layer.attachment = v; }));
      fields.appendChild(layerField('Rate on Line', layer.rateOnLine, function (v) { layer.rateOnLine = v; }, true));
      fields.appendChild(layerField('Premium (manual)', layer.premium, function (v) { layer.premium = v; }));

      card.appendChild(fields);

      // Exhaustion point display
      var exh = document.createElement('div');
      exh.className = 'prog-layer-exhaust';
      exh.textContent = fmt2(layer.limit) + ' xs ' + fmt2(layer.attachment) + ' (exhausts at ' + fmt2(layer.limit + layer.attachment) + ')';
      card.appendChild(exh);

      // RI placements
      var riSection = document.createElement('div');
      riSection.className = 'prog-ri-section';
      var riTitle = document.createElement('div');
      riTitle.className = 'prog-ri-title';
      riTitle.textContent = 'Reinsurance Placements';
      riSection.appendChild(riTitle);

      (layer.riStructure || []).forEach(function (ri, riIdx) {
        riSection.appendChild(renderRIPlacement(layer.id, ri, riIdx));
      });

      var addRIBtn = document.createElement('button');
      addRIBtn.className = 'prog-add-ri-btn';
      addRIBtn.textContent = '+ Add RI Placement';
      addRIBtn.onclick = function () { addRI(layer.id); };
      riSection.appendChild(addRIBtn);

      card.appendChild(riSection);
      container.appendChild(card);
    });
  }

  function layerField(label, value, onChange, isRate) {
    var wrap = document.createElement('div');
    wrap.className = 'prog-layer-field';
    var lbl = document.createElement('label');
    lbl.textContent = label;
    var inp = document.createElement('input');
    inp.type = 'number';
    inp.step = isRate ? '0.001' : 'any';
    inp.value = value || '';
    inp.onchange = function () { onChange(parseFloat(inp.value) || 0); };
    wrap.appendChild(lbl);
    wrap.appendChild(inp);
    return wrap;
  }

  function renderRIPlacement(layerId, ri, riIdx) {
    var wrap = document.createElement('div');
    wrap.className = 'prog-ri-placement';

    // Type selector
    var typeSel = document.createElement('select');
    typeSel.className = 'prog-ri-type';
    [
      { value: 'quota_share', label: 'Quota Share' },
      { value: 'surplus', label: 'Surplus Treaty' },
      { value: 'xol_fac', label: 'XoL Facultative' },
      { value: 'xol_treaty', label: 'XoL Treaty' }
    ].forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === ri.type) o.selected = true;
      typeSel.appendChild(o);
    });
    typeSel.onchange = function () { ri.type = typeSel.value; };

    // Share
    var shareInp = document.createElement('input');
    shareInp.type = 'number';
    shareInp.step = '0.01';
    shareInp.value = (ri.share * 100).toFixed(0);
    shareInp.className = 'prog-ri-input';
    shareInp.title = 'Ceded share %';
    shareInp.onchange = function () { ri.share = (parseFloat(shareInp.value) || 0) / 100; };

    var shareLbl = document.createElement('span');
    shareLbl.className = 'prog-ri-label';
    shareLbl.textContent = '% ceded';

    // Ceding commission
    var commInp = document.createElement('input');
    commInp.type = 'number';
    commInp.step = '0.01';
    commInp.value = ((ri.cedingCommission || 0) * 100).toFixed(0);
    commInp.className = 'prog-ri-input';
    commInp.title = 'Ceding commission %';
    commInp.onchange = function () { ri.cedingCommission = (parseFloat(commInp.value) || 0) / 100; };

    var commLbl = document.createElement('span');
    commLbl.className = 'prog-ri-label';
    commLbl.textContent = '% comm';

    // Remove
    var removeBtn = document.createElement('button');
    removeBtn.className = 'prog-remove-btn prog-ri-remove';
    removeBtn.textContent = 'x';
    removeBtn.onclick = function () { removeRI(layerId, riIdx); };

    wrap.appendChild(typeSel);
    wrap.appendChild(shareInp);
    wrap.appendChild(shareLbl);
    wrap.appendChild(commInp);
    wrap.appendChild(commLbl);
    wrap.appendChild(removeBtn);

    return wrap;
  }

  // ── Territories ────────────────────────────────────────────────────

  function renderTerritories() {
    var container = document.getElementById('prog-territories');
    container.innerHTML = '';

    _territories.forEach(function (t, idx) {
      var row = document.createElement('div');
      row.className = 'prog-terr-row';

      var nameInp = document.createElement('input');
      nameInp.type = 'text';
      nameInp.value = t.label;
      nameInp.className = 'prog-terr-name';
      nameInp.onchange = function () { t.label = nameInp.value; };

      var codeInp = document.createElement('input');
      codeInp.type = 'text';
      codeInp.value = t.code;
      codeInp.className = 'prog-terr-code';
      codeInp.onchange = function () { t.code = codeInp.value; };

      var shareInp = document.createElement('input');
      shareInp.type = 'number';
      shareInp.step = '0.01';
      shareInp.value = (t.share * 100).toFixed(1);
      shareInp.className = 'prog-terr-share';
      shareInp.onchange = function () { t.share = (parseFloat(shareInp.value) || 0) / 100; };

      var pctLabel = document.createElement('span');
      pctLabel.textContent = '%';

      var removeBtn = document.createElement('button');
      removeBtn.className = 'prog-remove-btn';
      removeBtn.textContent = 'x';
      removeBtn.onclick = function () {
        _territories.splice(idx, 1);
        renderTerritories();
      };

      row.appendChild(codeInp);
      row.appendChild(nameInp);
      row.appendChild(shareInp);
      row.appendChild(pctLabel);
      row.appendChild(removeBtn);
      container.appendChild(row);
    });

    var addBtn = document.createElement('button');
    addBtn.className = 'prog-add-btn prog-add-terr';
    addBtn.textContent = '+ Add Territory';
    addBtn.onclick = function () {
      _territories.push({ code: 'XX', label: 'New Territory', share: 0 });
      renderTerritories();
    };
    container.appendChild(addBtn);
  }

  // ── Calculate Programme ────────────────────────────────────────────

  function calculateProgramme() {
    // First calculate any lines that haven't been priced
    _lines.forEach(function (line) {
      if (line.schema && line.grossPremium === 0) {
        calculateLine(line);
      }
    });

    // Build programme object
    var programme = {
      lines: _lines.map(function (l) {
        return { riskCode: l.riskCode, label: l.label, grossPremium: l.grossPremium, currency: l.currency };
      }),
      layers: _layers,
      territories: _territories
    };

    var result = _engine.calculate(programme);
    renderResults(result);
    updateSummary(result);
  }

  // ── Results ────────────────────────────────────────────────────────

  function renderResults(result) {
    var container = document.getElementById('prog-results');
    container.innerHTML = '';
    if (!result) return;

    var sym = '$'; // default

    // Tower results
    if (result.tower && result.tower.layers.length > 0) {
      var towerDiv = document.createElement('div');
      towerDiv.className = 'prog-tower-results';

      var tbl = document.createElement('table');
      tbl.className = 'prog-results-table';
      tbl.innerHTML = '<thead><tr><th>Layer</th><th>Limit</th><th>Attachment</th><th>RoL</th><th>Premium</th><th>Retained</th><th>Ceded</th></tr></thead>';
      var tbody = document.createElement('tbody');

      result.tower.layers.forEach(function (lr) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + lr.name + '</td>' +
          '<td>' + fmt2(lr.limit) + '</td>' +
          '<td>' + fmt2(lr.attachment) + '</td>' +
          '<td>' + fmtPct1(lr.rateOnLine) + '</td>' +
          '<td>' + fmt2(lr.grossPremium) + '</td>' +
          '<td>' + fmt2(lr.retainedPremium) + '</td>' +
          '<td>' + fmt2(lr.totalCeded) + '</td>';
        tbody.appendChild(tr);
      });

      // Totals row
      var totRow = document.createElement('tr');
      totRow.className = 'prog-totals-row';
      totRow.innerHTML = '<td><strong>Total</strong></td><td></td><td></td><td></td>' +
        '<td><strong>' + fmt2(result.tower.totalGrossPremium) + '</strong></td>' +
        '<td><strong>' + fmt2(result.tower.totalRetainedPremium) + '</strong></td>' +
        '<td><strong>' + fmt2(result.tower.totalCededPremium) + '</strong></td>';
      tbody.appendChild(totRow);

      tbl.appendChild(tbody);
      towerDiv.appendChild(tbl);
      container.appendChild(towerDiv);
    }

    // Territory split
    if (result.territories && result.territories.length > 0) {
      var terrDiv = document.createElement('div');
      terrDiv.className = 'prog-terr-results';
      var terrH = document.createElement('h3');
      terrH.textContent = 'Territory Allocation (Retained Premium)';
      terrDiv.appendChild(terrH);

      var terrTbl = document.createElement('table');
      terrTbl.className = 'prog-results-table';
      terrTbl.innerHTML = '<thead><tr><th>Territory</th><th>Share</th><th>Premium</th></tr></thead>';
      var terrBody = document.createElement('tbody');

      result.territories.forEach(function (t) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + t.label + ' (' + t.code + ')</td>' +
          '<td>' + fmtPct1(t.share) + '</td>' +
          '<td>' + fmt2(t.premium) + '</td>';
        terrBody.appendChild(tr);
      });
      terrTbl.appendChild(terrBody);
      terrDiv.appendChild(terrTbl);
      container.appendChild(terrDiv);
    }
  }

  function updateSummary(result) {
    var el = document.getElementById('prog-summary');
    if (!result) {
      el.innerHTML = '<div class="prog-summary-empty">Add risk codes and layers, then Calculate Programme</div>';
      return;
    }

    var s = result.summary;
    el.innerHTML =
      '<div class="prog-summary-grid">' +
        '<div class="prog-summary-item prog-summary-main">' +
          '<span class="prog-s-label">Total Line Premium</span>' +
          '<span class="prog-s-value">' + fmt2(s.totalLinePremium) + '</span>' +
        '</div>' +
        '<div class="prog-summary-item">' +
          '<span class="prog-s-label">Tower Premium</span>' +
          '<span class="prog-s-value">' + fmt2(s.totalTowerPremium) + '</span>' +
        '</div>' +
        '<div class="prog-summary-item">' +
          '<span class="prog-s-label">Retained</span>' +
          '<span class="prog-s-value prog-s-profit">' + fmt2(s.totalRetainedPremium) + ' (' + fmtPct1(s.retentionRate) + ')</span>' +
        '</div>' +
        '<div class="prog-summary-item">' +
          '<span class="prog-s-label">Ceded</span>' +
          '<span class="prog-s-value">' + fmt2(s.totalCededPremium) + '</span>' +
        '</div>' +
        '<div class="prog-summary-item">' +
          '<span class="prog-s-label">Commission Back</span>' +
          '<span class="prog-s-value">' + fmt2(s.totalCommissionBack) + '</span>' +
        '</div>' +
        '<div class="prog-summary-item">' +
          '<span class="prog-s-label">Net RI Cost</span>' +
          '<span class="prog-s-value">' + fmt2(s.netRICost) + '</span>' +
        '</div>' +
        '<div class="prog-summary-item">' +
          '<span class="prog-s-label">Lines / Layers / Territories</span>' +
          '<span class="prog-s-value">' + s.lineCount + ' / ' + s.layerCount + ' / ' + s.territoryCount + '</span>' +
        '</div>' +
      '</div>';
  }

  // ── Exports ────────────────────────────────────────────────────────

  exports.init = init;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.ProgrammeUI = {}));
