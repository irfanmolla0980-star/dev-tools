// Navbar
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
}

// Active link
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
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Elements
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const inputArea = document.getElementById('inputArea');
const diffOutput = document.getElementById('diffOutput');

const viewTabs = document.querySelectorAll('.view-tab');
const themeBtn = document.getElementById('themeBtn');
const swapBtn = document.getElementById('swapBtn');
const moreBtn = document.getElementById('moreBtn');
const moreDropdown = document.getElementById('moreDropdown');

const optIgnoreCase = document.getElementById('optIgnoreCase');
const optIgnoreWhitespace = document.getElementById('optIgnoreWhitespace');
const optIgnoreBlank = document.getElementById('optIgnoreBlank');
const optLineNumbers = document.getElementById('optLineNumbers');
const optHighlightWords = document.getElementById('optHighlightWords');

const compareBtn = document.getElementById('compareBtn');
const sampleBtn = document.getElementById('sampleBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const paste1Btn = document.getElementById('paste1Btn');
const paste2Btn = document.getElementById('paste2Btn');
const clear1Btn = document.getElementById('clear1Btn');
const clear2Btn = document.getElementById('clear2Btn');

const statAdded = document.getElementById('statAdded');
const statRemoved = document.getElementById('statRemoved');
const statChanged = document.getElementById('statChanged');
const statSame = document.getElementById('statSame');

const copyDiffBtn = document.getElementById('copyDiffBtn');
const downloadDiffBtn = document.getElementById('downloadDiffBtn');
const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// State
let currentView = 'split';
let diffResult = [];
let currentStats = { added: 0, removed: 0, changed: 0, same: 0 };

// ============================================
// VIEW TABS
// ============================================
viewTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    viewTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentView = tab.dataset.view;
    if (diffResult.length > 0) renderDiff();
  });
});

// ============================================
// THEME TOGGLE
// ============================================
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('diff_theme', isLight ? 'light' : 'dark');
});

// ============================================
// MORE OPTIONS
// ============================================
moreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  moreDropdown.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!moreDropdown.contains(e.target) && e.target !== moreBtn) {
    moreDropdown.classList.remove('open');
  }
});

[optIgnoreCase, optIgnoreWhitespace, optIgnoreBlank, optLineNumbers, optHighlightWords].forEach(opt => {
  opt.addEventListener('change', () => {
    if (text1.value && text2.value) compare();
  });
});

// ============================================
// SWAP
// ============================================
swapBtn.addEventListener('click', () => {
  const temp = text1.value;
  text1.value = text2.value;
  text2.value = temp;
  if (text1.value || text2.value) compare();
});

// ============================================
// CLEAR
// ============================================
clear1Btn.addEventListener('click', () => {
  text1.value = '';
  diffOutput.innerHTML = '<p class="output-placeholder">Paste two texts and click Compare to see differences.</p>';
});

clear2Btn.addEventListener('click', () => {
  text2.value = '';
  diffOutput.innerHTML = '<p class="output-placeholder">Paste two texts and click Compare to see differences.</p>';
});

clearAllBtn.addEventListener('click', () => {
  text1.value = '';
  text2.value = '';
  diffOutput.innerHTML = '<p class="output-placeholder">Paste two texts and click Compare to see differences.</p>';
  resetStats();
  detailsContent.innerHTML = '<p class="no-details">Run a comparison to see details.</p>';
  diffResult = [];
});

function resetStats() {
  statAdded.textContent = '0';
  statRemoved.textContent = '0';
  statChanged.textContent = '0';
  statSame.textContent = '0';
}

// ============================================
// PASTE
// ============================================
paste1Btn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    text1.value = text;
    if (text2.value) compare();
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

paste2Btn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    text2.value = text;
    if (text1.value) compare();
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

