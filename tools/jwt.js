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
const jwtInput = document.getElementById('jwtInput');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const sampleBtn = document.getElementById('sampleBtn');
const decodeBtn = document.getElementById('decodeBtn');

const statusBar = document.getElementById('statusBar');
const tokenInfo = document.getElementById('tokenInfo');
const infoAlg = document.getElementById('infoAlg');
const infoType = document.getElementById('infoType');
const infoExp = document.getElementById('infoExp');
const infoStatus = document.getElementById('infoStatus');

const headerOutput = document.getElementById('headerOutput');
const payloadOutput = document.getElementById('payloadOutput');
const signatureOutput = document.getElementById('signatureOutput');

const claimsTable = document.getElementById('claimsTable');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadBtn = document.getElementById('downloadBtn');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let decodedData = null;

// Base64 URL decode
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  try {
    return decodeURIComponent(
      Array.from(binary).map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
  } catch (e) {
    return binary;
  }
}

// Decode JWT
function decodeJWT(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('JWT must have 3 parts (header.payload.signature)');
  }

  const [headerB64, payloadB64, signature] = parts;

  const headerJson = base64UrlDecode(headerB64);
  const payloadJson = base64UrlDecode(payloadB64);

  let header, payload;
  try {
    header = JSON.parse(headerJson);
  } catch (e) {
    throw new Error('Invalid JWT header');
  }

  try {
    payload = JSON.parse(payloadJson);
  } catch (e) {
    throw new Error('Invalid JWT payload');
  }

  return { header, payload, signature, headerB64, payloadB64 };
}

// Format JSON with syntax highlighting
function formatJSON(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-bool';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
}

// Format unix timestamp
function formatUnix(ts) {
  if (!ts && ts !== 0) return '—';
  const d = new Date(ts * 1000);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

// Format relative time
function relativeTime(ts) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - ts;
  const abs = Math.abs(diff);

  if (abs < 60) return (diff >= 0 ? '' : 'in ') + abs + 's' + (diff < 0 ? '' : ' ago');
  if (abs < 3600) return (diff >= 0 ? '' : 'in ') + Math.floor(abs / 60) + 'm' + (diff < 0 ? '' : ' ago');
  if (abs < 86400) return (diff >= 0 ? '' : 'in ') + Math.floor(abs / 3600) + 'h' + (diff < 0 ? '' : ' ago');
  if (abs < 2592000) return (diff >= 0 ? '' : 'in ') + Math.floor(abs / 86400) + 'd' + (diff < 0 ? '' : ' ago');
  return (diff >= 0 ? '' : 'in ') + Math.floor(abs / 2592000) + 'mo' + (diff < 0 ? '' : ' ago');
}

// Escape HTML
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Render
function renderDecoded(data) {
  decodedData = data;

  // Header
  headerOutput.innerHTML = formatJSON(data.header);

  // Payload
  payloadOutput.innerHTML = formatJSON(data.payload);

  // Signature
  signatureOutput.innerHTML = '<div style="word-break: break-all;">' + escapeHTML(data.signature) + '</div>';

  // Info
  infoAlg.textContent = data.header.alg || '—';
  infoType.textContent = data.header.typ || 'JWT';

  const now = Math.floor(Date.now() / 1000);
  const exp = data.payload.exp;

  if (exp) {
    infoExp.textContent = relativeTime(exp);
    if (exp < now) {
      infoStatus.textContent = '❌ Expired';
      infoStatus.className = 'info-value expired';
    } else {
      infoStatus.textContent = '✅ Valid';
      infoStatus.className = 'info-value valid';
    }
  } else {
    infoExp.textContent = 'No expiry';
    infoStatus.textContent = '✅ No exp';
    infoStatus.className = 'info-value valid';
  }

  tokenInfo.style.display = 'grid';

  // Claims table
  renderClaims(data.payload);

  // Details
  buildDetails(data);
}

