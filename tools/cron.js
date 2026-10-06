// ============================================
// CRON PARSER — Part 1
// Navbar + Theme + Elements + Cron Parsing Logic
// ============================================

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
const cronInput = document.getElementById('cronInput');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const sampleBtn = document.getElementById('sampleBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const presetChips = document.querySelectorAll('.preset-chip');
const statusBar = document.getElementById('statusBar');
const hrText = document.getElementById('hrText');
const nextRuns = document.getElementById('nextRuns');
const fieldBreakdown = document.getElementById('fieldBreakdown');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadBtn = document.getElementById('downloadBtn');
const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let currentParsed = null;

// ===== Field definitions =====
const FIELD_DEFS = [
  { name: 'Minute',    min: 0,  max: 59,  names: {} },
  { name: 'Hour',      min: 0,  max: 23,  names: {} },
  { name: 'Day',       min: 1,  max: 31,  names: {} },
  { name: 'Month',     min: 1,  max: 12,  names: { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 } },
  { name: 'Weekday',   min: 0,  max: 6,   names: { sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6 } }
];

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ===== Parse a single cron field =====
function parseField(raw, def) {
  const value = raw.toLowerCase().trim();
  const result = { raw: value, values: [], isStar: false, isStep: false, isRange: false, isList: false, description: '' };

  // Handle '*'
  if (value === '*') {
    result.isStar = true;
    for (let i = def.min; i <= def.max; i++) result.values.push(i);
    result.description = 'every ' + def.name.toLowerCase();
    return result;
  }

  // Handle '*/n' step
  if (value.startsWith('*/')) {
    const step = parseInt(value.slice(2), 10);
    if (isNaN(step) || step <= 0) return null;
    result.isStep = true;
    for (let i = def.min; i <= def.max; i += step) result.values.push(i);
    result.description = 'every ' + step + ' ' + def.name.toLowerCase() + (step > 1 ? 's' : '');
    return result;
  }

  // Handle comma list
  const parts = value.split(',');
  if (parts.length > 1) result.isList = true;

  for (const part of parts) {
    // Range with step: a-b/n
    if (part.includes('/')) {
      const [rangePart, stepStr] = part.split('/');
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) return null;

      if (rangePart.includes('-')) {
        const [a, b] = rangePart.split('-').map(s => resolveName(s, def));
        if (a === null || b === null || a < def.min || b > def.max || a > b) return null;
        result.isRange = true;
        result.isStep = true;
        for (let i = a; i <= b; i += step) result.values.push(i);
        result.description = 'every ' + step + ' ' + def.name.toLowerCase() + ' from ' + a + ' to ' + b;
      } else {
        const a = resolveName(rangePart, def);
        if (a === null) return null;
        result.isStep = true;
        for (let i = a; i <= def.max; i += step) result.values.push(i);
        result.description = 'every ' + step + ' ' + def.name.toLowerCase() + ' starting at ' + a;
      }
    }
    // Range: a-b
    else if (part.includes('-')) {
      const [a, b] = part.split('-').map(s => resolveName(s, def));
      if (a === null || b === null || a < def.min || b > def.max || a > b) return null;
      result.isRange = true;
      for (let i = a; i <= b; i++) result.values.push(i);
      result.description = def.name.toLowerCase() + ' from ' + a + ' to ' + b;
    }
    // Single value
    else {
      const v = resolveName(part, def);
      if (v === null || v < def.min || v > def.max) return null;
      result.values.push(v);
    }
  }

  // Deduplicate + sort
  result.values = [...new Set(result.values)].sort((a, b) => a - b);

  // Build description for list/range
  if (result.isRange && !result.description) {
    result.description = def.name.toLowerCase() + ' from ' + result.values[0] + ' to ' + result.values[result.values.length - 1];
  } else if (result.isList) {
    result.description = def.name.toLowerCase() + ' at ' + result.values.join(', ');
  } else if (!result.description) {
    result.description = def.name.toLowerCase() + ' at ' + result.values[0];
  }

  return result;
}

// ===== Resolve named values (JAN, MON, etc.) =====
function resolveName(str, def) {
  str = str.trim();
  if (def.names && def.names[str] !== undefined) return def.names[str];
  const n = parseInt(str, 10);
  if (isNaN(n)) return null;
  return n;
}

// ===== Validate + Parse full cron =====
function parseCron(expr) {
  const trimmed = expr.trim();
  if (!trimmed) return { error: 'Empty expression' };

  const fields = trimmed.split(/\s+/);
  if (fields.length !== 5) {
    return { error: 'Cron must have exactly 5 fields (minute hour day month weekday). You have ' + fields.length + '.' };
  }

  const parsed = [];
  for (let i = 0; i < 5; i++) {
    const p = parseField(fields[i], FIELD_DEFS[i]);
    if (!p) {
      return { error: 'Invalid value in ' + FIELD_DEFS[i].name + ' field: "' + fields[i] + '"' };
    }
    parsed.push(p);
  }

  return { fields: parsed, original: trimmed };
}

