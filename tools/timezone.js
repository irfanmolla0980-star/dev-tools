// Navbar toggle
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

// =========================================
// TIME ZONE DATABASE (70+)
// =========================================
const TIME_ZONES = [
  { value: 'UTC', label: 'UTC — Universal Time' },
  { value: 'Asia/Kolkata', label: 'IST — India (New Delhi)' },
  { value: 'Asia/Karachi', label: 'PKT — Pakistan (Karachi)' },
  { value: 'Asia/Dhaka', label: 'BST — Bangladesh (Dhaka)' },
  { value: 'Asia/Kathmandu', label: 'NPT — Nepal (Kathmandu)' },
  { value: 'Asia/Colombo', label: 'IST — Sri Lanka (Colombo)' },
  { value: 'Asia/Kabul', label: 'AFT — Afghanistan (Kabul)' },
  { value: 'Asia/Tehran', label: 'IRST — Iran (Tehran)' },
  { value: 'Asia/Dubai', label: 'GST — Dubai (UAE)' },
  { value: 'Asia/Riyadh', label: 'AST — Saudi Arabia (Riyadh)' },
  { value: 'Asia/Qatar', label: 'AST — Qatar (Doha)' },
  { value: 'Asia/Kuwait', label: 'AST — Kuwait' },
  { value: 'Asia/Baghdad', label: 'AST — Iraq (Baghdad)' },
  { value: 'Asia/Jerusalem', label: 'IST — Israel (Jerusalem)' },
  { value: 'Asia/Beirut', label: 'EET — Lebanon (Beirut)' },
  { value: 'Asia/Istanbul', label: 'TRT — Turkey (Istanbul)' },
  { value: 'Asia/Tashkent', label: 'UZT — Uzbekistan' },
  { value: 'Asia/Almaty', label: 'ALMT — Kazakhstan' },
  { value: 'Asia/Bangkok', label: 'ICT — Thailand (Bangkok)' },
  { value: 'Asia/Ho_Chi_Minh', label: 'ICT — Vietnam (Hanoi)' },
  { value: 'Asia/Jakarta', label: 'WIB — Indonesia (Jakarta)' },
  { value: 'Asia/Singapore', label: 'SGT — Singapore' },
  { value: 'Asia/Kuala_Lumpur', label: 'MYT — Malaysia (KL)' },
  { value: 'Asia/Manila', label: 'PST — Philippines (Manila)' },
  { value: 'Asia/Hong_Kong', label: 'HKT — Hong Kong' },
  { value: 'Asia/Shanghai', label: 'CST — China (Shanghai)' },
  { value: 'Asia/Taipei', label: 'CST — Taiwan (Taipei)' },
  { value: 'Asia/Seoul', label: 'KST — South Korea (Seoul)' },
  { value: 'Asia/Tokyo', label: 'JST — Japan (Tokyo)' },
  { value: 'Asia/Ulaanbaatar', label: 'ULAT — Mongolia' },
  { value: 'Asia/Yangon', label: 'MMT — Myanmar (Yangon)' },
  { value: 'Europe/London', label: 'GMT — UK (London)' },
  { value: 'Europe/Dublin', label: 'GMT — Ireland (Dublin)' },
  { value: 'Europe/Lisbon', label: 'WET — Portugal (Lisbon)' },
  { value: 'Europe/Madrid', label: 'CET — Spain (Madrid)' },
  { value: 'Europe/Paris', label: 'CET — France (Paris)' },
  { value: 'Europe/Berlin', label: 'CET — Germany (Berlin)' },
  { value: 'Europe/Rome', label: 'CET — Italy (Rome)' },
  { value: 'Europe/Amsterdam', label: 'CET — Netherlands' },
  { value: 'Europe/Brussels', label: 'CET — Belgium' },
  { value: 'Europe/Vienna', label: 'CET — Austria' },
  { value: 'Europe/Zurich', label: 'CET — Switzerland' },
  { value: 'Europe/Stockholm', label: 'CET — Sweden' },
  { value: 'Europe/Oslo', label: 'CET — Norway' },
  { value: 'Europe/Copenhagen', label: 'CET — Denmark' },
  { value: 'Europe/Warsaw', label: 'CET — Poland' },
  { value: 'Europe/Prague', label: 'CET — Czechia' },
  { value: 'Europe/Budapest', label: 'CET — Hungary' },
  { value: 'Europe/Athens', label: 'EET — Greece (Athens)' },
  { value: 'Europe/Helsinki', label: 'EET — Finland' },
  { value: 'Europe/Bucharest', label: 'EET — Romania' },
  { value: 'Europe/Kyiv', label: 'EET — Ukraine (Kyiv)' },
  { value: 'Europe/Moscow', label: 'MSK — Russia (Moscow)' },
  { value: 'Africa/Cairo', label: 'EET — Egypt (Cairo)' },
  { value: 'Africa/Lagos', label: 'WAT — Nigeria (Lagos)' },
  { value: 'Africa/Nairobi', label: 'EAT — Kenya (Nairobi)' },
  { value: 'Africa/Johannesburg', label: 'SAST — South Africa' },
  { value: 'Africa/Casablanca', label: 'WET — Morocco' },
  { value: 'Africa/Accra', label: 'GMT — Ghana (Accra)' },
  { value: 'America/New_York', label: 'EST — New York (US)' },
  { value: 'America/Chicago', label: 'CST — Chicago (US)' },
  { value: 'America/Denver', label: 'MST — Denver (US)' },
  { value: 'America/Phoenix', label: 'MST — Phoenix (US)' },
  { value: 'America/Los_Angeles', label: 'PST — Los Angeles (US)' },
  { value: 'America/Anchorage', label: 'AKST — Alaska (US)' },
  { value: 'Pacific/Honolulu', label: 'HST — Hawaii (US)' },
  { value: 'America/Toronto', label: 'EST — Toronto (Canada)' },
  { value: 'America/Vancouver', label: 'PST — Vancouver (Canada)' },
  { value: 'America/Mexico_City', label: 'CST — Mexico City' },
  { value: 'America/Sao_Paulo', label: 'BRT — São Paulo (Brazil)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'ART — Buenos Aires' },
  { value: 'America/Bogota', label: 'COT — Bogotá (Colombia)' },
  { value: 'America/Lima', label: 'PET — Lima (Peru)' },
  { value: 'America/Santiago', label: 'CLT — Santiago (Chile)' },
  { value: 'America/Caracas', label: 'VET — Caracas (Venezuela)' },
  { value: 'Australia/Sydney', label: 'AEDT — Sydney (Australia)' },
  { value: 'Australia/Melbourne', label: 'AEDT — Melbourne' },
  { value: 'Australia/Brisbane', label: 'AEST — Brisbane' },
  { value: 'Australia/Perth', label: 'AWST — Perth' },
  { value: 'Australia/Adelaide', label: 'ACDT — Adelaide' },
  { value: 'Pacific/Auckland', label: 'NZDT — Auckland (NZ)' },
  { value: 'Pacific/Fiji', label: 'FJT — Fiji' }
];

// Elements
const liveClockTime = document.getElementById('liveClockTime');
const liveClockDate = document.getElementById('liveClockDate');
const liveClockZone = document.getElementById('liveClockZone');
const utcTime = document.getElementById('utcTime');
const utcDate = document.getElementById('utcDate');
const utcCopyBtn = document.getElementById('utcCopyBtn');

const zoneSearch = document.getElementById('zoneSearch');
const searchClearBtn = document.getElementById('searchClearBtn');
const zonesCount = document.getElementById('zonesCount');

const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const nowBtn = document.getElementById('nowBtn');

const fromDisplay = document.getElementById('fromDisplay');
const toDisplay = document.getElementById('toDisplay');
const fromSearch = document.getElementById('fromSearch');
const toSearch = document.getElementById('toSearch');
const fromList = document.getElementById('fromList');
const toList = document.getElementById('toList');
const fromPicker = document.getElementById('fromPicker');
const toPicker = document.getElementById('toPicker');

const swapBtn = document.getElementById('swapBtn');
const mainValue = document.getElementById('mainValue');
const mainCopyBtn = document.getElementById('mainCopyBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const timeDiff = document.getElementById('timeDiff');

const formatBtns = document.querySelectorAll('.format-btn');
const quickZones = document.querySelectorAll('.quick-zone');

const allZonesList = document.getElementById('allZonesList');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// State
let fromZoneValue = 'Asia/Kolkata';
let toZoneValue = 'America/New_York';
let currentSearchTerm = '';
let currentFormat = '12';

// Format time based on toggle
function formatTime(date, tz, use12 = currentFormat === '12') {
  const opts = {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12
  };
  return new Intl.DateTimeFormat('en-GB', opts).format(date);
}

function formatDateTime(date, tz, use12 = currentFormat === '12') {
  const opts = {
    timeZone: tz,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12
  };
  return new Intl.DateTimeFormat('en-GB', opts).format(date);
}

function getOffset(tz, date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const parts = dtf.formatToParts(date);
  const v = {};
  parts.forEach(p => v[p.type] = p.value);
  const asUTC = Date.UTC(
    parseInt(v.year), parseInt(v.month) - 1, parseInt(v.day),
    parseInt(v.hour === '24' ? '0' : v.hour), parseInt(v.minute), parseInt(v.second)
  );
  return (asUTC - date.getTime()) / 60000;
}

function getAbbr(tz, date) {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' });
    const parts = dtf.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch (e) { return ''; }
}

function isDST(tz, date) {
  const jan = new Date(date.getFullYear(), 0, 1);
  const jul = new Date(date.getFullYear(), 6, 1);
  const janOff = getOffset(tz, jan);
  const julOff = getOffset(tz, jul);
  if (janOff === julOff) return false;
  const thisOff = getOffset(tz, date);
  const stdOff = Math.max(janOff, julOff) === julOff ? julOff : janOff;
  return thisOff < stdOff;
}

// Live clock + UTC
function updateClocks() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  const use12 = currentFormat === '12';
  if (use12) {
    let h = now.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    liveClockTime.textContent = `${h}:${mm}:${ss} ${ampm}`;
  } else {
    liveClockTime.textContent = `${hh}:${mm}:${ss}`;
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  liveClockDate.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  liveClockZone.textContent = localZone;

  // UTC
  utcTime.textContent = now.toISOString().substring(11, 19) + ' UTC';
  const yyyy = now.getUTCFullYear();
  const mo = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  utcDate.textContent = `${yyyy}-${mo}-${dd}`;
}
updateClocks();
setInterval(updateClocks, 1000);

// Init date/time
function initDateTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  timeInput.value = `${hh}:${min}`;
}
initDateTime();

// Build zone list
function buildZoneList(filter, container) {
  const filtered = TIME_ZONES.filter(z => z.label.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    container.innerHTML = '<div class="zone-option empty">No zones found</div>';
    return;
  }

  let html = '';
  filtered.forEach(zone => {
    const isSelected = (container === fromList && zone.value === fromZoneValue) ||
                       (container === toList && zone.value === toZoneValue);
    html += `<div class="zone-option ${isSelected ? 'selected' : ''}" data-value="${zone.value}">${zone.label}</div>`;
  });
  container.innerHTML = html;

  container.querySelectorAll('.zone-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const value = opt.dataset.value;
      if (container === fromList) {
        fromZoneValue = value;
        updateDisplay(fromDisplay, value);
        fromPicker.classList.remove('open');
        fromSearch.value = '';
        buildZoneList('', fromList);
      } else {
        toZoneValue = value;
        updateDisplay(toDisplay, value);
        toPicker.classList.remove('open');
        toSearch.value = '';
        buildZoneList('', toList);
      }
      updateConversion();
    });
  });
}

