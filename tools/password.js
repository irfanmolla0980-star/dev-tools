// Navbar toggle
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
const presetButtons = document.querySelectorAll('.preset-btn');
const modeTabs = document.querySelectorAll('.mode-tab');
const randomPanel = document.getElementById('randomPanel');
const passphrasePanel = document.getElementById('passphrasePanel');
const pinPanel = document.getElementById('pinPanel');

const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');

const wordSlider = document.getElementById('wordSlider');
const wordValue = document.getElementById('wordValue');

const pinSlider = document.getElementById('pinSlider');
const pinValue = document.getElementById('pinValue');

const typeUpper = document.getElementById('typeUpper');
const typeLower = document.getElementById('typeLower');
const typeNumber = document.getElementById('typeNumber');
const typeSymbol = document.getElementById('typeSymbol');

const optExcludeSimilar = document.getElementById('optExcludeSimilar');
const optExcludeAmbiguous = document.getElementById('optExcludeAmbiguous');
const optNoRepeat = document.getElementById('optNoRepeat');
const optMustInclude = document.getElementById('optMustInclude');
const optStartLetter = document.getElementById('optStartLetter');

const optCapWords = document.getElementById('optCapWords');
const optAddNumber = document.getElementById('optAddNumber');

const optNoRepeatPin = document.getElementById('optNoRepeatPin');

const separatorButtons = document.querySelectorAll('.sep-btn');
const qtyButtons = document.querySelectorAll('.qty-btn');

