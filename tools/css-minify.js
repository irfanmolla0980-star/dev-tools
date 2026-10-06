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
const copyBtn = document.getElementById('copyBtn');
const pasteBtn = document.getElementById('pasteBtn');
const sampleBtn = document.getElementById('sampleBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const statusBar = document.getElementById('statusBar');
const origSizeEl = document.getElementById('origSize');
const minSizeEl = document.getElementById('minSize');
const savedBytesEl = document.getElementById('savedBytes');
const savedPercentEl = document.getElementById('savedPercent');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadBtn = document.getElementById('downloadBtn');
const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let currentStats = null;

// ===== Byte formatter =====
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ===== Main Minify Function =====
function minifyCSS(css) {
  const stats = {
    commentsRemoved: 0,
    spacesRemoved: 0,
    newlinesRemoved: 0,
    semicolonsRemoved: 0,
    rules: []
  };

  let result = css;

  // 1. Remove comments /* ... */
  const commentMatches = result.match(/\/\*[\s\S]*?\*\//g);
  if (commentMatches) {
    stats.commentsRemoved = commentMatches.length;
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // 2. Count newlines before removing
  const newlineMatches = result.match(/\n/g);
  if (newlineMatches) stats.newlinesRemoved = newlineMatches.length;

  // 3. Save original rule count for details
  const originalRules = result.match(/[^{}]+\{[^{}]*\}/g) || [];

  // 4. Remove newlines and tabs
  result = result.replace(/[\n\r\t]/g, ' ');

  // 5. Remove multiple spaces
  const multiSpaceMatches = result.match(/\s{2,}/g);
  if (multiSpaceMatches) {
    stats.spacesRemoved = multiSpaceMatches.length;
  }
  result = result.replace(/\s{2,}/g, ' ');

  // 6. Remove space around special chars
  result = result.replace(/\s*([{}:;,>+~])\s*/g, '$1');

  // 7. Remove last semicolon before }
  const semiMatches = result.match(/;}/g);
  if (semiMatches) {
    stats.semicolonsRemoved = semiMatches.length;
  }
  result = result.replace(/;}/g, '}');

  // 8. Remove leading/trailing whitespace
  result = result.trim();

  // 9. Build rule-by-rule comparison for details
  const minifiedRules = result.match(/[^{}]+\{[^{}]*\}/g) || [];
  originalRules.forEach((origRule, i) => {
    if (minifiedRules[i]) {
      stats.rules.push({
        before: origRule.trim(),
        after: minifiedRules[i].trim()
      });
    }
  });

  return { minified: result, stats };
}

// ===== Process =====
function process() {
  const raw = inputBox.value;

  if (raw.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }

  if (raw.trim() === '') {
    outputBox.value = '';
    origSizeEl.textContent = '0 B';
    minSizeEl.textContent = '0 B';
    savedBytesEl.textContent = '0 B';
    savedPercentEl.textContent = '0%';
    currentStats = null;
    setStatus('info', '📐', 'Paste CSS to minify');
    detailsContent.innerHTML = '<p class="no-details">Paste CSS to see step-by-step details.</p>';
    return;
  }

  const { minified, stats } = minifyCSS(raw);

  const origBytes = new Blob([raw]).size;
  const minBytes = new Blob([minified]).size;
  const saved = origBytes - minBytes;
  const percent = origBytes > 0 ? ((saved / origBytes) * 100).toFixed(1) : 0;

  outputBox.value = minified;
  origSizeEl.textContent = formatBytes(origBytes);
  minSizeEl.textContent = formatBytes(minBytes);
  savedBytesEl.textContent = formatBytes(saved);
  savedPercentEl.textContent = percent + '%';

  currentStats = {
    origBytes,
    minBytes,
    saved,
    percent,
    stats
  };

  setStatus('success', '✅', 'CSS minified successfully — ' + percent + '% smaller');
  buildDetails(currentStats);
}

// ===== Status =====
function setStatus(type, icon, text) {
  statusBar.className = 'status-bar';
  if (type === 'success') statusBar.classList.add('success');
  else if (type === 'error') statusBar.classList.add('error');

  statusBar.querySelector('.status-icon').textContent = icon;
  statusBar.querySelector('.status-text').textContent = text;
}

// ===== Build Details =====
function buildDetails(data) {
  if (!detailsContent) return;

  if (!data) {
    detailsContent.innerHTML = '<p class="no-details">Paste CSS to see step-by-step details.</p>';
    return;
  }

  const s = data.stats;
  let html = '';

  // Section 1: Size Summary
  html += '<div class="detail-section">';
  html += '<h4>📊 Size Summary</h4>';
  html += '<div class="detail-row"><span class="detail-label">Original Size</span><span class="detail-value">' + formatBytes(data.origBytes) + '</span></div>';
  html += '<div class="detail-row"><span class="detail-label">Minified Size</span><span class="detail-value">' + formatBytes(data.minBytes) + '</span></div>';
  html += '<div class="detail-row"><span class="detail-label">Bytes Saved</span><span class="detail-value">' + formatBytes(data.saved) + '</span></div>';
  html += '<div class="detail-row"><span class="detail-label">Reduction</span><span class="detail-value">' + data.percent + '%</span></div>';
  html += '</div>';

  // Section 2: What was removed
  html += '<div class="detail-section">';
  html += '<h4>🗑️ What Was Removed</h4>';
  html += '<div class="detail-row"><span class="detail-label">Comments</span><span class="detail-value">' + s.commentsRemoved + '</span></div>';
  html += '<div class="detail-row"><span class="detail-label">Extra Spaces</span><span class="detail-value">' + s.spacesRemoved + '</span></div>';
  html += '<div class="detail-row"><span class="detail-label">Newlines</span><span class="detail-value">' + s.newlinesRemoved + '</span></div>';
  html += '<div class="detail-row"><span class="detail-label">Trailing Semicolons</span><span class="detail-value">' + s.semicolonsRemoved + '</span></div>';
  html += '</div>';

  // Section 3: Rule-by-rule
  if (s.rules && s.rules.length > 0) {
    html += '<div class="detail-section">';
    html += '<h4>📝 Rule-by-Rule Changes</h4>';
    html += '<ul class="rule-list">';

    const showRules = s.rules.slice(0, 10);
    showRules.forEach((rule, i) => {
      html += '<li>';
      html += '<div><span class="before">Before:</span> ' + escapeHtml(rule.before) + '</div>';
      html += '<div><span class="after">After:</span> ' + escapeHtml(rule.after) + '</div>';
      html += '</li>';
    });

    if (s.rules.length > 10) {
      html += '<li style="text-align:center; color:#996633;">+ ' + (s.rules.length - 10) + ' more rules...</li>';
    }

    html += '</ul>';
    html += '</div>';
  } else {
    html += '<div class="detail-section">';
    html += '<h4>📝 Rule-by-Rule Changes</h4>';
    html += '<p class="no-details">No complete CSS rules found. Make sure you have valid CSS like <code>body { color: red; }</code></p>';
    html += '</div>';
  }

  detailsContent.innerHTML = html;
}

// ===== Escape HTML =====
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===== Input Event (Live) =====
inputBox.addEventListener('input', process);

// ===== Clear Button =====
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  clearBtn.classList.remove('show');
  process();
  inputBox.focus();
});

