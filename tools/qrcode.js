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
const typeTabs = document.querySelectorAll('.type-tab');
const panels = document.querySelectorAll('.panel');
const qrPreview = document.getElementById('qrPreview');
const dataPreview = document.getElementById('dataPreview');

const sizeSelect = document.getElementById('sizeSelect');
const errorSelect = document.getElementById('errorSelect');
const marginSelect = document.getElementById('marginSelect');
const fgColor = document.getElementById('fgColor');
const bgColor = document.getElementById('bgColor');
const fgText = document.getElementById('fgText');
const bgText = document.getElementById('bgText');

const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const downloadJpgBtn = document.getElementById('downloadJpgBtn');
const downloadJpegBtn = document.getElementById('downloadJpegBtn');
const downloadWebpBtn = document.getElementById('downloadWebpBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const downloadDataBtn = document.getElementById('downloadDataBtn');

const getLocationBtn = document.getElementById('getLocationBtn');
const imageInput = document.getElementById('imageInput');
const imageInfo = document.getElementById('imageInfo');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let currentType = 'text';
let currentQR = null;
let currentData = '';
let currentImageData = '';

// Type tabs
typeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    typeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentType = tab.dataset.type;

    panels.forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById('panel-' + currentType);
    if (activePanel) activePanel.classList.add('active');

    const data = buildData();
    if (data) generateQR();
    else clearPreview();
  });
});

// Colors
fgColor.addEventListener('input', () => {
  fgText.textContent = fgColor.value.toUpperCase();
  if (currentData) generateQR();
});
bgColor.addEventListener('input', () => {
  bgText.textContent = bgColor.value.toUpperCase();
  if (currentData) generateQR();
});

// Image upload
if (imageInput) {
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      currentImageData = '';
      imageInfo.innerHTML = '';
      return;
    }

    if (file.size > 2048) {
      imageInfo.innerHTML = '⚠️ Image too large (' + (file.size / 1024).toFixed(1) + ' KB). Use a small icon (under 2 KB).';
      currentImageData = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      currentImageData = ev.target.result;
      imageInfo.innerHTML = '✓ Loaded (' + (file.size / 1024).toFixed(2) + ' KB)<br><img src="' + currentImageData + '" alt="preview">';
      if (currentType === 'image') generateQR();
    };
    reader.readAsDataURL(file);
  });
}

