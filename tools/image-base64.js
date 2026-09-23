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
const modeTabs = document.querySelectorAll('.mode-tab');
const panelImg2b64 = document.getElementById('panel-img2b64');
const panelB642img = document.getElementById('panel-b642img');

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const pasteBtn = document.getElementById('pasteBtn');
const clearImgBtn = document.getElementById('clearImgBtn');

const imageInfo = document.getElementById('imageInfo');
const imgPreview = document.getElementById('imgPreview');
const infoName = document.getElementById('infoName');
const infoType = document.getElementById('infoType');
const infoOrigSize = document.getElementById('infoOrigSize');
const infoDimensions = document.getElementById('infoDimensions');
const infoB64Size = document.getElementById('infoB64Size');
const infoIncrease = document.getElementById('infoIncrease');

const convertFormat = document.getElementById('convertFormat');
const qualitySelect = document.getElementById('qualitySelect');
const resizeCheck = document.getElementById('resizeCheck');
const resizeRow = document.getElementById('resizeRow');
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const keepRatio = document.getElementById('keepRatio');

const formatTabs = document.querySelectorAll('.format-tab');
const outputBox = document.getElementById('outputBox');
const copyBtn = document.getElementById('copyBtn');
const downloadTxtBtn = document.getElementById('downloadTxtBtn');
const downloadImgBtn = document.getElementById('downloadImgBtn');

const b64Input = document.getElementById('b64Input');
const pasteB64Btn = document.getElementById('pasteB64Btn');
const convertBtn = document.getElementById('convertBtn');
const clearB64Btn = document.getElementById('clearB64Btn');
const b64Status = document.getElementById('b64Status');
const b64Preview = document.getElementById('b64Preview');
const downloadDecodedBtn = document.getElementById('downloadDecodedBtn');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// State
let currentMode = 'img2b64';
let currentFormat = 'raw';
let currentImageData = null; // { file, dataUrl, width, height, type }
let currentB64 = '';
let currentDecodedImage = null;
let lastImageInfo = null;

// Mode tabs
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    modeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentMode = tab.dataset.mode;

    if (currentMode === 'img2b64') {
      panelImg2b64.classList.add('active');
      panelB642img.classList.remove('active');
    } else {
      panelImg2b64.classList.remove('active');
      panelB642img.classList.add('active');
    }
  });
});

// Format tabs
formatTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    formatTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFormat = tab.dataset.format;
    updateOutput();
  });
});

// Drop zone click
dropZone.addEventListener('click', () => fileInput.click());

// File input change
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadImageFile(file);
});

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    loadImageFile(file);
  }
});

// Paste image
pasteBtn.addEventListener('click', async () => {
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const file = new File([blob], 'pasted-image.' + type.split('/')[1], { type });
          loadImageFile(file);
          return;
        }
      }
    }
    alert('No image found in clipboard.');
  } catch (err) {
    alert('Clipboard access denied. Try Ctrl+V on the page.');
  }
});

// Global paste
document.addEventListener('paste', (e) => {
  const items = e.clipboardData.items;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        loadImageFile(file);
        return;
      }
    }
  }
});

// Load image file
function loadImageFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;

    const img = new Image();
    img.onload = () => {
      currentImageData = {
        file: file,
        dataUrl: dataUrl,
        width: img.width,
        height: img.height,
        type: file.type,
        name: file.name,
        size: file.size
      };

      showImageInfo(currentImageData);
      processImage();
    };
    img.src = dataUrl;
  };
  reader.readAsDataURL(file);
}

// Show image info
function showImageInfo(data) {
  imageInfo.style.display = 'grid';
  imgPreview.src = data.dataUrl;

  infoName.textContent = data.name || 'image';
  infoType.textContent = data.type || '—';
  infoOrigSize.textContent = formatBytes(data.size);
  infoDimensions.textContent = data.width + ' × ' + data.height + ' px';
  infoB64Size.textContent = '—';
  infoIncrease.textContent = '—';
}

// Process image (resize, format, quality)
function processImage() {
  if (!currentImageData) return;

  const img = new Image();
  img.onload = () => {
    let w = img.width;
    let h = img.height;

    // Resize
    if (resizeCheck.checked) {
      const nw = parseInt(resizeWidth.value) || w;
      const nh = parseInt(resizeHeight.value) || h;

      if (keepRatio.checked) {
        const ratio = Math.min(nw / w, nh / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      } else {
        w = nw;
        h = nh;
      }
    }

    // Canvas
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);

    // Format
    let mimeType = currentImageData.type;
    if (convertFormat.value !== 'original') {
      mimeType = 'image/' + convertFormat.value;
    }

    const quality = parseFloat(qualitySelect.value);

    let dataUrl;
    if (mimeType === 'image/png') {
      dataUrl = canvas.toDataURL('image/png');
    } else if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
      dataUrl = canvas.toDataURL(mimeType, quality);
    } else {
      dataUrl = canvas.toDataURL();
    }

    currentImageData.dataUrl = dataUrl;
    currentImageData.width = w;
    currentImageData.height = h;
    currentImageData.type = mimeType;
    currentImageData.b64 = dataUrl.split(',')[1];

    // Update info
    const b64Size = currentImageData.b64.length;
    const origSize = currentImageData.size || b64Size;
    const increase = origSize > 0 ? Math.round(((b64Size - origSize) / origSize) * 100) : 0;

    infoDimensions.textContent = w + ' × ' + h + ' px';
    infoB64Size.textContent = formatBytes(b64Size) + ' (' + b64Size.toLocaleString() + ' chars)';
    infoIncrease.textContent = (increase > 0 ? '+' : '') + increase + '%';

    imgPreview.src = dataUrl;

    updateOutput();
  };
  img.src = currentImageData.dataUrl;
}

