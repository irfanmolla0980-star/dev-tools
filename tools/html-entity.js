// Navbar
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) link.classList.add('active');
});

const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Elements
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const sampleBtn = document.getElementById('sampleBtn');
const swapBtn = document.getElementById('swapBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const modeTabs = document.querySelectorAll('.mode-tab');

const optHtmlSpecial = document.getElementById('optHtmlSpecial');
const optNonAscii = document.getElementById('optNonAscii');
const optNumeric = document.getElementById('optNumeric');
const optQuotes = document.getElementById('optQuotes');

const statInput = document.getElementById('statInput');
const statOutput = document.getElementById('statOutput');
const statEntities = document.getElementById('statEntities');
const statIncrease = document.getElementById('statIncrease');

const entityTabs = document.querySelectorAll('.entity-tab');
const entitiesGrid = document.getElementById('entitiesGrid');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let currentMode = 'encode';
let currentEntityCat = 'common';

// ENTITY DATABASE
const ENTITIES = {
  common: [
    { char: '<', code: '&lt;', name: 'Less than' },
    { char: '>', code: '&gt;', name: 'Greater than' },
    { char: '&', code: '&amp;', name: 'Ampersand' },
    { char: '"', code: '&quot;', name: 'Double quote' },
    { char: "'", code: '&#39;', name: 'Single quote' },
    { char: ' ', code: '&nbsp;', name: 'Non-breaking space' },
    { char: '©', code: '&copy;', name: 'Copyright' },
    { char: '®', code: '&reg;', name: 'Registered' },
    { char: '™', code: '&trade;', name: 'Trademark' },
    { char: '§', code: '&sect;', name: 'Section' },
    { char: '¶', code: '&para;', name: 'Paragraph' },
    { char: '†', code: '&dagger;', name: 'Dagger' },
    { char: '‡', code: '&Dagger;', name: 'Double dagger' },
    { char: '•', code: '&bull;', name: 'Bullet' },
    { char: '…', code: '&hellip;', name: 'Ellipsis' },
    { char: '–', code: '&ndash;', name: 'En dash' },
    { char: '—', code: '&mdash;', name: 'Em dash' },
    { char: '“', code: '&ldquo;', name: 'Left double quote' },
    { char: '”', code: '&rdquo;', name: 'Right double quote' },
    { char: '‘', code: '&lsquo;', name: 'Left single quote' },
    { char: '’', code: '&rsquo;', name: 'Right single quote' },
    { char: '«', code: '&laquo;', name: 'Left angle quote' },
    { char: '»', code: '&raquo;', name: 'Right angle quote' },
    { char: '¡', code: '&iexcl;', name: 'Inverted exclamation' },
    { char: '¿', code: '&iquest;', name: 'Inverted question' },
    { char: '·', code: '&middot;', name: 'Middle dot' },
    { char: '♥', code: '&hearts;', name: 'Heart' },
    { char: '♦', code: '&diams;', name: 'Diamond' },
    { char: '♣', code: '&clubs;', name: 'Club' },
    { char: '♠', code: '&spades;', name: 'Spade' },
    { char: '★', code: '&#9733;', name: 'Black star' },
    { char: '☆', code: '&#9734;', name: 'White star' },
    { char: '✓', code: '&#10003;', name: 'Check mark' },
    { char: '✗', code: '&#10007;', name: 'Cross mark' },
    { char: '☺', code: '&#9786;', name: 'Smiley' },
    { char: '☹', code: '&#9785;', name: 'Frown' }
  ],
  symbols: [
    { char: '€', code: '&euro;', name: 'Euro' },
    { char: '£', code: '&pound;', name: 'Pound' },
    { char: '¥', code: '&yen;', name: 'Yen' },
    { char: '¢', code: '&cent;', name: 'Cent' },
    { char: '₹', code: '&#8377;', name: 'Rupee' },
    { char: '₩', code: '&#8361;', name: 'Won' },
    { char: '₽', code: '&#8381;', name: 'Ruble' },
    { char: '¤', code: '&curren;', name: 'Currency' },
    { char: '№', code: '&#8470;', name: 'Numero' },
    { char: '°', code: '&deg;', name: 'Degree' },
    { char: '±', code: '&plusmn;', name: 'Plus-minus' },
    { char: 'µ', code: '&micro;', name: 'Micro' },
    { char: '‰', code: '&permil;', name: 'Per mille' },
    { char: '¼', code: '&frac14;', name: 'Quarter' },
    { char: '½', code: '&frac12;', name: 'Half' },
    { char: '¾', code: '&frac34;', name: 'Three quarters' },
    { char: '⅓', code: '&#8531;', name: 'One third' },
    { char: '⅔', code: '&#8532;', name: 'Two thirds' },
    { char: '∞', code: '&infin;', name: 'Infinity' },
    { char: '√', code: '&radic;', name: 'Square root' },
    { char: '∛', code: '&#8731;', name: 'Cube root' },
    { char: '∂', code: '&part;', name: 'Partial' },
    { char: '∑', code: '&sum;', name: 'Sum' },
    { char: '∏', code: '&prod;', name: 'Product' },
    { char: '∫', code: '&int;', name: 'Integral' },
    { char: '≈', code: '&asymp;', name: 'Approx' },
    { char: '≠', code: '&ne;', name: 'Not equal' },
    { char: '≤', code: '&le;', name: 'Less or equal' },
    { char: '≥', code: '&ge;', name: 'Greater or equal' },
    { char: '⊕', code: '&oplus;', name: 'Oplus' },
    { char: '⊗', code: '&otimes;', name: 'Otimes' }
  ],
  arrows: [
    { char: '←', code: '&larr;', name: 'Left arrow' },
    { char: '→', code: '&rarr;', name: 'Right arrow' },
    { char: '↑', code: '&uarr;', name: 'Up arrow' },
    { char: '↓', code: '&darr;', name: 'Down arrow' },
    { char: '↔', code: '&harr;', name: 'Left-right' },
    { char: '↕', code: '&varr;', name: 'Up-down' },
    { char: '↖', code: '&nwarr;', name: 'NW arrow' },
    { char: '↗', code: '&nearr;', name: 'NE arrow' },
    { char: '↘', code: '&searr;', name: 'SE arrow' },
    { char: '↙', code: '&swarr;', name: 'SW arrow' },
    { char: '⇐', code: '&lArr;', name: 'Double left' },
    { char: '⇒', code: '&rArr;', name: 'Double right' },
    { char: '⇑', code: '&uArr;', name: 'Double up' },
    { char: '⇓', code: '&dArr;', name: 'Double down' },
    { char: '⇔', code: '&hArr;', name: 'Double left-right' },
    { char: '↻', code: '&#8635;', name: 'Rotate right' },
    { char: '↺', code: '&#8634;', name: 'Rotate left' },
    { char: '⇄', code: '&rlarr;', name: 'Right-left' },
    { char: '⇅', code: '&udarr;', name: 'Up-down' },
    { char: '➜', code: '&#10132;', name: 'Heavy right' },
    { char: '➜', code: '&#10132;', name: 'Arrow' },
    { char: '⌂', code: '&#8962;', name: 'House' },
    { char: '⏎', code: '&#9166;', name: 'Return' },
    { char: '⏏', code: '&#9167;', name: 'Eject' },
    { char: '⌫', code: '&#9003;', name: 'Backspace' }
  ],
  math: [
    { char: '∀', code: '&forall;', name: 'For all' },
    { char: '∁', code: '&complement;', name: 'Complement' },
    { char: '∂', code: '&part;', name: 'Partial diff' },
    { char: '∃', code: '&exist;', name: 'Exists' },
    { char: '∄', code: '&nexist;', name: 'Not exists' },
    { char: '∅', code: '&empty;', name: 'Empty set' },
    { char: '∇', code: '&nabla;', name: 'Nabla' },
    { char: '∈', code: '&isin;', name: 'In' },
    { char: '∉', code: '&notin;', name: 'Not in' },
    { char: '∋', code: '&ni;', name: 'Contains' },
    { char: '∏', code: '&prod;', name: 'Product' },
    { char: '∑', code: '&sum;', name: 'Sum' },
    { char: '∖', code: '&setminus;', name: 'Set minus' },
    { char: '∗', code: '&lowast;', name: 'Asterisk' },
    { char: '√', code: '&radic;', name: 'Square root' },
    { char: '∝', code: '&prop;', name: 'Proportional' },
    { char: '∞', code: '&infin;', name: 'Infinity' },
    { char: '∠', code: '&ang;', name: 'Angle' },
    { char: '⊥', code: '&perp;', name: 'Perpendicular' },
    { char: '⊕', code: '&oplus;', name: 'Oplus' },
    { char: '⊗', code: '&otimes;', name: 'Otimes' },
    { char: '⊥', code: '&perp;', name: 'Perp' },
    { char: '⋅', code: '&sdot;', name: 'Dot' },
    { char: '≠', code: '&ne;', name: 'Not equal' },
    { char: '≡', code: '&equiv;', name: 'Identical' },
    { char: '≤', code: '&le;', name: 'Less or equal' },
    { char: '≥', code: '&ge;', name: 'Greater or equal' },
    { char: '⊂', code: '&sub;', name: 'Subset' },
    { char: '⊃', code: '&sup;', name: 'Superset' },
    { char: '⊄', code: '&nsub;', name: 'Not subset' }
  ],
  currency: [
    { char: '$', code: '&#36;', name: 'Dollar' },
    { char: '¢', code: '&cent;', name: 'Cent' },
    { char: '£', code: '&pound;', name: 'Pound' },
    { char: '¤', code: '&curren;', name: 'Currency' },
    { char: '¥', code: '&yen;', name: 'Yen' },
    { char: '€', code: '&euro;', name: 'Euro' },
    { char: '₹', code: '&#8377;', name: 'Rupee' },
    { char: '₩', code: '&#8361;', name: 'Won' },
    { char: '₽', code: '&#8381;', name: 'Ruble' },
    { char: '₺', code: '&#8378;', name: 'Lira' },
    { char: '₴', code: '&#8372;', name: 'Hryvnia' },
    { char: '₦', code: '&#8358;', name: 'Naira' },
    { char: '₱', code: '&#8369;', name: 'Peso' },
    { char: '₡', code: '&#8353;', name: 'Colon' },
    { char: '₪', code: '&#8362;', name: 'Shekel' },
    { char: '₫', code: '&#8363;', name: 'Dong' },
    { char: '฿', code: '&#3647;', name: 'Baht' },
    { char: '₸', code: '&#8376;', name: 'Tenge' },
    { char: '₼', code: '&#8380;', name: 'Manat' },
    { char: '₾', code: '&#8382;', name: 'Lari' }
  ],
  greek: [
    { char: 'α', code: '&alpha;', name: 'Alpha' },
    { char: 'β', code: '&beta;', name: 'Beta' },
    { char: 'γ', code: '&gamma;', name: 'Gamma' },
    { char: 'δ', code: '&delta;', name: 'Delta' },
    { char: 'ε', code: '&epsilon;', name: 'Epsilon' },
    { char: 'ζ', code: '&zeta;', name: 'Zeta' },
    { char: 'η', code: '&eta;', name: 'Eta' },
    { char: 'θ', code: '&theta;', name: 'Theta' },
    { char: 'ι', code: '&iota;', name: 'Iota' },
    { char: 'κ', code: '&kappa;', name: 'Kappa' },
    { char: 'λ', code: '&lambda;', name: 'Lambda' },
    { char: 'μ', code: '&mu;', name: 'Mu' },
    { char: 'ν', code: '&nu;', name: 'Nu' },
    { char: 'ξ', code: '&xi;', name: 'Xi' },
    { char: 'ο', code: '&omicron;', name: 'Omicron' },
    { char: 'π', code: '&pi;', name: 'Pi' },
    { char: 'ρ', code: '&rho;', name: 'Rho' },
    { char: 'σ', code: '&sigma;', name: 'Sigma' },
    { char: 'τ', code: '&tau;', name: 'Tau' },
    { char: 'υ', code: '&upsilon;', name: 'Upsilon' },
    { char: 'φ', code: '&phi;', name: 'Phi' },
    { char: 'χ', code: '&chi;', name: 'Chi' },
    { char: 'ψ', code: '&psi;', name: 'Psi' },
    { char: 'ω', code: '&omega;', name: 'Omega' },
    { char: 'Α', code: '&Alpha;', name: 'Alpha' },
    { char: 'Β', code: '&Beta;', name: 'Beta' },
    { char: 'Γ', code: '&Gamma;', name: 'Gamma' },
    { char: 'Δ', code: '&Delta;', name: 'Delta' },
    { char: 'Θ', code: '&Theta;', name: 'Theta' },
    { char: 'Λ', code: '&Lambda;', name: 'Lambda' },
    { char: 'Ξ', code: '&Xi;', name: 'Xi' },
    { char: 'Π', code: '&Pi;', name: 'Pi' },
    { char: 'Σ', code: '&Sigma;', name: 'Sigma' },
    { char: 'Φ', code: '&Phi;', name: 'Phi' },
    { char: 'Ψ', code: '&Psi;', name: 'Psi' },
    { char: 'Ω', code: '&Omega;', name: 'Omega' }
  ]
};

// Encode HTML
function encodeHTML(text) {
  let result = text;

  if (optNumeric.checked) {
    // Numeric entities
    if (optHtmlSpecial.checked) {
      result = result.replace(/&/g, '&#38;');
      result = result.replace(/</g, '&#60;');
      result = result.replace(/>/g, '&#62;');
    }
    if (optQuotes.checked) {
      result = result.replace(/"/g, '&#34;');
      result = result.replace(/'/g, '&#39;');
    }
  } else {
    // Named entities
    if (optHtmlSpecial.checked) {
      result = result.replace(/&/g, '&amp;');
      result = result.replace(/</g, '&lt;');
      result = result.replace(/>/g, '&gt;');
    }
    if (optQuotes.checked) {
      result = result.replace(/"/g, '&quot;');
      result = result.replace(/'/g, '&#39;');
    }
  }

  if (optNonAscii.checked) {
    // Encode all non-ASCII characters to numeric entities
    result = result.replace(/[^\x00-\x7F]/g, (c) => {
      return '&#' + c.charCodeAt(0) + ';';
    });
  }

  return result;
}

// Decode HTML
function decodeHTML(text) {
  // Named entities
  const namedEntities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&sect;': '§',
    '&para;': '¶',
    '&deg;': '°',
    '&plusmn;': '±',
    '&micro;': 'µ',
    '&frac14;': '¼',
    '&frac12;': '½',
    '&frac34;': '¾',
    '&infin;': '∞',
    '&radic;': '√',
    '&sum;': '∑',
    '&prod;': '∏',
    '&int;': '∫',
    '&asymp;': '≈',
    '&ne;': '≠',
    '&le;': '≤',
    '&ge;': '≥',
    '&larr;': '←',
    '&rarr;': '→',
    '&uarr;': '↑',
    '&darr;': '↓',
    '&harr;': '↔',
    '&hellip;': '…',
    '&ndash;': '–',
    '&mdash;': '—',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&laquo;': '«',
    '&raquo;': '»',
    '&bull;': '•',
    '&middot;': '·',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&hearts;': '♥',
    '&diams;': '♦',
    '&clubs;': '♣',
    '&spades;': '♠',
    '&alpha;': 'α',
    '&beta;': 'β',
    '&gamma;': 'γ',
    '&delta;': 'δ',
    '&epsilon;': 'ε',
    '&theta;': 'θ',
    '&lambda;': 'λ',
    '&mu;': 'μ',
    '&pi;': 'π',
    '&sigma;': 'σ',
    '&phi;': 'φ',
    '&omega;': 'ω',
    '&Omega;': 'Ω',
    '&Alpha;': 'Α',
    '&Beta;': 'Β',
    '&Gamma;': 'Γ',
    '&Delta;': 'Δ',
    '&Theta;': 'Θ',
    '&Lambda;': 'Λ',
    '&Pi;': 'Π',
    '&Sigma;': 'Σ',
    '&Phi;': 'Φ',
    '&Psi;': 'Ψ'
  };

  let result = text;

  // Replace named entities
  Object.keys(namedEntities).forEach(entity => {
    result = result.split(entity).join(namedEntities[entity]);
  });

  // Replace numeric entities (decimal)
  result = result.replace(/&#(\d+);/g, (match, code) => {
    return String.fromCharCode(parseInt(code, 10));
  });

  // Replace hex entities
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });

  return result;
}

// Process
function process() {
  const text = inputBox.value;

  if (text.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }

  if (!text) {
    outputBox.innerHTML = '<p class="output-placeholder">Encoded/Decoded text will appear here...</p>';
    statInput.textContent = '0';
    statOutput.textContent = '0';
    statEntities.textContent = '0';
    statIncrease.textContent = '0%';
    detailsContent.innerHTML = '<p class="no-details">Type something to see details.</p>';
    return;
  }

  let output;
  let entityCount = 0;

  if (currentMode === 'encode') {
    output = encodeHTML(text);
    // Count entities
    const matches = output.match(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g);
    entityCount = matches ? matches.length : 0;
  } else {
    output = decodeHTML(text);
    entityCount = 0;
  }

  outputBox.textContent = output;

  // Stats
  const inputLen = text.length;
  const outputLen = output.length;
  const increase = inputLen > 0 ? Math.round(((outputLen - inputLen) / inputLen) * 100) : 0;

  statInput.textContent = inputLen.toLocaleString();
  statOutput.textContent = outputLen.toLocaleString();
  statEntities.textContent = entityCount;
  statIncrease.textContent = (increase > 0 ? '+' : '') + increase + '%';

  // Details
  buildDetails(text, output, entityCount);
}

// Build details
function buildDetails(input, output, entityCount) {
  if (!detailsContent) return;

  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const increase = inputSize > 0 ? Math.round(((outputSize - inputSize) / inputSize) * 100) : 0;

  let html = '';
  html += '<div class="detail-row"><span class="detail-char">Mode</span><span class="detail-arrow">→</span><span class="detail-value">' + currentMode + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Input length</span><span class="detail-arrow">→</span><span class="detail-value">' + input.length + ' chars</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Output length</span><span class="detail-arrow">→</span><span class="detail-value">' + output.length + ' chars</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Input size</span><span class="detail-arrow">→</span><span class="detail-value">' + inputSize + ' bytes</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Output size</span><span class="detail-arrow">→</span><span class="detail-value">' + outputSize + ' bytes</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Size change</span><span class="detail-arrow">→</span><span class="detail-value">' + (increase > 0 ? '+' : '') + increase + '%</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Entities encoded</span><span class="detail-arrow">→</span><span class="detail-value">' + entityCount + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">HTML special</span><span class="detail-arrow">→</span><span class="detail-value">' + (optHtmlSpecial.checked ? 'On' : 'Off') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Non-ASCII</span><span class="detail-arrow">→</span><span class="detail-value">' + (optNonAscii.checked ? 'On' : 'Off') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Numeric</span><span class="detail-arrow">→</span><span class="detail-value">' + (optNumeric.checked ? 'On' : 'Off') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Quotes</span><span class="detail-arrow">→</span><span class="detail-value">' + (optQuotes.checked ? 'On' : 'Off') + '</span></div>';

  detailsContent.innerHTML = html;
}

// Render entities
function renderEntities() {
  const list = ENTITIES[currentEntityCat] || [];
  let html = '';

  list.forEach(e => {
    html += `
      <button class="entity-btn" data-char="${e.char}" data-code="${e.code}" title="${e.name}" type="button">
        <span class="entity-char">${e.char}</span>
        <span class="entity-code">${e.code}</span>
      </button>
    `;
  });

  entitiesGrid.innerHTML = html;

  entitiesGrid.querySelectorAll('.entity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const char = btn.dataset.char;
      const code = btn.dataset.code;
      const insert = currentMode === 'encode' ? code : char;

      const start = inputBox.selectionStart;
      const before = inputBox.value.substring(0, start);
      const after = inputBox.value.substring(start);

      inputBox.value = before + insert + after;
      inputBox.focus();
      inputBox.selectionStart = inputBox.selectionEnd = start + insert.length;

      process();
    });
  });
}

