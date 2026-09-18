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
const modeButtons = document.querySelectorAll('.mode-btn');
const unitButtons = document.querySelectorAll('.unit-btn');
const unitButtonsWrap = document.getElementById('unitButtons');

const outSeconds = document.getElementById('outSeconds');
const outMillis = document.getElementById('outMillis');
const outUTC = document.getElementById('outUTC');
const outLocal = document.getElementById('outLocal');
const outISO = document.getElementById('outISO');
const outRelative = document.getElementById('outRelative');

const liveSeconds = document.getElementById('liveSeconds');
const liveMillis = document.getElementById('liveMillis');
const liveUTC = document.getElementById('liveUTC');
const liveLocal = document.getElementById('liveLocal');
const copyLiveBtn = document.getElementById('copyLiveBtn');
const useNowBtn = document.getElementById('useNowBtn');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let currentMode = 'ts-to-date';
let currentUnit = 's';
let lastDate = null;

// ===== Details Toggle =====
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// ===== Live Current Time =====
function updateLive() {
  const now = new Date();
  liveSeconds.textContent = Math.floor(now.getTime() / 1000);
  liveMillis.textContent = now.getTime();
  liveUTC.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  liveLocal.textContent = formatLocal(now);
}
updateLive();
setInterval(updateLive, 1000);

function formatLocal(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ===== Copy Live Unix =====
if (copyLiveBtn) {
  copyLiveBtn.addEventListener('click', () => {
    const text = Math.floor(Date.now() / 1000).toString();
    navigator.clipboard.writeText(text).then(() => {
      const original = copyLiveBtn.textContent;
      copyLiveBtn.textContent = '✓ Copied';
      copyLiveBtn.classList.add('copied');
      setTimeout(() => {
        copyLiveBtn.textContent = original;
        copyLiveBtn.classList.remove('copied');
      }, 1200);
    });
  });
}

// ===== Use Now =====
if (useNowBtn) {
  useNowBtn.addEventListener('click', () => {
    if (currentMode === 'ts-to-date') {
      inputBox.value = currentUnit === 's'
        ? Math.floor(Date.now() / 1000)
        : Date.now();
    } else {
      inputBox.value = new Date().toISOString().substring(0, 19);
    }
    inputBox.dispatchEvent(new Event('input'));
  });
}

// ===== Mode Switch =====
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;

    if (currentMode === 'ts-to-date') {
      inputBox.placeholder = 'Enter Unix timestamp (e.g. 1700000000)...';
      unitButtonsWrap.classList.remove('hidden');
    } else {
      inputBox.placeholder = 'Enter date (e.g. 2024-01-15 10:30:00)...';
      unitButtonsWrap.classList.add('hidden');
    }

    inputBox.value = '';
    clearBtn.classList.remove('show');
    resetOutputs();
  });
});

// ===== Unit Switch =====
unitButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    unitButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentUnit = btn.dataset.unit;
    inputBox.dispatchEvent(new Event('input'));
  });
});

// ===== Input Event =====
inputBox.addEventListener('input', () => {
  const raw = inputBox.value.trim();

  if (raw.length > 0) clearBtn.classList.add('show');
  else clearBtn.classList.remove('show');

  if (raw === '') {
    resetOutputs();
    detailsContent.innerHTML = '';
    return;
  }

  if (currentMode === 'ts-to-date') {
    handleTimestampInput(raw);
  } else {
    handleDateInput(raw);
  }
});

// ===== Timestamp → Date =====
function handleTimestampInput(raw) {
  let ts = parseFloat(raw);
  if (isNaN(ts)) {
    resetOutputs();
    detailsContent.innerHTML = '<p style="color:#5577aa;">Enter a valid number.</p>';
    return;
  }

  const ms = currentUnit === 's' ? ts * 1000 : ts;
  const date = new Date(ms);

  if (isNaN(date.getTime())) {
    resetOutputs();
    detailsContent.innerHTML = '<p style="color:#5577aa;">Invalid date range.</p>';
    return;
  }

  lastDate = date;
  renderOutputs(date);
  buildDetails(date, ts, currentUnit);
}

// ===== Date → Timestamp =====
function handleDateInput(raw) {
  // Try to parse the date string
  let date = new Date(raw);

  // Also try common format: YYYY-MM-DD HH:MM:SS
  if (isNaN(date.getTime())) {
    const alt = raw.replace(' ', 'T');
    date = new Date(alt);
  }

  if (isNaN(date.getTime())) {
    resetOutputs();
    detailsContent.innerHTML = '<p style="color:#5577aa;">Invalid date format.</p>';
    return;
  }

  lastDate = date;
  renderOutputs(date);
  buildDetails(date, date.getTime(), 'ms');
}

// ===== Render Outputs =====
function renderOutputs(date) {
  const ms = date.getTime();
  const s = Math.floor(ms / 1000);

  outSeconds.textContent = s;
  outMillis.textContent = ms;
  outUTC.textContent = date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  outLocal.textContent = formatLocal(date);
  outISO.textContent = date.toISOString();
  outRelative.textContent = getRelativeTime(date);
}

// ===== Reset =====
function resetOutputs() {
  outSeconds.textContent = '—';
  outMillis.textContent = '—';
  outUTC.textContent = '—';
  outLocal.textContent = '—';
  outISO.textContent = '—';
  outRelative.textContent = '—';
}

// ===== Relative Time =====
function getRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;

  const sec = Math.floor(abs / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  let text;
  if (sec < 60) text = `${sec} second${sec !== 1 ? 's' : ''}`;
  else if (min < 60) text = `${min} minute${min !== 1 ? 's' : ''}`;
  else if (hour < 24) text = `${hour} hour${hour !== 1 ? 's' : ''}`;
  else if (day < 30) text = `${day} day${day !== 1 ? 's' : ''}`;
  else if (month < 12) text = `${month} month${month !== 1 ? 's' : ''}`;
  else text = `${year} year${year !== 1 ? 's' : ''}`;

  return future ? `in ${text}` : `${text} ago`;
}

// ===== Clear Button =====
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  clearBtn.classList.remove('show');
  resetOutputs();
  detailsContent.innerHTML = '';
  inputBox.focus();
});

// ===== Copy Buttons =====
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target || target.textContent === '—') return;

    navigator.clipboard.writeText(target.textContent).then(() => {
      const original = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => (btn.textContent = original), 1000);
    });
  });
});

// ===== Details Builder =====
function buildDetails(date, inputValue, unit) {
  if (!detailsContent) return;

  const ms = date.getTime();
  const s = Math.floor(ms / 1000);

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">Input</span><span class="detail-arrow">→</span><span class="detail-value">${inputValue}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Unit</span><span class="detail-arrow">→</span><span class="detail-value">${unit === 's' ? 'Seconds' : 'Milliseconds'}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Unix (s)</span><span class="detail-arrow">→</span><span class="detail-value">${s}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Unix (ms)</span><span class="detail-arrow">→</span><span class="detail-value">${ms}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">UTC</span><span class="detail-arrow">→</span><span class="detail-value">${date.toISOString()}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Local</span><span class="detail-arrow">→</span><span class="detail-value">${formatLocal(date)}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Day</span><span class="detail-arrow">→</span><span class="detail-value">${date.toLocaleDateString('en-US', { weekday: 'long' })}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Timezone</span><span class="detail-arrow">→</span><span class="detail-value">${Intl.DateTimeFormat().resolvedOptions().timeZone}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Offset</span><span class="detail-arrow">→</span><span class="detail-value">UTC${date.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(date.getTimezoneOffset() / 60)}</span></div>`;

  detailsContent.innerHTML = html;
}