// ============================================
// README GEN — Part 1 (Fixed)
// Navbar + Theme + TECH_DATA + Elements
// ============================================

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

// ===== TECH DATA =====
const TECH_DATA = {
  // Languages
  python:     { label: 'Python',     logo: 'python',          category: 'languages' },
  javascript: { label: 'JavaScript', logo: 'javascript',      category: 'languages' },
  typescript: { label: 'TypeScript', logo: 'typescript',      category: 'languages' },
  java:       { label: 'Java',       logo: 'openjdk',         category: 'languages' },
  cpp:        { label: 'C++',        logo: 'cplusplus',       category: 'languages' },
  c:          { label: 'C',          logo: 'c',               category: 'languages' },
  csharp:     { label: 'C#',         logo: 'csharp',          category: 'languages' },
  go:         { label: 'Go',         logo: 'go',              category: 'languages' },
  rust:       { label: 'Rust',       logo: 'rust',            category: 'languages' },
  php:        { label: 'PHP',        logo: 'php',             category: 'languages' },
  ruby:       { label: 'Ruby',       logo: 'ruby',            category: 'languages' },
  kotlin:     { label: 'Kotlin',     logo: 'kotlin',          category: 'languages' },
  swift:      { label: 'Swift',      logo: 'swift',           category: 'languages' },
  dart:       { label: 'Dart',       logo: 'dart',            category: 'languages' },

  // Frontend
  react:      { label: 'React',      logo: 'react',           category: 'frontend' },
  vue:        { label: 'Vue.js',     logo: 'vuedotjs',        category: 'frontend' },
  angular:    { label: 'Angular',    logo: 'angular',         category: 'frontend' },
  svelte:     { label: 'Svelte',     logo: 'svelte',          category: 'frontend' },
  nextjs:     { label: 'Next.js',    logo: 'nextdotjs',       category: 'frontend' },
  tailwind:   { label: 'Tailwind',   logo: 'tailwindcss',     category: 'frontend' },
  bootstrap:  { label: 'Bootstrap',  logo: 'bootstrap',       category: 'frontend' },
  html5:      { label: 'HTML5',      logo: 'html5',           category: 'frontend' },
  css3:       { label: 'CSS3',       logo: 'css3',            category: 'frontend' },

  // Backend
  nodejs:     { label: 'Node.js',    logo: 'nodedotjs',       category: 'backend' },
  express:    { label: 'Express',    logo: 'express',         category: 'backend' },
  django:     { label: 'Django',     logo: 'django',          category: 'backend' },
  flask:      { label: 'Flask',      logo: 'flask',           category: 'backend' },
  spring:     { label: 'Spring',     logo: 'spring',          category: 'backend' },
  laravel:    { label: 'Laravel',    logo: 'laravel',         category: 'backend' },

  // Mobile
  reactnative:{ label: 'React Native', logo: 'react',         category: 'mobile' },
  flutter:    { label: 'Flutter',    logo: 'flutter',         category: 'mobile' },
  android:    { label: 'Android',    logo: 'android',         category: 'mobile' },
  ios:        { label: 'iOS',        logo: 'apple',           category: 'mobile' },

  // AI / ML
  tensorflow: { label: 'TensorFlow', logo: 'tensorflow',      category: 'aiml' },
  pytorch:    { label: 'PyTorch',    logo: 'pytorch',         category: 'aiml' },
  keras:      { label: 'Keras',      logo: 'keras',           category: 'aiml' },
  sklearn:    { label: 'scikit-learn', logo: 'scikitlearn',   category: 'aiml' },
  opencv:     { label: 'OpenCV',     logo: 'opencv',          category: 'aiml' },
  pandas:     { label: 'Pandas',     logo: 'pandas',          category: 'aiml' },
  numpy:      { label: 'NumPy',      logo: 'numpy',           category: 'aiml' },
  huggingface:{ label: 'Hugging Face', logo: 'huggingface',   category: 'aiml' },
  langchain:  { label: 'LangChain',  logo: 'langchain',       category: 'aiml' },
  openai:     { label: 'OpenAI',     logo: 'openai',          category: 'aiml' },

  // Database
  mongodb:    { label: 'MongoDB',    logo: 'mongodb',         category: 'database' },
  mysql:      { label: 'MySQL',      logo: 'mysql',           category: 'database' },
  postgresql: { label: 'PostgreSQL', logo: 'postgresql',      category: 'database' },
  redis:      { label: 'Redis',      logo: 'redis',           category: 'database' },
  sqlite:     { label: 'SQLite',     logo: 'sqlite',          category: 'database' },
  firebase:   { label: 'Firebase',   logo: 'firebase',        category: 'database' },

  // DevOps & Tools
  docker:     { label: 'Docker',     logo: 'docker',          category: 'devops' },
  kubernetes: { label: 'Kubernetes', logo: 'kubernetes',      category: 'devops' },
  aws:        { label: 'AWS',        logo: 'amazonwebservices', category: 'devops' },
  gcp:        { label: 'GCP',        logo: 'googlecloud',     category: 'devops' },
  linux:      { label: 'Linux',      logo: 'linux',           category: 'devops' },
  git:        { label: 'Git',        logo: 'git',             category: 'devops' },
  figma:      { label: 'Figma',      logo: 'figma',           category: 'devops' },
  postman:    { label: 'Postman',    logo: 'postman',         category: 'devops' }
};

