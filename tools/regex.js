// =========================================
// NAVBAR TOGGLE (MOBILE)
// =========================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// =========================================
// ACTIVE LINK HIGHLIGHT
// =========================================

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) {
    link.classList.add('active');
  }
});

// =========================================
// BACK TO TOP
// =========================================

const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =========================================
// ELEMENT REFERENCES
// =========================================

const patternInput = document.getElementById('patternInput');
const flagsInput = document.getElementById('flagsInput');
const testInput = document.getElementById('testInput');
const clearBtn = document.getElementById('clearBtn');
const highlightBox = document.getElementById('highlightBox');
const statusBar = document.getElementById('statusBar');
const copyBtn = document.getElementById('copyBtn');
const sampleBtn = document.getElementById('sampleBtn');

const statMatches = document.getElementById('statMatches');
const statGroups = document.getElementById('statGroups');
const statPattern = document.getElementById('statPattern');
const statFlags = document.getElementById('statFlags');

const presetButtons = document.querySelectorAll('.preset-btn');
const flagChips = document.querySelectorAll('.flag-chip');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let lastResults = [];

// =========================================
// DETAILS TOGGLE
// =========================================

if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// =========================================
// PRESET BUTTONS (QUICK PATTERNS)
// =========================================

presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    patternInput.value = btn.dataset.pattern;
    flagsInput.value = btn.dataset.flags || 'g';
    updateFlagChips();
    runRegex();
  });
});

// =========================================
// FLAG CHIPS (CLICK TO TOGGLE)
// =========================================

flagChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const flag = chip.dataset.flag;
    let flags = flagsInput.value;

    if (flags.includes(flag)) {
      flags = flags.replace(flag, '');
    } else {
      flags += flag;
    }

    flags = flags.split('').sort().join('');
    flagsInput.value = flags;
    updateFlagChips();
    runRegex();
  });
});

// =========================================
// UPDATE FLAG CHIPS VISUAL
// =========================================

function updateFlagChips() {
  const flags = flagsInput.value;

  flagChips.forEach(chip => {
    if (flags.includes(chip.dataset.flag)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

// =========================================
// INPUT EVENTS
// =========================================

patternInput.addEventListener('input', runRegex);

flagsInput.addEventListener('input', () => {
  updateFlagChips();
  runRegex();
});

testInput.addEventListener('input', () => {
  if (testInput.value.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }
  runRegex();
});

// =========================================
// CLEAR BUTTON
// =========================================

clearBtn.addEventListener('click', () => {
  testInput.value = '';
  clearBtn.classList.remove('show');
  runRegex();
  testInput.focus();
});

// =========================================
// MAIN REGEX RUNNER
// =========================================

function runRegex() {
  const pattern = patternInput.value;
  const flags = flagsInput.value;
  const text = testInput.value;

  statPattern.textContent = pattern ? '/' + pattern + '/' : '—';
  statFlags.textContent = flags || '—';

  // No pattern
  if (!pattern) {
    highlightBox.innerHTML = '<span class="output-placeholder">Highlighted matches will appear here...</span>';
    setStatus('info', '🔍', 'Write a pattern to start testing');
    resetStats();
    lastResults = [];
    detailsContent.innerHTML = '<p class="no-details">Run a pattern to see match details.</p>';
    return;
  }

  // Build regex
  let regex;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err) {
    highlightBox.innerHTML = '<span class="output-placeholder">Invalid pattern — check your regex.</span>';
    setStatus('error', '✕', 'Invalid regex: ' + err.message);
    resetStats();
    lastResults = [];
    detailsContent.innerHTML = '<p class="no-details">Cannot parse regex.</p>';
    return;
  }

  // No test text
  if (!text) {
    highlightBox.innerHTML = '<span class="output-placeholder">Type some test text above...</span>';
    setStatus('info', '✏️', 'Add test text to see matches');
    resetStats();
    lastResults = [];
    detailsContent.innerHTML = '<p class="no-details">Add test text to see match details.</p>';
    return;
  }

  // Find all matches
  const matches = [];
  let match;

  if (flags.includes('g')) {
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index,
        groups: match.slice(1).map((g, i) => ({
          index: i + 1,
          value: g !== undefined ? g : null
        })),
        namedGroups: match.groups || {}
      });
      if (match.index === regex.lastIndex) regex.lastIndex++;
      if (matches.length > 10000) break;
    }
  } else {
    match = regex.exec(text);
    if (match) {
      matches.push({
        text: match[0],
        index: match.index,
        groups: match.slice(1).map((g, i) => ({
          index: i + 1,
          value: g !== undefined ? g : null
        })),
        namedGroups: match.groups || {}
      });
    }
  }

  lastResults = matches;

  // Highlight output
  if (matches.length === 0) {
    highlightBox.textContent = text;
    setStatus('error', '✕', 'No matches found');
  } else {
    highlightBox.innerHTML = highlightText(text, matches);
    const noun = matches.length === 1 ? 'match' : 'matches';
    setStatus('success', '✓', matches.length + ' ' + noun + ' found');
  }

  // Stats
  const totalGroups = matches.reduce((sum, m) => sum + m.groups.length, 0);
  statMatches.textContent = matches.length;
  statGroups.textContent = totalGroups;

  // Details
  buildMatchDetails(matches);
}