// Build data string
function buildData() {
  switch (currentType) {
    case 'text':
      return document.getElementById('textInput').value.trim();

    case 'url': {
      let v = document.getElementById('urlInput').value.trim();
      if (!v) return '';
      if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
      return v;
    }

    case 'email': {
      const to = document.getElementById('emailTo').value.trim();
      const sub = document.getElementById('emailSubject').value.trim();
      const body = document.getElementById('emailBody').value.trim();
      if (!to) return '';
      let s = 'mailto:' + to;
      const p = [];
      if (sub) p.push('subject=' + encodeURIComponent(sub));
      if (body) p.push('body=' + encodeURIComponent(body));
      if (p.length) s += '?' + p.join('&');
      return s;
    }

    case 'phone': {
      const v = document.getElementById('phoneInput').value.trim();
      if (!v) return '';
      return 'tel:' + v.replace(/\s/g, '');
    }

    case 'sms': {
      const phone = document.getElementById('smsPhone').value.trim();
      const msg = document.getElementById('smsMessage').value.trim();
      if (!phone) return '';
      let s = 'smsto:' + phone.replace(/\s/g, '');
      if (msg) s += ':' + msg;
      return s;
    }

    case 'wifi': {
      const ssid = document.getElementById('wifiSsid').value.trim();
      const pass = document.getElementById('wifiPassword').value.trim();
      const sec = document.getElementById('wifiSecurity').value;
      const hidden = document.getElementById('wifiHidden').value;
      if (!ssid) return '';
      const esc = (str) => str.replace(/([\\;,:"])/g, '\\$1');
      let s = `WIFI:T:${sec};S:${esc(ssid)};`;
      if (sec !== 'nopass' && pass) s += `P:${esc(pass)};`;
      if (hidden === 'true') s += 'H:true;';
      s += ';';
      return s;
    }

    case 'vcard': {
      const name = document.getElementById('vcardName').value.trim();
      const nick = document.getElementById('vcardNickname').value.trim();
      const phone = document.getElementById('vcardPhone').value.trim();
      const phone2 = document.getElementById('vcardPhone2').value.trim();
      const email = document.getElementById('vcardEmail').value.trim();
      const comp = document.getElementById('vcardCompany').value.trim();
      const title = document.getElementById('vcardTitle').value.trim();
      const web = document.getElementById('vcardWebsite').value.trim();
      const bday = document.getElementById('vcardBirthday').value;
      const addr = document.getElementById('vcardAddress').value.trim();
      const photo = document.getElementById('vcardPhotoUrl').value.trim();
      const notes = document.getElementById('vcardNotes').value.trim();
      if (!name) return '';
      let s = 'BEGIN:VCARD\nVERSION:3.0\n';
      s += `FN:${name}\n`;
      const parts = name.split(' ');
      if (parts.length > 1) s += `N:${parts.slice(1).join(' ')};${parts[0]};;;\n`;
      else s += `N:${name};;;;\n`;
      if (nick) s += `NICKNAME:${nick}\n`;
      if (phone) s += `TEL;TYPE=CELL:${phone}\n`;
      if (phone2) s += `TEL;TYPE=HOME:${phone2}\n`;
      if (email) s += `EMAIL:${email}\n`;
      if (comp) s += `ORG:${comp}\n`;
      if (title) s += `TITLE:${title}\n`;
      if (web) s += `URL:${web}\n`;
      if (bday) s += `BDAY:${bday.replace(/-/g, '')}\n`;
      if (addr) s += `ADR:;;${addr};;;;\n`;
      if (photo) s += `PHOTO;VALUE=URI:${photo}\n`;
      if (notes) s += `NOTE:${notes}\n`;
      s += 'END:VCARD';
      return s;
    }

    case 'location': {
      const lat = document.getElementById('locationLat').value.trim();
      const lng = document.getElementById('locationLng').value.trim();
      const alt = document.getElementById('locationAltitude').value.trim();
      const label = document.getElementById('locationLabel').value.trim();
      const query = document.getElementById('locationQuery').value.trim();
      if (query) {
        return 'geo:0,0?q=' + encodeURIComponent(query);
      }
      if (!lat || !lng) return '';
      let s = `geo:${lat},${lng}`;
      const p = [];
      if (alt) p.push('alt=' + alt);
      if (label) p.push('q=' + encodeURIComponent(label));
      if (p.length) s += '?' + p.join('&');
      return s;
    }

    case 'upi': {
      const upi = document.getElementById('upiId').value.trim();
      const name = document.getElementById('upiName').value.trim();
      const amt = document.getElementById('upiAmount').value.trim();
      const note = document.getElementById('upiNote').value.trim();
      const ref = document.getElementById('upiRef').value.trim();
      const curr = document.getElementById('upiCurrency').value;
      if (!upi) return '';
      const p = ['pa=' + encodeURIComponent(upi)];
      if (name) p.push('pn=' + encodeURIComponent(name));
      if (amt) p.push('am=' + encodeURIComponent(amt));
      p.push('cu=' + curr);
      if (note) p.push('tn=' + encodeURIComponent(note));
      if (ref) p.push('tr=' + encodeURIComponent(ref));
      return 'upi://pay?' + p.join('&');
    }

    case 'image':
      return currentImageData;

    case 'event': {
      const title = document.getElementById('eventTitle').value.trim();
      const loc = document.getElementById('eventLocation').value.trim();
      const desc = document.getElementById('eventDescription').value.trim();
      const start = document.getElementById('eventStart').value;
      const end = document.getElementById('eventEnd').value;
      const allDay = document.getElementById('eventAllDay').value;
      if (!title || !start) return '';
      const fmt = (dt) => {
        const d = new Date(dt);
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      let s = 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n';
      s += `SUMMARY:${title}\n`;
      if (loc) s += `LOCATION:${loc}\n`;
      if (desc) s += `DESCRIPTION:${desc}\n`;
      s += `DTSTART:${fmt(start)}\n`;
      if (end) s += `DTEND:${fmt(end)}\n`;
      if (allDay === 'true') s += 'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\n';
      s += 'END:VEVENT\nEND:VCALENDAR';
      return s;
    }

    case 'whatsapp': {
      const phone = document.getElementById('waPhone').value.trim().replace(/\D/g, '');
      const msg = document.getElementById('waMessage').value.trim();
      if (!phone) return '';
      let s = 'https://wa.me/' + phone;
      if (msg) s += '?text=' + encodeURIComponent(msg);
      return s;
    }

    case 'youtube': {
      const url = document.getElementById('ytUrl').value.trim();
      if (!url) return '';
      return url;
    }

    case 'spotify': {
      const url = document.getElementById('spotifyUrl').value.trim();
      if (!url) return '';
      return url;
    }

    case 'crypto': {
      const coin = document.getElementById('cryptoCoin').value;
      const addr = document.getElementById('cryptoAddress').value.trim();
      const amt = document.getElementById('cryptoAmount').value.trim();
      const label = document.getElementById('cryptoLabel').value.trim();
      if (!addr) return '';
      let s = coin + ':' + addr;
      const p = [];
      if (amt) p.push('amount=' + amt);
      if (label) p.push('label=' + encodeURIComponent(label));
      if (p.length) s += '?' + p.join('&');
      return s;
    }

    case 'pdf': {
      const title = document.getElementById('pdfTitle').value.trim();
      const url = document.getElementById('pdfUrl').value.trim();
      const desc = document.getElementById('pdfDescription').value.trim();
      if (!url) return '';
      return url;
    }
  }
  return '';
}

// Generate QR
function generateQR() {
  const data = buildData();

  if (!data) {
    clearPreview();
    return;
  }

  currentData = data;

  const size = parseInt(sizeSelect.value);
  const errorLevel = errorSelect.value;
  const fg = fgColor.value;
  const bg = bgColor.value;

  qrPreview.classList.remove('empty');
  qrPreview.innerHTML = '';

  const margin = parseInt(marginSelect.value);
  const marginPx = (margin / 100) * size;

  const container = document.createElement('div');
  container.style.padding = marginPx + 'px';
  container.style.background = bg;
  container.style.borderRadius = '8px';

  qrPreview.appendChild(container);

  try {
    currentQR = new QRCode(container, {
      text: data,
      width: size,
      height: size,
      colorDark: fg,
      colorLight: bg,
      correctLevel: QRCode.CorrectLevel[errorLevel]
    });
  } catch (e) {
    qrPreview.innerHTML = `
      <div class="qr-placeholder">
        <span class="placeholder-icon">⚠️</span>
        <p>Data too long for this error level</p>
      </div>
    `;
    return;
  }

  dataPreview.textContent = data;
  buildDetails(data);
}

// Clear preview
function clearPreview() {
  qrPreview.classList.add('empty');
  qrPreview.innerHTML = `
    <div class="qr-placeholder">
      <span class="placeholder-icon">📱</span>
      <p>Fill in the fields to generate QR</p>
    </div>
  `;
  dataPreview.innerHTML = '<p class="output-placeholder">Encoded data will appear here...</p>';
  currentData = '';
  currentQR = null;
}

// Details
function buildDetails(data) {
  if (!detailsContent) return;

  const size = sizeSelect.value;
  const errorLevel = errorSelect.value;
  const fg = fgColor.value.toUpperCase();
  const bg = bgColor.value.toUpperCase();
  const charCount = data.length;
  const typeLabel = currentType.charAt(0).toUpperCase() + currentType.slice(1);
  const margin = marginSelect.value;

  let html = '';
  html += `<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">${typeLabel}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Data length</span><span class="detail-arrow">→</span><span class="detail-value">${charCount} chars</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Size</span><span class="detail-arrow">→</span><span class="detail-value">${size} × ${size} px</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Error level</span><span class="detail-arrow">→</span><span class="detail-value">${errorLevel}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Margin</span><span class="detail-arrow">→</span><span class="detail-value">${margin} units</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Foreground</span><span class="detail-arrow">→</span><span class="detail-value">${fg}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Background</span><span class="detail-arrow">→</span><span class="detail-value">${bg}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Encoded</span><span class="detail-arrow">→</span><span class="detail-value">${escapeHTML(data.substring(0, 80))}${charCount > 80 ? '...' : ''}</span></div>`;

  detailsContent.innerHTML = html;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Generate button
generateBtn.addEventListener('click', generateQR);

// Debounced auto-generate
let debounceTimer = null;
document.querySelectorAll('.input-field').forEach(field => {
  field.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const data = buildData();
      if (data) generateQR();
    }, 400);
  });
});

sizeSelect.addEventListener('change', () => { if (currentData) generateQR(); });
errorSelect.addEventListener('change', () => { if (currentData) generateQR(); });
marginSelect.addEventListener('change', () => { if (currentData) generateQR(); });

// Clear
clearBtn.addEventListener('click', () => {
  document.querySelectorAll('.input-field').forEach(f => f.value = '');
  document.querySelectorAll('input[type="color"]').forEach(c => c.value = '#051520');
  currentImageData = '';
  if (imageInfo) imageInfo.innerHTML = '';
  clearPreview();
  detailsContent.innerHTML = '<p class="no-details">Generate a QR code first to see details.</p>';
});

// Get location
if (getLocationBtn) {
  getLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    getLocationBtn.textContent = '📍 Getting location...';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        document.getElementById('locationLat').value = position.coords.latitude.toFixed(6);
        document.getElementById('locationLng').value = position.coords.longitude.toFixed(6);
        if (position.coords.altitude) {
          document.getElementById('locationAltitude').value = position.coords.altitude.toFixed(1);
        }
        getLocationBtn.textContent = '📍 Use My Location';
        generateQR();
      },
      (error) => {
        getLocationBtn.textContent = '📍 Use My Location';
        alert('Could not get location: ' + error.message);
      }
    );
  });
}

