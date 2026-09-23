// Navbar
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
}

// Active link
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
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Elements
const editorInput = document.getElementById('editorInput');
const previewContent = document.getElementById('previewContent');
const splitView = document.getElementById('splitView');
const viewTabs = document.querySelectorAll('.view-tab');
const toolBtns = document.querySelectorAll('.tool-btn[data-action]');

const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');

const themeBtn = document.getElementById('themeBtn');
const cheatBtn = document.getElementById('cheatBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const moreBtn = document.getElementById('moreBtn');
const moreDropdown = document.getElementById('moreDropdown');

const optAutoSave = document.getElementById('optAutoSave');
const optScrollSync = document.getElementById('optScrollSync');
const optWordWrap = document.getElementById('optWordWrap');
const optLineNumbers = document.getElementById('optLineNumbers');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');

const findReplaceBtn = document.getElementById('findReplaceBtn');
const tocBtn = document.getElementById('tocBtn');
const emojiBtn = document.getElementById('emojiBtn');
const printBtn = document.getElementById('printBtn');
const richCopyBtn = document.getElementById('richCopyBtn');
const clearStorageBtn = document.getElementById('clearStorageBtn');

const headingToggle = document.getElementById('headingToggle');
const headingMenu = document.getElementById('headingMenu');
const headingDropdown = headingToggle.closest('.tool-dropdown');

const findPanel = document.getElementById('findPanel');
const findInput = document.getElementById('findInput');
const replaceInput = document.getElementById('replaceInput');
const findNextBtn = document.getElementById('findNextBtn');
const replaceOneBtn = document.getElementById('replaceOneBtn');
const replaceAllBtn = document.getElementById('replaceAllBtn');
const closeFindBtn = document.getElementById('closeFindBtn');

const emojiPicker = document.getElementById('emojiPicker');
const emojiGrid = document.getElementById('emojiGrid');

const statWords = document.getElementById('statWords');
const statChars = document.getElementById('statChars');
const statLines = document.getElementById('statLines');
const statTime = document.getElementById('statTime');
const statHeadings = document.getElementById('statHeadings');
const statLinks = document.getElementById('statLinks');
const statImages = document.getElementById('statImages');
const statCodeBlocks = document.getElementById('statCodeBlocks');

const copyHtmlBtn = document.getElementById('copyHtmlBtn');
const copyMdBtn = document.getElementById('copyMdBtn');
const downloadMdBtn = document.getElementById('downloadMdBtn');
const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
const copyRawBtn = document.getElementById('copyRawBtn');
const htmlOutput = document.getElementById('htmlOutput');

const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');

const cheatModal = document.getElementById('cheatModal');
const closeCheatBtn = document.getElementById('closeCheatBtn');
const tocModal = document.getElementById('tocModal');
const closeTocBtn = document.getElementById('closeTocBtn');
const tocBody = document.getElementById('tocBody');

// State
let currentHtml = '';
let currentMarkdown = '';
let currentFontSize = 14;
let findIndex = 0;

// Configure marked
if (window.marked) {
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  });
}

// View tabs
viewTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    viewTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const view = tab.dataset.view;
    splitView.classList.remove('editor-only', 'preview-only');
    if (view === 'editor') splitView.classList.add('editor-only');
    else if (view === 'preview') splitView.classList.add('preview-only');
  });
});

// Render markdown
function renderMarkdown() {
  const md = editorInput.value;
  currentMarkdown = md;

  if (!md.trim()) {
    previewContent.innerHTML = '<p class="preview-placeholder">Your Markdown preview will appear here...</p>';
    currentHtml = '';
    htmlOutput.innerHTML = '<p class="output-placeholder">HTML code will appear here...</p>';
    resetStats();
    detailsContent.innerHTML = '<p class="no-details">Start typing to see details.</p>';
    if (optAutoSave.checked) localStorage.setItem('md_draft', '');
    return;
  }

  try {
    const rawHtml = marked.parse(md);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    previewContent.innerHTML = cleanHtml;

    if (window.hljs) {
      previewContent.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }

    currentHtml = cleanHtml;
    htmlOutput.textContent = cleanHtml;

    updateStats(md, cleanHtml);
    buildDetails(md, cleanHtml);

    if (optAutoSave.checked) localStorage.setItem('md_draft', md);
  } catch (err) {
    previewContent.innerHTML = '<p class="preview-placeholder">⚠️ Error parsing Markdown.</p>';
    console.error(err);
  }
}

