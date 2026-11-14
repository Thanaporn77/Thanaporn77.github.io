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
document.querySelectorAll('.pgrid').forEach((g) => {
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
function countUp(el) {
  if (reduce || el.dataset.done) return;
  el.dataset.done = '1';
  const end = +el.dataset.count, t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / 900, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { counter.unobserve(e.target); countUp(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => { if (!el.closest('.slide')) counter.observe(el); });

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

// ---- Scroll-pinned slides (vertical) ----
(() => {
  const box = document.getElementById('scrolly');
  if (!box) return;
  const slides = [...document.querySelectorAll('#slides .slide')];
  const dots = [...document.querySelectorAll('#dots button')];
  const no = document.getElementById('slideNo');
  let current = -1;
  const show = (i) => {
    if (i === current) return;
    current = i;
    slides.forEach((sl, k) => { sl.classList.toggle('active', k === i); sl.classList.toggle('past', k < i); });
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    no.textContent = String(i + 1).padStart(2, '0');
    slides[i].querySelectorAll('[data-count]').forEach(countUp);
  };
  const update = () => {
    const r = box.getBoundingClientRect();
    const total = box.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(Math.max(-r.top / total, 0), 0.9999) : 0;
    show(Math.floor(p * slides.length));
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', update);
  dots.forEach((d, k) => d.addEventListener('click', () => {
    const total = box.offsetHeight - innerHeight;
    scrollTo({ top: box.offsetTop + total * (k + 0.5) / slides.length, behavior: reduce ? 'auto' : 'smooth' });
  }));
  update();
})();

// ---- Skill filter ----
(() => {
  const btns = [...document.querySelectorAll('.filter')];
  const pills = [...document.querySelectorAll('#skillPills li')];
  btns.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    btns.forEach((x) => x.classList.toggle('active', x === b));
    pills.forEach((li, i) => {
      const show = f === 'all' ? true : li.dataset.cat === f;
      li.classList.toggle('off', !show);
      li.classList.remove('pop');
      if (show && !reduce) { void li.offsetWidth; li.style.animationDelay = (i % 12) * 0.02 + 's'; li.classList.add('pop'); }
    });
  }));
})();

// ---- More-projects filter ----
(() => {
  const btns = [...document.querySelectorAll('[data-mfilter]')];
  const rows = [...document.querySelectorAll('#moreList li')];
  btns.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.mfilter;
    btns.forEach((x) => x.classList.toggle('active', x === b));
    rows.forEach((li, i) => {
      const show = f === 'all' || li.dataset.status === f;
      li.classList.toggle('off', !show);
      li.classList.remove('pop');
      if (show && !reduce) { void li.offsetWidth; li.style.animationDelay = (i % 10) * 0.025 + 's'; li.classList.add('pop'); }
    });
  }));
})();