function updateDisplay(el, value) {
  const zone = TIME_ZONES.find(z => z.value === value);
  if (zone) el.querySelector('.zone-picker-text').textContent = zone.label;
}

// Init dropdowns
updateDisplay(fromDisplay, fromZoneValue);
updateDisplay(toDisplay, toZoneValue);
buildZoneList('', fromList);
buildZoneList('', toList);

// Dropdown open/close
fromDisplay.addEventListener('click', (e) => {
  e.stopPropagation();
  fromPicker.classList.toggle('open');
  toPicker.classList.remove('open');
  if (fromPicker.classList.contains('open')) setTimeout(() => fromSearch.focus(), 100);
});
toDisplay.addEventListener('click', (e) => {
  e.stopPropagation();
  toPicker.classList.toggle('open');
  fromPicker.classList.remove('open');
  if (toPicker.classList.contains('open')) setTimeout(() => toSearch.focus(), 100);
});
document.addEventListener('click', (e) => {
  if (!fromPicker.contains(e.target)) fromPicker.classList.remove('open');
  if (!toPicker.contains(e.target)) toPicker.classList.remove('open');
});
fromList.addEventListener('click', (e) => e.stopPropagation());
toList.addEventListener('click', (e) => e.stopPropagation());
fromSearch.addEventListener('click', (e) => e.stopPropagation());
toSearch.addEventListener('click', (e) => e.stopPropagation());
fromSearch.addEventListener('input', () => buildZoneList(fromSearch.value, fromList));
toSearch.addEventListener('input', () => buildZoneList(toSearch.value, toList));

