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
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const categoryTabs = document.querySelectorAll('.cat-tab');
const codesList = document.getElementById('codesList');
const statTotal = document.getElementById('statTotal');
const statShowing = document.getElementById('statShowing');
const detailsToggle = document.getElementById('detailsToggle');
const detailsDropdown = document.getElementById('detailsDropdown');
const detailsContent = document.getElementById('detailsContent');
const themeBtn = document.getElementById('themeBtn');

let currentCategory = 'all';
let currentSearch = '';
let lastSelectedCode = null;

// HTTP STATUS CODES DATABASE
const HTTP_CODES = [
  // 1xx Informational
  { code: 100, name: 'Continue', cat: '1xx', desc: 'The server has received the request headers and the client should proceed to send the body.', usage: 'Used with large POST requests where the client wants to check before sending.' },
  { code: 101, name: 'Switching Protocols', cat: '1xx', desc: 'The requester has asked the server to switch protocols.', usage: 'Used in WebSocket upgrades from HTTP.' },
  { code: 102, name: 'Processing', cat: '1xx', desc: 'The server has received and is processing the request, but no response is available yet.', usage: 'Used for long-running requests.' },
  { code: 103, name: 'Early Hints', cat: '1xx', desc: 'Used to return some response headers before final HTTP message.', usage: 'Speeds up page loading.' },

  // 2xx Success
  { code: 200, name: 'OK', cat: '2xx', desc: 'Standard response for successful HTTP requests.', usage: 'Most common success response for GET, POST, PUT.' },
  { code: 201, name: 'Created', cat: '2xx', desc: 'The request has been fulfilled and a new resource has been created.', usage: 'Used after successful POST to create a resource.' },
  { code: 202, name: 'Accepted', cat: '2xx', desc: 'The request has been accepted but not yet processed.', usage: 'Used for async processing.' },
  { code: 203, name: 'Non-Authoritative Information', cat: '2xx', desc: 'The response has been modified by a proxy.', usage: 'Rarely used.' },
  { code: 204, name: 'No Content', cat: '2xx', desc: 'The server successfully processed the request but is not returning any content.', usage: 'Used with DELETE requests.' },
  { code: 205, name: 'Reset Content', cat: '2xx', desc: 'The server successfully processed the request but is not returning any content. Client should reset the document view.', usage: 'Rarely used.' },
  { code: 206, name: 'Partial Content', cat: '2xx', desc: 'The server is delivering only part of the resource.', usage: 'Used for video streaming and resumable downloads.' },
  { code: 207, name: 'Multi-Status', cat: '2xx', desc: 'The message body contains multiple status codes.', usage: 'Used in WebDAV.' },
  { code: 208, name: 'Already Reported', cat: '2xx', desc: 'Used in WebDAV to avoid repeating status codes.', usage: 'Rarely used.' },
  { code: 226, name: 'IM Used', cat: '2xx', desc: 'The server has fulfilled a GET request with instance manipulations.', usage: 'Rarely used.' },

  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', cat: '3xx', desc: 'Indicates multiple options for the resource.', usage: 'Rarely used.' },
  { code: 301, name: 'Moved Permanently', cat: '3xx', desc: 'The resource has been permanently moved to a new URL.', usage: 'SEO-friendly redirects. Browsers cache this.' },
  { code: 302, name: 'Found', cat: '3xx', desc: 'The resource has been temporarily moved to a new URL.', usage: 'Temporary redirects.' },
  { code: 303, name: 'See Other', cat: '3xx', desc: 'The response should be retrieved with a GET request to another URL.', usage: 'Used after POST to redirect.' },
  { code: 304, name: 'Not Modified', cat: '3xx', desc: 'The resource has not been modified since the last request.', usage: 'Used for browser caching.' },
  { code: 305, name: 'Use Proxy', cat: '3xx', desc: 'The requested resource is available only through a proxy.', usage: 'Deprecated.' },
  { code: 307, name: 'Temporary Redirect', cat: '3xx', desc: 'The resource is temporarily moved. The method should not change.', usage: 'Similar to 302 but preserves method.' },
  { code: 308, name: 'Permanent Redirect', cat: '3xx', desc: 'The resource is permanently moved. The method should not change.', usage: 'Similar to 301 but preserves method.' },

  // 4xx Client Error
  { code: 400, name: 'Bad Request', cat: '4xx', desc: 'The server cannot process the request due to client error.', usage: 'Invalid input, malformed syntax.' },
  { code: 401, name: 'Unauthorized', cat: '4xx', desc: 'The request requires user authentication.', usage: 'Missing or invalid auth token.' },
  { code: 402, name: 'Payment Required', cat: '4xx', desc: 'Reserved for future use.', usage: 'Rarely used.' },
  { code: 403, name: 'Forbidden', cat: '4xx', desc: 'The server understood the request but refuses to authorize it.', usage: 'User lacks permission.' },
  { code: 404, name: 'Not Found', cat: '4xx', desc: 'The requested resource could not be found.', usage: 'Most common error. Missing page or endpoint.' },
  { code: 405, name: 'Method Not Allowed', cat: '4xx', desc: 'The request method is not supported for the resource.', usage: 'Wrong HTTP method.' },
  { code: 406, name: 'Not Acceptable', cat: '4xx', desc: 'The requested resource cannot generate content acceptable per Accept headers.', usage: 'Content negotiation failure.' },
  { code: 407, name: 'Proxy Authentication Required', cat: '4xx', desc: 'The client must first authenticate with the proxy.', usage: 'Proxy auth needed.' },
  { code: 408, name: 'Request Timeout', cat: '4xx', desc: 'The server timed out waiting for the request.', usage: 'Slow client.' },
  { code: 409, name: 'Conflict', cat: '4xx', desc: 'The request conflicts with the current state of the server.', usage: 'Duplicate data, version conflicts.' },
  { code: 410, name: 'Gone', cat: '4xx', desc: 'The resource is no longer available and will not be available again.', usage: 'Permanently deleted resource.' },
  { code: 411, name: 'Length Required', cat: '4xx', desc: 'The request did not specify the length of its content.', usage: 'Missing Content-Length header.' },
  { code: 412, name: 'Precondition Failed', cat: '4xx', desc: 'The server does not meet one of the preconditions.', usage: 'Conditional requests.' },
  { code: 413, name: 'Payload Too Large', cat: '4xx', desc: 'The request is larger than the server is willing to process.', usage: 'File upload too big.' },
  { code: 414, name: 'URI Too Long', cat: '4xx', desc: 'The URI provided was too long.', usage: 'Excessive query string.' },
  { code: 415, name: 'Unsupported Media Type', cat: '4xx', desc: 'The request entity has a media type which the server does not support.', usage: 'Wrong Content-Type.' },
  { code: 416, name: 'Range Not Satisfiable', cat: '4xx', desc: 'The client has asked for a portion of the file that the server cannot supply.', usage: 'Invalid range request.' },
  { code: 417, name: 'Expectation Failed', cat: '4xx', desc: 'The server cannot meet the requirements of the Expect request-header field.', usage: 'Rarely used.' },
  { code: 418, name: "I'm a teapot", cat: '4xx', desc: 'An April Fools joke status code.', usage: 'Easter egg.' },
  { code: 421, name: 'Misdirected Request', cat: '4xx', desc: 'The request was directed at a server that is not able to produce a response.', usage: 'Rarely used.' },
  { code: 422, name: 'Unprocessable Entity', cat: '4xx', desc: 'The request was well-formed but contains semantic errors.', usage: 'Validation failed.' },
  { code: 423, name: 'Locked', cat: '4xx', desc: 'The resource that is being accessed is locked.', usage: 'WebDAV.' },
  { code: 424, name: 'Failed Dependency', cat: '4xx', desc: 'The request failed due to failure of a previous request.', usage: 'WebDAV.' },
  { code: 425, name: 'Too Early', cat: '4xx', desc: 'The server is unwilling to risk processing a request that might be replayed.', usage: 'Rarely used.' },
  { code: 426, name: 'Upgrade Required', cat: '4xx', desc: 'The client should switch to a different protocol.', usage: 'TLS upgrade.' },
  { code: 428, name: 'Precondition Required', cat: '4xx', desc: 'The origin server requires the request to be conditional.', usage: 'Rarely used.' },
  { code: 429, name: 'Too Many Requests', cat: '4xx', desc: 'The user has sent too many requests in a given amount of time.', usage: 'Rate limiting.' },
  { code: 431, name: 'Request Header Fields Too Large', cat: '4xx', desc: 'The server is unwilling to process the request because its header fields are too large.', usage: 'Header too big.' },
  { code: 451, name: 'Unavailable For Legal Reasons', cat: '4xx', desc: 'The resource is unavailable for legal reasons.', usage: 'Government censorship.' },

  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', cat: '5xx', desc: 'The server encountered an internal error.', usage: 'Server-side bug.' },
  { code: 501, name: 'Not Implemented', cat: '5xx', desc: 'The server does not support the functionality required to fulfill the request.', usage: 'Unsupported method.' },
  { code: 502, name: 'Bad Gateway', cat: '5xx', desc: 'The server received an invalid response from an upstream server.', usage: 'Gateway/proxy issue.' },
  { code: 503, name: 'Service Unavailable', cat: '5xx', desc: 'The server is currently unavailable.', usage: 'Server overload or maintenance.' },
  { code: 504, name: 'Gateway Timeout', cat: '5xx', desc: 'The server did not receive a timely response from an upstream server.', usage: 'Upstream timeout.' },
  { code: 505, name: 'HTTP Version Not Supported', cat: '5xx', desc: 'The server does not support the HTTP protocol version used in the request.', usage: 'Old client.' },
  { code: 506, name: 'Variant Also Negotiates', cat: '5xx', desc: 'Transparent content negotiation for the request results in a circular reference.', usage: 'Rarely used.' },
  { code: 507, name: 'Insufficient Storage', cat: '5xx', desc: 'The server is unable to store the representation needed to complete the request.', usage: 'WebDAV.' },
  { code: 508, name: 'Loop Detected', cat: '5xx', desc: 'The server detected an infinite loop while processing the request.', usage: 'WebDAV.' },
  { code: 510, name: 'Not Extended', cat: '5xx', desc: 'Further extensions to the request are required.', usage: 'Rarely used.' },
  { code: 511, name: 'Network Authentication Required', cat: '5xx', desc: 'The client needs to authenticate to gain network access.', usage: 'Captive portal.' }
];

