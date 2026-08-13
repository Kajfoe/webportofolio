/* =========================================================
   PORTFOLIO — MAIN JS
   Vanilla JS, no build step. Loads data from localStorage
   (set by admin.html) with data/data.json as the source of
   truth on first run, then renders every section dynamically.
   ========================================================= */

const STORAGE_KEY = 'portfolio_data_v1';

/* ---------------------------------------------------------
   1. DATA LOADING
   --------------------------------------------------------- */
async function loadData(){
  // 1. Prefer data saved by the admin panel
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved){
    try { return JSON.parse(saved); } catch(e){ /* fall through */ }
  }
  // 2. Otherwise fetch the default JSON file (works when served over http/https)
  try{
    const res = await fetch('data/data.json');
    if (res.ok){
      const json = await res.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
      return json;
    }
  }catch(e){ /* file:// fetch is blocked by browsers — fall back below */ }
  // 3. Last resort: embedded copy so the site still works opened directly from disk
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.DEFAULT_DATA));
  return window.DEFAULT_DATA;
}

let DATA = null;

/* ---------------------------------------------------------
   2. ICONS (lucide) helper
   --------------------------------------------------------- */
function icon(name, cls=''){ return `<i data-lucide="${name}" class="${cls}"></i>`; }
function refreshIcons(){ if (window.lucide) lucide.createIcons(); }

/* ---------------------------------------------------------
   3. RENDER FUNCTIONS
   --------------------------------------------------------- */
function renderAll(){
  document.title = DATA.site.title;
  document.getElementById('logo-text').textContent = DATA.site.logoText;
  document.getElementById('loader-text').textContent = DATA.site.loaderText;
  applyTheme(DATA.theme);
  renderHero();
  renderAbout();
  renderSkills();
  renderEducation();
  renderExperience();
  renderCertificates();
  renderGallery();
  renderContact();
  renderFooter();
  renderStats();
  applySectionOrderAndVisibility();
  refreshIcons();
}

function applyTheme(theme){
  document.documentElement.style.setProperty('--blue', theme.colorBlue);
  document.documentElement.style.setProperty('--purple', theme.colorPurple);
  const saved = localStorage.getItem('portfolio_theme_mode');
  document.body.setAttribute('data-theme', saved || theme.mode || 'dark');
}

function renderHero(){
  const h = DATA.hero;
  document.getElementById('hero-greeting').textContent = h.greeting;
  document.getElementById('hero-name').textContent = h.name;
  document.getElementById('hero-desc').textContent = h.description;
  const photo = document.getElementById('hero-photo');
  photo.src = h.photo;
  photo.alt = h.name;
  document.getElementById('btn-cv').href = h.cvFile;
  window.HERO_ROLES = h.roles && h.roles.length ? h.roles : ['Developer'];
}

function renderAbout(){
  document.getElementById('about-heading').textContent = DATA.about.heading;
  document.getElementById('about-desc').textContent = DATA.about.description;
  const grid = document.getElementById('bio-grid');
  grid.innerHTML = Object.entries(DATA.about.biodata).map(([k,v]) => `
    <div class="bio-item glass reveal-zoom">
      <div class="k">${k}</div>
      <div class="v">${v}</div>
    </div>`).join('');
}

function renderSkills(){
  document.getElementById('skills-heading').textContent = DATA.skills.heading;
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = DATA.skills.categories.map((s,idx) => {
    const circumference = 301; // 2*PI*r (r=48)
    const offset = circumference - (circumference * s.level/100);
    const gradId = `gradSkill-${idx}`;
    return `
    <div class="skill-card glass tilt reveal-zoom">
      <div class="skill-ring" data-offset="${offset}">
        <svg viewBox="0 0 110 110">
          <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--blue-bright)"/>
              <stop offset="100%" stop-color="var(--purple-bright)"/>
            </linearGradient>
          </defs>
          <circle class="track" cx="55" cy="55" r="48"></circle>
          <circle class="bar" cx="55" cy="55" r="48" style="stroke:url(#${gradId})"></circle>
        </svg>
        <div class="pct">${s.level}%</div>
      </div>
      ${icon(s.icon,'skill-icon')}
      <div class="skill-name">${s.name}</div>
    </div>`;
  }).join('');
}

