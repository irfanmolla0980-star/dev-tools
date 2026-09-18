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

// ===== URL Encode/Decode Logic =====
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
      inputBox.placeholder = 'Enter URL or text to encode...';
    } else {
      inputBox.placeholder = 'Enter encoded URL to decode...';
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
      const encoded = encodeURIComponent(raw);
      outputBox.value = encoded;
      buildUrlDetails(raw, encoded, 'encode');
    } catch (e) {
      outputBox.value = '⚠️ Cannot encode this text.';
      detailsContent.innerHTML = '';
    }
  } else {
    try {
      const decoded = decodeURIComponent(raw.trim());
      outputBox.value = decoded;
      buildUrlDetails(raw, decoded, 'decode');
    } catch (e) {
      outputBox.value = '⚠️ Invalid encoded URL.';
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
    inputBox.placeholder = 'Enter encoded URL to decode...';
  } else {
    currentMode = 'encode';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="encode"]').classList.add('active');
    inputBox.placeholder = 'Enter URL or text to encode...';
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

// ===== URL Details Builder =====
function buildUrlDetails(input, output, mode) {
  if (!detailsContent) return;

  let html = '';

  html += `
    <div class="detail-row">
      <span class="detail-char">Mode</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${mode === 'encode' ? 'Encode' : 'Decode'}</span>
    </div>
  `;

  html += `
    <div class="detail-row">
      <span class="detail-char">Input</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${input.length} chars</span>
    </div>
  `;

  html += `
    <div class="detail-row">
      <span class="detail-char">Output</span>
      <span class="detail-arrow">→</span>
      <span class="detail-value">${output.length} chars</span>
    </div>
  `;

  // Show special characters encoded (only in encode mode)
  if (mode === 'encode') {
    const specialChars = [' ', '!', '#', '$', '&', "'", '(', ')', '*', '+', ',', '/', ':', ';', '=', '?', '@', '[', ']', '%', '"', '<', '>', '{', '}', '|', '\\', '^', '`'];
    const uniqueEncoded = [];
    let encodedCount = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (specialChars.includes(char)) {
        encodedCount++;
        if (!uniqueEncoded.includes(char)) {
          uniqueEncoded.push(char);
        }
      }
    }

    if (encodedCount > 0) {
      html += `
        <div class="detail-row">
          <span class="detail-char">Encoded</span>
          <span class="detail-arrow">→</span>
          <span class="detail-value">${encodedCount} special char(s)</span>
        </div>
      `;

      uniqueEncoded.slice(0, 12).forEach(char => {
        const encoded = encodeURIComponent(char);
        const displayChar = char === ' ' ? '␣' : char;
        html += `
          <div class="detail-row">
            <span class="detail-char">${displayChar}</span>
            <span class="detail-arrow">→</span>
            <span class="detail-value">${encoded}</span>
          </div>
        `;
      });

      if (uniqueEncoded.length > 12) {
        html += `
          <div class="detail-row">
            <span class="detail-char">...</span>
            <span class="detail-arrow"></span>
            <span class="detail-value">+${uniqueEncoded.length - 12} more</span>
          </div>
        `;
      }
    } else {
      html += `
        <div class="detail-row">
          <span class="detail-char">Note</span>
          <span class="detail-arrow">→</span>
          <span class="detail-value">No special chars to encode</span>
        </div>
      `;
    }
  }

  detailsContent.innerHTML = html;
}