// Convert
function convertTime(date, time, fromZone, toZone) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const localDate = new Date(y, m - 1, d, hh, mm);
  const fromOff = getOffset(fromZone, localDate);
  const toOff = getOffset(toZone, localDate);
  const diff = toOff - fromOff;
  return new Date(localDate.getTime() + diff * 60000);
}

// Update
function updateConversion() {
  const date = dateInput.value;
  const time = timeInput.value;
  if (!date || !time) return;

  const converted = convertTime(date, time, fromZoneValue, toZoneValue);

  // Main output
  mainValue.textContent = formatDateTime(converted, toZoneValue);

  // Time diff
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const localDate = new Date(y, m - 1, d, hh, mm);
  const fromOff = getOffset(fromZoneValue, localDate);
  const toOff = getOffset(toZoneValue, localDate);
  const diffMin = toOff - fromOff;
  const diffH = Math.floor(Math.abs(diffMin) / 60);
  const diffM = Math.abs(diffMin) % 60;
  const sign = diffMin >= 0 ? '+' : '-';

  timeDiff.textContent = `${sign}${diffH}h ${diffM}m`;
  timeDiff.className = 'time-diff ' + (diffMin >= 0 ? 'positive' : 'negative');

  renderAllZones(date, time, fromZoneValue);
  buildDetails(date, time, fromZoneValue, toZoneValue, converted);
}

