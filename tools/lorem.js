// Navbar toggle (mobile)
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

// Active link highlight
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) link.classList.add('active');
});

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Elements
const modeTabs = document.querySelectorAll('.mode-tab');
const generatePanel = document.getElementById('generatePanel');
const replacePanel = document.getElementById('replacePanel');

const typeButtons = document.querySelectorAll('.type-btn');
const sourceButtons = document.querySelectorAll('.source-btn');

const qtySlider = document.getElementById('qtySlider');
const qtyDisplay = document.getElementById('qtyDisplay');

const customWordsWrapper = document.getElementById('customWordsWrapper');
const customWords = document.getElementById('customWords');

const optStartLorem = document.getElementById('optStartLorem');
const optHtml = document.getElementById('optHtml');
const optUppercase = document.getElementById('optUppercase');
const optBullets = document.getElementById('optBullets');

const generateBtn = document.getElementById('generateBtn');
const regenerateBtn = document.getElementById('regenerateBtn');

const replaceInput = document.getElementById('replaceInput');
const clearBtn = document.getElementById('clearBtn');
const loremifyBtn = document.getElementById('loremifyBtn');
const unloremifyBtn = document.getElementById('unloremifyBtn');

const outputBox = document.getElementById('outputBox');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

const statWords = document.getElementById('statWords');
const statChars = document.getElementById('statChars');
const statSentences = document.getElementById('statSentences');
const statParagraphs = document.getElementById('statParagraphs');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// State
let currentMode = 'generate';
let currentType = 'paragraphs';
let currentSource = 'classic';
let currentText = '';
let originalText = '';

// Classic Lorem words
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'curabitur', 'pretium',
  'tincidunt', 'lacus', 'facilisi', 'cras', 'fermentum', 'odio', 'eu',
  'feugiat', 'viverra', 'nibh', 'pulvinar', 'mattis', 'nunc',
  'augue', 'vestibulum', 'arcu', 'euismod',
  'facilisis', 'etiam', 'orci', 'dapibus', 'ultrices',
  'posuere', 'cubilia', 'curae', 'donec', 'massa', 'sapien', 'faucibus',
  'molestie', 'ac', 'vitae', 'suscipit', 'tellus', 'mauris',
  'pellentesque', 'placerat', 'ultricies',
  'turpis', 'aliquet', 'risus'
];

// Classic start
const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

// Helpers
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getWordPool() {
  if (currentSource === 'custom') {
    const words = customWords.value
      .split(/[,،\s]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (words.length === 0) return LOREM_WORDS;
    return words;
  }
  return LOREM_WORDS;
}

function generateWord() {
  const pool = getWordPool();
  return randomFromArray(pool);
}

function generateSentence(wordCount) {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(generateWord());
  }
  let sentence = capitalize(words.join(' '));
  sentence += '.';
  return sentence;
}

function generateParagraph(sentenceCount) {
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    const wordCount = 8 + Math.floor(Math.random() * 8);
    sentences.push(generateSentence(wordCount));
  }
  return sentences.join(' ');
}

function generateText() {
  const qty = parseInt(qtySlider.value);
  let result = '';

  if (currentType === 'paragraphs') {
    const paragraphs = [];
    for (let i = 0; i < qty; i++) {
      const sentenceCount = 3 + Math.floor(Math.random() * 3);
      let para = generateParagraph(sentenceCount);

      if (i === 0 && optStartLorem.checked && currentSource === 'classic') {
        para = CLASSIC_START + ' ' + para;
      }
      paragraphs.push(para);
    }

    if (optHtml.checked) {
      result = paragraphs.map(p => `<p>${p}</p>`).join('\n');
    } else if (optBullets.checked) {
      result = paragraphs.map(p => `• ${p}`).join('\n\n');
    } else {
      result = paragraphs.join('\n\n');
    }

  } else if (currentType === 'sentences') {
    const sentences = [];
    for (let i = 0; i < qty; i++) {
      const wordCount = 8 + Math.floor(Math.random() * 8);
      sentences.push(generateSentence(wordCount));
    }

    if (optStartLorem.checked && currentSource === 'classic' && sentences.length > 0) {
      sentences[0] = CLASSIC_START;
    }

    if (optHtml.checked) {
      result = sentences.map(s => `<p>${s}</p>`).join('\n');
    } else if (optBullets.checked) {
      result = sentences.map(s => `• ${s}`).join('\n');
    } else {
      result = sentences.join(' ');
    }

  } else if (currentType === 'words') {
    const words = [];
    for (let i = 0; i < qty; i++) {
      words.push(generateWord());
    }
    result = words.join(' ');

  } else if (currentType === 'characters') {
    let chars = '';
    while (chars.length < qty) {
      chars += generateWord() + ' ';
    }
    result = chars.substring(0, qty);
  }

  if (optUppercase.checked) {
    result = result.toUpperCase();
  }

  return result;
}