// ============================================
// DRAG & DROP
// ============================================
function setupDrop(pnl, textarea) {
  pnl.addEventListener('dragover', (e) => {
    e.preventDefault();
    pnl.classList.add('dragover');
  });
  pnl.addEventListener('dragleave', () => pnl.classList.remove('dragover'));
  pnl.addEventListener('drop', (e) => {
    e.preventDefault();
    pnl.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      textarea.value = ev.target.result;
      if (text1.value && text2.value) compare();
    };
    reader.readAsText(file);
  });
}

const panels = document.querySelectorAll('.input-panel');
if (panels[0]) setupDrop(panels[0], text1);
if (panels[1]) setupDrop(panels[1], text2);

// ============================================
// COMPARE
// ============================================
compareBtn.addEventListener('click', compare);

function compare() {
  const a = text1.value;
  const b = text2.value;

  if (!a && !b) {
    diffOutput.innerHTML = '<p class="output-placeholder">Please enter text in both panels.</p>';
    return;
  }

  // Apply options
  const lines1 = prepareLines(a);
  const lines2 = prepareLines(b);

  diffResult = computeDiff(lines1, lines2);
  renderDiff();
}

function prepareLines(text) {
  let lines = text.split('\n');

  if (optIgnoreBlank.checked) {
    lines = lines.filter(l => l.trim() !== '');
  }

  if (optIgnoreWhitespace.checked) {
    lines = lines.map(l => l.replace(/\s+/g, ' ').trim());
  }

  if (optIgnoreCase.checked) {
    lines = lines.map(l => l.toLowerCase());
  }

  return lines;
}

// ============================================
// DIFF ALGORITHM (Longest Common Subsequence)
// ============================================
function computeDiff(a, b) {
  const m = a.length;
  const n = b.length;

  // LCS table
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const result = [];
  let i = m, j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'same', a: a[i - 1], b: b[j - 1], aNum: i, bNum: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', a: '', b: b[j - 1], aNum: null, bNum: j });
      j--;
    } else if (i > 0) {
      result.unshift({ type: 'removed', a: a[i - 1], b: '', aNum: i, bNum: null });
      i--;
    }
  }

  // Detect "changed" pairs (removed followed by added at same position)
  const merged = [];
  let k = 0;
  while (k < result.length) {
    if (
      result[k].type === 'removed' &&
      k + 1 < result.length &&
      result[k + 1].type === 'added'
    ) {
      merged.push({
        type: 'changed',
        a: result[k].a,
        b: result[k + 1].b,
        aNum: result[k].aNum,
        bNum: result[k + 1].bNum
      });
      k += 2;
    } else {
      merged.push(result[k]);
      k++;
    }
  }

  return merged;
}

// ============================================
// RENDER DIFF
// ============================================
function renderDiff() {
  if (!diffResult.length) {
    diffOutput.innerHTML = '<p class="output-placeholder">No differences found.</p>';
    resetStats();
    return;
  }

  let added = 0, removed = 0, changed = 0, same = 0;

  diffResult.forEach(d => {
    if (d.type === 'added') added++;
    else if (d.type === 'removed') removed++;
    else if (d.type === 'changed') changed++;
    else same++;
  });

  currentStats = { added, removed, changed, same };

  statAdded.textContent = added;
  statRemoved.textContent = removed;
  statChanged.textContent = changed;
  statSame.textContent = same;

  if (currentView === 'split') renderSplit();
  else if (currentView === 'unified') renderUnified();
  else renderInline();

  buildDetails();
}

// Side by side
function renderSplit() {
  let leftHtml = '<div class="side-col left">';
  let rightHtml = '</div><div class="side-col right">';

  diffResult.forEach(d => {
    if (d.type === 'same') {
      leftHtml += makeLine(d.aNum, d.a, 'same');
      rightHtml += makeLine(d.bNum, d.b, 'same');
    } else if (d.type === 'removed') {
      leftHtml += makeLine(d.aNum, d.a, 'removed');
      rightHtml += makeLine(null, '', 'empty');
    } else if (d.type === 'added') {
      leftHtml += makeLine(null, '', 'empty');
      rightHtml += makeLine(d.bNum, d.b, 'added');
    } else if (d.type === 'changed') {
      leftHtml += makeLine(d.aNum, d.a, 'removed');
      rightHtml += makeLine(d.bNum, d.b, 'added');
    }
  });

  leftHtml += '</div>';
  rightHtml += '</div>';

  diffOutput.innerHTML = '<div class="side-grid">' + leftHtml + rightHtml + '</div>';
}