// Update stats
function updateStats(showing) {
  statTotal.textContent = HTTP_CODES.length;
  statShowing.textContent = showing;
}

// Filter codes
function filterCodes() {
  const term = currentSearch.toLowerCase().trim();

  let filtered = HTTP_CODES;

  if (currentCategory !== 'all') {
    filtered = filtered.filter(c => c.cat === currentCategory);
  }

  if (term) {
    filtered = filtered.filter(c =>
      c.code.toString().includes(term) ||
      c.name.toLowerCase().includes(term) ||
      c.desc.toLowerCase().includes(term)
    );
  }

  renderCodes(filtered);
  updateStats(filtered.length);
}

// Render codes
function renderCodes(codes) {
  if (codes.length === 0) {
    codesList.innerHTML = '<p class="output-placeholder">No codes match your search.</p>';
    return;
  }

  let html = '';
  codes.forEach(c => {
    html += `
      <div class="code-card" data-cat="${c.cat}" data-code="${c.code}">
        <div class="code-header">
          <span class="code-number">
            ${c.code}
            <span class="code-badge">${c.cat}</span>
          </span>
          <span class="code-copy-icon">⧉</span>
        </div>
        <div class="code-name">${escapeHTML(c.name)}</div>
        <div class="code-desc">${escapeHTML(c.desc)}</div>
        <div class="code-usage">${escapeHTML(c.usage)}</div>
      </div>
    `;
  });

  codesList.innerHTML = html;

  // Click to copy
  codesList.querySelectorAll('.code-card').forEach(card => {
    card.addEventListener('click', () => {
      const code = card.dataset.code;
      const found = HTTP_CODES.find(c => c.code == code);
      if (!found) return;

      const text = found.code + ' ' + found.name;
      navigator.clipboard.writeText(text).then(() => {
        card.classList.add('copied');
        const icon = card.querySelector('.code-copy-icon');
        const original = icon.textContent;
        icon.textContent = '✓';
        setTimeout(() => {
          card.classList.remove('copied');
          icon.textContent = original;
        }, 800);

        // Details
        lastSelectedCode = found;
        buildDetails(found);
      });
    });
  });
}