// =========================================
// HIGHLIGHT TEXT
// =========================================

function highlightText(text, matches) {
  if (matches.length === 0) return escapeHTML(text);

  let result = '';
  let lastIndex = 0;

  matches.forEach((m, i) => {
    const start = m.index;
    const end = start + m.text.length;

    result += escapeHTML(text.substring(lastIndex, start));

    const cls = i % 2 === 0 ? 'match-hl' : 'match-hl alt';
    result += `<span class="${cls}">${escapeHTML(m.text)}</span>`;

    lastIndex = end;
  });

  result += escapeHTML(text.substring(lastIndex));

  return result;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// =========================================
// STATUS
// =========================================

function setStatus(type, icon, text) {
  statusBar.className = 'status-bar';
  if (type === 'success') statusBar.classList.add('success');
  else if (type === 'error') statusBar.classList.add('error');

  statusBar.querySelector('.status-icon').textContent = icon;
  statusBar.querySelector('.status-text').textContent = text;
}

// =========================================
// RESET STATS
// =========================================

function resetStats() {
  statMatches.textContent = '0';
  statGroups.textContent = '0';
}

// =========================================
// MATCH DETAILS BUILDER
// =========================================

function buildMatchDetails(matches) {
  if (!detailsContent) return;

  if (matches.length === 0) {
    detailsContent.innerHTML = '<p class="no-details">No matches to show.</p>';
    return;
  }

  let html = '';

  matches.slice(0, 50).forEach((m, i) => {
    const cls = i % 2 === 0 ? 'match-item' : 'match-item alt';
    html += `<div class="${cls}">`;
    html += `<div class="match-head">`;
    html += `<span class="match-index">Match ${i + 1}</span>`;
    html += `<span class="match-position">at index ${m.index}</span>`;
    html += `</div>`;
    html += `<div class="match-text">"${escapeHTML(m.text)}"</div>`;

    m.groups.forEach(g => {
      const val = g.value === null ? '(no match)' : `"${escapeHTML(g.value)}"`;
      html += `<div class="match-group"><span class="match-group-key">Group ${g.index}</span><span class="match-group-value">${val}</span></div>`;
    });

    const namedKeys = Object.keys(m.namedGroups);
    namedKeys.forEach(key => {
      const val = m.namedGroups[key] === undefined ? '(no match)' : `"${escapeHTML(m.namedGroups[key])}"`;
      html += `<div class="match-group"><span class="match-group-key">${key}</span><span class="match-group-value">${val}</span></div>`;
    });

    html += `</div>`;
  });

  if (matches.length > 50) {
    html += `<p class="no-details">+${matches.length - 50} more matches (showing first 50)</p>`;
  }

  detailsContent.innerHTML = html;
}

// =========================================
// COPY BUTTON
// =========================================

copyBtn.addEventListener('click', () => {
  if (!highlightBox.textContent || highlightBox.textContent.includes('appear here')) return;

  navigator.clipboard.writeText(highlightBox.textContent).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1200);
  });
});

// =========================================
// SAMPLE BUTTON
// =========================================

sampleBtn.addEventListener('click', () => {
  patternInput.value = '\\d+';
  flagsInput.value = 'g';
  testInput.value = `Order #12345 was placed on 2024-01-15.
Customer ID: 9876, Total: 250 rupees.
Refund issued: 50 units on 2024-02-03.
Order #67890 shipped on 2024-03-10.`;
  clearBtn.classList.add('show');
  updateFlagChips();
  runRegex();
});

// =========================================
// INIT
// =========================================

updateFlagChips();