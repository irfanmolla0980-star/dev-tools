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
const colorPicker = document.getElementById('colorPicker');
const hexInput = document.getElementById('hexInput');
const clearBtn = document.getElementById('clearBtn');
const randomBtn = document.getElementById('randomBtn');
const swatchGrid = document.getElementById('swatchGrid');
const statusBar = document.getElementById('statusBar');
const shadeScale = document.getElementById('shadeScale');
const harmonyGrid = document.getElementById('harmonyGrid');
const contrastSection = document.getElementById('contrastSection');
const exportTabs = document.querySelectorAll('.export-tab');
const exportLabel = document.getElementById('exportLabel');
const exportBox = document.getElementById('exportBox');
const copyExportBtn = document.getElementById('copyExportBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadBtn = document.getElementById('downloadBtn');
const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let currentColor = '#3b82f6';
let currentExportFormat = 'css';
let currentPalette = null;

// ===== Color Conversion Helpers =====
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
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

  return { r: r * 255, g: g * 255, b: b * 255 };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function isValidHex(hex) {
  return /^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(hex);
}

function normalizeHex(hex) {
  if (!hex.startsWith('#')) hex = '#' + hex;
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex.toLowerCase();
}

// ===== Relative Luminance (for contrast) =====
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ===== Shade Scale Generator (Tailwind-style) =====
function generateShadeScale(baseHex) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const baseHue = hsl.h;
  const baseSat = Math.min(hsl.s, 90);

  // Target lightness for each step (Tailwind-inspired)
  const steps = [
    { name: '50',  l: 97, s: Math.min(baseSat, 100) },
    { name: '100', l: 94, s: Math.min(baseSat, 100) },
    { name: '200', l: 86, s: Math.min(baseSat, 95) },
    { name: '300', l: 76, s: Math.min(baseSat, 90) },
    { name: '400', l: 66, s: Math.min(baseSat, 88) },
    { name: '500', l: 55, s: baseSat },
    { name: '600', l: 45, s: Math.min(baseSat + 5, 90) },
    { name: '700', l: 35, s: Math.min(baseSat + 8, 85) },
    { name: '800', l: 25, s: Math.min(baseSat + 10, 80) },
    { name: '900', l: 17, s: Math.min(baseSat + 10, 75) },
    { name: '950', l: 10, s: Math.min(baseSat + 10, 70) }
  ];

  return steps.map(step => {
    const hex = hslToHex(baseHue, step.s, step.l);
    return { name: step.name, hex: hex };
  });
}

// ===== Harmony Palettes =====
function generateHarmonies(baseHex) {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const h = hsl.h;
  const s = hsl.s;
  const l = hsl.l;

  // Helper to generate shades from a hue
  const shades = (hue) => [
    hslToHex(hue, s, 25),
    hslToHex(hue, s, 40),
    hslToHex(hue, s, 55),
    hslToHex(hue, s, 70),
    hslToHex(hue, s, 88)
  ];

  return {
    complementary: shades((h + 180) % 360),
    analogous: shades((h + 30) % 360),
    triadic: shades((h + 120) % 360),
    monochromatic: [
      hslToHex(h, s, 20),
      hslToHex(h, s, 35),
      hslToHex(h, s, 50),
      hslToHex(h, s, 65),
      hslToHex(h, s, 85)
    ]
  };
}

// ===== Render Shade Scale =====
function renderShadeScale(shades) {
  if (!shadeScale) return;

  let html = '';
  shades.forEach(shade => {
    const rgb = hexToRgb(shade.hex);
    const textColor = getLuminance(rgb.r, rgb.g, rgb.b) > 0.5 ? '#2a0044' : '#ffffff';

    html += `
      <div class="shade-row" style="background:${shade.hex}" data-hex="${shade.hex}">
        <span class="shade-name" style="color:${textColor}">${shade.name}</span>
        <span class="shade-hex" style="color:${textColor}">${shade.hex}</span>
      </div>
    `;
  });

  shadeScale.innerHTML = html;

  // Click to copy
  shadeScale.querySelectorAll('.shade-row').forEach(row => {
    row.addEventListener('click', () => {
      const hex = row.dataset.hex;
      navigator.clipboard.writeText(hex).then(() => {
        row.classList.add('copied');
        setTimeout(() => row.classList.remove('copied'), 800);
      });
    });
  });
}

// ===== Render Harmony =====
function renderHarmony(harmonies) {
  if (!harmonyGrid) return;

  const labels = {
    complementary: '🎯 Complementary (180°)',
    analogous: '🌈 Analogous (+30°)',
    triadic: '🔺 Triadic (120°)',
    monochromatic: '⚪ Monochromatic'
  };

  let html = '';
  Object.keys(harmonies).forEach(key => {
    html += `
      <div class="harmony-card">
        <div class="harmony-title">${labels[key] || key}</div>
        <div class="harmony-swatches">
    `;

    harmonies[key].forEach(hex => {
      const rgb = hexToRgb(hex);
      const textColor = getLuminance(rgb.r, rgb.g, rgb.b) > 0.5 ? '#2a0044' : '#ffffff';
      html += `
        <div class="harmony-swatch" style="background:${hex}; color:${textColor}" data-hex="${hex}">
          ${hex.replace('#', '')}
        </div>
      `;
    });

    html += `</div></div>`;
  });

  harmonyGrid.innerHTML = html;

  // Click to copy
  harmonyGrid.querySelectorAll('.harmony-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const hex = swatch.dataset.hex;
      navigator.clipboard.writeText(hex).then(() => {
        swatch.classList.add('copied');
        setTimeout(() => swatch.classList.remove('copied'), 800);
      });
    });
  });
}