// Render all zones
function renderAllZones(date, time, fromZone) {
  const filtered = currentSearchTerm
    ? TIME_ZONES.filter(z => z.label.toLowerCase().includes(currentSearchTerm.toLowerCase()))
    : TIME_ZONES;

  zonesCount.textContent = `${filtered.length} time ${filtered.length === 1 ? 'zone' : 'zones'}`;

  if (filtered.length === 0) {
    allZonesList.innerHTML = '<p class="output-placeholder">No zones match your search.</p>';
    return;
  }

  let html = '';
  filtered.forEach(zone => {
    const converted = convertTime(date, time, fromZone, zone.value);
    const timeText = formatTime(converted, zone.value);
    const off = getOffset(zone.value, converted);
    const offH = Math.floor(Math.abs(off) / 60);
    const offM = Math.abs(off) % 60;
    const offStr = `UTC${off >= 0 ? '+' : '-'}${offH}${offM ? ':' + String(offM).padStart(2, '0') : ''}`;
    const abbr = getAbbr(zone.value, converted);
    const dst = isDST(zone.value, converted);
    const isFrom = zone.value === fromZone;

    html += `
      <div class="zone-row ${isFrom ? 'highlight' : ''}" data-zone="${zone.value}">
        <div class="zone-info">
          <span class="zone-name">${zone.label}</span>
          <span class="zone-meta">
            <span>${offStr}</span>
            <span>${abbr}</span>
            ${dst ? '<span class="dst-badge">DST</span>' : ''}
          </span>
        </div>
        <span class="zone-value">${timeText}</span>
      </div>
    `;
  });
  allZonesList.innerHTML = html;

  allZonesList.querySelectorAll('.zone-row').forEach(row => {
    row.addEventListener('click', () => {
      const zoneValue = row.dataset.zone;
      const converted = convertTime(date, time, fromZone, zoneValue);
      const text = formatDateTime(converted, zoneValue);
      navigator.clipboard.writeText(text).then(() => {
        const original = row.querySelector('.zone-value').textContent;
        row.querySelector('.zone-value').textContent = '✓ Copied';
        setTimeout(() => { row.querySelector('.zone-value').textContent = original; }, 800);
      });
    });
  });
}

// Search
zoneSearch.addEventListener('input', () => {
  currentSearchTerm = zoneSearch.value.trim();
  if (currentSearchTerm.length > 0) searchClearBtn.classList.add('show');
  else searchClearBtn.classList.remove('show');

  if (dateInput.value && timeInput.value) {
    renderAllZones(dateInput.value, timeInput.value, fromZoneValue);
  }
});

searchClearBtn.addEventListener('click', () => {
  zoneSearch.value = '';
  currentSearchTerm = '';
  searchClearBtn.classList.remove('show');
  zoneSearch.focus();
  if (dateInput.value && timeInput.value) {
    renderAllZones(dateInput.value, timeInput.value, fromZoneValue);
  }
});

// Date/time change
dateInput.addEventListener('change', updateConversion);
timeInput.addEventListener('change', updateConversion);

// Now button
nowBtn.addEventListener('click', () => {
  initDateTime();
  updateConversion();
});

// Format toggle
formatBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    formatBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFormat = btn.dataset.format;
    updateClocks();
    updateConversion();
  });
});