function makeLine(num, text, cls) {
  const numHtml = optLineNumbers.checked
    ? '<span class="line-num">' + (num !== null ? num : '') + '</span>'
    : '';
  const safeText = escapeHtml(text);
  return '<div class="diff-line ' + cls + '">' + numHtml + '<span class="line-content">' + (safeText || '&nbsp;') + '</span></div>';
}

// Unified
function renderUnified() {
  let html = '<div class="unified-grid">';

  diffResult.forEach(d => {
    if (d.type === 'same') {
      html += '<div class="unified-line same">';
      html += '<span class="unified-marker"> </span>';
      html += '<span class="unified-nums"><span class="unified-num">' + (d.aNum || '') + '</span><span class="unified-num">' + (d.bNum || '') + '</span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.a) + '</span>';
      html += '</div>';
    } else if (d.type === 'removed') {
      html += '<div class="unified-line removed">';
      html += '<span class="unified-marker">-</span>';
      html += '<span class="unified-nums"><span class="unified-num">' + (d.aNum || '') + '</span><span class="unified-num"></span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.a) + '</span>';
      html += '</div>';
    } else if (d.type === 'added') {
      html += '<div class="unified-line added">';
      html += '<span class="unified-marker">+</span>';
      html += '<span class="unified-nums"><span class="unified-num"></span><span class="unified-num">' + (d.bNum || '') + '</span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.b) + '</span>';
      html += '</div>';
    } else if (d.type === 'changed') {
      html += '<div class="unified-line removed">';
      html += '<span class="unified-marker">-</span>';
      html += '<span class="unified-nums"><span class="unified-num">' + (d.aNum || '') + '</span><span class="unified-num"></span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.a) + '</span>';
      html += '</div>';
      html += '<div class="unified-line added">';
      html += '<span class="unified-marker">+</span>';
      html += '<span class="unified-nums"><span class="unified-num"></span><span class="unified-num">' + (d.bNum || '') + '</span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.b) + '</span>';
      html += '</div>';
    }
  });

  html += '</div>';
  diffOutput.innerHTML = html;
}

// Inline
function renderInline() {
  let html = '<div class="unified-grid">';

  diffResult.forEach(d => {
    if (d.type === 'same') {
      html += '<div class="unified-line same">';
      html += '<span class="unified-marker"> </span>';
      html += '<span class="unified-nums"><span class="unified-num">' + (d.aNum || '') + '</span><span class="unified-num">' + (d.bNum || '') + '</span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.a) + '</span>';
      html += '</div>';
    } else if (d.type === 'changed' && optHighlightWords.checked) {
      html += '<div class="unified-line changed">';
      html += '<span class="unified-marker">~</span>';
      html += '<span class="unified-nums"><span class="unified-num">' + (d.aNum || '') + '</span><span class="unified-num">' + (d.bNum || '') + '</span></span>';
      html += '<span class="unified-content">' + highlightWords(d.a, d.b) + '</span>';
      html += '</div>';
    } else if (d.type === 'removed') {
      html += '<div class="unified-line removed">';
      html += '<span class="unified-marker">-</span>';
      html += '<span class="unified-nums"><span class="unified-num">' + (d.aNum || '') + '</span><span class="unified-num"></span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.a) + '</span>';
      html += '</div>';
    } else if (d.type === 'added') {
      html += '<div class="unified-line added">';
      html += '<span class="unified-marker">+</span>';
      html += '<span class="unified-nums"><span class="unified-num"></span><span class="unified-num">' + (d.bNum || '') + '</span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.b) + '</span>';
      html += '</div>';
    } else if (d.type === 'changed') {
      html += '<div class="unified-line removed">';
      html += '<span class="unified-marker">-</span>';
      html += '<span class="unified-nums"><span class="unified-num">' + (d.aNum || '') + '</span><span class="unified-num"></span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.a) + '</span>';
      html += '</div>';
      html += '<div class="unified-line added">';
      html += '<span class="unified-marker">+</span>';
      html += '<span class="unified-nums"><span class="unified-num"></span><span class="unified-num">' + (d.bNum || '') + '</span></span>';
      html += '<span class="unified-content">' + escapeHtml(d.b) + '</span>';
      html += '</div>';
    }
  });

  html += '</div>';
  diffOutput.innerHTML = html;
}

