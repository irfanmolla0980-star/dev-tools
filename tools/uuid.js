// ===== Navbar Toggle (Mobile) =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// ===== Active Link Highlight =====
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) {
    link.classList.add('active');
  }
});

// ===== Back to Top =====
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

// ===== UUID Generator Logic =====
const modeButtons = document.querySelectorAll('.mode-btn');
const qtyButtons = document.querySelectorAll('.qty-btn');
const generateBtn = document.getElementById('generateBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const uuidOutput = document.getElementById('uuidOutput');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let currentVersion = 'v4';
let currentQty = 1;
let generatedUUIDs = [];

// Details Toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Version Switch
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentVersion = btn.dataset.version;
  });
});

// Quantity Switch
qtyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    qtyButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentQty = parseInt(btn.dataset.qty);
  });
});

// Generate
generateBtn.addEventListener('click', () => {
  generatedUUIDs = [];
  const count = currentQty;

  for (let i = 0; i < count; i++) {
    if (currentVersion === 'v4') {
      generatedUUIDs.push(uuidv4());
    } else {
      generatedUUIDs.push(uuidv1());
    }
  }

  renderUUIDs();
  buildUUIDDetails();
});

// Copy All
copyAllBtn.addEventListener('click', () => {
  if (generatedUUIDs.length === 0) return;

  navigator.clipboard.writeText(generatedUUIDs.join('\n')).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied All';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1400);
  });
});

// Render UUID List
function renderUUIDs() {
  if (generatedUUIDs.length === 0) {
    uuidOutput.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🆔</span>
        <p>Click <strong>Generate UUIDs</strong> to create unique IDs.</p>
      </div>
    `;
    return;
  }

  let html = '';
  generatedUUIDs.forEach((uuid, index) => {
    html += `
      <div class="uuid-item">
        <span class="uuid-text" data-index="${index}">${uuid}</span>
        <button class="uuid-copy" data-index="${index}" type="button">⧉</button>
      </div>
    `;
  });
  uuidOutput.innerHTML = html;

  // Attach copy listeners
  uuidOutput.querySelectorAll('.uuid-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      navigator.clipboard.writeText(generatedUUIDs[index]).then(() => {
        btn.textContent = '✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '⧉';
          btn.classList.remove('copied');
        }, 1000);
      });
    });
  });

  // Click on text to copy
  uuidOutput.querySelectorAll('.uuid-text').forEach(el => {
    el.addEventListener('click', () => {
      const index = parseInt(el.dataset.index);
      navigator.clipboard.writeText(generatedUUIDs[index]).then(() => {
        const original = el.textContent;
        el.textContent = '✓ Copied!';
        setTimeout(() => (el.textContent = original), 900);
      });
    });
  });
}

// ===== UUID v4 (Random) =====
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ===== UUID v1 (Time-based) =====
function uuidv1() {
  const now = Date.now();
  const timeLow = ((now & 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0');
  const timeMid = ((now / 0x100000000) & 0xFFFF).toString(16).padStart(4, '0');
  const timeHi = (((now / 0x100000000) & 0x0FFF) | 0x1000).toString(16).padStart(4, '0');
  const clockSeq = ((Math.random() * 0x3FFF) | 0x8000).toString(16).padStart(4, '0');
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
}

// ===== Details Builder =====
function buildUUIDDetails() {
  if (!detailsContent) return;

  if (generatedUUIDs.length === 0) {
    detailsContent.innerHTML = '<p class="no-details">Generate UUIDs first to see details.</p>';
    return;
  }

  const version = currentVersion;
  const count = generatedUUIDs.length;

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">Version</span><span class="detail-arrow">→</span><span class="detail-value">UUID ${version}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Count</span><span class="detail-arrow">→</span><span class="detail-value">${count} generated</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Length</span><span class="detail-arrow">→</span><span class="detail-value">36 characters</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Bits</span><span class="detail-arrow">→</span><span class="detail-value">128-bit</span></div>`;

  if (version === 'v4') {
    html += `<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">Random</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Random bits</span><span class="detail-arrow">→</span><span class="detail-value">122</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Possible</span><span class="detail-arrow">→</span><span class="detail-value">5.3 × 10³⁶</span></div>`;
  } else {
    html += `<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">Time-based</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Based on</span><span class="detail-arrow">→</span><span class="detail-value">Timestamp + Random</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Sortable</span><span class="detail-arrow">→</span><span class="detail-value">Yes (by time)</span></div>`;
  }

  html += `<div class="detail-row"><span class="detail-char">Format</span><span class="detail-arrow">→</span><span class="detail-value">8-4-4-4-12 hex</span></div>`;

  if (count > 0) {
    html += `<div class="detail-row"><span class="detail-char">First</span><span class="detail-arrow">→</span><span class="detail-value">${generatedUUIDs[0]}</span></div>`;
    if (count > 1) {
      html += `<div class="detail-row"><span class="detail-char">Last</span><span class="detail-arrow">→</span><span class="detail-value">${generatedUUIDs[count - 1]}</span></div>`;
    }
  }

  detailsContent.innerHTML = html;
}