// ===== Render Contrast =====
function renderContrast(baseHex) {
  if (!contrastSection) return;

  const contrasts = [
    { label: 'White Text', bg: '#ffffff', text: baseHex },
    { label: 'Black Text', bg: '#000000', text: baseHex },
    { label: 'Base as BG', bg: baseHex, text: '#ffffff' },
    { label: 'Base as BG', bg: baseHex, text: '#000000' }
  ];

  let html = '';
  contrasts.forEach(c => {
    const ratio = getContrastRatio(c.bg, c.text);
    const aaPass = ratio >= 4.5;
    const aaaPass = ratio >= 7;
    const aaLarge = ratio >= 3;

    html += `
      <div class="contrast-card">
        <div class="contrast-preview" style="background:${c.bg}; color:${c.text}">
          ${c.label}
        </div>
        <div class="contrast-info">
          <div class="contrast-title">${c.label}</div>
          <div class="contrast-ratio">Ratio: ${ratio.toFixed(2)}:1</div>
          <div class="contrast-badges">
            <span class="badge ${aaPass ? 'pass' : 'fail'}">AA ${aaPass ? '✓' : '✕'}</span>
            <span class="badge ${aaaPass ? 'pass' : 'fail'}">AAA ${aaaPass ? '✓' : '✕'}</span>
            <span class="badge ${aaLarge ? 'pass' : 'fail'}">AA Large ${aaLarge ? '✓' : '✕'}</span>
          </div>
        </div>
      </div>
    `;
  });

  contrastSection.innerHTML = html;
}

// ===== Render Export =====
function renderExport(shades, format) {
  if (!exportBox) return;

  const labels = {
    css: 'CSS Variables',
    tailwind: 'Tailwind Config',
    scss: 'SCSS Variables',
    json: 'JSON'
  };

  if (exportLabel) exportLabel.textContent = labels[format] || 'Export';

  let text = '';

  if (format === 'css') {
    text = ':root {\n';
    shades.forEach(s => {
      text += `  --color-primary-${s.name}: ${s.hex};\n`;
    });
    text += '}\n';
  } else if (format === 'tailwind') {
    text = '// tailwind.config.js\n';
    text += 'module.exports = {\n';
    text += '  theme: {\n';
    text += '    extend: {\n';
    text += '      colors: {\n';
    text += "        primary: {\n";
    shades.forEach(s => {
      text += `          ${s.name}: '${s.hex}',\n`;
    });
    text += '        },\n';
    text += '      },\n';
    text += '    },\n';
    text += '  },\n';
    text += '};\n';
  } else if (format === 'scss') {
    shades.forEach(s => {
      text += `$color-primary-${s.name}: ${s.hex};\n`;
    });
  } else if (format === 'json') {
    const obj = {};
    shades.forEach(s => {
      obj[s.name] = s.hex;
    });
    text = JSON.stringify({ primary: obj }, null, 2);
  }

  exportBox.value = text;
}

// ===== Build Details =====
function buildDetails(baseHex, shades, harmonies) {
  if (!detailsContent) return;

  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  let html = '';

  // Section 1: Base Color Info
  html += '<div class="detail-section">';
  html += '<h4>🎨 Base Color</h4>';
  html += `<div class="detail-row"><span class="detail-label">HEX</span><span class="detail-value">${baseHex}</span></div>`;
  html += `<div class="detail-row"><span class="detail-label">RGB</span><span class="detail-value">rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</span></div>`;
  html += `<div class="detail-row"><span class="detail-label">HSL</span><span class="detail-value">hsl(${hsl.h.toFixed(0)}, ${hsl.s.toFixed(0)}%, ${hsl.l.toFixed(0)}%)</span></div>`;
  html += '</div>';

  // Section 2: How shades were made
  html += '<div class="detail-section">';
  html += '<h4>📐 How Shade Scale Works</h4>';
  html += '<ul class="step-list">';
  html += '<li>Base hue fixed, lightness changed step by step</li>';
  html += '<li>50 = lightest (97% lightness), 950 = darkest (10%)</li>';
  html += '<li>Saturation slightly increased for darker shades</li>';
  html += '<li>Each shade is a valid CSS color — copy and use</li>';
  html += '</ul>';
  html += '</div>';

  // Section 3: Shade breakdown
  html += '<div class="detail-section">';
  html += '<h4>🎚️ Shade Breakdown</h4>';
  shades.forEach(s => {
    const sRgb = hexToRgb(s.hex);
    const sHsl = rgbToHsl(sRgb.r, sRgb.g, sRgb.b);
    html += `<div class="detail-row"><span class="detail-label">${s.name}</span><span class="detail-value">${s.hex} · L:${sHsl.l.toFixed(0)}%</span></div>`;
  });
  html += '</div>';

  // Section 4: Harmony explanation
  html += '<div class="detail-section">';
  html += '<h4>🌈 Harmony Explained</h4>';
  html += '<ul class="step-list">';
  html += '<li><strong>Complementary</strong>: base hue + 180° (opposite on wheel)</li>';
  html += '<li><strong>Analogous</strong>: base hue + 30° (neighbor)</li>';
  html += '<li><strong>Triadic</strong>: base hue + 120° (equidistant)</li>';
  html += '<li><strong>Monochromatic</strong>: same hue, different lightness</li>';
  html += '</ul>';
  html += '</div>';

  detailsContent.innerHTML = html;
}

