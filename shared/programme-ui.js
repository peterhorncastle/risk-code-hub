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

  // ── Educational Guide ──────────────────────────────────────────────

  function buildGuidePanel() {
    var guide = document.createElement('div');
    guide.className = 'prog-guide';

    var toggle = document.createElement('button');
    toggle.className = 'prog-guide-toggle';
    var icon = document.createElement('span');
    icon.className = 'prog-guide-icon';
    icon.textContent = '▶';
    toggle.appendChild(icon);
    toggle.appendChild(document.createTextNode(' How to Use the Programme Builder'));

    var body = document.createElement('div');
    body.className = 'prog-guide-body';
    body.innerHTML =
      '<h4>Overview</h4>' +
      '<p>This tool builds a multi-line insurance programme from the ground up. ' +
      'Add individual risk codes (lines of business), stack them into a layer tower ' +
      'with reinsurance protection, and allocate the retained premium across territories.</p>' +

      '<h4>Risk Code Lines</h4>' +
      '<p>Each line represents a single class of business — for example Aviation Hull (H2) or Marine Cargo (C3). ' +
      'Select a hub and risk code from the dropdowns, enter the exposure details into the mini rater, ' +
      'then click <strong>Calculate Line</strong> to generate a gross premium using the bottom-up loss-cost model.</p>' +

      '<h4>Layer Tower</h4>' +
      '<p>Insurance programmes are structured as a vertical tower of coverage layers. ' +
      'Each layer has a <em>limit</em> (maximum payout) and an <em>attachment point</em> ' +
      '(the loss amount at which the layer starts paying). ' +
      'The primary layer typically attaches at ground level (0); excess layers stack above.</p>' +
      '<dl>' +
        '<dt>Limit</dt>' +
        '<dd>The maximum amount this layer will pay for a single loss. For example, a $10M primary layer pays up to $10M per loss.</dd>' +
        '<dt>Attachment (xs)</dt>' +
        '<dd>The deductible or retention below this layer. A layer described as "$10M xs $10M" pays losses between $10M and $20M.</dd>' +
        '<dt>Rate on Line (RoL)</dt>' +
        '<dd>Premium expressed as a percentage of the limit. Enter as a decimal: 0.05 = 5%. A 5% RoL on a $10M limit produces $500,000 premium.</dd>' +
        '<dt>Premium (manual)</dt>' +
        '<dd>Alternatively, enter the layer premium directly. This overrides the RoL calculation.</dd>' +
        '<dt>Exhaustion Point</dt>' +
        '<dd>Attachment + Limit — the total loss at which the layer is fully used up. Shown automatically below each layer.</dd>' +
      '</dl>' +

      '<h4>Reinsurance (RI) Placements</h4>' +
      '<p>Reinsurance transfers part of each layer\'s risk to a reinsurer. ' +
      'Each placement has a type, a ceded share (% of premium passed to the reinsurer), ' +
      'and a ceding commission (% the reinsurer pays back to cover acquisition costs).</p>' +
      '<dl>' +
        '<dt>Quota Share</dt>' +
        '<dd>Proportional treaty — the reinsurer takes a fixed percentage of every risk on the layer. ' +
        'Simple and predictable; both premium and losses are shared in the same proportion.</dd>' +
        '<dt>Surplus Treaty</dt>' +
        '<dd>Proportional treaty — the reinsurer takes the surplus above the insurer\'s retained line. ' +
        'The ceded share varies by risk size; larger risks cede more.</dd>' +
        '<dt>XoL Facultative</dt>' +
        '<dd>Excess of Loss on a single risk (non-proportional). The reinsurer pays losses that exceed a per-risk retention, ' +
        'placed on a case-by-case basis.</dd>' +
        '<dt>XoL Treaty</dt>' +
        '<dd>Excess of Loss across the portfolio (non-proportional). Covers aggregate or per-occurrence losses ' +
        'exceeding a retention, under a standing treaty agreement.</dd>' +
        '<dt>% Ceded</dt>' +
        '<dd>The proportion of premium passed to the reinsurer. For quota share, this equals the risk share (e.g. 25% ceded = 25% of losses covered).</dd>' +
        '<dt>% Commission</dt>' +
        '<dd>Ceding commission — the percentage the reinsurer pays back to the cedant to cover business acquisition costs ' +
        '(e.g. brokerage, administration). A 30% commission on $125,000 ceded returns $37,500.</dd>' +
      '</dl>' +

      '<h4>Territory Split</h4>' +
      '<p>Allocates the retained premium (after reinsurance) across geographic territories. ' +
      'This is used for regulatory capital allocation, solvency reporting, and performance tracking by region. ' +
      'Shares should sum to 100%.</p>' +

      '<h4>Summary Banner</h4>' +
      '<dl>' +
        '<dt>Total Line Premium</dt>' +
        '<dd>Sum of all individual risk code gross premiums, calculated bottom-up from each line\'s rating model.</dd>' +
        '<dt>Tower Premium</dt>' +
        '<dd>Total premium across all layers in the tower. May differ from line premium if layers are priced separately using Rate on Line.</dd>' +
        '<dt>Retained</dt>' +
        '<dd>Premium kept by the insurer after ceding to reinsurers. Shown with retention rate as a percentage.</dd>' +
        '<dt>Ceded</dt>' +
        '<dd>Total premium passed to reinsurers across all placements.</dd>' +
        '<dt>Commission Back</dt>' +
        '<dd>Total ceding commission returned by reinsurers — offsets part of the cost of reinsurance.</dd>' +
        '<dt>Net RI Cost</dt>' +
        '<dd>Ceded minus Commission Back — the true net cost of buying reinsurance protection.</dd>' +
      '</dl>';

    toggle.onclick = function () {
      var isOpen = body.classList.contains('open');
      body.classList.toggle('open');
      icon.classList.toggle('open');
    };

    guide.appendChild(toggle);
    guide.appendChild(body);
    return guide;
  }

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

    // Educational guide panel
    containerEl.appendChild(buildGuidePanel());

    // Main layout: 3 columns
    var main = document.createElement('div');
    main.className = 'prog-main';

    // Col 1: Lines (risk codes)
    var linesCol = document.createElement('div');
    linesCol.className = 'prog-col prog-lines-col';
    linesCol.innerHTML = '<h2>Risk Code Lines</h2>' +
      '<p class="prog-section-help">Each line represents an individual class of business (e.g. Aviation Hull, Marine Cargo). ' +
      'Select a hub and risk code, fill in the exposure details, then click Calculate Line to price it.</p>';
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
    towerCol.innerHTML = '<h2>Layer Tower</h2>' +
      '<p class="prog-section-help">A tower stacks layers of insurance cover. The primary layer pays first; ' +
      'excess layers attach above it. Set a Rate on Line or manual premium for each layer, then add reinsurance placements to cede risk.</p>';
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
    rightCol.innerHTML = '<h2>Territory Split</h2>' +
      '<p class="prog-section-help">Allocates retained premium across geographic territories. ' +
      'Shares should sum to 100%. Used for regulatory capital allocation and solvency reporting.</p>';
    var terrContainer = document.createElement('div');
    terrContainer.id = 'prog-territories';
    rightCol.appendChild(terrContainer);
    var resultsHeader = document.createElement('h2');
    resultsHeader.textContent = 'Programme Results';
    resultsHeader.style.marginTop = '24px';
    rightCol.appendChild(resultsHeader);
    var resultsHelp = document.createElement('p');
    resultsHelp.className = 'prog-section-help';
    resultsHelp.textContent = 'Shows each layer\'s gross premium, how much is retained vs. ceded to reinsurers, and how retained premium is split across territories.';
    rightCol.appendChild(resultsHelp);
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

      fields.appendChild(layerField('Limit', layer.limit, function (v) { layer.limit = v; }, false,
        'Maximum payout for a single loss on this layer'));
      fields.appendChild(layerField('Attachment (xs)', layer.attachment, function (v) { layer.attachment = v; }, false,
        'Loss amount at which this layer begins to pay'));
      fields.appendChild(layerField('Rate on Line', layer.rateOnLine, function (v) { layer.rateOnLine = v; }, true,
        'Premium as % of limit (e.g. 0.05 = 5%)'));
      fields.appendChild(layerField('Premium (manual)', layer.premium, function (v) { layer.premium = v; }, false,
        'Override: enter premium directly instead of using RoL'));

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

  function layerField(label, value, onChange, isRate, hint) {
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
    if (hint) {
      var h = document.createElement('div');
      h.className = 'prog-field-hint';
      h.textContent = hint;
      wrap.appendChild(h);
    }
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