const generateBtn = document.getElementById('generateBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const downloadBtn = document.getElementById('downloadBtn');

const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const outputList = document.getElementById('outputList');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// State
let currentMode = 'random';
let currentSeparator = '-';
let currentQty = 1;
let currentPasswords = [];

// Word list for passphrase
const WORDS = [
  'apple', 'tiger', 'river', 'cloud', 'stone', 'flame', 'ocean', 'forest',
  'silver', 'golden', 'thunder', 'shadow', 'falcon', 'dragon', 'phoenix',
  'crystal', 'amber', 'violet', 'cosmic', 'lunar', 'solar', 'storm',
  'winter', 'summer', 'autumn', 'spring', 'mountain', 'valley', 'desert',
  'island', 'garden', 'meadow', 'canyon', 'glacier', 'volcano', 'meteor',
  'planet', 'galaxy', 'nebula', 'comet', 'rocket', 'engine', 'circuit',
  'signal', 'network', 'server', 'client', 'system', 'module', 'widget',
  'button', 'pixel', 'vector', 'matrix', 'buffer', 'memory', 'kernel',
  'basket', 'bottle', 'candle', 'coffee', 'guitar', 'violin', 'piano',
  'purple', 'orange', 'yellow', 'crimson', 'azure', 'jade', 'coral',
  'swift', 'brave', 'clever', 'gentle', 'happy', 'lucky', 'mighty',
  'noble', 'quick', 'royal', 'smart', 'witty', 'young', 'bright'
];

// Character sets
const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const SIMILAR_CHARS = 'lI1O0';
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

// Random integer
function randomInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

// Random item from array
function randomFrom(arr) {
  return arr[randomInt(arr.length)];
}

// Get selected charset
function getCharset() {
  let charset = '';

  if (typeUpper.checked) charset += CHARS.upper;
  if (typeLower.checked) charset += CHARS.lower;
  if (typeNumber.checked) charset += CHARS.number;
  if (typeSymbol.checked) charset += CHARS.symbol;

  if (optExcludeSimilar.checked) {
    charset = charset.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
  }

  if (optExcludeAmbiguous.checked) {
    charset = charset.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
  }

  return charset;
}

// Generate random password
function generateRandomPassword() {
  const length = parseInt(lengthSlider.value);
  const charset = getCharset();

  if (!charset) return '⚠️ Select at least one type';

  let password = '';
  let attempts = 0;
  const maxAttempts = 200;

  while (password.length < length && attempts < maxAttempts) {
    attempts++;

    // Collect required types
    const required = [];
    if (optMustInclude.checked) {
      if (typeUpper.checked) required.push(CHARS.upper);
      if (typeLower.checked) required.push(CHARS.lower);
      if (typeNumber.checked) required.push(CHARS.number);
      if (typeSymbol.checked) required.push(CHARS.symbol);
    }

    password = '';

    // First char must be letter if option checked
    if (optStartLetter.checked) {
      const letters = (typeUpper.checked ? CHARS.upper : '') + (typeLower.checked ? CHARS.lower : '');
      const filtered = optExcludeSimilar.checked
        ? letters.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('')
        : letters;
      if (filtered) {
        password += randomFrom(filtered);
      }
    }

    // Add required types
    required.forEach(set => {
      let filtered = set;
      if (optExcludeSimilar.checked) {
        filtered = filtered.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
      }
      if (optExcludeAmbiguous.checked) {
        filtered = filtered.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
      }
      if (filtered) {
        password += randomFrom(filtered);
      }
    });

    // Fill the rest
    while (password.length < length) {
      const c = randomFrom(charset);
      if (optNoRepeat.checked && password.includes(c)) {
        continue;
      }
      password += c;
    }

    // Shuffle (except first if startLetter)
    if (password.length > 1) {
      const first = optStartLetter.checked ? password[0] : '';
      const rest = password.split('');
      if (optStartLetter.checked) rest.shift();

      for (let i = rest.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }

      password = optStartLetter.checked ? first + rest.join('') : rest.join('');
    }

    // Validate no repeat
    if (optNoRepeat.checked) {
      const unique = new Set(password);
      if (unique.size < password.length) {
        password = '';
        continue;
      }
    }

    break;
  }

  return password || '⚠️ Could not generate';
}

// Generate passphrase
function generatePassphrase() {
  const wordCount = parseInt(wordSlider.value);
  const words = [];

  for (let i = 0; i < wordCount; i++) {
    let word = randomFrom(WORDS);
    if (optCapWords.checked) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }

  let result = words.join(currentSeparator);

  if (optAddNumber.checked) {
    result += randomInt(100);
  }

  return result;
}

// Generate PIN
function generatePIN() {
  const length = parseInt(pinSlider.value);
  let pin = '';
  let attempts = 0;

  while (pin.length < length && attempts < 100) {
    attempts++;
    pin = '';

    for (let i = 0; i < length; i++) {
      let digit;
      let tries = 0;
      do {
        digit = String(randomInt(10));
        tries++;
      } while (optNoRepeatPin.checked && pin.includes(digit) && tries < 20);
      pin += digit;
    }

    break;
  }

  return pin;
}

// Calculate entropy
function calculateEntropy(password) {
  let charsetSize = 0;

  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  if (charsetSize === 0) charsetSize = 1;

  const entropy = password.length * Math.log2(charsetSize);
  return Math.round(entropy);
}

// Get strength from entropy
function getStrength(entropy) {
  if (entropy < 40) return { level: 'weak', text: 'Weak', color: '#ff2244' };
  if (entropy < 60) return { level: 'fair', text: 'Fair', color: '#ff8833' };
  if (entropy < 80) return { level: 'good', text: 'Good', color: '#ffcc33' };
  if (entropy < 100) return { level: 'strong', text: 'Strong', color: '#66ff99' };
  return { level: 'very-strong', text: 'Very Strong', color: '#00ffaa' };
}

// Estimate crack time
function estimateCrackTime(entropy) {
  // Assuming 10 billion guesses per second (modern GPU)
  const guessesPerSecond = 1e10;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond / 2; // average

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 3.154e10) return `${Math.round(seconds / 31536000)} years`;

  const years = seconds / 31536000;
  if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
  return `Trillions of years`;
}

// Update strength meter
function updateStrength(password) {
  if (!password || password.startsWith('⚠️')) {
    strengthBar.className = 'strength-bar';
    strengthText.textContent = '—';
    return;
  }

  const entropy = calculateEntropy(password);
  const strength = getStrength(entropy);

  strengthBar.className = 'strength-bar ' + strength.level;
  strengthText.textContent = strength.text + ' — ' + entropy + ' bits';
  strengthText.style.color = strength.color;
}

