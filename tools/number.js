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

// ===== Number Converter Logic =====
const input = document.getElementById('numberInput');
const clearBtn = document.getElementById('clearBtn');
const baseButtons = document.querySelectorAll('.base-btn');

const decimalEl = document.getElementById('decimalValue');
const binaryEl = document.getElementById('binaryValue');
const hexEl = document.getElementById('hexValue');
const octalEl = document.getElementById('octalValue');

const decimalBreakdown = document.getElementById('decimalBreakdown');
const binaryBreakdown = document.getElementById('binaryBreakdown');
const hexBreakdown = document.getElementById('hexBreakdown');
const octalBreakdown = document.getElementById('octalBreakdown');

let currentBase = 10;
let currentNumber = 0;

// Base Button Click
baseButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    baseButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentBase = parseInt(btn.dataset.base);

    input.value = '';
    clearBtn.classList.remove('show');
    resetOutputs();
  });
});

// Input Event
input.addEventListener('input', () => {
  const raw = input.value.trim();

  if (raw.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }

  if (raw === '') {
    resetOutputs();
    return;
  }

  const num = parseInt(raw, currentBase);

  if (isNaN(num) || num < 0) {
    resetOutputs();
    return;
  }

  currentNumber = num;

  decimalEl.textContent = num.toString(10);
  binaryEl.textContent = num.toString(2);
  hexEl.textContent = num.toString(16).toUpperCase();
  octalEl.textContent = num.toString(8);

  buildDecimalBreakdown(num);
  buildBinaryBreakdown(num);
  buildHexBreakdown(num);
  buildOctalBreakdown(num);
});

// Clear Button
clearBtn.addEventListener('click', () => {
  input.value = '';
  clearBtn.classList.remove('show');
  resetOutputs();
  input.focus();
});

// Reset
function resetOutputs() {
  decimalEl.textContent = '0';
  binaryEl.textContent = '0';
  hexEl.textContent = '0';
  octalEl.textContent = '0';
  currentNumber = 0;

  if (decimalBreakdown) decimalBreakdown.innerHTML = '';
  if (binaryBreakdown) binaryBreakdown.innerHTML = '';
  if (hexBreakdown) hexBreakdown.innerHTML = '';
  if (octalBreakdown) octalBreakdown.innerHTML = '';
}

// Copy Buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const text = document.getElementById(targetId).textContent;

    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => (btn.textContent = original), 1000);
    });
  });
});

// Dropdown Toggle
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const targetId = btn.dataset.target;
    const dropdown = document.getElementById(targetId);

    document.querySelectorAll('.dropdown').forEach(d => {
      if (d !== dropdown) d.classList.remove('open');
    });

    document.querySelectorAll('.toggle-btn').forEach(b => {
      if (b !== btn) b.style.transform = 'rotate(0deg)';
    });

    dropdown.classList.toggle('open');

    if (dropdown.classList.contains('open')) {
      btn.style.transform = 'rotate(180deg)';
    } else {
      btn.style.transform = 'rotate(0deg)';
    }
  });
});

// Breakdown Functions
function buildDecimalBreakdown(num) {
  if (!decimalBreakdown) return;
  if (num === 0) {
    decimalBreakdown.innerHTML = '<h4>Decimal Breakdown</h4><p>Value: 0</p>';
    return;
  }
  const digits = num.toString(10).split('').reverse();
  let parts = [], powers = [];
  digits.forEach((d, i) => {
    parts.push(d + ' × 10<sup>' + i + '</sup>');
    powers.push('10<sup>' + i + '</sup>');
  });
  decimalBreakdown.innerHTML = `
    <h4>Decimal Breakdown</h4>
    <div class="breakdown">
      <div>${parts.reverse().join(' + ')} = ${num}</div>
      <div class="pos">Position: ${powers.reverse().join(' ')}</div>
    </div>
  `;
}

function buildBinaryBreakdown(num) {
  if (!binaryBreakdown) return;
  if (num === 0) {
    binaryBreakdown.innerHTML = '<h4>Binary Breakdown</h4><p>Value: 0</p>';
    return;
  }
  const binary = num.toString(2);
  const len = binary.length;
  let weights = '', bits = '', positions = '';
  for (let i = 0; i < len; i++) {
    const bit = binary[i];
    const power = len - 1 - i;
    const weight = Math.pow(2, power);
    weights += weight + (i < len - 1 ? ' + ' : ' = ' + num);
    bits += bit + (i < len - 1 ? ' ' : '');
    positions += '2<sup>' + power + '</sup>' + (i < len - 1 ? ' ' : '');
  }
  binaryBreakdown.innerHTML = `
    <h4>Binary Breakdown</h4>
    <div class="breakdown">
      <div>${weights}</div>
      <div>${bits}</div>
      <div class="pos">Position: ${positions}</div>
    </div>
  `;
}

function buildHexBreakdown(num) {
  if (!hexBreakdown) return;
  if (num === 0) {
    hexBreakdown.innerHTML = '<h4>Hexadecimal Breakdown</h4><p>Value: 0</p>';
    return;
  }
  const digits = num.toString(16).toUpperCase().split('').reverse();
  let parts = [], powers = [];
  digits.forEach((d, i) => {
    const val = parseInt(d, 16);
    parts.push(val + ' × 16<sup>' + i + '</sup>');
    powers.push('16<sup>' + i + '</sup>');
  });
  hexBreakdown.innerHTML = `
    <h4>Hexadecimal Breakdown</h4>
    <div class="breakdown">
      <div>${parts.reverse().join(' + ')} = ${num}</div>
      <div class="pos">Position: ${powers.reverse().join(' ')}</div>
    </div>
  `;
}

function buildOctalBreakdown(num) {
  if (!octalBreakdown) return;
  if (num === 0) {
    octalBreakdown.innerHTML = '<h4>Octal Breakdown</h4><p>Value: 0</p>';
    return;
  }
  const digits = num.toString(8).split('').reverse();
  let parts = [], powers = [];
  digits.forEach((d, i) => {
    parts.push(d + ' × 8<sup>' + i + '</sup>');
    powers.push('8<sup>' + i + '</sup>');
  });
  octalBreakdown.innerHTML = `
    <h4>Octal Breakdown</h4>
    <div class="breakdown">
      <div>${parts.reverse().join(' + ')} = ${num}</div>
      <div class="pos">Position: ${powers.reverse().join(' ')}</div>
    </div>
  `;
}