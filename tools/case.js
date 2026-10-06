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
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const sampleBtn = document.getElementById('sampleBtn');
const swapCaseBtn = document.getElementById('swapCaseBtn');

const optTrim = document.getElementById('optTrim');
const optRemoveExtra = document.getElementById('optRemoveExtra');
const optRemoveSpecial = document.getElementById('optRemoveSpecial');
const optRemoveNumbers = document.getElementById('optRemoveNumbers');

const statWords = document.getElementById('statWords');
const statChars = document.getElementById('statChars');
const statLines = document.getElementById('statLines');
const statSentences = document.getElementById('statSentences');

const resultsGrid = document.getElementById('resultsGrid');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

const themeBtn = document.getElementById('themeBtn');

let currentResults = {};

// CASE FUNCTIONS
function getWords(text) {
  // Split by spaces and common separators
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-\/\.]+/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function toUpperCase(text) {
  return text.toUpperCase();
}

function toLowerCase(text) {
  return text.toLowerCase();
}

function toTitleCase(text) {
  return getWords(text)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function toSentenceCase(text) {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
}

function toCamelCase(text) {
  const words = getWords(text);
  if (words.length === 0) return '';
  return words[0].toLowerCase() +
    words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function toPascalCase(text) {
  return getWords(text)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function toSnakeCase(text) {
  return getWords(text)
    .map(w => w.toLowerCase())
    .join('_');
}

function toKebabCase(text) {
  return getWords(text)
    .map(w => w.toLowerCase())
    .join('-');
}

function toConstantCase(text) {
  return getWords(text)
    .map(w => w.toUpperCase())
    .join('_');
}

function toDotCase(text) {
  return getWords(text)
    .map(w => w.toLowerCase())
    .join('.');
}

function toPathCase(text) {
  return getWords(text)
    .map(w => w.toLowerCase())
    .join('/');
}

function toAlternatingCase(text) {
  let result = '';
  let upper = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[a-zA-Z]/.test(c)) {
      result += upper ? c.toUpperCase() : c.toLowerCase();
      upper = !upper;
    } else {
      result += c;
    }
  }
  return result;
}

// Apply options to input
function applyOptions(text) {
  let result = text;

  if (optRemoveSpecial.checked) {
    result = result.replace(/[^\w\s\-\.\/]/g, '');
  }

  if (optRemoveNumbers.checked) {
    result = result.replace(/[0-9]/g, '');
  }

  if (optRemoveExtra.checked) {
    result = result.replace(/\s+/g, ' ');
  }

  if (optTrim.checked) {
    result = result.trim();
  }

  return result;
}

// Build all cases
function buildCases(text) {
  const cleanText = applyOptions(text);

  if (!cleanText) return {};

  return {
    'UPPERCASE': toUpperCase(cleanText),
    'lowercase': toLowerCase(cleanText),
    'Title Case': toTitleCase(cleanText),
    'Sentence case': toSentenceCase(cleanText),
    'camelCase': toCamelCase(cleanText),
    'PascalCase': toPascalCase(cleanText),
    'snake_case': toSnakeCase(cleanText),
    'kebab-case': toKebabCase(cleanText),
    'CONSTANT_CASE': toConstantCase(cleanText),
    'dot.case': toDotCase(cleanText),
    'path/case': toPathCase(cleanText),
    'aLtErNaTiNg': toAlternatingCase(cleanText)
  };
}

// Render results
function renderResults(cases) {
  const keys = Object.keys(cases);

  if (keys.length === 0) {
    resultsGrid.innerHTML = '<p class="output-placeholder">Type something to see 12 case styles...</p>';
    currentResults = {};
    return;
  }

  let html = '';
  keys.forEach(key => {
    html += `
      <div class="result-card" data-case="${key}">
        <div class="result-header">
          <span class="result-label">${key}</span>
          <span class="result-copy-icon">⧉</span>
        </div>
        <div class="result-value">${escapeHTML(cases[key])}</div>
      </div>
    `;
  });

  resultsGrid.innerHTML = html;
  currentResults = cases;

  // Click to copy
  resultsGrid.querySelectorAll('.result-card').forEach(card => {
    card.addEventListener('click', () => {
      const caseName = card.dataset.case;
      const value = cases[caseName];

      navigator.clipboard.writeText(value).then(() => {
        card.classList.add('copied');
        const icon = card.querySelector('.result-copy-icon');
        const original = icon.textContent;
        icon.textContent = '✓';
        setTimeout(() => {
          card.classList.remove('copied');
          icon.textContent = original;
        }, 800);
      });
    });
  });
}

// Update stats
function updateStats(text) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text ? text.split('\n').length : 0;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    : 0;

  statWords.textContent = words.toLocaleString();
  statChars.textContent = chars.toLocaleString();
  statLines.textContent = lines.toLocaleString();
  statSentences.textContent = sentences.toLocaleString();
}