function animateSkillRings(){
  document.querySelectorAll('.skill-ring').forEach(r => {
    const bar = r.querySelector('.bar');
    if (bar) bar.style.strokeDashoffset = r.dataset.offset;
  });
}

function renderEducation(){
  document.getElementById('education-heading').textContent = DATA.education.heading;
  const el = document.getElementById('timeline');
  el.innerHTML = DATA.education.items.map(i => `
    <div class="timeline-item reveal-left">
      <div class="period">${i.period}</div>
      <h3>${i.title}</h3>
      <div class="place">${i.place}</div>
      <p>${i.desc}</p>
    </div>`).join('');
}

function renderExperience(){
  document.getElementById('experience-heading').textContent = DATA.experience.heading;
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = DATA.experience.items.map(p => `
    <div class="project-card glass tilt reveal">
      <div class="project-thumb">
        <img src="${p.thumbnail}" alt="${p.title}" onerror="this.src='https://placehold.co/600x400/0a0d1c/7fa4ff?text=${encodeURIComponent(p.title)}'">
        <span class="project-status">${p.status}</span>
      </div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tech-tags">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div>
        <div class="project-links">
          <a href="${p.demo}" target="_blank" rel="noopener">${icon('external-link')} Demo</a>
          <a href="${p.github}" target="_blank" rel="noopener">${icon('github')} Code</a>
        </div>
      </div>
    </div>`).join('');
}

function renderCertificates(){
  document.getElementById('certificate-heading').textContent = DATA.certificate.heading;
  const wrap = document.getElementById('cert-slider');
  wrap.innerHTML = DATA.certificate.items.map((c,idx) => `
    <div class="cert-card glass tilt" data-idx="${idx}">
      <img src="${c.image}" alt="${c.title}" onerror="this.src='https://placehold.co/500x340/0a0d1c/cd8bff?text=${encodeURIComponent(c.title)}'">
      <div class="cert-info">
        <h4>${c.title}</h4>
        <span>${c.issuer}</span>
      </div>
    </div>`).join('');
  wrap.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card.querySelector('img').src));
  });
}

function renderGallery(){
  document.getElementById('gallery-heading').textContent = DATA.gallery.heading;
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = DATA.gallery.items.map(g => `
    <div class="gallery-item reveal-zoom">
      <img src="${g.image}" alt="${g.caption}" onerror="this.src='https://placehold.co/500x650/0a0d1c/4f7cff?text=${encodeURIComponent(g.caption)}'">
      <div class="gallery-overlay">${g.caption}</div>
    </div>`).join('');
  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item.querySelector('img').src));
  });
}

function renderContact(){
  const c = DATA.contact;
  document.getElementById('contact-heading').textContent = c.heading;
  document.getElementById('contact-desc').textContent = c.description;
  document.getElementById('contact-email').textContent = c.email;
  document.getElementById('contact-whatsapp-link').href = `https://wa.me/${c.whatsapp}`;
  document.getElementById('map-iframe').src = c.mapEmbed;
  document.getElementById('social-github').href = c.social.github;
  document.getElementById('social-linkedin').href = c.social.linkedin;
  document.getElementById('social-instagram').href = c.social.instagram;
  document.getElementById('social-whatsapp').href = `https://wa.me/${c.whatsapp}`;
}

function renderFooter(){
  document.getElementById('footer-text').textContent = DATA.footer.text;
  document.getElementById('footer-logo').textContent = DATA.site.logoText;
  document.getElementById('year').textContent = new Date().getFullYear();
  const s = DATA.contact.social;
  document.getElementById('footer-social-1').href = s.github;
  document.getElementById('footer-social-2').href = s.linkedin;
  document.getElementById('footer-social-3').href = s.instagram;
}

function renderStats(){
  const s = DATA.stats;
  animateCount(document.getElementById('stat-visitors'), s.visitors);
  animateCount(document.getElementById('stat-projects'), s.projects);
  animateCount(document.getElementById('stat-years'), s.experienceYears);
  animateCount(document.getElementById('stat-coffee'), s.cupsOfCoffee);
}