// Mode tabs
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    modeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentMode = tab.dataset.mode;

    if (currentMode === 'encode') {
      inputBox.placeholder = 'Type or paste text to encode...';
    } else {
      inputBox.placeholder = 'Paste HTML entities to decode...';
    }

    process();
  });
});

// Entity tabs
entityTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    entityTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentEntityCat = tab.dataset.cat;
    renderEntities();
  });
});

// Options
[optHtmlSpecial, optNonAscii, optNumeric, optQuotes].forEach(opt => {
  opt.addEventListener('change', process);
});

// Input
inputBox.addEventListener('input', process);

// Clear
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  process();
  inputBox.focus();
});

// Paste
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      inputBox.value = text;
      process();
    }
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

// Sample
sampleBtn.addEventListener('click', () => {
  if (currentMode === 'encode') {
    inputBox.value = '<div class="box">Hello & welcome © 2026</div>';
  } else {
    inputBox.value = '&lt;div class=&quot;box&quot;&gt;Hello &amp; welcome &copy; 2026&lt;/div&gt;';
  }
  process();
});

// Swap
swapBtn.addEventListener('click', () => {
  const temp = inputBox.value;
  inputBox.value = outputBox.textContent || '';
  process();
});

// Copy
copyBtn.addEventListener('click', () => {
  const text = outputBox.textContent;
  if (!text || text.includes('will appear here')) return;

  navigator.clipboard.writeText(text).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1000);
  });
});

// Download
downloadBtn.addEventListener('click', () => {
  const text = outputBox.textContent;
  if (!text || text.includes('will appear here')) return;

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'html-entity-' + currentMode + '.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Details toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Theme toggle
if (themeBtn) {
  const savedTheme = localStorage.getItem('devtools_theme') || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeBtn.querySelector('.theme-icon').textContent = '☀️';
    themeBtn.querySelector('.theme-label').textContent = 'Light Mode';
  } else {
    themeBtn.querySelector('.theme-icon').textContent = '🌙';
    themeBtn.querySelector('.theme-label').textContent = 'Dark Mode';
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
    themeBtn.querySelector('.theme-label').textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('devtools_theme', isDark ? 'dark' : 'light');
  });
}

// Init
renderEntities();
process();