// Download PNG
downloadPngBtn.addEventListener('click', () => {
  if (!currentData) {
    alert('Generate a QR code first.');
    return;
  }

  const canvas = qrPreview.querySelector('canvas');
  if (!canvas) {
    alert('Cannot download this QR.');
    return;
  }

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'qrcode-' + currentType + '.png';
  link.click();
});

// Download JPG
downloadJpgBtn.addEventListener('click', () => {
  if (!currentData) {
    alert('Generate a QR code first.');
    return;
  }

  const canvas = qrPreview.querySelector('canvas');
  if (!canvas) {
    alert('Cannot download this QR.');
    return;
  }

  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = canvas.height;
  const ctx = temp.getContext('2d');
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, temp.width, temp.height);
  ctx.drawImage(canvas, 0, 0);

  const link = document.createElement('a');
  link.href = temp.toDataURL('image/jpeg', 0.95);
  link.download = 'qrcode-' + currentType + '.jpg';
  link.click();
});

// Download JPEG (same as JPG)
downloadJpegBtn.addEventListener('click', () => {
  if (!currentData) {
    alert('Generate a QR code first.');
    return;
  }

  const canvas = qrPreview.querySelector('canvas');
  if (!canvas) {
    alert('Cannot download this QR.');
    return;
  }

  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = canvas.height;
  const ctx = temp.getContext('2d');
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, temp.width, temp.height);
  ctx.drawImage(canvas, 0, 0);

  const link = document.createElement('a');
  link.href = temp.toDataURL('image/jpeg', 1.0);
  link.download = 'qrcode-' + currentType + '.jpeg';
  link.click();
});