// Build details
function buildDetails(text) {
  if (!detailsContent) return;

  if (!text.trim()) {
    detailsContent.innerHTML = '<p class="no-details">Type something to see details.</p>';
    return;
  }

  const clean = applyOptions(text);
  const words = getWords(clean).length;
  const chars = clean.length;

  let html = '';
  html += '<div class="detail-row"><span class="detail-char">Input length</span><span class="detail-arrow">→</span><span class="detail-value">' + text.length + ' chars</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Processed length</span><span class="detail-arrow">→</span><span class="detail-value">' + chars + ' chars</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Word count</span><span class="detail-arrow">→</span><span class="detail-value">' + words + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Case styles</span><span class="detail-arrow">→</span><span class="detail-value">12</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Trim spaces</span><span class="detail-arrow">→</span><span class="detail-value">' + (optTrim.checked ? 'Yes' : 'No') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Remove extra spaces</span><span class="detail-arrow">→</span><span class="detail-value">' + (optRemoveExtra.checked ? 'Yes' : 'No') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Remove special</span><span class="detail-arrow">→</span><span class="detail-value">' + (optRemoveSpecial.checked ? 'Yes' : 'No') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Remove numbers</span><span class="detail-arrow">→</span><span class="detail-value">' + (optRemoveNumbers.checked ? 'Yes' : 'No') + '</span></div>';

  detailsContent.innerHTML = html;
}

// Main update
function update() {
  const text = inputBox.value;

  if (text.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }

  updateStats(text);

  const cases = buildCases(text);
  renderResults(cases);
  buildDetails(text);
}

// Escape HTML
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Input event
inputBox.addEventListener('input', update);

// Options change
[optTrim, optRemoveExtra, optRemoveSpecial, optRemoveNumbers].forEach(opt => {
  opt.addEventListener('change', update);
});

// Clear
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  update();
  inputBox.focus();
});

// Clear all
clearAllBtn.addEventListener('click', () => {
  inputBox.value = '';
  update();
});

// Paste
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      inputBox.value = text;
      update();
    }
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

// Sample
sampleBtn.addEventListener('click', () => {
  inputBox.value = 'hello world example text';
  update();
});

// Swap case
swapCaseBtn.addEventListener('click', () => {
  inputBox.value = toAlternatingCase(inputBox.value);
  update();
});

// Copy all
copyAllBtn.addEventListener('click', () => {
  if (Object.keys(currentResults).length === 0) {
    alert('Type something first.');
    return;
  }

  let text = '';
  Object.keys(currentResults).forEach(key => {
    text += key + ':\n' + currentResults[key] + '\n\n';
  });

  navigator.clipboard.writeText(text.trim()).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1200);
  });
});

// Download
downloadBtn.addEventListener('click', () => {
  if (Object.keys(currentResults).length === 0) {
    alert('Type something first.');
    return;
  }

  let text = '';
  Object.keys(currentResults).forEach(key => {
    text += key + ':\n' + currentResults[key] + '\n\n';
  });

  const blob = new Blob([text.trim()], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'case-conversions.txt';
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

// Initialize
update();