// ===== Paste Button =====
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      inputBox.value = text;
      clearBtn.classList.add('show');
      process();
    }
  } catch (e) {
    alert('Clipboard access denied. Please paste manually.');
  }
});

// ===== Sample Button =====
sampleBtn.addEventListener('click', () => {
  const sample = `/* Main styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

/* Header section */
.header {
  padding: 20px;
  color: #333333;
  border-bottom: 1px solid #eeeeee;
}

.header h1 {
  font-size: 24px;
  margin: 0;
}

/* Button styles */
.btn {
  padding: 10px 20px;
  background: #ff8800;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background: #cc6600;
}`;
  inputBox.value = sample;
  clearBtn.classList.add('show');
  process();
});

// ===== Clear All =====
clearAllBtn.addEventListener('click', () => {
  inputBox.value = '';
  clearBtn.classList.remove('show');
  process();
});

// ===== Copy Output =====
copyBtn.addEventListener('click', () => {
  if (outputBox.value === '') return;

  navigator.clipboard.writeText(outputBox.value).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1200);
  });
});

// ===== Copy All =====
copyAllBtn.addEventListener('click', () => {
  if (!currentStats || outputBox.value === '') {
    alert('Paste CSS first.');
    return;
  }

  navigator.clipboard.writeText(outputBox.value).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied Minified CSS';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1200);
  });
});

// ===== Download =====
downloadBtn.addEventListener('click', () => {
  if (!currentStats || outputBox.value === '') {
    alert('Paste CSS first.');
    return;
  }

  const blob = new Blob([outputBox.value], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'styles.min.css';
  a.click();
  URL.revokeObjectURL(url);
});

// ===== Details Toggle =====
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// ===== Theme Toggle =====
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

// ===== Init =====
process();