// Build details
function buildDetails(c) {
  if (!detailsContent) return;

  let html = '';
  html += '<div class="detail-row"><span class="detail-char">Code</span><span class="detail-arrow">→</span><span class="detail-value">' + c.code + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Name</span><span class="detail-arrow">→</span><span class="detail-value">' + escapeHTML(c.name) + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Category</span><span class="detail-arrow">→</span><span class="detail-value">' + c.cat + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">Description</span><span class="detail-arrow">→</span><span class="detail-value">' + escapeHTML(c.desc) + '</span></div>';
  html += '<div class="detail-row"><span class="detail-char">When to use</span><span class="detail-arrow">→</span><span class="detail-value">' + escapeHTML(c.usage) + '</span></div>';

  detailsContent.innerHTML = html;
}

// Escape HTML
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Search event
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value;
  if (currentSearch.length > 0) {
    searchClearBtn.classList.add('show');
  } else {
    searchClearBtn.classList.remove('show');
  }
  filterCodes();
});

// Search clear
searchClearBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  searchClearBtn.classList.remove('show');
  searchInput.focus();
  filterCodes();
});

// Category tabs
categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.cat;
    filterCodes();
  });
});

// Details toggle
if (detailsToggle && detailsDropdown) {
  detailsToggle.addEventListener('click', () => {
    detailsDropdown.classList.toggle('open');
    detailsToggle.classList.toggle('open');
  });
}

// Theme toggle
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

// Init
filterCodes();