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

// ===== Color Converter Logic =====
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const hslInput = document.getElementById('hslInput');
const colorPicker = document.getElementById('colorPicker');
const colorPreview = document.getElementById('colorPreview');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

let currentColor = { r: 170, g: 102, b: 255 };

// Details Toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Initialize
updateAllFormats(currentColor);

// ===== Color Picker =====
colorPicker.addEventListener('input', () => {
  const hex = colorPicker.value;
  const rgb = hexToRgb(hex);
  currentColor = rgb;
  updateAllFormats(currentColor);
});

// ===== HEX Input =====
hexInput.addEventListener('input', () => {
  toggleClearBtn(hexInput);

  let val = hexInput.value.trim();
  if (!val.startsWith('#')) val = '#' + val;

  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    const rgb = hexToRgb(val);
    currentColor = rgb;
    updateAllFormats(currentColor, 'hex');
  }
});

// ===== RGB Input =====
rgbInput.addEventListener('input', () => {
  toggleClearBtn(rgbInput);

  const match = rgbInput.value.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (match) {
    const r = Math.min(255, parseInt(match[1]));
    const g = Math.min(255, parseInt(match[2]));
    const b = Math.min(255, parseInt(match[3]));
    currentColor = { r, g, b };
    updateAllFormats(currentColor, 'rgb');
  }
});

// ===== HSL Input =====
hslInput.addEventListener('input', () => {
  toggleClearBtn(hslInput);

  const match = hslInput.value.match(/(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
  if (match) {
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    const rgb = hslToRgb(h, s, l);
    currentColor = rgb;
    updateAllFormats(currentColor, 'hsl');
  }
});

// ===== Update All Formats =====
function updateAllFormats(rgb, source) {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  if (source !== 'hex') hexInput.value = hex;
  if (source !== 'rgb') rgbInput.value = rgbStr;
  if (source !== 'hsl') hslInput.value = hslStr;

  colorPicker.value = hex;
  colorPreview.style.background = hex;

  buildColorDetails(rgb, hex, rgbStr, hslStr, hsl);
}

// ===== Conversion Helpers =====
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l;
  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// ===== Clear Buttons =====
function toggleClearBtn(input) {
  const wrapper = input.closest('.input-wrapper');
  const btn = wrapper.querySelector('.clear-btn');
  if (!btn) return;

  if (input.value.length > 0) {
    btn.classList.add('show');
  } else {
    btn.classList.remove('show');
  }
}

document.querySelectorAll('.clear-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    input.value = '';
    btn.classList.remove('show');
    input.focus();
  });
});

// ===== Copy Chips =====
document.querySelectorAll('.copy-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const targetId = chip.dataset.target;
    const input = document.getElementById(targetId);
    if (!input || !input.value) return;

    navigator.clipboard.writeText(input.value).then(() => {
      const original = chip.textContent;
      chip.textContent = '✓ Copied';
      chip.classList.add('copied');
      setTimeout(() => {
        chip.textContent = original;
        chip.classList.remove('copied');
      }, 1200);
    });
  });
});

// ===== Details Builder =====
function buildColorDetails(rgb, hex, rgbStr, hslStr, hsl) {
  if (!detailsContent) return;

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">HEX</span><span class="detail-arrow">→</span><span class="detail-value">${hex}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">RGB</span><span class="detail-arrow">→</span><span class="detail-value">${rgbStr}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">HSL</span><span class="detail-arrow">→</span><span class="detail-value">${hslStr}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Red</span><span class="detail-arrow">→</span><span class="detail-value">${rgb.r} (${rgb.r.toString(16).padStart(2, '0').toUpperCase()})</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Green</span><span class="detail-arrow">→</span><span class="detail-value">${rgb.g} (${rgb.g.toString(16).padStart(2, '0').toUpperCase()})</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Blue</span><span class="detail-arrow">→</span><span class="detail-value">${rgb.b} (${rgb.b.toString(16).padStart(2, '0').toUpperCase()})</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Hue</span><span class="detail-arrow">→</span><span class="detail-value">${hsl.h}°</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Saturation</span><span class="detail-arrow">→</span><span class="detail-value">${hsl.s}%</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Lightness</span><span class="detail-arrow">→</span><span class="detail-value">${hsl.l}%</span></div>`;

  detailsContent.innerHTML = html;
}