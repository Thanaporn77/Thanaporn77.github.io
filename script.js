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
const rot = document.getElementById('rotator');
if (rot && !reduce) {
  const words = ['Laravel', 'React', 'Node.js', 'Next.js', 'React Native', 'WordPress'];
  let i = 0;
  setInterval(() => {
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
document.querySelectorAll('[data-count]').forEach((el) => { if (!reduce) el.textContent = '0'; counter.observe(el); });

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
