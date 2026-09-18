// ===== Navbar Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// ===== Active Link Highlight =====
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) link.classList.add('active');
});

// ===== Back to Top =====
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

// ===== Element References =====
const inputBox = document.getElementById('inputBox');
const clearBtn = document.getElementById('clearBtn');
const outputPre = document.getElementById('outputPre');
const statusBar = document.getElementById('statusBar');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const sampleBtn = document.getElementById('sampleBtn');

const statLines = document.getElementById('statLines');
const statChars = document.getElementById('statChars');
const statKeys = document.getElementById('statKeys');
const statSize = document.getElementById('statSize');

const actionButtons = document.querySelectorAll('.action-btn');
const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let currentAction = 'beautify';
let currentParsed = null;
let lastOutputText = '';

// ===== Details Toggle =====
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// ===== Action Switch =====
actionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    actionButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentAction = btn.dataset.action;
    processInput();
  });
});

// ===== Input Event =====
inputBox.addEventListener('input', () => {
  if (inputBox.value.length > 0) clearBtn.classList.add('show');
  else clearBtn.classList.remove('show');

  processInput();
});

// ===== Process Input =====
function processInput() {
  const raw = inputBox.value.trim();
  lastOutputText = '';

  if (raw === '') {
    outputPre.innerHTML = '<span class="output-placeholder">Formatted JSON will appear here...</span>';
    setStatus('info', '📋', 'Ready — paste JSON or JS object to start');
    resetStats();
    detailsContent.innerHTML = '<p class="no-details">Format some JSON first to see details.</p>';
    currentParsed = null;
    return;
  }

  // ===== JS → JSON =====
  if (currentAction === 'js-to-json') {
    try {
      const obj = parseJSObject(raw);
      const jsonStr = JSON.stringify(obj, null, 2);
      currentParsed = obj;
      lastOutputText = jsonStr;
      outputPre.innerHTML = highlightJSON(jsonStr);
      setStatus('success', '✓', 'Converted JS object to JSON');
      updateStats(jsonStr, obj);
      buildDetails(obj, jsonStr);
    } catch (err) {
      outputPre.innerHTML = '<span class="output-placeholder">Cannot convert — invalid JS object.</span>';
      setStatus('error', '✕', 'Error: ' + err.message.substring(0, 120));
      resetStats();
      detailsContent.innerHTML = '<p class="no-details">Cannot parse JS object.</p>';
      currentParsed = null;
    }
    return;
  }

  // ===== JSON → JS =====
  if (currentAction === 'json-to-js') {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      outputPre.innerHTML = '<span class="output-placeholder">Cannot convert — invalid JSON.</span>';
      setStatus('error', '✕', 'Error: ' + cleanError(err.message));
      resetStats();
      detailsContent.innerHTML = '<p class="no-details">Cannot parse JSON.</p>';
      currentParsed = null;
      return;
    }

    currentParsed = parsed;
    const jsStr = toJSObjectString(parsed);
    lastOutputText = jsStr;
    outputPre.textContent = jsStr;
    setStatus('success', '✓', 'Converted JSON to JS object');
    updateStats(jsStr, parsed);
    buildDetails(parsed, jsStr);
    return;
  }

  // ===== Beautify / Minify / Validate =====
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    outputPre.innerHTML = '<span class="output-placeholder">Invalid JSON — fix the error below.</span>';
    setStatus('error', '✕', 'Error: ' + cleanError(err.message));
    resetStats();
    detailsContent.innerHTML = '<p class="no-details">Cannot parse JSON.</p>';
    currentParsed = null;
    return;
  }

  currentParsed = parsed;

  let output;
  if (currentAction === 'beautify') {
    output = JSON.stringify(parsed, null, 2);
    setStatus('success', '✓', 'Valid JSON — beautified');
  } else if (currentAction === 'minify') {
    output = JSON.stringify(parsed);
    setStatus('success', '✓', 'Valid JSON — minified');
  } else {
    output = JSON.stringify(parsed, null, 2);
    setStatus('success', '✓', 'Valid JSON — no errors found');
  }

  lastOutputText = output;
  outputPre.innerHTML = highlightJSON(output);
  updateStats(output, parsed);
  buildDetails(parsed, output);
}

// ===== Parse JS Object =====
function parseJSObject(str) {
  // Trim and try to extract the object body if wrapped
  let s = str.trim();

  // Remove trailing semicolon
  s = s.replace(/;\s*$/, '');

  // Remove `const x = ...`, `let x = ...`, `var x = ...`
  s = s.replace(/^(const|let|var)\s+\w+\s*=\s*/, '');
  s = s.replace(/^(module\.exports\s*=\s*)/, '');
  s = s.replace(/^(export\s+default\s*)/, '');

  // Wrap in parentheses to make it an expression and use Function constructor
  // This safely evaluates simple JS objects without external side effects
  try {
    const fn = new Function('return (' + s + ');');
    const result = fn();
    if (typeof result !== 'object' || result === null) {
      throw new Error('Not an object or array');
    }
    return result;
  } catch (e) {
    throw new Error('Invalid JS object syntax');
  }
}

// ===== Convert JSON to JS object string =====
function toJSObjectString(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  const padIn = '  '.repeat(indent + 1);

  if (obj === null) return 'null';
  if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => padIn + toJSObjectString(item, indent + 1));
    return '[\n' + items.join(',\n') + '\n' + pad + ']';
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    const items = keys.map(key => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      return padIn + safeKey + ': ' + toJSObjectString(obj[key], indent + 1);
    });
    return '{\n' + items.join(',\n') + '\n' + pad + '}';
  }

  return 'undefined';
}