// Update stats
function updateStats(md, html) {
  const words = md.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = md.length;
  const lines = md.split('\n').length;
  const readTime = Math.max(1, Math.ceil(words / 200));
  const headings = (md.match(/^#{1,6}\s/gm) || []).length;
  const links = (md.match(/\[[^\]]+\]\([^)]+\)/g) || []).length;
  const images = (md.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  const codeBlocks = Math.floor((md.match(/```/g) || []).length / 2);

  statWords.textContent = words.toLocaleString();
  statChars.textContent = chars.toLocaleString();
  statLines.textContent = lines.toLocaleString();
  statTime.textContent = readTime + ' min';
  statHeadings.textContent = headings;
  statLinks.textContent = links;
  statImages.textContent = images;
  statCodeBlocks.textContent = codeBlocks;
}

// Reset stats
function resetStats() {
  statWords.textContent = '0';
  statChars.textContent = '0';
  statLines.textContent = '0';
  statTime.textContent = '0 min';
  statHeadings.textContent = '0';
  statLinks.textContent = '0';
  statImages.textContent = '0';
  statCodeBlocks.textContent = '0';
}

// Details
function buildDetails(md, html) {
  if (!detailsContent) return;
  const words = md.trim().split(/\s+/).filter(w => w.length > 0).length;
  const lines = md.split('\n').length;
  const htmlSize = new Blob([html]).size;
  const mdSize = new Blob([md]).size;

  let out = '';
  out += `<div class="detail-row"><span class="detail-char">Markdown size</span><span class="detail-arrow">→</span><span class="detail-value">${formatBytes(mdSize)}</span></div>`;
  out += `<div class="detail-row"><span class="detail-char">HTML size</span><span class="detail-arrow">→</span><span class="detail-value">${formatBytes(htmlSize)}</span></div>`;
  out += `<div class="detail-row"><span class="detail-char">Words</span><span class="detail-arrow">→</span><span class="detail-value">${words.toLocaleString()}</span></div>`;
  out += `<div class="detail-row"><span class="detail-char">Lines</span><span class="detail-arrow">→</span><span class="detail-value">${lines.toLocaleString()}</span></div>`;
  out += `<div class="detail-row"><span class="detail-char">Ratio (HTML/MD)</span><span class="detail-arrow">→</span><span class="detail-value">${(htmlSize / mdSize).toFixed(2)}×</span></div>`;
  out += `<div class="detail-row"><span class="detail-char">Parser</span><span class="detail-arrow">→</span><span class="detail-value">marked.js</span></div>`;
  out += `<div class="detail-row"><span class="detail-char">Sanitizer</span><span class="detail-arrow">→</span><span class="detail-value">DOMPurify</span></div>`;
  out += `<div class="detail-row"><span class="detail-char">Highlight</span><span class="detail-arrow">→</span><span class="detail-value">highlight.js</span></div>`;

  detailsContent.innerHTML = out;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Editor input (debounced)
let mdTimer = null;
editorInput.addEventListener('input', () => {
  clearTimeout(mdTimer);
  mdTimer = setTimeout(renderMarkdown, 150);
});

// Toolbar buttons
toolBtns.forEach(btn => {
  btn.addEventListener('click', () => insertMarkdown(btn.dataset.action));
});

// Heading dropdown
headingToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  headingDropdown.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!headingDropdown.contains(e.target)) {
    headingDropdown.classList.remove('open');
  }
});

headingMenu.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    insertMarkdown(item.dataset.action);
    headingDropdown.classList.remove('open');
  });
});

// Insert markdown
function insertMarkdown(action) {
  const textarea = editorInput;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);

  let insert = '';
  let cursorOffset = 0;

  switch (action) {
    case 'h1': insert = '# ' + (selected || 'Heading 1'); cursorOffset = 2; break;
    case 'h2': insert = '## ' + (selected || 'Heading 2'); cursorOffset = 3; break;
    case 'h3': insert = '### ' + (selected || 'Heading 3'); cursorOffset = 4; break;
    case 'h4': insert = '#### ' + (selected || 'Heading 4'); cursorOffset = 5; break;
    case 'h5': insert = '##### ' + (selected || 'Heading 5'); cursorOffset = 6; break;
    case 'h6': insert = '###### ' + (selected || 'Heading 6'); cursorOffset = 7; break;
    case 'bold': insert = '**' + (selected || 'bold') + '**'; cursorOffset = 2; break;
    case 'italic': insert = '*' + (selected || 'italic') + '*'; cursorOffset = 1; break;
    case 'strike': insert = '~~' + (selected || 'strike') + '~~'; cursorOffset = 2; break;
    case 'code': insert = '`' + (selected || 'code') + '`'; cursorOffset = 1; break;
    case 'codeblock': insert = '```\n' + (selected || 'code') + '\n```'; cursorOffset = 4; break;
    case 'link': insert = '[' + (selected || 'link text') + '](https://example.com)'; cursorOffset = 1; break;
    case 'image': insert = '![' + (selected || 'alt text') + '](https://example.com/image.png)'; cursorOffset = 2; break;
    case 'ul': insert = '- ' + (selected || 'item 1') + '\n- item 2\n- item 3'; cursorOffset = 2; break;
    case 'ol': insert = '1. ' + (selected || 'item 1') + '\n2. item 2\n3. item 3'; cursorOffset = 3; break;
    case 'quote': insert = '> ' + (selected || 'quote here'); cursorOffset = 2; break;
    case 'hr': insert = '\n---\n'; cursorOffset = 5; break;
    case 'table': insert = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'; cursorOffset = 2; break;
    case 'task': insert = '- [ ] ' + (selected || 'task 1') + '\n- [ ] task 2\n- [x] task 3'; cursorOffset = 6; break;
  }

  textarea.value = before + insert + after;
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
  renderMarkdown();
}

// Clear
clearBtn.addEventListener('click', () => {
  if (!confirm('Clear all text?')) return;
  editorInput.value = '';
  renderMarkdown();
  editorInput.focus();
});

// Sample
sampleBtn.addEventListener('click', () => {
  editorInput.value = `# Welcome to Markdown

This is **bold** and this is *italic*.

## Features

- Live preview
- Auto-save
- Scroll sync

## Code

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

## Table

| Tool | Purpose |
|------|---------|
| Base64 | Encode/Decode |
| JSON | Format |
| Regex | Test |

> Markdown is used everywhere.

[Visit Google](https://google.com)

- [x] Task done
- [ ] Task pending

---

**Dev Tools** — Made with ❤️`;
  renderMarkdown();
});

// More dropdown
moreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  moreDropdown.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!moreDropdown.contains(e.target) && e.target !== moreBtn) {
    moreDropdown.classList.remove('open');
  }
});

// Auto-save toggle
optAutoSave.addEventListener('change', () => {
  if (optAutoSave.checked) {
    localStorage.setItem('md_draft', editorInput.value);
  } else {
    localStorage.removeItem('md_draft');
  }
});

// Scroll sync
let syncEnabled = true;
optScrollSync.addEventListener('change', () => {
  syncEnabled = optScrollSync.checked;
});

editorInput.addEventListener('scroll', () => {
  if (!syncEnabled || !optScrollSync.checked) return;
  const ratio = editorInput.scrollTop / (editorInput.scrollHeight - editorInput.clientHeight || 1);
  previewContent.scrollTop = ratio * (previewContent.scrollHeight - previewContent.clientHeight);
});

previewContent.addEventListener('scroll', () => {
  if (!syncEnabled || !optScrollSync.checked) return;
  const ratio = previewContent.scrollTop / (previewContent.scrollHeight - previewContent.clientHeight || 1);
  editorInput.scrollTop = ratio * (editorInput.scrollHeight - editorInput.clientHeight);
});

// Word wrap
optWordWrap.addEventListener('change', () => {
  if (optWordWrap.checked) {
    editorInput.classList.remove('nowrap');
  } else {
    editorInput.classList.add('nowrap');
  }
});

// Font size
fontSizeSlider.addEventListener('input', () => {
  currentFontSize = parseInt(fontSizeSlider.value);
  fontSizeValue.textContent = currentFontSize;
  editorInput.style.fontSize = currentFontSize + 'px';
  previewContent.style.fontSize = currentFontSize + 'px';
});

// Find & Replace
findReplaceBtn.addEventListener('click', () => {
  findPanel.classList.toggle('open');
  if (findPanel.classList.contains('open')) {
    setTimeout(() => findInput.focus(), 200);
  }
});

closeFindBtn.addEventListener('click', () => {
  findPanel.classList.remove('open');
});

findNextBtn.addEventListener('click', () => {
  const term = findInput.value;
  if (!term) return;
  const text = editorInput.value;
  let idx = text.indexOf(term, findIndex);
  if (idx === -1) {
    findIndex = 0;
    idx = text.indexOf(term, 0);
  }
  if (idx === -1) {
    alert('Not found.');
    return;
  }
  editorInput.focus();
  editorInput.setSelectionRange(idx, idx + term.length);
  findIndex = idx + term.length;
});

replaceOneBtn.addEventListener('click', () => {
  const term = findInput.value;
  const repl = replaceInput.value;
  if (!term) return;
  const start = editorInput.selectionStart;
  const end = editorInput.selectionEnd;
  if (editorInput.value.substring(start, end) === term) {
    editorInput.setRangeText(repl, start, end, 'end');
    renderMarkdown();
  } else {
    findNextBtn.click();
  }
});

replaceAllBtn.addEventListener('click', () => {
  const term = findInput.value;
  const repl = replaceInput.value;
  if (!term) return;
  const count = (editorInput.value.match(new RegExp(escapeRegExp(term), 'g')) || []).length;
  if (count === 0) { alert('Not found.'); return; }
  editorInput.value = editorInput.value.split(term).join(repl);
  renderMarkdown();
  alert('Replaced ' + count + ' occurrence(s).');
});

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Emoji picker
const EMOJIS = [
  '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃',
  '😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙',
  '😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔',
  '🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥',
  '😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮',
  '🥵','🥶','😵','🤯','🤠','🥳','😎','🤓','🧐','😕',
  '😟','🙁','😮','😯','😲','😳','🥺','😦','😧','😨',
  '😰','😥','😢','😭','😱','😖','😣','😞','😓','😩',
  '😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️',
  '💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔',
  '❣️','💕','💞','💓','💗','💖','💘','💝','💟','✨',
  '⭐','🌟','💫','⚡','🔥','💥','💢','💦','💨','🎉',
  '🎊','🎈','🎁','🎀','🏆','🥇','🥈','🥉','👍','👎',
  '👏','🙌','🤝','🙏','✌️','🤞','🤟','👌','🤌','🤏',
  '👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋'
];

EMOJIS.forEach(e => {
  const btn = document.createElement('button');
  btn.className = 'emoji-item';
  btn.type = 'button';
  btn.textContent = e;
  btn.addEventListener('click', () => {
    const start = editorInput.selectionStart;
    const before = editorInput.value.substring(0, start);
    const after = editorInput.value.substring(start);
    editorInput.value = before + e + after;
    editorInput.focus();
    editorInput.selectionStart = editorInput.selectionEnd = start + e.length;
    renderMarkdown();
  });
  emojiGrid.appendChild(btn);
});

emojiBtn.addEventListener('click', () => {
  emojiPicker.classList.toggle('open');
});

// Print
printBtn.addEventListener('click', () => {
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Markdown Print</title>
    <style>
      body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.7; color: #000; }
      h1, h2, h3 { color: #00887a; }
      pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
      code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
      th { background: #e8f5f0; }
      blockquote { border-left: 4px solid #00887a; padding: 8px 14px; background: #f5faf8; }
      img { max-width: 100%; }
    </style></head><body>${currentHtml}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
});

// Rich copy
richCopyBtn.addEventListener('click', async () => {
  if (!currentHtml) return;
  try {
    const blob = new Blob([currentHtml], { type: 'text/html' });
    const data = [new ClipboardItem({
      'text/html': blob,
      'text/plain': new Blob([previewContent.innerText], { type: 'text/plain' })
    })];
    await navigator.clipboard.write(data);
    const original = richCopyBtn.textContent;
    richCopyBtn.textContent = '✓ Copied';
    setTimeout(() => richCopyBtn.textContent = original, 1200);
  } catch (err) {
    alert('Copy failed. Try selecting and copying manually.');
  }
});

// Clear storage
clearStorageBtn.addEventListener('click', () => {
  if (!confirm('Clear saved draft?')) return;
  localStorage.removeItem('md_draft');
  alert('Saved draft cleared.');
});

// TOC
tocBtn.addEventListener('click', () => {
  const headings = currentMarkdown.match(/^(#{1,6})\s+(.+)$/gm) || [];
  if (headings.length === 0) {
    tocBody.innerHTML = '<p class="no-details">No headings yet. Add some with # syntax.</p>';
  } else {
    let html = '';
    headings.forEach(h => {
      const match = h.match(/^(#{1,6})\s+(.+)$/);
      const level = match[1].length;
      const text = match[2];
      html += `<a class="toc-item h${level}" data-text="${escapeHTML(text)}">${escapeHTML(text)}</a>`;
    });
    tocBody.innerHTML = html;

    tocBody.querySelectorAll('.toc-item').forEach(item => {
      item.addEventListener('click', () => {
        const text = item.dataset.text;
        const allH = previewContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const h of allH) {
          if (h.textContent.trim() === text.trim()) {
            h.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          }
        }
        tocModal.classList.remove('open');
      });
    });
  }
  tocModal.classList.add('open');
});

closeTocBtn.addEventListener('click', () => tocModal.classList.remove('open'));
tocModal.addEventListener('click', (e) => {
  if (e.target === tocModal) tocModal.classList.remove('open');
});

// Cheat sheet
cheatBtn.addEventListener('click', () => cheatModal.classList.add('open'));
closeCheatBtn.addEventListener('click', () => cheatModal.classList.remove('open'));
cheatModal.addEventListener('click', (e) => {
  if (e.target === cheatModal) cheatModal.classList.remove('open');
});

// Escape key closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cheatModal.classList.remove('open');
    tocModal.classList.remove('open');
    findPanel.classList.remove('open');
    emojiPicker.classList.remove('open');
    moreDropdown.classList.remove('open');
    headingDropdown.classList.remove('open');
  }
});

// Import file
importBtn.addEventListener('click', () => importFile.click());

importFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    editorInput.value = ev.target.result;
    renderMarkdown();
  };
  reader.readAsText(file);
  importFile.value = '';
});

// Theme toggle
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('md_theme', isLight ? 'light' : 'dark');
});

// Copy buttons
copyHtmlBtn.addEventListener('click', () => {
  if (!currentHtml) return;
  navigator.clipboard.writeText(currentHtml).then(() => flashBtn(copyHtmlBtn, '✓ Copied'));
});

copyMdBtn.addEventListener('click', () => {
  if (!currentMarkdown) return;
  navigator.clipboard.writeText(currentMarkdown).then(() => flashBtn(copyMdBtn, '✓ Copied'));
});

copyRawBtn.addEventListener('click', () => {
  if (!currentHtml) return;
  navigator.clipboard.writeText(currentHtml).then(() => flashBtn(copyRawBtn, '✓ Copied'));
});

function flashBtn(btn, text) {
  const original = btn.textContent;
  btn.textContent = text;
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('copied');
  }, 1200);
}

// Download .md
downloadMdBtn.addEventListener('click', () => {
  if (!currentMarkdown) { alert('Write something first.'); return; }
  const blob = new Blob([currentMarkdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  a.click();
  URL.revokeObjectURL(url);
});

// Download .html
downloadHtmlBtn.addEventListener('click', () => {
  if (!currentHtml) { alert('Write something first.'); return; }
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Markdown Preview</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/atom-one-dark.min.css">
<style>
body{background:#0a0a0f;color:#ddeeff;font-family:-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;line-height:1.7;}
h1{color:#33ffcc;border-bottom:2px solid rgba(51,255,204,.3);padding-bottom:8px;}
h2{color:#33ccff;border-bottom:1px solid rgba(51,204,255,.2);padding-bottom:6px;}
h3{color:#66ffee;}h4{color:#99ffee;}
a{color:#33ffcc;}code{background:rgba(51,255,204,.1);color:#33ffcc;padding:2px 6px;border-radius:4px;}
pre{background:#050505;border-left:3px solid #33ffcc;border-radius:8px;padding:14px;overflow-x:auto;}
pre code{background:transparent;color:#ddeeff;}
blockquote{border-left:4px solid #33ffcc;padding:8px 14px;background:rgba(51,255,204,.05);}
table{border-collapse:collapse;width:100%;}
th,td{border:1px solid #333;padding:8px 12px;text-align:left;}
th{background:rgba(51,255,204,.1);color:#33ffcc;}
img{max-width:100%;border-radius:8px;}
</style>
</head>
<body>
${currentHtml}
</body>
</html>`;
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.html';
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
(function init() {
  // Load theme
  const savedTheme = localStorage.getItem('md_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeBtn.textContent = '☀️';
  }

  // Load draft
  const savedDraft = localStorage.getItem('md_draft');
  if (savedDraft) {
    editorInput.value = savedDraft;
  } else {
    editorInput.value = `# Welcome to Markdown

This is **bold** and this is *italic*.

## Features

- Live preview
- Auto-save
- Scroll sync

## Code

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

## Table

| Tool | Purpose |
|------|---------|
| Base64 | Encode/Decode |
| JSON | Format |

> Markdown is everywhere.

[Visit Google](https://google.com)

- [x] Task done
- [ ] Task pending

---

**Dev Tools** — Made with ❤️`;
  }

  renderMarkdown();
})();