// Render claims
function renderClaims(payload) {
  const claims = [
    { key: 'iss', desc: 'Issuer — who created the token' },
    { key: 'sub', desc: 'Subject — who the token is about' },
    { key: 'aud', desc: 'Audience — who can use it' },
    { key: 'exp', desc: 'Expiration time' },
    { key: 'nbf', desc: 'Not Before — valid only after' },
    { key: 'iat', desc: 'Issued At — when created' },
    { key: 'jti', desc: 'JWT ID — unique identifier' }
  ];

  let html = '';
  let found = false;

  claims.forEach(c => {
    if (payload[c.key] !== undefined) {
      found = true;
      let value = payload[c.key];

      if (c.key === 'exp' || c.key === 'iat' || c.key === 'nbf') {
        value = formatUnix(value) + ' (' + relativeTime(value) + ')';
      } else {
        value = String(value);
      }

      html += `
        <div class="claim-row">
          <span class="claim-key">${c.key}</span>
          <span class="claim-value">${escapeHTML(value)}<span class="claim-desc">${c.desc}</span></span>
        </div>
      `;
    }
  });

  // Other custom claims
  Object.keys(payload).forEach(key => {
    if (!claims.find(c => c.key === key)) {
      found = true;
      html += `
        <div class="claim-row">
          <span class="claim-key">${escapeHTML(key)}</span>
          <span class="claim-value">${escapeHTML(String(payload[key]))}<span class="claim-desc">Custom claim</span></span>
        </div>
      `;
    }
  });

  if (!found) {
    claimsTable.innerHTML = '<p class="output-placeholder">No claims found.</p>';
    return;
  }

  claimsTable.innerHTML = html;
}

// Build details
function buildDetails(data) {
  if (!detailsContent) return;

  const headerSize = new Blob([JSON.stringify(data.header)]).size;
  const payloadSize = new Blob([JSON.stringify(data.payload)]).size;
  const sigSize = data.signature.length;
  const totalSize = headerSize + payloadSize + sigSize;

  const exp = data.payload.exp;
  const iat = data.payload.iat;
  const now = Math.floor(Date.now() / 1000);
  let validFor = '—';

  if (exp) {
    const diff = exp - now;
    if (diff > 0) {
      validFor = relativeTime(exp).replace('in ', '') + ' remaining';
    } else {
      validFor = 'Expired ' + relativeTime(exp).replace(' ago', '') + ' ago';
    }
  }

  let html = '';
  html += '<div class="detail-row"><span class="detail-char">Algorithm</span><span class="detail-arrow">→</span><span class="detail-value">' + (data.header.alg || '—') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">' + (data.header.typ || 'JWT') + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Header size</span><span class="detail-arrow">→</span><span class="detail-value">' + headerSize + ' bytes</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Payload size</span><span class="detail-arrow">→</span><span class="detail-value">' + payloadSize + ' bytes</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Signature length</span><span class="detail-arrow">→</span><span class="detail-value">' + sigSize + ' chars</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Total size</span><span class="detail-arrow">→</span><span class="detail-value">' + totalSize + ' bytes</span></div>';

  if (iat) {
    html += '<div class="detail-row"><span class="detail-char">Issued at</span><span class="detail-arrow">→</span><span class="detail-value">' + formatUnix(iat) + '</span></div>';
  }
  if (exp) {
    html += '<div class="detail-row"><span class="detail-char">Expires at</span><span class="detail-arrow">→</span><span class="detail-value">' + formatUnix(exp) + '</span></div>';
    html += '<div class="detail-row"><span class="detail-char">Valid for</span><span class="detail-arrow">→</span><span class="detail-value">' + validFor + '</span></div>';
  }
  if (data.payload.nbf) {
    html += '<div class="detail-row"><span class="detail-char">Not before</span><span class="detail-arrow">→</span><span class="detail-value">' + formatUnix(data.payload.nbf) + '</span></div>';
  }

  html += '<div class="detail-row"><span class="detail-char">Claims count</span><span class="detail-arrow">→</span><span class="detail-value">' + Object.keys(data.payload).length + '</span></div>';

  detailsContent.innerHTML = html;
}

