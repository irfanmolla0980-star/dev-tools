// Navbar toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// Active link highlight
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) link.classList.add('active');
});

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ====================
// UNIT DEFINITIONS
// =====================
// Each unit has: name, symbol, and either factor (multiply to base) or special function

const UNITS = {
  length: {
    base: 'meter',
    units: {
      nanometer:   { symbol: 'nm',  factor: 1e-9 },
      micrometer:  { symbol: 'µm',  factor: 1e-6 },
      millimeter:  { symbol: 'mm',  factor: 0.001 },
      centimeter:  { symbol: 'cm',  factor: 0.01 },
      decimeter:   { symbol: 'dm',  factor: 0.1 },
      meter:       { symbol: 'm',   factor: 1 },
      decameter:   { symbol: 'dam', factor: 10 },
      hectometer:  { symbol: 'hm',  factor: 100 },
      kilometer:   { symbol: 'km',  factor: 1000 },
      inch:        { symbol: 'in',  factor: 0.0254 },
      foot:        { symbol: 'ft',  factor: 0.3048 },
      yard:        { symbol: 'yd',  factor: 0.9144 },
      mile:        { symbol: 'mi',  factor: 1609.344 },
      nauticalMile:{ symbol: 'nmi', factor: 1852 }
    }
  },

  weight: {
    base: 'kilogram',
    units: {
      microgram:  { symbol: 'µg', factor: 1e-9 },
      milligram:  { symbol: 'mg', factor: 1e-6 },
      gram:       { symbol: 'g',  factor: 0.001 },
      decagram:   { symbol: 'dag',factor: 0.01 },
      hectogram:  { symbol: 'hg', factor: 0.1 },
      kilogram:   { symbol: 'kg', factor: 1 },
      tonMetric:  { symbol: 't',  factor: 1000 },
      ounce:      { symbol: 'oz', factor: 0.0283495 },
      pound:      { symbol: 'lb', factor: 0.453592 },
      stone:      { symbol: 'st', factor: 6.35029 },
      tonUS:      { symbol: 'ton',factor: 907.185 }
    }
  },

  temperature: {
    base: 'celsius',
    special: true,
    units: {
      celsius:    { symbol: '°C' },
      fahrenheit: { symbol: '°F' },
      kelvin:     { symbol: 'K' }
    }
  },

  area: {
    base: 'squareMeter',
    units: {
      squareMillimeter: { symbol: 'mm²', factor: 1e-6 },
      squareCentimeter: { symbol: 'cm²', factor: 1e-4 },
      squareMeter:      { symbol: 'm²',  factor: 1 },
      squareKilometer:  { symbol: 'km²', factor: 1e6 },
      squareInch:       { symbol: 'in²', factor: 0.00064516 },
      squareFoot:       { symbol: 'ft²', factor: 0.092903 },
      squareYard:       { symbol: 'yd²', factor: 0.836127 },
      acre:             { symbol: 'ac',  factor: 4046.86 },
      hectare:          { symbol: 'ha',  factor: 10000 },
      squareMile:       { symbol: 'mi²', factor: 2.59e6 }
    }
  },

  volume: {
    base: 'liter',
    units: {
      milliliter:  { symbol: 'mL', factor: 0.001 },
      centiliter:  { symbol: 'cL', factor: 0.01 },
      deciliter:   { symbol: 'dL', factor: 0.1 },
      liter:       { symbol: 'L',  factor: 1 },
      cubicMeter:  { symbol: 'm³', factor: 1000 },
      cubicCm:     { symbol: 'cm³',factor: 0.001 },
      teaspoonUS:  { symbol: 'tsp',factor: 0.00492892 },
      tablespoonUS:{ symbol: 'tbsp',factor: 0.0147868 },
      fluidOunceUS:{ symbol: 'fl oz',factor: 0.0295735 },
      cupUS:       { symbol: 'cup',factor: 0.236588 },
      pintUS:      { symbol: 'pt', factor: 0.473176 },
      quartUS:     { symbol: 'qt', factor: 0.946353 },
      gallonUS:    { symbol: 'gal',factor: 3.78541 },
      gallonUK:    { symbol: 'gal UK',factor: 4.54609 }
    }
  },

  time: {
    base: 'second',
    units: {
      nanosecond:  { symbol: 'ns',  factor: 1e-9 },
      microsecond: { symbol: 'µs',  factor: 1e-6 },
      millisecond: { symbol: 'ms',  factor: 0.001 },
      second:      { symbol: 's',   factor: 1 },
      minute:      { symbol: 'min', factor: 60 },
      hour:        { symbol: 'h',   factor: 3600 },
      day:         { symbol: 'd',   factor: 86400 },
      week:        { symbol: 'wk',  factor: 604800 },
      month:       { symbol: 'mo',  factor: 2629800 },
      year:        { symbol: 'yr',  factor: 31557600 }
    }
  },

  speed: {
    base: 'meterPerSecond',
    units: {
      meterPerSecond: { symbol: 'm/s', factor: 1 },
      kilometerPerHour:{ symbol: 'km/h', factor: 0.277778 },
      milePerHour:    { symbol: 'mph', factor: 0.44704 },
      footPerSecond:  { symbol: 'ft/s', factor: 0.3048 },
      knot:           { symbol: 'kn',  factor: 0.514444 }
    }
  },

  data: {
    base: 'byte',
    units: {
      bit:         { symbol: 'bit', factor: 0.125 },
      byte:        { symbol: 'B',   factor: 1 },
      kilobyte:    { symbol: 'KB',  factor: 1024 },
      megabyte:    { symbol: 'MB',  factor: 1048576 },
      gigabyte:    { symbol: 'GB',  factor: 1073741824 },
      terabyte:    { symbol: 'TB',  factor: 1.0995e12 },
      petabyte:    { symbol: 'PB',  factor: 1.1259e15 },
      kibibyte:    { symbol: 'KiB', factor: 1024 },
      mebibyte:    { symbol: 'MiB', factor: 1048576 },
      gibibyte:    { symbol: 'GiB', factor: 1073741824 },
      tebibyte:    { symbol: 'TiB', factor: 1.0995e12 }
    }
  },

  energy: {
    base: 'joule',
    units: {
      electronvolt: { symbol: 'eV',  factor: 1.60218e-19 },
      joule:        { symbol: 'J',   factor: 1 },
      kilojoule:    { symbol: 'kJ',  factor: 1000 },
      calorie:      { symbol: 'cal', factor: 4.184 },
      kilocalorie:  { symbol: 'kcal',factor: 4184 },
      wattHour:     { symbol: 'Wh',  factor: 3600 },
      kilowattHour: { symbol: 'kWh', factor: 3.6e6 },
      BTU:          { symbol: 'BTU', factor: 1055.06 }
    }
  },

  pressure: {
    base: 'pascal',
    units: {
      pascal:     { symbol: 'Pa',  factor: 1 },
      kilopascal: { symbol: 'kPa', factor: 1000 },
      bar:        { symbol: 'bar', factor: 100000 },
      millibar:   { symbol: 'mbar',factor: 100 },
      atmosphere: { symbol: 'atm', factor: 101325 },
      psi:        { symbol: 'psi', factor: 6894.76 },
      torr:       { symbol: 'Torr',factor: 133.322 },
      mmHg:       { symbol: 'mmHg',factor: 133.322 }
    }
  }
};