// Update output
function updateOutput() {
  if (!currentImageData || !currentImageData.b64) {
    outputBox.innerHTML = '<p class="output-placeholder">Base64 code will appear here...</p>';
    return;
  }

  const dataUrl = currentImageData.dataUrl;
  const b64 = currentImageData.b64;
  const mime = currentImageData.type;
  const name = currentImageData.name || 'image';

  let output = '';

  switch (currentFormat) {
    case 'raw':
      output = b64;
      break;
    case 'datauri':
      output = dataUrl;
      break;
    case 'css':
      output = `.image {\n  background-image: url('${dataUrl}');\n  background-size: cover;\n  background-position: center;\n}`;
      break;
    case 'html':
      output = `<img src="${dataUrl}" alt="${name}" />`;
      break;
    case 'htmlpic':
      output = `<picture>\n  <img src="${dataUrl}" alt="${name}" />\n</picture>`;
      break;
    case 'markdown':
      output = `![${name}](${dataUrl})`;
      break;
  }

  currentB64 = output;
  outputBox.textContent = output;

  // Save info for details
  lastImageInfo = {
    name: name,
    type: mime,
    width: currentImageData.width,
    height: currentImageData.height,
    b64Length: b64.length,
    origSize: currentImageData.size,
    format: currentFormat
  };

  buildDetails();
}

// Format bytes
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Resize toggle
resizeCheck.addEventListener('change', () => {
  if (resizeCheck.checked) {
    resizeRow.style.display = 'grid';
    if (currentImageData && !resizeWidth.value) {
      resizeWidth.value = currentImageData.width;
      resizeHeight.value = currentImageData.height;
    }
  } else {
    resizeRow.style.display = 'none';
  }
  if (currentImageData) processImage();
});

// Keep ratio
keepRatio.addEventListener('change', () => {
  if (currentImageData) processImage();
});

// Resize inputs
resizeWidth.addEventListener('input', () => {
  if (keepRatio.checked && currentImageData) {
    const w = parseInt(resizeWidth.value);
    if (w > 0) {
      const ratio = currentImageData.height / currentImageData.width;
      resizeHeight.value = Math.round(w * ratio);
    }
  }
});

resizeHeight.addEventListener('input', () => {
  if (keepRatio.checked && currentImageData) {
    const h = parseInt(resizeHeight.value);
    if (h > 0) {
      const ratio = currentImageData.width / currentImageData.height;
      resizeWidth.value = Math.round(h * ratio);
    }
  }
});

// Format & quality change
convertFormat.addEventListener('change', () => { if (currentImageData) processImage(); });
qualitySelect.addEventListener('change', () => { if (currentImageData) processImage(); });

// Clear image
clearImgBtn.addEventListener('click', () => {
  currentImageData = null;
  fileInput.value = '';
  imageInfo.style.display = 'none';
  outputBox.innerHTML = '<p class="output-placeholder">Base64 code will appear here...</p>';
  currentB64 = '';
  lastImageInfo = null;
  detailsContent.innerHTML = '<p class="no-details">Upload an image or paste Base64 to see details.</p>';
});

// Copy button
copyBtn.addEventListener('click', () => {
  if (!currentB64) return;
  navigator.clipboard.writeText(currentB64).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1200);
  });
});

// Download .txt
downloadTxtBtn.addEventListener('click', () => {
  if (!currentB64) return;
  const blob = new Blob([currentB64], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'image-base64.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Download image
downloadImgBtn.addEventListener('click', () => {
  if (!currentImageData || !currentImageData.dataUrl) return;
  const ext = currentImageData.type.split('/')[1] || 'png';
  const a = document.createElement('a');
  a.href = currentImageData.dataUrl;
  a.download = 'converted-image.' + ext;
  a.click();
});

// ============================================
// BASE64 → IMAGE MODE
// ============================================

// Paste text
pasteB64Btn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      b64Input.value = text.trim();
      handleB64Input();
    }
  } catch (err) {
    alert('Clipboard access denied.');
  }
});

// Convert button
convertBtn.addEventListener('click', () => handleB64Input());

// Input event (debounced)
let b64Timer = null;
b64Input.addEventListener('input', () => {
  clearTimeout(b64Timer);
  b64Timer = setTimeout(() => handleB64Input(), 500);
});