const CATEGORY_META = {
  languages: { title: 'Programming Languages', order: 1 },
  frontend:  { title: 'Frontend Development', order: 2 },
  backend:   { title: 'Backend Development', order: 3 },
  mobile:    { title: 'Mobile App Development', order: 4 },
  aiml:      { title: 'AI / ML', order: 5 },
  database:  { title: 'Database', order: 6 },
  devops:    { title: 'DevOps & Tools', order: 7 }
};

// ===== Elements =====
const nameInput = document.getElementById('nameInput');
const taglineInput = document.getElementById('taglineInput');
const bioInput = document.getElementById('bioInput');
const currentWorkInput = document.getElementById('currentWorkInput');
const learningInput = document.getElementById('learningInput');
const askMeInput = document.getElementById('askMeInput');
const githubInput = document.getElementById('githubInput');
const linkedinInput = document.getElementById('linkedinInput');
const twitterInput = document.getElementById('twitterInput');
const portfolioInput = document.getElementById('portfolioInput');
const emailInput = document.getElementById('emailInput');
const blogInput = document.getElementById('blogInput');
const coffeeInput = document.getElementById('coffeeInput');
const devtoInput = document.getElementById('devtoInput');
const mediumInput = document.getElementById('mediumInput');

const statsCard = document.getElementById('statsCard');
const langCard = document.getElementById('langCard');
const streakCard = document.getElementById('streakCard');
const trophyCard = document.getElementById('trophyCard');
const visitorCounter = document.getElementById('visitorCounter');

const techContainer = document.getElementById('techContainer');
const outputBox = document.getElementById('outputBox');
const previewBox = document.getElementById('previewBox');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const openPreviewBtn = document.getElementById('openPreviewBtn');
const sampleBtn = document.getElementById('sampleBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const statusBar = document.getElementById('statusBar');
const themeBtn = document.getElementById('themeBtn');

// ============================================
// README GEN — Part 2 (Fixed)
// Tech Chips + Markdown Generator + MD to HTML
// ============================================

// ===== Render Tech Chips =====
function renderTechChips() {
  if (!techContainer) return;

  const grouped = {};
  Object.keys(TECH_DATA).forEach(key => {
    const tech = TECH_DATA[key];
    const cat = tech.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ key, ...tech });
  });

  const sortedCats = Object.keys(grouped).sort((a, b) => {
    const oa = CATEGORY_META[a]?.order || 999;
    const ob = CATEGORY_META[b]?.order || 999;
    return oa - ob;
  });

  let html = '';
  sortedCats.forEach(cat => {
    const meta = CATEGORY_META[cat] || { title: cat };
    html += `<div class="tech-category">`;
    html += `<h4 class="tech-cat-title">${meta.title}</h4>`;
    html += `<div class="tech-grid" data-category="${cat}">`;

    grouped[cat].forEach(tech => {
      const logoUrl = `https://cdn.simpleicons.org/${tech.logo}`;
      html += `<button class="tech-chip" data-tech="${tech.key}" type="button">`;
      html += `<img src="${logoUrl}" alt="${tech.label}" onerror="this.style.display='none'" />`;
      html += `<span>${tech.label}</span>`;
      html += `</button>`;
    });

    html += `</div></div>`;
  });

  techContainer.innerHTML = html;

  techContainer.querySelectorAll('.tech-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      render();
    });
  });
}

function getSelectedTechs() {
  const selected = [];
  techContainer.querySelectorAll('.tech-chip.active').forEach(chip => {
    selected.push(chip.dataset.tech);
  });
  return selected;
}

