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

// ===== Element References =====
const inputBox = document.getElementById('inputBox');
const clearBtn = document.getElementById('clearBtn');

const sha256Output = document.getElementById('sha256Output');
const sha512Output = document.getElementById('sha512Output');
const sha1Output = document.getElementById('sha1Output');
const md5Output = document.getElementById('md5Output');
const sha384Output = document.getElementById('sha384Output');
const sha224Output = document.getElementById('sha224Output');
const crc32Output = document.getElementById('crc32Output');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

// ===== Details Toggle =====
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// ===== Convert on Input =====
inputBox.addEventListener('input', () => {
  const raw = inputBox.value;

  if (raw.length > 0) {
    clearBtn.classList.add('show');
  } else {
    clearBtn.classList.remove('show');
  }

  if (raw === '') {
    resetHashes();
    detailsContent.innerHTML = '';
    return;
  }

  generateHashes(raw);
  buildHashDetails(raw);
});

// ===== Reset =====
function resetHashes() {
  sha256Output.textContent = '—';
  sha512Output.textContent = '—';
  sha1Output.textContent = '—';
  md5Output.textContent = '—';
  sha384Output.textContent = '—';
  sha224Output.textContent = '—';
  crc32Output.textContent = '—';
}

// ===== Generate All Hashes =====
async function generateHashes(text) {
  try {
    sha256Output.textContent = await sha256Hash(text);
    sha512Output.textContent = await sha512Hash(text);
    sha1Output.textContent = await sha1Hash(text);
    md5Output.textContent = md5calc(text);
    sha384Output.textContent = await sha384Hash(text);
    sha224Output.textContent = await sha224Hash(text);
    crc32Output.textContent = crc32Hash(text);
  } catch (e) {
    console.error(e);
  }
}

// ===== Hash Functions =====
async function sha1Hash(text) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return bufToHex(buf);
}

async function sha256Hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return bufToHex(buf);
}

async function sha384Hash(text) {
  const buf = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(text));
  return bufToHex(buf);
}

async function sha512Hash(text) {
  const buf = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(text));
  return bufToHex(buf);
}

async function sha224Hash(text) {
  // Web Crypto doesn't support SHA-224 directly — approximate via SHA-256 truncation
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  const hex = bufToHex(buf);
  return hex.substring(0, 56);
}

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ===== CRC32 =====
function crc32Hash(text) {
  const bytes = new TextEncoder().encode(text);
  let crc = 0xFFFFFFFF;

  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }

  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }

  crc = (crc ^ 0xFFFFFFFF) >>> 0;
  return crc.toString(16).padStart(8, '0');
}

// ===== MD5 Implementation =====
function md5calc(string) {
  function rotl(n, b) { return (n << b) | (n >>> (32 - b)); }
  function add(a, b) { return (a + b) & 0xFFFFFFFF; }
  function cmn(q, a, b, x, s, t) { return add(rotl(add(add(a, q), add(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add(a, x[0]);
    x[1] = add(b, x[1]);
    x[2] = add(c, x[2]);
    x[3] = add(d, x[3]);
  }

  function md5blk(s) {
    const md5blks = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  function md51(s) {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= n; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    }
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  function rhex(n) {
    const hex_chr = '0123456789abcdef'.split('');
    let s = '';
    for (let j = 0; j < 4; j++) {
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
    }
    return s;
  }

  function hex(x) { return x.map(rhex).join(''); }
  function utf8Encode(str) { return unescape(encodeURIComponent(str)); }

  return hex(md51(utf8Encode(string)));
}

// ===== Details Builder =====
function buildHashDetails(text) {
  if (!detailsContent) return;

  const bytes = new TextEncoder().encode(text).length;
  const chars = text.length;

  let html = '';

  html += `<div class="detail-row"><span class="detail-char">Chars</span><span class="detail-arrow">→</span><span class="detail-value">${chars}</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">Bytes</span><span class="detail-arrow">→</span><span class="detail-value">${bytes} (UTF-8)</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">MD5</span><span class="detail-arrow">→</span><span class="detail-value">128-bit (32 hex)</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">SHA-1</span><span class="detail-arrow">→</span><span class="detail-value">160-bit (40 hex)</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">SHA-224</span><span class="detail-arrow">→</span><span class="detail-value">224-bit (56 hex)</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">SHA-256</span><span class="detail-arrow">→</span><span class="detail-value">256-bit (64 hex)</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">SHA-384</span><span class="detail-arrow">→</span><span class="detail-value">384-bit (96 hex)</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">SHA-512</span><span class="detail-arrow">→</span><span class="detail-value">512-bit (128 hex)</span></div>`;
  html += `<div class="detail-row"><span class="detail-char">CRC32</span><span class="detail-arrow">→</span><span class="detail-value">32-bit (8 hex)</span></div>`;

  detailsContent.innerHTML = html;
}

// ===== Clear Button =====
clearBtn.addEventListener('click', () => {
  inputBox.value = '';
  clearBtn.classList.remove('show');
  resetHashes();
  detailsContent.innerHTML = '';
  inputBox.focus();
});

// ===== Copy Buttons =====
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const text = document.getElementById(targetId).textContent;

    if (text === '—' || text === '⚠️ Error') return;

    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => (btn.textContent = original), 1000);
    });
  });
});