// Handle base64 input
function handleB64Input() {
  let raw = b64Input.value.trim();

  if (!raw) {
    b64Preview.innerHTML = `
      <div class="b64-placeholder">
        <span class="placeholder-icon">🔁</span>
        <p>Image will appear here</p>
      </div>
    `;
    currentDecodedImage = null;
    setB64Status('info', '🔁', 'Paste a Base64 string and click Convert');
    return;
  }

  // Strip data URI prefix if present
  let b64 = raw;
  let mimeType = 'image/png';

  if (raw.startsWith('data:')) {
    const match = raw.match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      b64 = match[2];
    } else {
      setB64Status('error', '✕', 'Invalid Data URI format');
      currentDecodedImage = null;
      return;
    }
  }

  // Validate base64
  if (!/^[A-Za-z0-9+/=\s]+$/.test(b64)) {
    setB64Status('error', '✕', 'Invalid Base64 characters');
    currentDecodedImage = null;
    return;
  }

  // Clean whitespace
  b64 = b64.replace(/\s/g, '');

  // Build data URL
  const dataUrl = 'data:' + mimeType + ';base64,' + b64;

  // Try loading
  const img = new Image();
  img.onload = () => {
    currentDecodedImage = {
      dataUrl: dataUrl,
      width: img.width,
      height: img.height,
      type: mimeType,
      b64: b64
    };

    b64Preview.innerHTML = '<img src="' + dataUrl + '" alt="decoded" />';
    setB64Status('success', '✓', 'Decoded successfully — ' + img.width + '×' + img.height + ' px, ' + formatBytes(b64.length));

    buildDetails();
  };
  img.onerror = () => {
    b64Preview.innerHTML = `
      <div class="b64-placeholder">
        <span class="placeholder-icon">⚠️</span>
        <p>Invalid Base64 — cannot decode as image</p>
      </div>
    `;
    setB64Status('error', '✕', 'Invalid Base64 or not an image');
    currentDecodedImage = null;
  };
  img.src = dataUrl;
}

// Status
function setB64Status(type, icon, text) {
  b64Status.className = 'status-bar';
  if (type === 'success') b64Status.classList.add('success');
  else if (type === 'error') b64Status.classList.add('error');

  b64Status.querySelector('.status-icon').textContent = icon;
  b64Status.querySelector('.status-text').textContent = text;
}

// Clear B64
clearB64Btn.addEventListener('click', () => {
  b64Input.value = '';
  b64Preview.innerHTML = `
    <div class="b64-placeholder">
      <span class="placeholder-icon">🔁</span>
      <p>Image will appear here</p>
    </div>
  `;
  currentDecodedImage = null;
  setB64Status('info', '🔁', 'Paste a Base64 string and click Convert');
});

// Download decoded image
downloadDecodedBtn.addEventListener('click', () => {
  if (!currentDecodedImage) {
    alert('Convert a Base64 string first.');
    return;
  }
  const ext = currentDecodedImage.type.split('/')[1] || 'png';
  const a = document.createElement('a');
  a.href = currentDecodedImage.dataUrl;
  a.download = 'decoded-image.' + ext;
  a.click();
});

// ============================================
// DETAILS
// ============================================

function buildDetails() {
  if (!detailsContent) return;

  let html = '';

  if (currentMode === 'img2b64' && lastImageInfo) {
    const info = lastImageInfo;
    html += `<div class="detail-row"><span class="detail-char">Mode</span><span class="detail-arrow">→</span><span class="detail-value">Image → Base64</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">File name</span><span class="detail-arrow">→</span><span class="detail-value">${escapeHTML(info.name)}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">${info.type}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Dimensions</span><span class="detail-arrow">→</span><span class="detail-value">${info.width} × ${info.height} px</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Original size</span><span class="detail-arrow">→</span><span class="detail-value">${formatBytes(info.origSize)}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Base64 length</span><span class="detail-arrow">→</span><span class="detail-value">${info.b64Length.toLocaleString()} chars</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Copy format</span><span class="detail-arrow">→</span><span class="detail-value">${info.format}</span></div>`;
  } else if (currentMode === 'b642img' && currentDecodedImage) {
    const info = currentDecodedImage;
    html += `<div class="detail-row"><span class="detail-char">Mode</span><span class="detail-arrow">→</span><span class="detail-value">Base64 → Image</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">${info.type}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Dimensions</span><span class="detail-arrow">→</span><span class="detail-value">${info.width} × ${info.height} px</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Base64 length</span><span class="detail-arrow">→</span><span class="detail-value">${info.b64.length.toLocaleString()} chars</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Decoded size</span><span class="detail-arrow">→</span><span class="detail-value">${formatBytes(info.b64.length)}</span></div>`;
  } else {
    html = '<p class="no-details">Upload an image or paste Base64 to see details.</p>';
  }

  detailsContent.innerHTML = html;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Details toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}