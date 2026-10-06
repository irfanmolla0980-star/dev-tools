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
const ipInput = document.getElementById('ipInput');
const cidrSelect = document.getElementById('cidrSelect');
const clearIpBtn = document.getElementById('clearIpBtn');
const pasteBtn = document.getElementById('pasteBtn');
const sampleBtn = document.getElementById('sampleBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const cidrChips = document.querySelectorAll('.cidr-chip');
const statusBar = document.getElementById('statusBar');
const resultsGrid = document.getElementById('resultsGrid');
const binaryIp = document.getElementById('binaryIp');
const binaryMask = document.getElementById('binaryMask');
const binaryNetwork = document.getElementById('binaryNetwork');
const binaryBroadcast = document.getElementById('binaryBroadcast');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadBtn = document.getElementById('downloadBtn');
const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let currentResults = null;

// IP helper functions
function ipToInt(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return null;
  for (const p of parts) {
    if (isNaN(p) || p < 0 || p > 255) return null;
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function intToIp(num) {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join('.');
}

function intToBinary(num) {
  const parts = [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ];
  return parts.map(p => p.toString(2).padStart(8, '0')).join('.');
}

// CIDR to netmask
function cidrToMask(cidr) {
  if (cidr === 0) return 0;
  return (0xFFFFFFFF << (32 - cidr)) >>> 0;
}

// Class detection
function getIpClass(firstOctet) {
  if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
  if (firstOctet === 127) return 'Loopback';
  if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Reserved)';
  return 'Unknown';
}

// Private / Public
function getIpType(ip) {
  const parts = ip.split('.').map(Number);
  const first = parts[0];
  const second = parts[1];

  if (first === 10) return 'Private';
  if (first === 172 && second >= 16 && second <= 31) return 'Private';
  if (first === 192 && second === 168) return 'Private';
  if (first === 127) return 'Loopback';
  if (first === 169 && second === 254) return 'Link-Local';
  if (first === 224 || (first >= 224 && first <= 239)) return 'Multicast';
  return 'Public';
}

// Calculate subnet
function calculateSubnet(ipStr, cidr) {
  const ipInt = ipToInt(ipStr);
  if (ipInt === null) return null;

  const maskInt = cidrToMask(cidr);
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidr);

  let usableHosts = totalHosts - 2;
  if (cidr === 31) usableHosts = 2;
  if (cidr === 32) usableHosts = 1;
  if (usableHosts < 0) usableHosts = 0;

  let firstHost = '—';
  let lastHost = '—';

  if (cidr <= 30) {
    firstHost = intToIp(networkInt + 1);
    lastHost = intToIp(broadcastInt - 1);
  } else if (cidr === 31) {
    firstHost = intToIp(networkInt);
    lastHost = intToIp(broadcastInt);
  } else if (cidr === 32) {
    firstHost = ipStr;
    lastHost = ipStr;
  }

  const parts = ipStr.split('.').map(Number);
  const ipClass = getIpClass(parts[0]);
  const ipType = getIpType(ipStr);

  return {
    ip: ipStr,
    cidr: cidr,
    netmask: intToIp(maskInt),
    wildcard: intToIp(wildcardInt),
    network: intToIp(networkInt),
    broadcast: intToIp(broadcastInt),
    firstHost: firstHost,
    lastHost: lastHost,
    totalHosts: totalHosts,
    usableHosts: usableHosts,
    ipClass: ipClass,
    ipType: ipType,
    networkBits: cidr,
    hostBits: 32 - cidr,
    binaryIp: intToBinary(ipInt),
    binaryMask: intToBinary(maskInt),
    binaryNetwork: intToBinary(networkInt),
    binaryBroadcast: intToBinary(broadcastInt)
  };
}

// Render results
function renderResults(r) {
  if (!r) {
    resultsGrid.innerHTML = '<p class="output-placeholder">Enter an IP address to calculate subnet</p>';
    return;
  }

  const cards = [
    { label: 'CIDR Notation', value: '/' + r.cidr },
    { label: 'Netmask', value: r.netmask },
    { label: 'Wildcard Mask', value: r.wildcard },
    { label: 'Network Address', value: r.network },
    { label: 'Broadcast Address', value: r.broadcast },
    { label: 'First Usable Host', value: r.firstHost },
    { label: 'Last Usable Host', value: r.lastHost },
    { label: 'Total Hosts', value: r.totalHosts.toLocaleString() },
    { label: 'Usable Hosts', value: r.usableHosts.toLocaleString() },
    { label: 'IP Class', value: r.ipClass },
    { label: 'Address Type', value: r.ipType },
    { label: 'Network Bits', value: r.networkBits + ' bits' },
    { label: 'Host Bits', value: r.hostBits + ' bits' },
    { label: 'Binary IP', value: r.binaryIp }
  ];

  let html = '';
  cards.forEach(c => {
    html += `
      <div class="result-card" data-copy="${c.value}">
        <span class="result-label">${c.label}</span>
        <span class="result-value">${c.value}</span>
      </div>
    `;
  });

  resultsGrid.innerHTML = html;

  // Click to copy
  resultsGrid.querySelectorAll('.result-card').forEach(card => {
    card.addEventListener('click', () => {
      const value = card.dataset.copy;
      if (!value || value === '—') return;

      navigator.clipboard.writeText(value).then(() => {
        card.classList.add('copied');
        const orig = card.querySelector('.result-value').textContent;
        card.querySelector('.result-value').textContent = '✓ Copied';
        setTimeout(() => {
          card.classList.remove('copied');
          card.querySelector('.result-value').textContent = orig;
        }, 800);
      });
    });
  });

  // Binary
  binaryIp.textContent = r.binaryIp;
  binaryMask.textContent = r.binaryMask;
  binaryNetwork.textContent = r.binaryNetwork;
  binaryBroadcast.textContent = r.binaryBroadcast;
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
  const ipStr = ipInput.value.trim();
  const cidr = parseInt(cidrSelect.value);

  if (!ipStr) {
    setStatus('info', '🌍', 'Enter an IP address to calculate subnet');
    resultsGrid.innerHTML = '<p class="output-placeholder">Enter an IP address to calculate subnet</p>';
    binaryIp.textContent = '—';
    binaryMask.textContent = '—';
    binaryNetwork.textContent = '—';
    binaryBroadcast.textContent = '—';
    currentResults = null;
    detailsContent.innerHTML = '<p class="no-details">Enter an IP address to see details.</p>';
    return;
  }

  const result = calculateSubnet(ipStr, cidr);

  if (!result) {
    setStatus('error', '❌', 'Invalid IP address — use format like 192.168.1.1');
    resultsGrid.innerHTML = '<p class="output-placeholder">Invalid IP address</p>';
    binaryIp.textContent = '—';
    binaryMask.textContent = '—';
    binaryNetwork.textContent = '—';
    binaryBroadcast.textContent = '—';
    currentResults = null;
    detailsContent.innerHTML = '<p class="no-details">Invalid IP address.</p>';
    return;
  }

  currentResults = result;
  renderResults(result);
  setStatus('success', '✅', 'Subnet calculated successfully');
  buildDetails(result);
}

// Build details
function buildDetails(r) {
  if (!detailsContent) return;

  let html = '';
  html += '<div class="detail-row"><span class="detail-char">IP Address</span><span class="detail-arrow">→</span><span class="detail-value">' + r.ip + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">CIDR</span><span class="detail-arrow">→</span><span class="detail-value">/' + r.cidr + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Network Bits</span><span class="detail-arrow">→</span><span class="detail-value">' + r.networkBits + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Host Bits</span><span class="detail-arrow">→</span><span class="detail-value">' + r.hostBits + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Total IPs</span><span class="detail-arrow">→</span><span class="detail-value">' + r.totalHosts.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Usable Hosts</span><span class="detail-arrow">→</span><span class="detail-value">' + r.usableHosts.toLocaleString() + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Class</span><span class="detail-arrow">→</span><span class="detail-value">' + r.ipClass + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">' + r.ipType + '</span></div>';

  const parts = r.ip.split('.').map(Number);
  html += '<div class="detail-row"><span class="detail-char">Octet 1</span><span class="detail-arrow">→</span><span class="detail-value">' + parts[0] + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Octet 2</span><span class="detail-arrow">→</span><span class="detail-value">' + parts[1] + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Octet 3</span><span class="detail-arrow">→</span><span class="detail-value">' + parts[2] + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Octet 4</span><span class="detail-arrow">→</span><span class="detail-value">' + parts[3] + '</span></div>';

  detailsContent.innerHTML = html;
}

// Input events
ipInput.addEventListener('input', () => {
  const val = ipInput.value;
  if (val.length > 0) clearIpBtn.classList.add('show');
  else clearIpBtn.classList.remove('show');
  process();
});

cidrSelect.addEventListener('change', () => {
  // Update active chip
  cidrChips.forEach(chip => {
    if (parseInt(chip.dataset.cidr) === parseInt(cidrSelect.value)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  process();
});

// Clear IP
clearIpBtn.addEventListener('click', () => {
  ipInput.value = '';
  clearIpBtn.classList.remove('show');
  process();
  ipInput.focus();
});

// Paste
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      ipInput.value = text.trim();
      clearIpBtn.classList.add('show');
      process();
    }
  } catch (e) {
    alert('Clipboard access denied.');
  }
});

