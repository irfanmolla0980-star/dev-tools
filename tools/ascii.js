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

// ===== ASCII Converter Logic =====
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const swapBtn = document.getElementById('swapBtn');
const modeButtons = document.querySelectorAll('.mode-btn');

let currentMode = 'text-to-ascii';

// Mode Switch
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;

    if (currentMode === 'text-to-ascii') {
      inputBox.placeholder = 'Enter text here...';
    } else {
      inputBox.placeholder = 'Enter ASCII codes (space separated)...';
    }

    inputBox.value = '';
    outputBox.value = '';
    clearBtn.classList.remove('show');
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
    return;
  }

  if (currentMode === 'text-to-ascii') {
    const asciiCodes = [];
    for (let i = 0; i < raw.length; i++) {
      asciiCodes.push(raw.charCodeAt(i));
    }
    outputBox.value = asciiCodes.join(' ');
  } else {
    const codes = raw.trim().split(/\s+/);
    let text = '';
    let hasError = false;

    codes.forEach(code => {
      const num = parseInt(code, 10);
      if (isNaN(num) || num < 0 || num > 127) {
        hasError = true;
      } else {
        text += String.fromCharCode(num);
      }
    });

    if (hasError) {
      outputBox.value = '⚠️ Invalid ASCII code (must be 0–127)';
    } else {
      outputBox.value = text;
    }
  }
});

// Clear Button
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  outputBox.value = '';
  clearBtn.classList.remove('show');
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
  if (currentMode === 'text-to-ascii') {
    currentMode = 'ascii-to-text';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="ascii-to-text"]').classList.add('active');
    inputBox.placeholder = 'Enter ASCII codes (space separated)...';
  } else {
    currentMode = 'text-to-ascii';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="text-to-ascii"]').classList.add('active');
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