// ==========
// STATE
// ===========

let currentCategory = 'length';

// ===================
// ELEMENT REFERENCES
// ====================

const categoryButtons = document.querySelectorAll('.cat-btn');
const inputValue = document.getElementById('inputValue');
const clearBtn = document.getElementById('clearBtn');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const mainValue = document.getElementById('mainValue');
const mainCopyBtn = document.getElementById('mainCopyBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const allUnitsList = document.getElementById('allUnitsList');
const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// ==========================
// TEMPERATURE CONVERSIONS
// ============================

function tempToCelsius(value, from) {
  if (from === 'celsius') return value;
  if (from === 'fahrenheit') return (value - 32) * 5 / 9;
  if (from === 'kelvin') return value - 273.15;
  return value;
}

function celsiusToTemp(celsius, to) {
  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return celsius * 9 / 5 + 32;
  if (to === 'kelvin') return celsius + 273.15;
  return celsius;
}

// ============
// CONVERSION
// =============

function convert(value, from, to) {
  const cat = UNITS[currentCategory];

  if (cat.special && currentCategory === 'temperature') {
    const celsius = tempToCelsius(value, from);
    return celsiusToTemp(celsius, to);
  }

  const fromFactor = cat.units[from].factor;
  const toFactor = cat.units[to].factor;

  return (value * fromFactor) / toFactor;
}

// ==================
// POPULATE UNITS
// ===================

function populateUnits() {
  const cat = UNITS[currentCategory];
  const unitKeys = Object.keys(cat.units);

  let html = '';
  unitKeys.forEach(key => {
    const unit = cat.units[key];
    const label = formatUnitName(key) + ' (' + unit.symbol + ')';
    html += `<option value="${key}">${label}</option>`;
  });

  fromUnit.innerHTML = html;
  toUnit.innerHTML = html;

  // Set defaults
  if (currentCategory === 'length') {
    fromUnit.value = 'meter';
    toUnit.value = 'foot';
  } else if (currentCategory === 'weight') {
    fromUnit.value = 'kilogram';
    toUnit.value = 'pound';
  } else if (currentCategory === 'temperature') {
    fromUnit.value = 'celsius';
    toUnit.value = 'fahrenheit';
  } else if (currentCategory === 'area') {
    fromUnit.value = 'squareMeter';
    toUnit.value = 'squareFoot';
  } else if (currentCategory === 'volume') {
    fromUnit.value = 'liter';
    toUnit.value = 'gallonUS';
  } else if (currentCategory === 'time') {
    fromUnit.value = 'second';
    toUnit.value = 'minute';
  } else if (currentCategory === 'speed') {
    fromUnit.value = 'kilometerPerHour';
    toUnit.value = 'milePerHour';
  } else if (currentCategory === 'data') {
    fromUnit.value = 'megabyte';
    toUnit.value = 'gigabyte';
  } else if (currentCategory === 'energy') {
    fromUnit.value = 'joule';
    toUnit.value = 'calorie';
  } else if (currentCategory === 'pressure') {
    fromUnit.value = 'bar';
    toUnit.value = 'psi';
  } else {
    fromUnit.value = unitKeys[0];
    toUnit.value = unitKeys[unitKeys.length - 1];
  }
}

// Format unit key to readable name
function formatUnitName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// ======================
// NUMBER FORMATTING
// =======================

function formatNumber(num) {
  if (!isFinite(num)) return '—';
  if (num === 0) return '0';

  const abs = Math.abs(num);

  // Very small or very large — use exponential
  if (abs < 1e-6 || abs >= 1e15) {
    return num.toExponential(4);
  }

  // Regular — up to 6 significant digits
  let str = num.toPrecision(6);

  // Remove trailing zeros
  if (str.includes('.')) {
    str = str.replace(/0+$/, '').replace(/\.$/, '');
  }

  // Add thousands separator
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// ===============
// MAIN UPDATE
// ===============

function updateConversion() {
  const raw = inputValue.value.trim();

  if (raw === '') {
    clearBtn.classList.remove('show');
    mainValue.textContent = '—';
    allUnitsList.innerHTML = '';
    detailsContent.innerHTML = '<p class="no-details">Enter a value to see details.</p>';
    return;
  }

  clearBtn.classList.add('show');

  const value = parseFloat(raw);
  if (isNaN(value)) {
    mainValue.textContent = '⚠️ Invalid';
    allUnitsList.innerHTML = '';
    return;
  }

  const from = fromUnit.value;
  const to = toUnit.value;
  const result = convert(value, from, to);

  mainValue.textContent = formatNumber(result) + ' ' + UNITS[currentCategory].units[to].symbol;

  renderAllUnits(value, from);
  buildDetails(value, from, to, result);
}

// =====================
// RENDER ALL UNITS
// ======================

function renderAllUnits(value, fromUnit) {
  const cat = UNITS[currentCategory];
  const unitKeys = Object.keys(cat.units);

  let html = '';

  unitKeys.forEach(key => {
    const result = convert(value, fromUnit, key);
    const unit = cat.units[key];
    const isHighlight = key === fromUnit;

    html += `
      <div class="unit-row ${isHighlight ? 'highlight' : ''}" data-value="${key}">
        <span class="unit-name">${unit.symbol}</span>
        <span class="unit-value">${formatNumber(result)}</span>
      </div>
    `;
  });

  allUnitsList.innerHTML = html;

  // Click to copy
  allUnitsList.querySelectorAll('.unit-row').forEach(row => {
    row.addEventListener('click', () => {
      const key = row.dataset.value;
      const result = convert(value, fromUnit, key);
      const text = formatNumber(result) + ' ' + cat.units[key].symbol;

      navigator.clipboard.writeText(text).then(() => {
        const original = row.querySelector('.unit-value').textContent;
        row.querySelector('.unit-value').textContent = '✓ Copied';
        setTimeout(() => {
          row.querySelector('.unit-value').textContent = original;
        }, 800);
      });
    });
  });
}

// ===========
// DETAILS
// ===========

function buildDetails(value, from, to, result) {
  if (!detailsContent) return;

  const cat = UNITS[currentCategory];
  const fromUnitData = cat.units[from];
  const toUnitData = cat.units[to];

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">Category</span><span class="detail-arrow">→</span><span class="detail-value">${formatUnitName(currentCategory)}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Input</span><span class="detail-arrow">→</span><span class="detail-value">${formatNumber(value)} ${fromUnitData.symbol}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Output</span><span class="detail-arrow">→</span><span class="detail-value">${formatNumber(result)} ${toUnitData.symbol}</span></div>`;

  if (cat.special && currentCategory === 'temperature') {
    const celsius = tempToCelsius(value, from);
    html += `<div class="detail-row"><span class="detail-char">Celsius</span><span class="detail-arrow">→</span><span class="detail-value">${formatNumber(celsius)} °C</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Fahrenheit</span><span class="detail-arrow">→</span><span class="detail-value">${formatNumber(celsiusToTemp(celsius, 'fahrenheit'))} °F</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Kelvin</span><span class="detail-arrow">→</span><span class="detail-value">${formatNumber(celsiusToTemp(celsius, 'kelvin'))} K</span></div>`;
  } else {
    const fromFactor = fromUnitData.factor;
    const toFactor = toUnitData.factor;
    const baseValue = value * fromFactor;
    const baseName = formatUnitName(cat.base);

    html += `<div class="detail-row"><span class="detail-char">Base value</span><span class="detail-arrow">→</span><span class="detail-value">${formatNumber(baseValue)} ${baseName}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">From factor</span><span class="detail-arrow">→</span><span class="detail-value">${fromFactor}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">To factor</span><span class="detail-arrow">→</span><span class="detail-value">${toFactor}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Formula</span><span class="detail-arrow">→</span><span class="detail-value">(${formatNumber(value)} × ${fromFactor}) ÷ ${toFactor}</span></div>`;
  }

  html += `<div class="detail-row"><span class="detail-char">Total units</span><span class="detail-arrow">→</span><span class="detail-value">${Object.keys(cat.units).length}</span></div>`;

  detailsContent.innerHTML = html;
}

// ====================
// CATEGORY SWITCH
// ===================

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    populateUnits();
    updateConversion();
  });
});