// ===== Build human readable =====
function buildHumanReadable(parsed) {
  const [min, hr, day, mon, wk] = parsed.fields;

  // Time part
  let timePart = '';
  if (min.isStar && hr.isStar) {
    timePart = 'Every minute';
  } else if (min.isStar) {
    timePart = 'Every minute';
  } else if (min.isStep && hr.isStar) {
    timePart = 'Every ' + min.raw.slice(2) + ' minutes';
  } else if (hr.isStar) {
    timePart = 'At minute ' + min.values.join(', ') + ' of every hour';
  } else if (min.isStar) {
    timePart = 'Every minute during hour ' + hr.values.join(', ');
  } else {
    // Specific time
    const minutes = min.values.map(m => String(m).padStart(2, '0'));
    const hours = hr.values.map(h => String(h).padStart(2, '0'));
    if (min.values.length === 1 && hr.values.length === 1) {
      timePart = 'At ' + hours[0] + ':' + minutes[0];
    } else if (min.values.length === 1) {
      timePart = 'At minute ' + minutes[0] + ' of hours ' + hr.values.join(', ');
    } else if (hr.values.length === 1) {
      timePart = 'At minutes ' + minutes.join(', ') + ' past hour ' + hours[0];
    } else {
      timePart = 'At minutes ' + minutes.join(', ') + ' of hours ' + hr.values.join(', ');
    }
  }

  // Day part
  let dayPart = '';
  if (day.isStar && wk.isStar) {
    dayPart = 'every day';
  } else if (!day.isStar && wk.isStar) {
    dayPart = 'on day ' + day.values.join(', ') + ' of the month';
  } else if (day.isStar && !wk.isStar) {
    const dayNames = wk.values.map(v => WEEKDAY_NAMES[v]).join(', ');
    dayPart = 'on ' + dayNames;
  } else {
    // Both restricted → OR logic
    const dayNames = wk.values.map(v => WEEKDAY_NAMES[v]).join(', ');
    dayPart = 'on day ' + day.values.join(', ') + ' of the month OR on ' + dayNames;
  }

  // Month part
  let monthPart = '';
  if (!mon.isStar) {
    const monthNames = mon.values.map(v => MONTH_NAMES[v]).join(', ');
    monthPart = 'in ' + monthNames;
  }

  return (timePart + ' ' + dayPart + (monthPart ? ' ' + monthPart : '')).replace(/\s+/g, ' ').trim();
}

// ============================================
// CRON PARSER — Part 2
// Next Run Times + Field Breakdown + Render
// ============================================

