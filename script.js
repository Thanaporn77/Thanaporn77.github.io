// ---- Dark / Light toggle ----
const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const current = root.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ---- Reveal on scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---- Highlight active nav link ----
const links = [...document.querySelectorAll('.nav-links a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

// ---- Year ----
document.getElementById('year').textContent = new Date().getFullYear();

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Stagger reveal inside grids ----
document.querySelectorAll('.soft-grid, .projects-grid, .tiers, .duties, .sites').forEach((g) => {
  [...g.querySelectorAll(':scope > .reveal')].forEach((el, i) => el.style.setProperty('--d', (i % 6) * 0.07 + 's'));
});

// ---- Rotating word in hero ----
if (document.getElementById('rotator') && !reduce) {
  const words = ['Laravel', 'React', 'Node.js', 'Next.js', 'React Native', 'WordPress'];
  let i = 0;
  setInterval(() => {
    const rot = document.getElementById('rotator');
    if (!rot) return;
    rot.classList.add('out');
    setTimeout(() => { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 300);
  }, 2200);
}

// ---- Count-up numbers ----
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    counter.unobserve(el);
    if (reduce) return;
    const step = (t) => {
      const p = Math.min((t - t0) / 900, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));

// ---- Spotlight that follows the mouse on cards ----
document.addEventListener('pointermove', (e) => {
  const card = e.target.closest && e.target.closest('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', e.clientX - r.left + 'px');
  card.style.setProperty('--my', e.clientY - r.top + 'px');
}, { passive: true });

// ---- Scroll progress bar ----
const bar = document.getElementById('progress');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    ticking = false;
  });
}, { passive: true });

// ---- Language switch (EN / TH) ----
const i18nEls = [...document.querySelectorAll('[data-th]')];
const titles = { en: document.title, th: document.title };
function setLang(lang) {
  i18nEls.forEach((el) => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    el.innerHTML = lang === 'th' ? el.dataset.th : el.dataset.en;
  });
  root.lang = lang;
  root.dataset.lang = lang;
  document.title = titles[lang];
  try { localStorage.setItem('lang', lang); } catch (e) {}
}
document.getElementById('langToggle').addEventListener('click', () => {
  setLang(root.dataset.lang === 'th' ? 'en' : 'th');
});
let startLang = new URLSearchParams(location.search).get('lang');
if (!startLang) { try { startLang = localStorage.getItem('lang'); } catch (e) {} }
if (startLang === 'th') setLang('th');

// ---- Stat slider ----
(() => {
  const track = document.getElementById('slides');
  if (!track) return;
  const slides = [...track.children];
  const dots = [...document.querySelectorAll('#dots button')];
  let current = 0, timer;
  const go = (i) => {
    current = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };
  const mark = () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    current = i;
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  };
  track.addEventListener('scroll', () => requestAnimationFrame(mark), { passive: true });
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); restart(); }));
  document.getElementById('prevSlide').addEventListener('click', () => { go(current - 1); restart(); });
  document.getElementById('nextSlide').addEventListener('click', () => { go(current + 1); restart(); });
  const start = () => { if (!reduce) timer = setInterval(() => go(current + 1), 5000); };
  const stop = () => clearInterval(timer);
  const restart = () => { stop(); start(); };
  const box = document.getElementById('slider');
  box.addEventListener('mouseenter', stop);
  box.addEventListener('mouseleave', start);
  box.addEventListener('touchstart', stop, { passive: true });
  mark(); start();
})();