// Render output
function renderPasswords(passwords) {
  currentPasswords = passwords;

  if (passwords.length === 0) {
    outputList.innerHTML = '<p class="output-placeholder">Click <strong>Generate Password</strong> to create secure passwords.</p>';
    updateStrength('');
    detailsContent.innerHTML = '<p class="no-details">Generate passwords first to see details.</p>';
    return;
  }

  let html = '';
  passwords.forEach((pw, index) => {
    html += `
      <div class="password-item">
        <span class="password-text" data-index="${index}">${escapeHTML(pw)}</span>
        <button class="password-copy" data-index="${index}" type="button">⧉</button>
      </div>
    `;
  });

  outputList.innerHTML = html;

  // Attach copy listeners
  outputList.querySelectorAll('.password-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      navigator.clipboard.writeText(passwords[index]).then(() => {
        btn.textContent = '✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '⧉';
          btn.classList.remove('copied');
        }, 1000);
      });
    });
  });

  outputList.querySelectorAll('.password-text').forEach(el => {
    el.addEventListener('click', () => {
      const index = parseInt(el.dataset.index);
      navigator.clipboard.writeText(passwords[index]).then(() => {
        const original = el.textContent;
        el.textContent = '✓ Copied!';
        setTimeout(() => (el.textContent = original), 900);
      });
    });
  });

  // Update strength based on first password
  updateStrength(passwords[0]);

  // Build details
  buildDetails(passwords[0]);
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Build details
function buildDetails(password) {
  if (!detailsContent) return;

  if (!password || password.startsWith('⚠️')) {
    detailsContent.innerHTML = '<p class="no-details">Generate passwords first to see details.</p>';
    return;
  }

  const entropy = calculateEntropy(password);
  const strength = getStrength(entropy);
  const crackTime = estimateCrackTime(entropy);

  const upperCount = (password.match(/[A-Z]/g) || []).length;
  const lowerCount = (password.match(/[a-z]/g) || []).length;
  const digitCount = (password.match(/[0-9]/g) || []).length;
  const symbolCount = (password.match(/[^A-Za-z0-9]/g) || []).length;

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">Mode</span><span class="detail-arrow">→</span><span class="detail-value">${currentMode}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Length</span><span class="detail-arrow">→</span><span class="detail-value">${password.length}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Uppercase</span><span class="detail-arrow">→</span><span class="detail-value">${upperCount}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Lowercase</span><span class="detail-arrow">→</span><span class="detail-value">${lowerCount}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Digits</span><span class="detail-arrow">→</span><span class="detail-value">${digitCount}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Symbols</span><span class="detail-arrow">→</span><span class="detail-value">${symbolCount}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Entropy</span><span class="detail-arrow">→</span><span class="detail-value">${entropy} bits</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Crack time</span><span class="detail-arrow">→</span><span class="detail-value">${crackTime}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Quantity</span><span class="detail-arrow">→</span><span class="detail-value">${currentPasswords.length}</span></div>`;

  html += `<div class="strength-line" style="color:${strength.color};">Strength: ${strength.text}</div>`;

  detailsContent.innerHTML = html;
}

// Preset configurations
const PRESETS = {
  email: {
    mode: 'random',
    length: 16,
    upper: true, lower: true, number: true, symbol: false,
    excludeSimilar: true, excludeAmbiguous: true,
    mustInclude: true, startLetter: true
  },
  website: {
    mode: 'random',
    length: 20,
    upper: true, lower: true, number: true, symbol: true,
    excludeSimilar: false, excludeAmbiguous: false,
    mustInclude: true, startLetter: false
  },
  wifi: {
    mode: 'random',
    length: 24,
    upper: true, lower: true, number: true, symbol: true,
    excludeSimilar: true, excludeAmbiguous: true,
    mustInclude: true, startLetter: false
  },
  banking: {
    mode: 'random',
    length: 32,
    upper: true, lower: true, number: true, symbol: true,
    excludeSimilar: false, excludeAmbiguous: false,
    mustInclude: true, startLetter: false
  },
  gaming: {
    mode: 'random',
    length: 12,
    upper: true, lower: true, number: true, symbol: false,
    excludeSimilar: true, excludeAmbiguous: true,
    mustInclude: true, startLetter: true
  },
  maximum: {
    mode: 'random',
    length: 64,
    upper: true, lower: true, number: true, symbol: true,
    excludeSimilar: false, excludeAmbiguous: false,
    mustInclude: true, startLetter: false
  },
  pin: {
    mode: 'pin',
    pinLength: 6,
    noRepeatPin: false
  },
  passphrase: {
    mode: 'passphrase',
    wordCount: 4,
    capWords: true,
    separator: '-',
    addNumber: false
  }
};