// =========
// INPUT
// ==========

inputValue.addEventListener('input', updateConversion);

clearBtn.addEventListener('click', () => {
  inputValue.value = '';
  clearBtn.classList.remove('show');
  updateConversion();
  inputValue.focus();
});

// ================
// SELECT CHANGE
// =================

fromUnit.addEventListener('change', updateConversion);
toUnit.addEventListener('change', updateConversion);

// ========
// SWAP
// ========

swapBtn.addEventListener('click', () => {
  const temp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = temp;
  updateConversion();
});

// ================
// COPY BUTTONS
// ================

mainCopyBtn.addEventListener('click', () => {
  const text = mainValue.textContent;
  if (!text || text === '—' || text.startsWith('⚠️')) return;

  navigator.clipboard.writeText(text).then(() => {
    const original = mainCopyBtn.textContent;
    mainCopyBtn.textContent = '✓';
    mainCopyBtn.classList.add('copied');
    setTimeout(() => {
      mainCopyBtn.textContent = original;
      mainCopyBtn.classList.remove('copied');
    }, 1000);
  });
});

copyAllBtn.addEventListener('click', () => {
  const raw = inputValue.value.trim();
  if (raw === '') return;

  const value = parseFloat(raw);
  if (isNaN(value)) return;

  const cat = UNITS[currentCategory];
  const from = fromUnit.value;
  const unitKeys = Object.keys(cat.units);

  const lines = unitKeys.map(key => {
    const result = convert(value, from, key);
    return `${formatNumber(result)} ${cat.units[key].symbol}`;
  });

  const text = `${value} ${cat.units[from].symbol} equals:\n` + lines.join('\n');

  navigator.clipboard.writeText(text).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied All';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1400);
  });
});

// ==============
// DETAILS TOGGLE
// ==============

if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// =======
// INIT
// =======

populateUnits();
updateConversion();