// ===== Find next run times =====
function getNextRuns(parsed, count) {
  const [minF, hrF, dayF, monF, wkF] = parsed.fields;
  const results = [];

  // Special handling for OR logic on day/month
  const bothRestricted = !dayF.isStar && !wkF.isStar;
  const dayStar = dayF.isStar;
  const wkStar = wkF.isStar;

  const minSet = new Set(minF.values);
  const hrSet = new Set(hrF.values);
  const daySet = new Set(dayF.values);
  const monSet = new Set(monF.values);
  const wkSet = new Set(wkF.values);

  const start = new Date();
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const cursor = new Date(start);
  let safety = 0;
  const maxIterations = 5 * 366 * 24 * 60;

  while (results.length < count && safety < maxIterations) {
    safety++;

    const month = cursor.getMonth() + 1;
    const day = cursor.getDate();
    const weekday = cursor.getDay();
    const hour = cursor.getHours();
    const minute = cursor.getMinutes();

    // Check month
    if (!monSet.has(month)) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    // Day check (OR logic)
    let dayMatches;
    if (dayStar && wkStar) {
      dayMatches = true;
    } else if (!dayStar && wkStar) {
      dayMatches = daySet.has(day);
    } else if (dayStar && !wkStar) {
      dayMatches = wkSet.has(weekday);
    } else {
      dayMatches = daySet.has(day) || wkSet.has(weekday);
    }

    if (!dayMatches) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    // Hour check
    if (!hrSet.has(hour)) {
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
      continue;
    }

    // Minute check
    if (!minSet.has(minute)) {
      cursor.setMinutes(cursor.getMinutes() + 1, 0, 0);
      continue;
    }

    // Match!
    results.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

// ===== Format date for display =====
function formatDateTime(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = days[date.getDay()];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');

  return day + ', ' + m + ' ' + d + ', ' + y + ' at ' + h + ':' + mi;
}

// ===== Relative time =====
function getRelativeTime(date) {
  const now = new Date();
  const diff = date - now;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'in less than a minute';
  if (mins < 60) return 'in ' + mins + ' minute' + (mins > 1 ? 's' : '');
  if (hours < 24) return 'in ' + hours + ' hour' + (hours > 1 ? 's' : '');
  if (days < 30) return 'in ' + days + ' day' + (days > 1 ? 's' : '');
  return 'in ' + Math.floor(days / 30) + ' months';
}

// ===== Render Next Runs =====
function renderNextRuns(runs) {
  if (!nextRuns) return;

  if (runs.length === 0) {
    nextRuns.innerHTML = '<p class="empty-note">No upcoming runs found in the next 5 years.</p>';
    return;
  }

  let html = '';
  runs.forEach((run, i) => {
    html += `
      <div class="next-run-item">
        <div class="next-run-index">${i + 1}</div>
        <div class="next-run-content">
          <div class="next-run-date">${formatDateTime(run)}</div>
          <div class="next-run-relative">${getRelativeTime(run)}</div>
        </div>
      </div>
    `;
  });

  nextRuns.innerHTML = html;
}

// ===== Render Field Breakdown =====
function renderFieldBreakdown(parsed) {
  if (!fieldBreakdown) return;

  let html = '';
  parsed.fields.forEach((f, i) => {
    const def = FIELD_DEFS[i];
    html += `
      <div class="field-item">
        <span class="field-name">${def.name}</span>
        <span class="field-value">${f.raw}</span>
        <span class="field-meaning">${f.description}</span>
      </div>
    `;
  });

  fieldBreakdown.innerHTML = html;
}

// ===== Render Details =====
function renderDetails(parsed) {
  if (!detailsContent) return;

  let html = '';

  // Section 1: Field-by-field breakdown
  html += '<div class="detail-section">';
  html += '<h4>📋 Field Breakdown</h4>';
  parsed.fields.forEach((f, i) => {
    const def = FIELD_DEFS[i];
    html += `<div class="detail-row"><span class="detail-label">${def.name}</span><span class="detail-value">"${f.raw}" → ${f.description}</span></div>`;
  });
  html += '</div>';

  // Section 2: Special characters explained
  html += '<div class="detail-section">';
  html += '<h4>🔤 Special Characters Used</h4>';
  html += '<ul class="step-list">';
  const used = new Set();
  parsed.fields.forEach(f => {
    if (f.isStar) used.add('*');
    if (f.isList) used.add(',');
    if (f.isRange) used.add('-');
    if (f.isStep) used.add('/');
  });
  if (used.has('*')) html += '<li><strong>*</strong> — every value (any)</li>';
  if (used.has(',')) html += '<li><strong>,</strong> — list of values</li>';
  if (used.has('-')) html += '<li><strong>-</strong> — range of values</li>';
  if (used.has('/')) html += '<li><strong>/</strong> — step (every Nth value)</li>';
  if (used.size === 0) html += '<li>No special characters — single fixed values only</li>';
  html += '</ul>';
  html += '</div>';

  // Section 3: Values per field
  html += '<div class="detail-section">';
  html += '<h4>🔢 Expanded Values</h4>';
  parsed.fields.forEach((f, i) => {
    const def = FIELD_DEFS[i];
    let displayValues = f.values;
    if (def.name === 'Weekday') {
      displayValues = f.values.map(v => WEEKDAY_NAMES[v]);
    } else if (def.name === 'Month') {
      displayValues = f.values.map(v => MONTH_NAMES[v]);
    }
    const preview = displayValues.slice(0, 12).join(', ') + (displayValues.length > 12 ? ' …' : '');
    html += `<div class="detail-row"><span class="detail-label">${def.name}</span><span class="detail-value">${preview}</span></div>`;
  });
  html += '</div>';

  // Section 4: OR logic warning if applicable
  const dayF = parsed.fields[2];
  const wkF = parsed.fields[4];
  if (!dayF.isStar && !wkF.isStar) {
    html += '<div class="detail-section">';
    html += '<h4>⚠️ OR Logic Detected</h4>';
    html += '<div class="warn-box">';
    html += 'Both <strong>Day-of-Month</strong> and <strong>Day-of-Week</strong> are restricted. ';
    html += 'Cron will run the job when <strong>EITHER</strong> condition is true — not both. ';
    html += 'This is the #1 source of cron bugs.';
    html += '</div>';
    html += '</div>';
  }

  detailsContent.innerHTML = html;
}

// ============================================
// CRON PARSER — Part 3
// Main Process + Events + Theme + Init
// ============================================

// ===== Status =====
function setStatus(type, icon, text) {
  if (!statusBar) return;
  statusBar.className = 'status-bar';
  if (type === 'success') statusBar.classList.add('success');
  else if (type === 'error') statusBar.classList.add('error');

  statusBar.querySelector('.status-icon').textContent = icon;
  statusBar.querySelector('.status-text').textContent = text;
}

// ===== Main Process =====
function process() {
  const raw = cronInput.value.trim();

  if (raw.length > 0) clearBtn.classList.add('show');
  else clearBtn.classList.remove('show');

  if (raw === '') {
    hrText.textContent = '—';
    nextRuns.innerHTML = '<p class="empty-note">Next run times will appear here.</p>';
    fieldBreakdown.innerHTML = '<p class="empty-note">Field breakdown will appear here.</p>';
    detailsContent.innerHTML = '<p class="no-details">Enter a cron expression to see step-by-step details.</p>';
    setStatus('info', '⏰', 'Enter a cron expression to parse');
    currentParsed = null;
    return;
  }

  const parsed = parseCron(raw);

  if (parsed.error) {
    hrText.textContent = '❌ ' + parsed.error;
    nextRuns.innerHTML = '<p class="empty-note">Fix the error to see next runs.</p>';
    fieldBreakdown.innerHTML = '<p class="empty-note">Fix the error to see field breakdown.</p>';
    detailsContent.innerHTML = '<p class="no-details">' + parsed.error + '</p>';
    setStatus('error', '❌', parsed.error);
    currentParsed = null;
    return;
  }

  currentParsed = parsed;

  // Human readable
  const humanText = buildHumanReadable(parsed);
  hrText.textContent = humanText;

  // Next runs
  const runs = getNextRuns(parsed, 5);
  renderNextRuns(runs);

  // Field breakdown
  renderFieldBreakdown(parsed);

  // Details
  renderDetails(parsed);

  setStatus('success', '✅', 'Parsed successfully — ' + humanText);
}

// ===== Input Event (Live) =====
cronInput.addEventListener('input', process);

// ===== Clear =====
clearBtn.addEventListener('click', () => {
  cronInput.value = '';
  clearBtn.classList.remove('show');
  process();
  cronInput.focus();
});

// ===== Paste =====
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      cronInput.value = text.trim();
      clearBtn.classList.add('show');
      process();
    }
  } catch (e) {
    alert('Clipboard access denied. Please paste manually.');
  }
});