// Swap
swapBtn.addEventListener('click', () => {
  const temp = fromZoneValue;
  fromZoneValue = toZoneValue;
  toZoneValue = temp;
  updateDisplay(fromDisplay, fromZoneValue);
  updateDisplay(toDisplay, toZoneValue);
  updateConversion();
});

// Quick zones
quickZones.forEach(btn => {
  btn.addEventListener('click', () => {
    const zone = btn.dataset.zone;
    toZoneValue = zone;
    updateDisplay(toDisplay, toZoneValue);
    quickZones.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateConversion();
  });
});

// Copy buttons
mainCopyBtn.addEventListener('click', () => {
  const text = mainValue.textContent;
  if (!text || text === '—') return;
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

utcCopyBtn.addEventListener('click', () => {
  const text = utcTime.textContent + ' — ' + utcDate.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = utcCopyBtn.textContent;
    utcCopyBtn.textContent = '✓ Copied';
    utcCopyBtn.classList.add('copied');
    setTimeout(() => {
      utcCopyBtn.textContent = original;
      utcCopyBtn.classList.remove('copied');
    }, 1200);
  });
});

copyAllBtn.addEventListener('click', () => {
  if (!dateInput.value || !timeInput.value) return;
  const lines = TIME_ZONES.map(zone => {
    const converted = convertTime(dateInput.value, timeInput.value, fromZoneValue, zone.value);
    return `${zone.label}: ${formatDateTime(converted, zone.value)}`;
  });
  const text = `From ${fromZoneValue} — ${dateInput.value} ${timeInput.value}\n\n` + lines.join('\n');
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

// Details
function buildDetails(date, time, fromZone, toZone, converted) {
  if (!detailsContent) return;
  const fromData = TIME_ZONES.find(z => z.value === fromZone);
  const toData = TIME_ZONES.find(z => z.value === toZone);

  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const localDate = new Date(y, m - 1, d, hh, mm);

  const fromOff = getOffset(fromZone, localDate);
  const toOff = getOffset(toZone, converted);
  const diffMin = toOff - fromOff;
  const diffH = Math.floor(Math.abs(diffMin) / 60);
  const diffM = Math.abs(diffMin) % 60;
  const sign = diffMin >= 0 ? '+' : '-';

  const fromAbbr = getAbbr(fromZone, localDate);
  const toAbbr = getAbbr(toZone, converted);
  const fromDST = isDST(fromZone, localDate);
  const toDST = isDST(toZone, converted);

  const fromOffStr = `UTC${fromOff >= 0 ? '+' : '-'}${Math.floor(Math.abs(fromOff) / 60)}:${String(Math.abs(fromOff) % 60).padStart(2, '0')}`;
  const toOffStr = `UTC${toOff >= 0 ? '+' : '-'}${Math.floor(Math.abs(toOff) / 60)}:${String(Math.abs(toOff) % 60).padStart(2, '0')}`;

  let html = '';
  html += `<div class="detail-row"><span class="detail-char">From Zone</span><span class="detail-arrow">→</span><span class="detail-value">${fromData ? fromData.label : fromZone}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">To Zone</span><span class="detail-arrow">→</span><span class="detail-value">${toData ? toData.label : toZone}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Input Date</span><span class="detail-arrow">→</span><span class="detail-value">${date}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Input Time</span><span class="detail-arrow">→</span><span class="detail-value">${time}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">From Offset</span><span class="detail-arrow">→</span><span class="detail-value">${fromOffStr}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">To Offset</span><span class="detail-arrow">→</span><span class="detail-value">${toOffStr}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Difference</span><span class="detail-arrow">→</span><span class="detail-value">${sign}${diffH}h ${diffM}m</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">From Abbr</span><span class="detail-arrow">→</span><span class="detail-value">${fromAbbr}${fromDST ? ' (DST)' : ''}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">To Abbr</span><span class="detail-arrow">→</span><span class="detail-value">${toAbbr}${toDST ? ' (DST)' : ''}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Result</span><span class="detail-arrow">→</span><span class="detail-value">${formatDateTime(converted, toZone)}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Total Zones</span><span class="detail-arrow">→</span><span class="detail-value">${TIME_ZONES.length}</span></div>`;

  detailsContent.innerHTML = html;
}

// Details toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Auto-detect user zone
const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (TIME_ZONES.find(z => z.value === userZone)) {
  fromZoneValue = userZone;
  updateDisplay(fromDisplay, fromZoneValue);
}

updateConversion();