function applySectionOrderAndVisibility(){
  const main = document.getElementById('main-sections');
  DATA.sectionOrder.forEach(key => {
    const el = document.getElementById('section-'+key);
    if (!el) return;
    main.appendChild(el);
    el.style.display = DATA.sectionVisibility[key] === false ? 'none' : '';
  });
}

/* ---------------------------------------------------------
   4. LOADER
   --------------------------------------------------------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 900);
});

/* ---------------------------------------------------------
   5. CUSTOM CURSOR
   --------------------------------------------------------- */
function initCursor(){
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const glow = document.querySelector('.mouse-glow');
  let rx=0, ry=0, mx=0, my=0;
  window.addEventListener('mousemove', e => {
    dot.style.left = e.clientX+'px'; dot.style.top = e.clientY+'px';
    mx = e.clientX; my = e.clientY;
    glow.style.left = e.clientX+'px'; glow.style.top = e.clientY+'px';
  });
  (function raf(){ rx += (mx-rx)*0.18; ry += (my-ry)*0.18; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(raf); })();
  document.querySelectorAll('a,button,.tilt,input,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ---------------------------------------------------------
   6. SCROLL PROGRESS + NAVBAR + BACK TO TOP
   --------------------------------------------------------- */
function initScrollFx(){
  const bar = document.getElementById('scroll-progress');
  const nav = document.getElementById('navbar');
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct+'%';
    nav.classList.toggle('scrolled', h.scrollTop > 40);
    btt.classList.toggle('show', h.scrollTop > 600);
    highlightActiveNav();
  });
  btt.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

function highlightActiveNav(){
  const links = document.querySelectorAll('.nav-links a');
  let current = '';
  document.querySelectorAll('.section, .hero').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) current = sec.id;
  });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+current));
}

/* ---------------------------------------------------------
   7. MOBILE MENU
   --------------------------------------------------------- */
function initMobileMenu(){
  const btn = document.getElementById('hamburger');
  const nav = document.querySelector('.nav-links');
  btn.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

/* ---------------------------------------------------------
   8. TYPING ROLE TEXT
   --------------------------------------------------------- */
function initTyping(){
  const el = document.getElementById('hero-role-text');
  const roles = window.HERO_ROLES || ['Developer'];
  let ri=0, ci=0, deleting=false;
  function tick(){
    const word = roles[ri];
    el.textContent = deleting ? word.slice(0,ci--) : word.slice(0,ci++);
    let delay = deleting ? 45 : 85;
    if (!deleting && ci === word.length+1){ deleting = true; delay = 1400; }
    else if (deleting && ci === 0){ deleting = false; ri = (ri+1)%roles.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------------------------------------------------------
   9. SCROLL REVEAL (IntersectionObserver)
   --------------------------------------------------------- */
function initReveal(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        if (e.target.closest('#section-skills')) animateSkillRings();
        obs.unobserve(e.target);
      }
    });
  }, { threshold:.18 });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-zoom').forEach(el => obs.observe(el));
}
// re-run for elements injected after initial render
function refreshReveal(){ initReveal(); }

/* ---------------------------------------------------------
   10. 3D TILT ON HOVER
   --------------------------------------------------------- */
function initTilt(){
  document.addEventListener('mousemove', e => {
    const el = e.target.closest('.tilt');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - .5;
    const py = (e.clientY - r.top)/r.height - .5;
    el.style.transform = `perspective(800px) rotateX(${-py*10}deg) rotateY(${px*10}deg) translateY(-4px)`;
  });
  document.addEventListener('mouseout', e => {
    const el = e.target.closest('.tilt');
    if (el) el.style.transform = '';
  });
}

/* ---------------------------------------------------------
   11. HERO PHOTO PARALLAX
   --------------------------------------------------------- */
function initHeroParallax(){
  const wrap = document.getElementById('hero-photo-wrap');
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const px = (e.clientX/window.innerWidth - .5) * 24;
    const py = (e.clientY/window.innerHeight - .5) * 24;
    wrap.style.transform = `rotateY(${px}deg) rotateX(${-py}deg)`;
  });
}