// Word-level highlight
function highlightWords(oldLine, newLine) {
  const oldWords = oldLine.split(/(\s+)/);
  const newWords = newLine.split(/(\s+)/);

  let html = '';
  const maxLen = Math.max(oldWords.length, newWords.length);

  for (let i = 0; i < maxLen; i++) {
    const ow = oldWords[i] || '';
    const nw = newWords[i] || '';

    if (ow === nw) {
      html += escapeHtml(nw);
    } else {
      if (ow) html += '<span class="word-removed">' + escapeHtml(ow) + '</span>';
      if (nw) html += '<span class="word-added">' + escapeHtml(nw) + '</span>';
    }
  }

  return html;
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// =============
// DETAILS
// ============
function buildDetails() {
  if (!detailsContent) return;

  const a = text1.value;
  const b = text2.value;
  const linesA = a.split('\n').length;
  const linesB = b.split('\n').length;
  const charsA = a.length;
  const charsB = b.length;
  const wordsA = a.trim().split(/\s+/).filter(w => w).length;
  const wordsB = b.trim().split(/\s+/).filter(w => w).length;

  const total = currentStats.added + currentStats.removed + currentStats.changed + currentStats.same;
  const matchPercent = total > 0 ? ((currentStats.same / total) * 100).toFixed(1) : '0';

  let html = '';
  html += '<div class="detail-row"><span class="detail-char">Original lines</span><span class="detail-arrow">→</span><span class="detail-value">' + linesA.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Changed lines</span><span class="detail-arrow">→</span><span class="detail-value">' + linesB.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Original words</span><span class="detail-arrow">→</span><span class="detail-value">' + wordsA.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Changed words</span><span class="detail-arrow">→</span><span class="detail-value">' + wordsB.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Original chars</span><span class="detail-arrow">→</span><span class="detail-value">' + charsA.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Changed chars</span><span class="detail-arrow">→</span><span class="detail-value">' + charsB.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Total diff lines</span><span class="detail-arrow">→</span><span class="detail-value">' + total.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Match</span><span class="detail-arrow">→</span><span class="detail-value">' + matchPercent + '%</span></div>';
  html += '<div class="detail-row"><span class="detail-char">View mode</span><span class="detail-arrow">→</span><span class="detail-value">' + currentView + '</span></div>';

  detailsContent.innerHTML = html;
}

// =========
// COPY DIFF
// ==========
copyDiffBtn.addEventListener('click', () => {
  if (!diffResult.length) {
    alert('Run a comparison first.');
    return;
  }

  const patch = buildPatch();
  navigator.clipboard.writeText(patch).then(() => {
    const original = copyDiffBtn.textContent;
    copyDiffBtn.textContent = '✓ Copied';
    copyDiffBtn.classList.add('copied');
    setTimeout(() => {
      copyDiffBtn.textContent = original;
      copyDiffBtn.classList.remove('copied');
    }, 1200);
  });
});

// ========================
// BUILD PATCH (Git-style)
// =========================
function buildPatch() {
  let patch = '--- original\n+++ changed\n';
  patch += '@@ -1,' + (text1.value.split('\n').length) + ' +1,' + (text2.value.split('\n').length) + ' @@\n';

  diffResult.forEach(d => {
    if (d.type === 'same') patch += ' ' + d.a + '\n';
    else if (d.type === 'removed') patch += '-' + d.a + '\n';
    else if (d.type === 'added') patch += '+' + d.b + '\n';
    else if (d.type === 'changed') {
      patch += '-' + d.a + '\n';
      patch += '+' + d.b + '\n';
    }
  });

  return patch;
}

// =================
// DOWNLOAD .patch
// =================
downloadDiffBtn.addEventListener('click', () => {
  if (!diffResult.length) {
    alert('Run a comparison first.');
    return;
  }

  const patch = buildPatch();
  const blob = new Blob([patch], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'changes.patch';
  a.click();
  URL.revokeObjectURL(url);
});

// ===============
// DOWNLOAD .HTML
// ================
downloadHtmlBtn.addEventListener('click', () => {
  if (!diffResult.length) {
    alert('Run a comparison first.');
    return;
  }

  const styles = `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #ddaaff; padding: 20px; line-height: 1.6; }
    h1 { color: #cc44ff; border-bottom: 2px solid #cc44ff; padding-bottom: 10px; }
    .stats { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
    .stat { padding: 10px 16px; border-radius: 8px; border: 1px solid #2a1030; }
    .stat.added { color: #33ff88; border-color: #33ff88; }
    .stat.removed { color: #ff5577; border-color: #ff5577; }
    .stat.changed { color: #ffcc33; border-color: #ffcc33; }
    .stat.same { color: #33ccff; border-color: #33ccff; }
    .diff { background: #050505; border: 1px solid #2a1030; border-radius: 8px; padding: 14px; font-family: 'Courier New', monospace; font-size: 13px; overflow-x: auto; white-space: pre-wrap; }
    .diff .add { background: rgba(51, 255, 136, 0.15); color: #aaffcc; display: block; padding: 2px 6px; border-left: 3px solid #33ff88; }
    .diff .remove { background: rgba(255, 85, 119, 0.15); color: #ffaacc; display: block; padding: 2px 6px; border-left: 3px solid #ff5577; }
    .diff .same { display: block; padding: 2px 6px; }
  `;

  let diffHtml = '';
  diffResult.forEach(d => {
    if (d.type === 'same') diffHtml += '<span class="same">' + escapeHtml(d.a) + '</span>';
    else if (d.type === 'removed') diffHtml += '<span class="remove">- ' + escapeHtml(d.a) + '</span>';
    else if (d.type === 'added') diffHtml += '<span class="add">+ ' + escapeHtml(d.b) + '</span>';
    else if (d.type === 'changed') {
      diffHtml += '<span class="remove">- ' + escapeHtml(d.a) + '</span>';
      diffHtml += '<span class="add">+ ' + escapeHtml(d.b) + '</span>';
    }
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Diff Result</title>
<style>${styles}</style>
</head>
<body>
<h1>🔍 Diff Result</h1>
<div class="stats">
  <div class="stat added">+ Added: ${currentStats.added}</div>
  <div class="stat removed">− Removed: ${currentStats.removed}</div>
  <div class="stat changed">~ Changed: ${currentStats.changed}</div>
  <div class="stat same">= Unchanged: ${currentStats.same}</div>
</div>
<div class="diff">${diffHtml}</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'diff-result.html';
  a.click();
  URL.revokeObjectURL(url);
});

// ============
// SAMPLE DATA
// ============
sampleBtn.addEventListener('click', () => {
  text1.value = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const users = ["Alice", "Bob"];
users.forEach(greet);

// TODO: add more users
console.log("Done");`;

  text2.value = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return true;
}

const users = ["Alice", "Bob", "Charlie", "Diana"];
users.forEach(user => greet(user));

// All users loaded
console.log("Done");`;

  compare();
});

// ===============
// DETAILS TOGGLE
// ===============
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// ===================
// KEYBOARD SHORTCUTS
// ===================
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    compare();
  }
});

// ====
// INIT
// ====
(function init() {
  const savedTheme = localStorage.getItem('diff_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeBtn.textContent = '☀️';
  }
})();