// Status
function setStatus(type, icon, text) {
  statusBar.className = 'status-bar';
  if (type === 'success') statusBar.classList.add('success');
  else if (type === 'error') statusBar.classList.add('error');

  statusBar.querySelector('.status-icon').textContent = icon;
  statusBar.querySelector('.status-text').textContent = text;
}

// Process
function process() {
  const raw = jwtInput.value.trim();

  if (!raw) {
    setStatus('info', '🎫', 'Paste a JWT to decode it');
    tokenInfo.style.display = 'none';
    headerOutput.innerHTML = '<p class="output-placeholder">—</p>';
    payloadOutput.innerHTML = '<p class="output-placeholder">—</p>';
    signatureOutput.innerHTML = '<p class="output-placeholder">—</p>';
    claimsTable.innerHTML = '<p class="output-placeholder">Decode a token to see claims.</p>';
    detailsContent.innerHTML = '<p class="no-details">Decode a token to see details.</p>';
    decodedData = null;
    return;
  }

  try {
    const data = decodeJWT(raw);
    renderDecoded(data);

    const now = Math.floor(Date.now() / 1000);
    const exp = data.payload.exp;

    if (exp && exp < now) {
      setStatus('error', '❌', 'Token decoded — but it is EXPIRED');
    } else if (exp) {
      setStatus('success', '✅', 'Token decoded successfully — valid');
    } else {
      setStatus('success', '✅', 'Token decoded successfully');
    }
  } catch (err) {
    setStatus('error', '❌', 'Error: ' + err.message);
    tokenInfo.style.display = 'none';
    headerOutput.innerHTML = '<p class="output-placeholder">—</p>';
    payloadOutput.innerHTML = '<p class="output-placeholder">—</p>';
    signatureOutput.innerHTML = '<p class="output-placeholder">—</p>';
    claimsTable.innerHTML = '<p class="output-placeholder">Invalid token.</p>';
    detailsContent.innerHTML = '<p class="no-details">Invalid token.</p>';
    decodedData = null;
  }
}

// Input event (debounced)
let decodeTimer = null;
jwtInput.addEventListener('input', () => {
  const raw = jwtInput.value;

  if (raw.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }

  clearTimeout(decodeTimer);
  decodeTimer = setTimeout(process, 300);
});

// Clear
clearBtn.addEventListener('click', () => {
  jwtInput.value = '';
  clearBtn.classList.remove('show');
  process();
  jwtInput.focus();
});

// Paste
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      jwtInput.value = text.trim();
      clearBtn.classList.add('show');
      process();
    }
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

// Sample
sampleBtn.addEventListener('click', () => {
  // A sample JWT (HS256)
  jwtInput.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjo0MTAyNDQ0ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  clearBtn.classList.add('show');
  process();
});

// Decode button
decodeBtn.addEventListener('click', process);

// Copy buttons (each section)
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const targetId = btn.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;

    const text = target.textContent.trim();
    if (!text || text === '—') return;

    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = '✓ Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1000);
    });
  });
});

// Copy all JSON
copyAllBtn.addEventListener('click', () => {
  if (!decodedData) {
    alert('Decode a token first.');
    return;
  }

  const full = {
    header: decodedData.header,
    payload: decodedData.payload,
    signature: decodedData.signature
  };

  navigator.clipboard.writeText(JSON.stringify(full, null, 2)).then(() => {
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
  if (!decodedData) {
    alert('Decode a token first.');
    return;
  }

  const full = {
    header: decodedData.header,
    payload: decodedData.payload,
    signature: decodedData.signature
  };

  const blob = new Blob([JSON.stringify(full, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jwt-decoded.json';
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
process();