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

// ===== Base64 Logic =====
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const swapBtn = document.getElementById('swapBtn');
const modeButtons = document.querySelectorAll('.mode-btn');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let currentMode = 'encode';

// Details Toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Mode Switch
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;

    if (currentMode === 'encode') {
      inputBox.placeholder = 'Enter text to encode...';
    } else {
      inputBox.placeholder = 'Enter Base64 to decode...';
    }

    inputBox.value = '';
    outputBox.value = '';
    clearBtn.classList.remove('show');
    detailsContent.innerHTML = '';
  });
});

// Convert on Input
inputBox.addEventListener('input', () => {
  const raw = inputBox.value;

  if (raw.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }

  if (raw === '') {
    outputBox.value = '';
    detailsContent.innerHTML = '';
    return;
  }

  if (currentMode === 'encode') {
    try {
      const encoded = btoa(unescape(encodeURIComponent(raw)));
      outputBox.value = encoded;
      buildBase64Details(raw, encoded);
    } catch (e) {
      outputBox.value = '⚠️ Cannot encode this text.';
      detailsContent.innerHTML = '';
    }
  } else {
    try {
      const decoded = decodeURIComponent(escape(atob(raw.trim())));
      outputBox.value = decoded;
      buildDecodeDetails(raw.trim(), decoded);
    } catch (e) {
      outputBox.value = '⚠️ Invalid Base64 string.';
      detailsContent.innerHTML = '';
    }
  }
});

// Clear
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  outputBox.value = '';
  clearBtn.classList.remove('show');
  detailsContent.innerHTML = '';
  inputBox.focus();
});

// Copy
copyBtn.addEventListener('click', () => {
  if (outputBox.value === '') return;
  navigator.clipboard.writeText(outputBox.value).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    setTimeout(() => (copyBtn.textContent = original), 1200);
  });
});

// Swap
swapBtn.addEventListener('click', () => {
  if (currentMode === 'encode') {
    currentMode = 'decode';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="decode"]').classList.add('active');
    inputBox.placeholder = 'Enter Base64 to decode...';
  } else {
    currentMode = 'encode';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="encode"]').classList.add('active');
    inputBox.placeholder = 'Enter text to encode...';
  }

  const temp = inputBox.value;
  inputBox.value = outputBox.value;
  outputBox.value = temp;

  inputBox.dispatchEvent(new Event('input'));

  if (inputBox.value.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }
});

// ===== Base64 Encode Details =====
function buildBase64Details(text, base64) {
  if (!detailsContent) return;

  let html = '';

  const bytes = new TextEncoder().encode(text).length;
  const padding = (base64.match(/=/g) || []).length;

  html += `
    <div class="detail-row">
      <span class="detail-char">Input</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${text.length} chars</span>
    </div>
  `;

  html += `
    <div class="detail-row">
      <span class="detail-char">Bytes</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${bytes} bytes (UTF-8)</span>
    </div>
  `;

  html += `
    <div class="detail-row">
      <span class="detail-char">Base64</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${base64.length} chars</span>
    </div>
  `;

  html += `
    <div class="detail-row">
      <span class="detail-char">Padding</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${padding} "=" sign(s)</span>
    </div>
  `;

  // Character breakdown (up to 30)
  const limit = Math.min(text.length, 30);
  for (let i = 0; i < limit; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);
    const displayChar = char === ' ' ? '␣' : char;
    html += `
      <div class="detail-row">
        <span class="detail-char">${displayChar}</span>
        <span class="detail-arrow">→</span>
        <span class="detail-value">${code}</span>
      </div>
    `;
  }

  if (text.length > 30) {
    html += `
      <div class="detail-row">
        <span class="detail-char">...</span>
        <span class="detail-arrow"></span>
        <span class="detail-value">+${text.length - 30} more chars</span>
      </div>
    `;
  }

  detailsContent.innerHTML = html;
}

// ===== Base64 Decode Details =====
function buildDecodeDetails(base64, decoded) {
  if (!detailsContent) return;

  let html = '';

  const padding = (base64.match(/=/g) || []).length;

  html += `
    <div class="detail-row">
      <span class="detail-char">Base64</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${base64.length} chars</span>
    </div>
  `;

  html += `
    <div class="detail-row">
      <span class="detail-char">Padding</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${padding} "=" sign(s)</span>
    </div>
  `;

  html += `
    <div class="detail-row">
      <span class="detail-char">Decoded</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${decoded.length} chars</span>
    </div>
  `;

  detailsContent.innerHTML = html;
}