// ===== Main Process =====
function process(hex) {
  if (!isValidHex(hex)) {
    setStatus('error', '❌', 'Invalid hex color. Use format like #3b82f6');
    return;
  }

  hex = normalizeHex(hex);
  currentColor = hex;

  // Update inputs
  hexInput.value = hex;
  colorPicker.value = hex;

  // Update active swatch
  document.querySelectorAll('.swatch').forEach(sw => {
    if (sw.dataset.color.toLowerCase() === hex) sw.classList.add('active');
    else sw.classList.remove('active');
  });

  // Generate
  const shades = generateShadeScale(hex);
  const harmonies = generateHarmonies(hex);

  currentPalette = { base: hex, shades, harmonies };

  // Render
  renderShadeScale(shades);
  renderHarmony(harmonies);
  renderContrast(hex);
  renderExport(shades, currentExportFormat);
  buildDetails(hex, shades, harmonies);

  setStatus('success', '✅', 'Palette generated from ' + hex);
}

// ===== Status =====
function setStatus(type, icon, text) {
  if (!statusBar) return;
  statusBar.className = 'status-bar';
  if (type === 'success') statusBar.classList.add('success');
  else if (type === 'error') statusBar.classList.add('error');

  statusBar.querySelector('.status-icon').textContent = icon;
  statusBar.querySelector('.status-text').textContent = text;
}

// ===== Input Events =====
hexInput.addEventListener('input', () => {
  const val = hexInput.value.trim();
  if (val.length > 0) clearBtn.classList.add('show');
  else clearBtn.classList.remove('show');

  if (isValidHex(val)) {
    process(val);
  }
});

colorPicker.addEventListener('input', () => {
  process(colorPicker.value);
});

// Clear
clearBtn.addEventListener('click', () => {
  hexInput.value = '';
  clearBtn.classList.remove('show');
  hexInput.focus();
});

// Random
randomBtn.addEventListener('click', () => {
  const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  process(randomHex);
});

// Swatches
swatchGrid.querySelectorAll('.swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    process(sw.dataset.color);
  });
});

// Export tabs
exportTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    exportTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentExportFormat = tab.dataset.format;
    if (currentPalette) {
      renderExport(currentPalette.shades, currentExportFormat);
    }
  });
});

// Copy Export
copyExportBtn.addEventListener('click', () => {
  if (!exportBox.value) return;
  navigator.clipboard.writeText(exportBox.value).then(() => {
    const original = copyExportBtn.textContent;
    copyExportBtn.textContent = '✓ Copied';
    copyExportBtn.classList.add('copied');
    setTimeout(() => {
      copyExportBtn.textContent = original;
      copyExportBtn.classList.remove('copied');
    }, 1200);
  });
});

// Copy All (all export formats together)
copyAllBtn.addEventListener('click', () => {
  if (!currentPalette) return;

  const shades = currentPalette.shades;
  let text = '';

  text += '/* CSS Variables */\n:root {\n';
  shades.forEach(s => { text += `  --color-primary-${s.name}: ${s.hex};\n`; });
  text += '}\n\n';

  text += '/* Tailwind Config */\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: {\n';
  shades.forEach(s => { text += `          ${s.name}: '${s.hex}',\n`; });
  text += '        }\n      }\n    }\n  }\n};\n\n';

  text += '/* SCSS Variables */\n';
  shades.forEach(s => { text += `$color-primary-${s.name}: ${s.hex};\n`; });

  navigator.clipboard.writeText(text).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied All';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1200);
  });
});

// Download
downloadBtn.addEventListener('click', () => {
  if (!currentPalette) return;

  const shades = currentPalette.shades;
  let text = `/* Palette generated from ${currentPalette.base} */\n\n`;

  text += ':root {\n';
  shades.forEach(s => { text += `  --color-primary-${s.name}: ${s.hex};\n`; });
  text += '}\n\n';

  text += '/* Full Shade Scale */\n';
  shades.forEach(s => { text += `${s.name}: ${s.hex}\n`; });

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'palette-' + currentPalette.base.replace('#', '') + '.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Details Toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Theme Toggle
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

// ===== Init =====
process('#3b82f6');