// ===== Build Markdown =====
function buildMarkdown() {
  const name = nameInput.value.trim();
  const tagline = taglineInput.value.trim();
  const bio = bioInput.value.trim();
  const currentWork = currentWorkInput.value.trim();
  const learning = learningInput.value.trim();
  const askMe = askMeInput.value.trim();
  const github = githubInput.value.trim().replace(/^@/, '');
  const linkedin = linkedinInput.value.trim().replace(/^@/, '');
  const twitter = twitterInput.value.trim().replace(/^@/, '');
  const portfolio = portfolioInput.value.trim();
  const email = emailInput.value.trim();
  const blog = blogInput.value.trim();
  const coffee = coffeeInput.value.trim().replace(/^@/, '');
  const devto = devtoInput.value.trim().replace(/^@/, '');
  const medium = mediumInput.value.trim().replace(/^@/, '');

  if (!name && !tagline && !bio && !github) return null;

  let md = '';

  if (name) md += `# Hi there 👋, I'm ${name}!\n\n`;
  else md += `# Hi there 👋\n\n`;

  if (tagline) md += `### ${tagline}\n\n`;
  if (bio) md += `${bio}\n\n`;

  if (currentWork || learning || askMe) {
    if (currentWork) md += `- 🔭 I'm currently working on **${currentWork}**\n`;
    if (learning)    md += `- 🌱 I'm currently learning **${learning}**\n`;
    if (askMe)       md += `- 💬 Ask me about **${askMe}**\n`;
    md += '\n';
  }

  if (visitorCounter && visitorCounter.checked && github) {
    md += `![Profile Views](https://komarev.com/ghpvc/?username=${github}&color=4f46e5&style=for-the-badge&label=PROFILE+VIEWS)\n\n`;
  }

  const socials = [];
  if (github)    socials.push(`[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${github})`);
  if (linkedin)  socials.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${linkedin})`);
  if (twitter)   socials.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${twitter})`);
  if (portfolio) socials.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-4f46e5?style=for-the-badge&logo=google-chrome&logoColor=white)](${portfolio})`);
  if (email)     socials.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${email})`);
  if (blog)      socials.push(`[![Blog](https://img.shields.io/badge/Blog-FF5722?style=for-the-badge&logo=blogger&logoColor=white)](${blog})`);
  if (devto)     socials.push(`[![Dev.to](https://img.shields.io/badge/Dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white)](https://dev.to/${devto})`);
  if (medium)    socials.push(`[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@${medium})`);
  if (coffee)    socials.push(`[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/${coffee})`);

  if (socials.length > 0) {
    md += `<p align="left">\n`;
    socials.forEach(s => { md += `  ${s}\n`; });
    md += `</p>\n\n`;
  }

  const selectedTechs = getSelectedTechs();
  if (selectedTechs.length > 0) {
    md += `## 🛠️ Tech Stack\n\n`;
    md += `<p align="left">\n`;
    selectedTechs.forEach(key => {
      const t = TECH_DATA[key];
      if (!t) return;
      const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(t.label)}-f5f5f5?style=for-the-badge&logo=${t.logo}`;
      md += `  <img src="${badgeUrl}" alt="${t.label}" />\n`;
    });
    md += `</p>\n\n`;
  }

  const hasStats = (statsCard && statsCard.checked) ||
                   (langCard && langCard.checked) ||
                   (streakCard && streakCard.checked) ||
                   (trophyCard && trophyCard.checked);

  if (hasStats && github) {
    md += `## 📊 GitHub Stats\n\n`;

    if (statsCard && statsCard.checked) {
      md += `<p align="center">\n`;
      md += `  <img src="https://github-readme-stats.vercel.app/api?username=${github}&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" alt="GitHub Stats" />\n`;
      md += `</p>\n\n`;
    }

    if (langCard && langCard.checked) {
      md += `<p align="center">\n`;
      md += `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${github}&layout=compact&theme=tokyonight&hide_border=true" alt="Top Languages" />\n`;
      md += `</p>\n\n`;
    }

    if (streakCard && streakCard.checked) {
      md += `<p align="center">\n`;
      md += `  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${github}&theme=tokyonight&hide_border=true" alt="GitHub Streak" />\n`;
      md += `</p>\n\n`;
    }

    if (trophyCard && trophyCard.checked) {
      md += `<p align="center">\n`;
      md += `  <img src="https://github-profile-trophy.vercel.app/?username=${github}&theme=tokyonight&no-frame=true&row=1&column=6" alt="GitHub Trophies" />\n`;
      md += `</p>\n\n`;
    }
  }

  md += `---\n\n`;
  md += `⭐️ From [${name || 'me'}](https://github.com/${github || ''})\n`;

  return md;
}

