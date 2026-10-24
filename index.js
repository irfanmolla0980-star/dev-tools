// ===== Back to Top Button =====
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

// ===== Theme Toggle Button =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  if (themeIcon) themeIcon.textContent = '☀️';
  if (themeText) themeText.textContent = 'Light Mode';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
    if (themeText) themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}