function renderOutput(text) {
  if (!text || text.trim() === '') {
    outputBox.innerHTML = '<p class="output-placeholder">Your generated text will appear here...</p>';
    resetStats();
    currentText = '';
    detailsContent.innerHTML = '<p class="no-details">Generate text first to see details.</p>';
    return;
  }

  outputBox.textContent = text;
  currentText = text;
  updateStats(text);
  buildDetails(text);
}

function updateStats(text) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  statWords.textContent = words.toLocaleString();
  statChars.textContent = chars.toLocaleString();
  statSentences.textContent = sentences.toLocaleString();
  statParagraphs.textContent = paragraphs.toLocaleString();
}

function resetStats() {
  statWords.textContent = '0';
  statChars.textContent = '0';
  statSentences.textContent = '0';
  statParagraphs.textContent = '0';
}

function buildDetails(text) {
  if (!detailsContent) return;

  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">Mode</span><span class="detail-arrow">→</span><span class="detail-value">${currentMode === 'generate' ? 'Generate' : 'Replace'}</span></div>`;

  if (currentMode === 'generate') {
    html += `<div class="detail-row"><span class="detail-char">Type</span><span class="detail-arrow">→</span><span class="detail-value">${capitalize(currentType)}</span></div>`;
    html += `<div class="detail-row"><span class="detail-char">Source</span><span class="detail-arrow">→</span><span class="detail-value">${currentSource === 'classic' ? 'Classic Lorem' : 'Custom Words'}</span></div>`;
  }

  html += `<div class="detail-row"><span class="detail-char">Words</span><span class="detail-arrow">→</span><span class="detail-value">${words.toLocaleString()}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Characters</span><span class="detail-arrow">→</span><span class="detail-value">${chars.toLocaleString()}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Chars (no space)</span><span class="detail-arrow">→</span><span class="detail-value">${charsNoSpace.toLocaleString()}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Sentences</span><span class="detail-arrow">→</span><span class="detail-value">${sentences.toLocaleString()}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Paragraphs</span><span class="detail-arrow">→</span><span class="detail-value">${paragraphs.toLocaleString()}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Avg words/sentence</span><span class="detail-arrow">→</span><span class="detail-value">${avgWordsPerSentence}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Size</span><span class="detail-arrow">→</span><span class="detail-value">${formatBytes(new Blob([text]).size)}</span></div>`;

  detailsContent.innerHTML = html;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Mode tabs
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    modeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentMode = tab.dataset.mode;

    if (currentMode === 'generate') {
      generatePanel.classList.add('active');
      replacePanel.classList.remove('active');
    } else {
      generatePanel.classList.remove('active');
      replacePanel.classList.add('active');
    }

    renderOutput('');
  });
});

// Type buttons
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;

    if (currentType === 'paragraphs') {
      qtySlider.max = 20;
      if (parseInt(qtySlider.value) > 20) qtySlider.value = 20;
    } else if (currentType === 'sentences') {
      qtySlider.max = 50;
    } else if (currentType === 'words') {
      qtySlider.max = 200;
    } else if (currentType === 'characters') {
      qtySlider.max = 1000;
    }

    qtyDisplay.textContent = qtySlider.value;
  });
});

// Source buttons
sourceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sourceButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSource = btn.dataset.source;

    if (currentSource === 'custom') {
      customWordsWrapper.classList.add('show');
    } else {
      customWordsWrapper.classList.remove('show');
    }
  });
});

// Quantity slider
qtySlider.addEventListener('input', () => {
  qtyDisplay.textContent = qtySlider.value;
});

// Generate buttons
generateBtn.addEventListener('click', () => {
  const text = generateText();
  renderOutput(text);
});

regenerateBtn.addEventListener('click', () => {
  const text = generateText();
  renderOutput(text);
});

// Replace mode
replaceInput.addEventListener('input', () => {
  if (replaceInput.value.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }
});

clearBtn.addEventListener('click', () => {
  replaceInput.value = '';
  clearBtn.classList.remove('show');
  replaceInput.focus();
});

loremifyBtn.addEventListener('click', () => {
  const text = replaceInput.value.trim();
  if (!text) {
    renderOutput('');
    return;
  }

  originalText = text;
  const loremified = loremify(text);
  renderOutput(loremified);
});

unloremifyBtn.addEventListener('click', () => {
  if (!originalText) return;
  renderOutput(originalText);
});

// Loremify function
function loremify(text) {
  const tokens = text.split(/(\s+)/);
  const result = [];

  tokens.forEach(token => {
    if (/^\s+$/.test(token)) {
      result.push(token);
      return;
    }

    if (/^[.,!?;:()[\]{}'"-]+$/.test(token)) {
      result.push(token);
      return;
    }

    result.push(generateWord());
  });

  let output = result.join('');
  output = output.charAt(0).toUpperCase() + output.slice(1);
  return output;
}

// Copy button
copyBtn.addEventListener('click', () => {
  if (!currentText) return;

  navigator.clipboard.writeText(currentText).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 1200);
  });
});

// Download button
downloadBtn.addEventListener('click', () => {
  if (!currentText) return;

  const blob = new Blob([currentText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lorem-ipsum.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Details toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}