// ===== Sample =====
sampleBtn.addEventListener('click', () => {
  cronInput.value = '*/15 9-17 * * 1-5';
  clearBtn.classList.add('show');
  process();
});

// ===== Clear All =====
clearAllBtn.addEventListener('click', () => {
  cronInput.value = '';
  clearBtn.classList.remove('show');
  process();
});

// ===== Presets =====
presetChips.forEach(chip => {
  chip.addEventListener('click', () => {
    cronInput.value = chip.dataset.cron;
    clearBtn.classList.add('show');
    process();
  });
});

// ===== Copy All =====
copyAllBtn.addEventListener('click', () => {
  if (!currentParsed) {
    alert('Enter a valid cron expression first.');
    return;
  }

  let text = '';
  text += 'Cron Expression: ' + currentParsed.original + '\n\n';
  text += 'Meaning: ' + hrText.textContent + '\n\n';
  text += 'Fields:\n';
  currentParsed.fields.forEach((f, i) => {
    text += '  ' + FIELD_DEFS[i].name + ': ' + f.raw + ' → ' + f.description + '\n';
  });

  text += '\nNext 5 Run Times:\n';
  const runs = getNextRuns(currentParsed, 5);
  runs.forEach((r, i) => {
    text += '  ' + (i + 1) + '. ' + formatDateTime(r) + ' (' + getRelativeTime(r) + ')\n';
  });

  navigator.clipboard.writeText(text).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1200);
  });
});

// ===== Download =====
downloadBtn.addEventListener('click', () => {
  if (!currentParsed) {
    alert('Enter a valid cron expression first.');
    return;
  }

  let text = 'Cron Expression: ' + currentParsed.original + '\n\n';
  text += 'Meaning: ' + hrText.textContent + '\n\n';
  text += 'Fields:\n';
  currentParsed.fields.forEach((f, i) => {
    text += '  ' + FIELD_DEFS[i].name + ': ' + f.raw + ' → ' + f.description + '\n';
  });

  text += '\nNext 5 Run Times:\n';
  const runs = getNextRuns(currentParsed, 5);
  runs.forEach((r, i) => {
    text += '  ' + (i + 1) + '. ' + formatDateTime(r) + ' (' + getRelativeTime(r) + ')\n';
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cron-parse.txt';
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