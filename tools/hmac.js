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
const messageInput = document.getElementById('messageInput');
const keyInput = document.getElementById('keyInput');
const clearMsgBtn = document.getElementById('clearMsgBtn');
const clearKeyBtn = document.getElementById('clearKeyBtn');
const toggleKeyBtn = document.getElementById('toggleKeyBtn');
const pasteMsgBtn = document.getElementById('pasteMsgBtn');
const randomKeyBtn = document.getElementById('randomKeyBtn');
const sampleBtn = document.getElementById('sampleBtn');

const algoSelect = document.getElementById('algoSelect');
const formatSelect = document.getElementById('formatSelect');

const outputBox = document.getElementById('outputBox');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

const verifyInput = document.getElementById('verifyInput');
const verifyStatus = document.getElementById('verifyStatus');
const verifyIcon = document.getElementById('verifyIcon');
const verifyText = document.getElementById('verifyText');

const statMsg = document.getElementById('statMsg');
const statKey = document.getElementById('statKey');
const statHmac = document.getElementById('statHmac');
const statAlgo = document.getElementById('statAlgo');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let currentHMAC = '';

// Convert ArrayBuffer to Hex
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert ArrayBuffer to Base64
function bufToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Base64 URL safe
function base64UrlSafe(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Random key generator
function generateRandomKey(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(33 + (bytes[i] % 94));
  }
  return result;
}

// Map algorithm name to Web Crypto name
function getAlgoName(algo) {
  return algo;
}

// Generate HMAC
async function generateHMAC(message, key, algo) {
  const encoder = new TextEncoder();

  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algo } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return signature;
}

// Format output
function formatOutput(buf, format) {
  if (format === 'hex') {
    return bufToHex(buf);
  } else if (format === 'hex-upper') {
    return bufToHex(buf).toUpperCase();
  } else if (format === 'base64') {
    return bufToBase64(buf);
  } else if (format === 'base64url') {
    return base64UrlSafe(bufToBase64(buf));
  }
  return bufToHex(buf);
}

// Process
async function process() {
  const message = messageInput.value;
  const key = keyInput.value;
  const algo = algoSelect.value;
  const format = formatSelect.value;

  // Show/hide clear buttons
  if (message.length > 0) clearMsgBtn.classList.add('show');
  else clearMsgBtn.classList.remove('show');

  if (key.length > 0) clearKeyBtn.classList.add('show');
  else clearKeyBtn.classList.remove('show');

  // Stats
  statMsg.textContent = new Blob([message]).size;
  statKey.textContent = new Blob([key]).size;
  statAlgo.textContent = algo.replace('SHA-', '');

  if (!message || !key) {
    outputBox.innerHTML = '<p class="output-placeholder">HMAC will appear here...</p>';
    statHmac.textContent = '0';
    currentHMAC = '';
    verifyStatus.style.display = 'none';
    detailsContent.innerHTML = '<p class="no-details">Enter a message and key to see details.</p>';
    return;
  }

  try {
    const signature = await generateHMAC(message, key, algo);
    const output = formatOutput(signature, format);

    currentHMAC = output;
    outputBox.textContent = output;
    statHmac.textContent = output.length;

    // Verify
    checkVerify();

    // Details
    buildDetails(message, key, algo, output);
  } catch (e) {
    outputBox.innerHTML = '<p class="output-placeholder">⚠️ Error: ' + e.message + '</p>';
    currentHMAC = '';
    statHmac.textContent = '0';
    verifyStatus.style.display = 'none';
    detailsContent.innerHTML = '<p class="no-details">Error generating HMAC.</p>';
  }
}