// Apply preset
function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;

  // Highlight active preset
  presetButtons.forEach(btn => {
    if (btn.dataset.preset === name) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Set mode
  setMode(preset.mode);

  if (preset.mode === 'random') {
    lengthSlider.value = preset.length;
    lengthValue.textContent = preset.length;
    typeUpper.checked = preset.upper;
    typeLower.checked = preset.lower;
    typeNumber.checked = preset.number;
    typeSymbol.checked = preset.symbol;
    optExcludeSimilar.checked = preset.excludeSimilar;
    optExcludeAmbiguous.checked = preset.excludeAmbiguous;
    optMustInclude.checked = preset.mustInclude;
    optStartLetter.checked = preset.startLetter;
    optNoRepeat.checked = false;
  } else if (preset.mode === 'pin') {
    pinSlider.value = preset.pinLength;
    pinValue.textContent = preset.pinLength;
    optNoRepeatPin.checked = preset.noRepeatPin;
  } else if (preset.mode === 'passphrase') {
    wordSlider.value = preset.wordCount;
    wordValue.textContent = preset.wordCount;
    optCapWords.checked = preset.capWords;
    optAddNumber.checked = preset.addNumber;
    currentSeparator = preset.separator;
    separatorButtons.forEach(btn => {
      if (btn.dataset.sep === preset.separator) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  // Generate
  generate();
}

// Set mode
function setMode(mode) {
  currentMode = mode;

  modeTabs.forEach(tab => {
    if (tab.dataset.mode === mode) tab.classList.add('active');
    else tab.classList.remove('active');
  });

  randomPanel.classList.remove('active');
  passphrasePanel.classList.remove('active');
  pinPanel.classList.remove('active');

  if (mode === 'random') randomPanel.classList.add('active');
  else if (mode === 'passphrase') passphrasePanel.classList.add('active');
  else if (mode === 'pin') pinPanel.classList.add('active');
}

// Generate passwords
function generate() {
  const passwords = [];

  for (let i = 0; i < currentQty; i++) {
    if (currentMode === 'random') {
      passwords.push(generateRandomPassword());
    } else if (currentMode === 'passphrase') {
      passwords.push(generatePassphrase());
    } else if (currentMode === 'pin') {
      passwords.push(generatePIN());
    }
  }

  renderPasswords(passwords);
}

// Event listeners

presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    applyPreset(btn.dataset.preset);
  });
});

modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove preset active state when user manually changes mode
    presetButtons.forEach(b => b.classList.remove('active'));
    setMode(tab.dataset.mode);
  });
});

lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
});

wordSlider.addEventListener('input', () => {
  wordValue.textContent = wordSlider.value;
});

pinSlider.addEventListener('input', () => {
  pinValue.textContent = pinSlider.value;
});

separatorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    separatorButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSeparator = btn.dataset.sep;
  });
});

qtyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    qtyButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentQty = parseInt(btn.dataset.qty);
  });
});

generateBtn.addEventListener('click', generate);

// Copy all

copyAllBtn.addEventListener('click', () => {
  if (currentPasswords.length === 0) return;

  navigator.clipboard.writeText(currentPasswords.join('\n')).then(() => {
    const original = copyAllBtn.textContent;
    copyAllBtn.textContent = '✓ Copied All';
    copyAllBtn.classList.add('copied');
    setTimeout(() => {
      copyAllBtn.textContent = original;
      copyAllBtn.classList.remove('copied');
    }, 1400);
  });
});

// Download
downloadBtn.addEventListener('click', () => {
  if (currentPasswords.length === 0) return;

  const blob = new Blob([currentPasswords.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'passwords.txt';
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

// Init
generate();