// ===== Syntax Highlight =====
function highlightJSON(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }

  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'num';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'str';
        }
      } else if (/true|false/.test(match)) {
        cls = 'bool';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="hl-${cls}">${match}</span>`;
    }
  );
}

// ===== Status =====
function setStatus(type, icon, text) {
  statusBar.className = 'status-bar';
  if (type === 'success') statusBar.classList.add('success');
  else if (type === 'error') statusBar.classList.add('error');

  statusBar.querySelector('.status-icon').textContent = icon;
  statusBar.querySelector('.status-text').textContent = text;
}

function cleanError(msg) {
  return msg.replace(/^JSON\.parse: /, '').substring(0, 120);
}

// ===== Stats =====
function updateStats(output, parsed) {
  const lines = output.split('\n').length;
  const chars = output.length;
  const keys = countKeys(parsed);
  const bytes = new Blob([output]).size;

  statLines.textContent = lines.toLocaleString();
  statChars.textContent = chars.toLocaleString();
  statKeys.textContent = keys.toLocaleString();
  statSize.textContent = formatBytes(bytes);
}

function resetStats() {
  statLines.textContent = '0';
  statChars.textContent = '0';
  statKeys.textContent = '0';
  statSize.textContent = '0 B';
}

function countKeys(obj) {
  let count = 0;
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      if (typeof item === 'object' && item !== null) count += countKeys(item);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      count++;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += countKeys(obj[key]);
      }
    }
  }
  return count;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ===== Details Builder =====
function buildDetails(parsed, output) {
  if (!detailsContent) return;

  const type = Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' && parsed !== null ? 'Object' : typeof parsed;
  const keys = countKeys(parsed);
  const depth = getDepth(parsed);
  const rawBytes = new Blob([inputBox.value]).size;
  const outBytes = new Blob([output]).size;

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">Action</span><span class="detail-arrow">→</span><span class="detail-value">${currentAction}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Root type</span><span class="detail-arrow">→</span><span class="detail-value">${type}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Total keys</span><span class="detail-arrow">→</span><span class="detail-value">${keys}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Max depth</span><span class="detail-arrow">→</span><span class="detail-value">${depth}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Input size</span><span class="detail-arrow">→</span><span class="detail-value">${formatBytes(rawBytes)}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Output size</span><span class="detail-arrow">→</span><span class="detail-value">${formatBytes(outBytes)}</span></div>`;

  if (currentAction === 'minify' && rawBytes > outBytes) {
    const saved = Math.round((1 - outBytes / rawBytes) * 100);
    html += `<div class="detail-row"><span class="detail-char">Saved</span><span class="detail-arrow">→</span><span class="detail-value">${saved}% smaller</span></div>`;
  }

  if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
    const topKeys = Object.keys(parsed).slice(0, 12);
    html += `<div class="detail-row"><span class="detail-char">Top keys</span><span class="detail-arrow">→</span><span class="detail-value">${topKeys.join(', ')}${Object.keys(parsed).length > 12 ? '...' : ''}</span></div>`;
  }

  if (Array.isArray(parsed)) {
    html += `<div class="detail-row"><span class="detail-char">Array length</span><span class="detail-arrow">→</span><span class="detail-value">${parsed.length}</span></div>`;
  }

  detailsContent.innerHTML = html;
}

function getDepth(obj) {
  if (typeof obj !== 'object' || obj === null) return 1;
  let max = 1;
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      const d = 1 + getDepth(item);
      if (d > max) max = d;
    });
  } else {
    for (const key in obj) {
      const d = 1 + getDepth(obj[key]);
      if (d > max) max = d;
    }
  }
  return max;
}

// ===== Clear Button =====
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  clearBtn.classList.remove('show');
  processInput();
  inputBox.focus();
});

// ===== Copy Button =====
copyBtn.addEventListener('click', () => {
  if (!lastOutputText) return;

  navigator.clipboard.writeText(lastOutputText).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1200);
  });
});

// ===== Download Button =====
downloadBtn.addEventListener('click', () => {
  if (!lastOutputText) return;

  const ext = currentAction === 'json-to-js' ? 'js' : 'json';
  const blob = new Blob([lastOutputText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.' + ext;
  a.click();
  URL.revokeObjectURL(url);
});

// ===== Sample Button =====
sampleBtn.addEventListener('click', () => {
  if (currentAction === 'js-to-json') {
    inputBox.value = `const user = {
  name: "Dev Tools",
  version: "1.0.0",
  tools: ['Number', 'ASCII', 'Base64', 'Hash'],
  author: {
    name: 'You',
    country: 'India'
  },
  active: true,
  count: 21
};`;
  } else if (currentAction === 'json-to-js') {
    inputBox.value = JSON.stringify({
      name: "Dev Tools",
      version: "1.0.0",
      tools: ["Number", "ASCII", "Base64", "Hash"],
      author: { name: "You", country: "India" },
      active: true,
      count: 21
    }, null, 2);
  } else {
    inputBox.value = JSON.stringify({
      name: "Dev Tools",
      version: "1.0.0",
      tools: ["Number", "ASCII", "Base64", "Hash"],
      author: { name: "You", country: "India" },
      active: true,
      count: 21
    }, null, 2);
  }

  clearBtn.classList.add('show');
  processInput();
});