// ===== Simple Markdown to HTML =====
function mdToHtml(md) {
  if (!md) return '';
  let html = md;

  html = html.replace(/```([\s\S]*?)```/g, (m, code) => '<pre><code>' + escapeHtml(code.trim()) + '</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  html = html.replace(/^---$/gm, '<hr />');
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  const lines = html.split('\n');
  const result = [];
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed === '') {
      if (inList) { result.push('</ul>'); inList = false; }
      return;
    }
    if (trimmed.startsWith('<li>')) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(trimmed);
    } else if (trimmed.startsWith('<')) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(trimmed);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push('<p>' + trimmed + '</p>');
    }
  });

  if (inList) result.push('</ul>');

  return result.join('\n');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================
// README GEN — Part 3 (Fixed)
// Render + Status + Events + Theme + Init
// ============================================

function setStatus(type, icon, text) {
  if (!statusBar) return;
  statusBar.className = 'status-bar';
  if (type === 'success') statusBar.classList.add('success');
  else if (type === 'error') statusBar.classList.add('error');
  statusBar.querySelector('.status-icon').textContent = icon;
  statusBar.querySelector('.status-text').textContent = text;
}

function render() {
  const md = buildMarkdown();

  if (!md) {
    outputBox.innerHTML = '<span class="output-placeholder">Your README.md will appear here...</span>';
    previewBox.innerHTML = `
      <div class="preview-placeholder">
        <span class="preview-icon">👁️</span>
        <p>Live preview will appear here</p>
      </div>`;
    setStatus('info', '🚀', 'Start filling the form to generate your README');
    return;
  }

  outputBox.textContent = md;
  previewBox.innerHTML = mdToHtml(md);
  setStatus('success', '✅', 'README generated successfully');
}

const allInputs = [
  nameInput, taglineInput, bioInput, currentWorkInput, learningInput, askMeInput,
  githubInput, linkedinInput, twitterInput, portfolioInput, emailInput, blogInput,
  coffeeInput, devtoInput, mediumInput
];

allInputs.forEach(input => {
  if (input) input.addEventListener('input', render);
});

[statsCard, langCard, streakCard, trophyCard, visitorCounter].forEach(cb => {
  if (cb) cb.addEventListener('change', render);
});

if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const md = buildMarkdown();
    if (!md) { alert('Fill the form first.'); return; }
    navigator.clipboard.writeText(md).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = orig;
        copyBtn.classList.remove('copied');
      }, 1200);
    });
  });
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const md = buildMarkdown();
    if (!md) { alert('Fill the form first.'); return; }
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  });
}

if (openPreviewBtn) {
  openPreviewBtn.addEventListener('click', () => {
    const md = buildMarkdown();
    if (!md) { alert('Fill the form first.'); return; }
    try {
      localStorage.setItem('devtools_md_content', md);
    } catch (e) {}
    window.open('markdown.html', '_blank');
  });
}

if (sampleBtn) {
  sampleBtn.addEventListener('click', () => {
    nameInput.value = 'John Doe';
    taglineInput.value = 'Full Stack Developer • AI Enthusiast';
    bioInput.value = 'I build web apps and love clean code. Passionate about developer tooling and design systems.';
    currentWorkInput.value = 'My new portfolio site';
    learningInput.value = 'Rust, WebAssembly';
    askMeInput.value = 'React, Python, AI, DevOps';
    githubInput.value = 'johndoe';
    linkedinInput.value = 'johndoe';
    twitterInput.value = 'johndoe';
    portfolioInput.value = 'https://johndoe.com';
    emailInput.value = 'john@example.com';

    techContainer.querySelectorAll('.tech-chip').forEach(chip => {
      const t = chip.dataset.tech;
      if (['python', 'javascript', 'typescript', 'react', 'nodejs', 'mongodb', 'docker', 'git', 'tensorflow', 'pytorch'].includes(t)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    statsCard.checked = true;
    langCard.checked = true;
    streakCard.checked = true;
    trophyCard.checked = false;
    visitorCounter.checked = true;

    render();
  });
}

if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    allInputs.forEach(input => { if (input) input.value = ''; });
    techContainer.querySelectorAll('.tech-chip').forEach(chip => chip.classList.remove('active'));
    statsCard.checked = true;
    langCard.checked = true;
    streakCard.checked = false;
    trophyCard.checked = false;
    visitorCounter.checked = true;
    render();
  });
}

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

renderTechChips();
render();