// Verify
function checkVerify() {
  const expected = verifyInput.value.trim();

  if (!expected || !currentHMAC) {
    verifyStatus.style.display = 'none';
    return;
  }

  verifyStatus.style.display = 'flex';

  const cleanExpected = expected.toLowerCase().replace(/\s/g, '');
  const cleanActual = currentHMAC.toLowerCase().replace(/\s/g, '');

  if (cleanExpected === cleanActual) {
    verifyStatus.className = 'verify-status success';
    verifyIcon.textContent = '✅';
    verifyText.textContent = 'HMAC matches — signature is valid';
  } else {
    verifyStatus.className = 'verify-status error';
    verifyIcon.textContent = '❌';
    verifyText.textContent = 'HMAC does not match';
  }
}

// Build details
function buildDetails(message, key, algo, output) {
  if (!detailsContent) return;

  const msgSize = new Blob([message]).size;
  const keySize = new Blob([key]).size;
  const outputSize = new Blob([output]).size;
  const format = formatSelect.value;

  let html = '';
  html += '<div class="detail-row"><span class="detail-char">Algorithm</span><span class="detail-arrow">→</span><span class="detail-value">' + algo + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Output format</span><span class="detail-arrow">→</span><span class="detail-value">' + format + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Message size</span><span class="detail-arrow">→</span><span class="detail-value">' + msgSize + ' bytes</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Key size</span><span class="detail-arrow">→</span><span class="detail-value">' + keySize + ' bytes</span></div>';
  html += '<div class="detail-row"><span class="detail-char">HMAC length</span><span class="detail-arrow">→</span><span class="detail-value">' + output.length + ' chars</span></div>';
  html += '<div class="detail-row"><span class="detail-char">HMAC bytes</span><span class="detail-arrow">→</span><span class="detail-value">' + outputSize + ' bytes</span></div>';

  const bitLengths = { 'SHA-1': 160, 'SHA-256': 256, 'SHA-384': 384, 'SHA-512': 512 };
  html += '<div class="detail-row"><span class="detail-char">Output bits</span><span class="detail-arrow">→</span><span class="detail-value">' + bitLengths[algo] + ' bits</span></div>';

  detailsContent.innerHTML = html;
}

// Input events
messageInput.addEventListener('input', process);
keyInput.addEventListener('input', process);
algoSelect.addEventListener('change', process);
formatSelect.addEventListener('change', process);
verifyInput.addEventListener('input', checkVerify);

// Clear message
clearMsgBtn.addEventListener('click', () => {
  messageInput.value = '';
  process();
  messageInput.focus();
});

// Clear key
clearKeyBtn.addEventListener('click', () => {
  keyInput.value = '';
  process();
  keyInput.focus();
});

// Toggle key visibility
toggleKeyBtn.addEventListener('click', () => {
  if (keyInput.type === 'password') {
    keyInput.type = 'text';
    toggleKeyBtn.textContent = '🙈';
  } else {
    keyInput.type = 'password';
    toggleKeyBtn.textContent = '👁️';
  }
});

// Paste message
pasteMsgBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      messageInput.value = text;
      process();
    }
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

// Random key
randomKeyBtn.addEventListener('click', () => {
  keyInput.value = generateRandomKey(32);
  if (keyInput.type === 'password') {
    keyInput.type = 'text';
    toggleKeyBtn.textContent = '🙈';
  }
  process();
});

// Sample
sampleBtn.addEventListener('click', () => {
  messageInput.value = 'Hello World';
  keyInput.value = 'my-secret-key';
  if (keyInput.type === 'password') {
    keyInput.type = 'text';
    toggleKeyBtn.textContent = '🙈';
  }
  process();
});

// Copy
copyBtn.addEventListener('click', () => {
  if (!currentHMAC) return;

  navigator.clipboard.writeText(currentHMAC).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1200);
  });
});

// Download
downloadBtn.addEventListener('click', () => {
  if (!currentHMAC) {
    alert('Generate an HMAC first.');
    return;
  }

  const content = 'Message: ' + messageInput.value + '\n' +
    'Algorithm: ' + algoSelect.value + '\n' +
    'Format: ' + formatSelect.value + '\n' +
    'HMAC: ' + currentHMAC + '\n';

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hmac.txt';
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