// Download WebP
downloadWebpBtn.addEventListener('click', () => {
  if (!currentData) {
    alert('Generate a QR code first.');
    return;
  }

  const canvas = qrPreview.querySelector('canvas');
  if (!canvas) {
    alert('Cannot download this QR.');
    return;
  }

  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = canvas.height;
  const ctx = temp.getContext('2d');
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, temp.width, temp.height);
  ctx.drawImage(canvas, 0, 0);

  const link = document.createElement('a');
  link.href = temp.toDataURL('image/webp', 0.95);
  link.download = 'qrcode-' + currentType + '.webp';
  link.click();
});

// Download SVG
downloadSvgBtn.addEventListener('click', () => {
  if (!currentData) {
    alert('Generate a QR code first.');
    return;
  }

  const canvas = qrPreview.querySelector('canvas');
  if (!canvas) {
    alert('Cannot export SVG from this QR.');
    return;
  }

  const size = canvas.width;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, size, size);
  const pixels = imgData.data;

  const fg = fgColor.value;
  const bg = bgColor.value;

  let svg = '<?xml version="1.0" encoding="UTF-8"?>\n';
  svg += '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges">\n';
  svg += '<rect width="' + size + '" height="' + size + '" fill="' + bg + '"/>\n';

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const isDark = (r + g + b) < 384;

      if (isDark) {
        svg += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + fg + '"/>\n';
      }
    }
  }

  svg += '</svg>';

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qrcode-' + currentType + '.svg';
  link.click();
  URL.revokeObjectURL(url);
});

// Download .txt (encoded data)
downloadDataBtn.addEventListener('click', () => {
  if (!currentData) {
    alert('Generate a QR code first.');
    return;
  }

  const blob = new Blob([currentData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qrcode-data-' + currentType + '.txt';
  link.click();
  URL.revokeObjectURL(url);
});

// Details toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Initialize
qrPreview.classList.add('empty');