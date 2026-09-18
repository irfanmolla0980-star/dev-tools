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

// ===== Unicode ↔ Text Logic =====
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const swapBtn = document.getElementById('swapBtn');
const modeButtons = document.querySelectorAll('.mode-btn');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let currentMode = 'text-to-unicode';

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

    if (currentMode === 'text-to-unicode') {
      inputBox.placeholder = 'Enter text here...';
    } else {
      inputBox.placeholder = 'Enter Unicode (e.g. U+0048 U+0069)...';
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

  if (currentMode === 'text-to-unicode') {
    // Text to Unicode
    const parts = [];
    for (let i = 0; i < raw.length; i++) {
      const code = raw.charCodeAt(i);
      const hex = code.toString(16).toUpperCase().padStart(4, '0');
      parts.push('U+' + hex);
    }
    outputBox.value = parts.join(' ');
    buildUnicodeDetails(raw);
  } else {
    // Unicode to Text
    const parts = raw.trim().split(/\s+/);
    let text = '';
    let hasError = false;

    parts.forEach(code => {
      const clean = code.replace(/U\+/i, '').replace(/[^0-9A-Fa-f]/g, '');
      if (clean.length === 0) {
        hasError = true;
      } else {
        const num = parseInt(clean, 16);
        text += String.fromCharCode(num);
      }
    });

    if (hasError) {
      outputBox.value = '⚠️ Invalid Unicode (use format: U+0048 U+0069)';
      detailsContent.innerHTML = '<p style="color:#7744aa;">Details only available in Text → Unicode mode.</p>';
    } else {
      outputBox.value = text;
      detailsContent.innerHTML = '<p style="color:#7744aa;">Details only available in Text → Unicode mode.</p>';
    }
  }
});

// Clear Button
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  outputBox.value = '';
  clearBtn.classList.remove('show');
  detailsContent.innerHTML = '';
  inputBox.focus();
});

// Copy Button
copyBtn.addEventListener('click', () => {
  if (outputBox.value === '') return;

  navigator.clipboard.writeText(outputBox.value).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    setTimeout(() => (copyBtn.textContent = original), 1200);
  });
});

// Swap Button
swapBtn.addEventListener('click', () => {
  if (currentMode === 'text-to-unicode') {
    currentMode = 'unicode-to-text';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="unicode-to-text"]').classList.add('active');
    inputBox.placeholder = 'Enter Unicode (e.g. U+0048 U+0069)...';
  } else {
    currentMode = 'text-to-unicode';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="text-to-unicode"]').classList.add('active');
    inputBox.placeholder = 'Enter text here...';
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

// ===== Unicode Details Builder =====
function buildUnicodeDetails(text) {
  if (!detailsContent) return;

  if (!text || text.length === 0) {
    detailsContent.innerHTML = '<p style="color:#7744aa;">No details yet. Type something above.</p>';
    return;
  }

  let html = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);
    const hex = code.toString(16).toUpperCase().padStart(4, '0');
    const unicode = 'U+' + hex;
    const displayChar = char === ' ' ? '␣' : char;

    html += `
      <div class="detail-row">
        <span class="detail-char">${displayChar}</span>
        <span class="detail-arrow">→</span>
        <span class="detail-value">${unicode} · ${code}</span>
      </div>
    `;
  }

  detailsContent.innerHTML = html;
}