// Sample
sampleBtn.addEventListener('click', () => {
  ipInput.value = '192.168.1.100';
  cidrSelect.value = '24';
  cidrChips.forEach(chip => {
    if (chip.dataset.cidr === '24') chip.classList.add('active');
    else chip.classList.remove('active');
  });
  clearIpBtn.classList.add('show');
  process();
});

// Clear all
clearAllBtn.addEventListener('click', () => {
  ipInput.value = '';
  clearIpBtn.classList.remove('show');
  process();
});

// CIDR chips
cidrChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const cidr = chip.dataset.cidr;
    cidrSelect.value = cidr;
    cidrChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    process();
  });
});

// Copy all
copyAllBtn.addEventListener('click', () => {
  if (!currentResults) {
    alert('Enter an IP address first.');
    return;
  }

  const r = currentResults;
  const text = 'IP Address: ' + r.ip + '\n' +
    'CIDR: /' + r.cidr + '\n' +
    'Netmask: ' + r.netmask + '\n' +
    'Wildcard: ' + r.wildcard + '\n' +
    'Network: ' + r.network + '\n' +
    'Broadcast: ' + r.broadcast + '\n' +
    'First Host: ' + r.firstHost + '\n' +
    'Last Host: ' + r.lastHost + '\n' +
    'Total Hosts: ' + r.totalHosts + '\n' +
    'Usable Hosts: ' + r.usableHosts + '\n' +
    'Class: ' + r.ipClass + '\n' +
    'Type: ' + r.ipType + '\n';

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

// Download
downloadBtn.addEventListener('click', () => {
  if (!currentResults) {
    alert('Enter an IP address first.');
    return;
  }

  const r = currentResults;
  const text = 'IP Address: ' + r.ip + '\n' +
    'CIDR: /' + r.cidr + '\n' +
    'Netmask: ' + r.netmask + '\n' +
    'Wildcard: ' + r.wildcard + '\n' +
    'Network: ' + r.network + '\n' +
    'Broadcast: ' + r.broadcast + '\n' +
    'First Host: ' + r.firstHost + '\n' +
    'Last Host: ' + r.lastHost + '\n' +
    'Total Hosts: ' + r.totalHosts + '\n' +
    'Usable Hosts: ' + r.usableHosts + '\n' +
    'Class: ' + r.ipClass + '\n' +
    'Type: ' + r.ipType + '\n' +
    'Binary IP: ' + r.binaryIp + '\n' +
    'Binary Mask: ' + r.binaryMask + '\n';

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'subnet-' + r.ip.replace(/\./g, '-') + '.txt';
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