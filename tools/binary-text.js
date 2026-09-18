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

// ===== Binary ↔ Text Logic =====
const inputBox = document.getElementById('inputBox');
const outputBox = document.getElementById('outputBox');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const swapBtn = document.getElementById('swapBtn');
const modeButtons = document.querySelectorAll('.mode-btn');

let currentMode = 'text-to-binary';

// Mode Switch
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;

    if (currentMode === 'text-to-binary') {
      inputBox.placeholder = 'Enter text here...';
    } else {
      inputBox.placeholder = 'Enter binary (space separated, e.g. 01001000 01101001)...';
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

  if (currentMode === 'text-to-binary') {
    const binaryParts = [];
    for (let i = 0; i < raw.length; i++) {
      const code = raw.charCodeAt(i);
      binaryParts.push(code.toString(2).padStart(8, '0'));
    }
    outputBox.value = binaryParts.join(' ');
  } else {
    const parts = raw.trim().split(/\s+/);
    let text = '';
    let hasError = false;

    parts.forEach(bin => {
      const clean = bin.replace(/[^01]/g, '');
      if (clean.length === 0 || clean.length > 8) {
        hasError = true;
      } else {
        const num = parseInt(clean, 2);
        text += String.fromCharCode(num);
      }
    });

    if (hasError) {
      outputBox.value = '⚠️ Invalid binary (use 8-bit groups, e.g. 01001000 01101001)';
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
  if (currentMode === 'text-to-binary') {
    currentMode = 'binary-to-text';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="binary-to-text"]').classList.add('active');
    inputBox.placeholder = 'Enter binary (space separated, e.g. 01001000 01101001)...';
  } else {
    currentMode = 'text-to-binary';
    modeButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="text-to-binary"]').classList.add('active');
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