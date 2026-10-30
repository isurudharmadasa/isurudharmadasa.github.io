window.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const items = Array.from(links.querySelectorAll('a'));

  // Solid navigation bar once the hero is scrolled past
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) nav.classList.add('solid'); else onScroll();
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  items.forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Highlight the section in view
  const sections = items.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      items.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));
});

// Render projects, earlier projects and publications from the data files in js/
window.addEventListener('DOMContentLoaded', () => {
  const titled = (tag, p) => {
    const el = document.createElement(tag);
    if (p.link) { const a = document.createElement('a'); a.href = p.link; a.textContent = p.title; el.appendChild(a); }
    else el.textContent = p.title;
    return el;
  };
  const cards = (id, data) => {
    const list = document.getElementById(id);
    if (!list || !Array.isArray(data)) return;
    list.textContent = '';
    data.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project';
      const status = document.createElement('span');
      status.className = 'status' + (/progress|active|live/i.test(p.status) ? ' live' : '');
      status.textContent = p.status;
      const desc = document.createElement('p');
      desc.textContent = p.description;
      card.append(status, titled('h3', p), desc);
      list.appendChild(card);
    });
  };
  if (typeof PROJECTS !== 'undefined') cards('projectList', PROJECTS);
  if (typeof PAST_PROJECTS !== 'undefined') cards('pastList', PAST_PROJECTS);

  const pubs = document.getElementById('pubList');
  if (pubs && typeof PUBLICATIONS !== 'undefined') {
    pubs.textContent = '';
    PUBLICATIONS.forEach(p => {
      const li = document.createElement('li');
      const m = document.createElement('p');
      m.textContent = p.venue + ', ' + p.date;
      li.append(titled('h3', p), m);
      pubs.appendChild(li);
    });
  }
});

// Email is assembled only when the button is clicked, so it never appears in the page source
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('emailBtn');
  if (!btn) return;
  const codes = [100,104,97,114,109,97,100,97,115,97,46,105,115,117,114,117,64,103,109,97,105,108,46,99,111,109];
  btn.addEventListener('click', () => {
    const addr = String.fromCharCode.apply(null, codes);
    const a = document.createElement('a');
    a.className = 'icon-link';
    a.href = 'mailto:' + addr;
    a.textContent = addr;
    btn.replaceWith(a);
    a.focus();
  }, { once: true });
});

// Gentle scroll reveal (runs last so dynamically rendered cards are included)
window.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.split > h2, .prose, .portrait, .org, .edu, .extras, .project, .pubs li, .awards li, .sub, .foot-line');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach(t => { t.classList.add('reveal'); io.observe(t); });
});