/* ---------------------------------------------------------
   12. RIPPLE BUTTON EFFECT
   --------------------------------------------------------- */
function initRipple(){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      r.style.left = (e.clientX-rect.left)+'px';
      r.style.top = (e.clientY-rect.top)+'px';
      this.appendChild(r);
      setTimeout(()=>r.remove(), 650);
    });
  });
}

/* ---------------------------------------------------------
   13. THEME TOGGLE
   --------------------------------------------------------- */
function initThemeToggle(){
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('portfolio_theme_mode', next);
  });
}

/* ---------------------------------------------------------
   14. LIGHTBOX
   --------------------------------------------------------- */
function openLightbox(src){
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  lb.classList.add('open');
}
function initLightbox(){
  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target.id === 'lightbox' || e.target.closest('.close-lb')) document.getElementById('lightbox').classList.remove('open');
  });
}

/* ---------------------------------------------------------
   15. CERTIFICATE SLIDER NAV
   --------------------------------------------------------- */
function initCertNav(){
  const slider = document.getElementById('cert-slider');
  document.getElementById('cert-prev').addEventListener('click', () => slider.scrollBy({left:-310, behavior:'smooth'}));
  document.getElementById('cert-next').addEventListener('click', () => slider.scrollBy({left:310, behavior:'smooth'}));
}

/* ---------------------------------------------------------
   16. CONTACT FORM (front-end only demo)
   --------------------------------------------------------- */
function initContactForm(){
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Terkirim ✓';
    form.reset();
    setTimeout(()=> btn.innerHTML = original, 2400);
  });
}

/* ---------------------------------------------------------
   17. DIGITAL CLOCK
   --------------------------------------------------------- */
function initClock(){
  const el = document.getElementById('digital-clock');
  function tick(){
    const d = new Date();
    el.textContent = d.toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }
  tick(); setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   18. ANIMATED COUNTER
   --------------------------------------------------------- */
function animateCount(el, target){
  if (!el) return;
  let cur = 0; const step = Math.max(1, target/60);
  const t = setInterval(() => {
    cur += step;
    if (cur >= target){ cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur).toLocaleString('id-ID');
  }, 20);
}

/* ---------------------------------------------------------
   19. PARTICLE BACKGROUND (canvas)
   --------------------------------------------------------- */
function initParticles(){
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let w,h,particles=[];
  function resize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight; }
  resize(); addEventListener('resize', resize);
  const COUNT = innerWidth < 700 ? 34 : 70;
  for (let i=0;i<COUNT;i++){
    particles.push({ x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.6+.4, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25, hue: Math.random()>.5 ? '79,124,255' : '168,85,247' });
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0) p.x=w; if (p.x>w) p.x=0; if (p.y<0) p.y=h; if (p.y>h) p.y=0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue},.55)`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------------------------------------------------
   20. EASTER EGG (Konami code + logo triple-click)
   --------------------------------------------------------- */
function initEasterEgg(){
  const modal = document.getElementById('easter-egg');
  const closeIt = () => modal.classList.remove('open');
  document.querySelector('.egg-close')?.addEventListener('click', closeIt);
  modal.addEventListener('click', e => { if (e.target.id==='easter-egg') closeIt(); });

  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    pos = (e.key === seq[pos]) ? pos+1 : 0;
    if (pos === seq.length){ modal.classList.add('open'); pos = 0; }
  });

  let clicks = 0, clickTimer;
  document.getElementById('logo-link')?.addEventListener('click', e => {
    e.preventDefault(); clicks++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(()=>clicks=0, 600);
    if (clicks === 3){ modal.classList.add('open'); clicks = 0; }
  });
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  DATA = await loadData();
  renderAll();
  initCursor();
  initScrollFx();
  initMobileMenu();
  initTyping();
  initReveal();
  initTilt();
  initHeroParallax();
  initRipple();
  initThemeToggle();
  initLightbox();
  initCertNav();
  initContactForm();
  initClock();
  initParticles();
  initEasterEgg();
  refreshIcons();
  // re-observe reveal targets rendered after DOM ready
  setTimeout(refreshReveal, 60);
});
