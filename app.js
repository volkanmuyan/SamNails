/* ================================================================
   LOADER
   ================================================================ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('out'), 1600);
});

/* ================================================================
   THEME TOGGLE
   ================================================================ */
const savedTheme = localStorage.getItem('sn-theme') || 'white';
document.documentElement.dataset.theme = savedTheme;

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'pink' ? 'white' : 'pink';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('sn-theme', next);
}

/* ================================================================
   LANGUAGE (i18n.js must be loaded first)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyLang();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

  initAll();
});

/* ================================================================
   CUSTOM CURSOR — nail polish bottle
   ================================================================ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(pointer:coarse)').matches) {
    if (cursor) cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  // Soft glow ring that lags well behind the cursor
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  document.body.appendChild(glow);

  // Hotspot: SVG 22×36, nail tip at top-center (11, 2).
  // transform-origin: 50% 3% ≈ (11, 1) keeps tip pinned through rotation.
  const OX = 11, OY = 2;
  let mx = -200, my = -200, cx = -200, cy = -200;
  let gx = -200, gy = -200;
  let lastX = -200, lastY = -200, trailTimer = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function anim() {
    cx += (mx - cx) * 0.26;
    cy += (my - cy) * 0.26;
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    cursor.style.transform = `translate(${cx - OX}px, ${cy - OY}px)`;
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(anim);
  })();

  // Sparkle + glitter trail
  const sparkleColors = ['#C4909A','#C8A96E','#F0D5D9','#E2CC9C','#FADADD','#D4A8B0'];
  const shapes = ['star','star','heart','dot','dot','dot'];

  function spawnParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const shape  = shapes[Math.floor(Math.random() * shapes.length)];
      const color  = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      const dur    = (.38 + Math.random() * .32).toFixed(2);
      const tx     = ((Math.random() - .5) * 30).toFixed(1);
      const ty     = (-6 - Math.random() * 22).toFixed(1);
      const rot    = Math.floor(Math.random() * 360);
      const ox     = x + (Math.random() - .5) * 12;
      const oy     = y + (Math.random() - .5) * 12;

      if (shape === 'dot') {
        const d = document.createElement('div');
        d.className = 'glitter';
        const sz = 3 + Math.random() * 4;
        d.style.cssText = `left:${ox-sz/2}px;top:${oy-sz/2}px;width:${sz}px;height:${sz}px;background:${color};--dur:${dur}s;--ty:${ty}px;`;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), dur * 1000 + 60);
      } else {
        const sp = document.createElement('div');
        sp.className = 'sparkle';
        sp.style.cssText = `left:${ox}px;top:${oy}px;--dur:${dur}s;--tx:${tx}px;--ty:${ty}px;--rot:${rot}deg;`;
        sp.innerHTML = shape === 'heart'
          ? `<svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 8.5C5 8.5 1 5.5 1 3A2 2 0 015 3 2 2 0 019 3C9 5.5 5 8.5 5 8.5Z" fill="${color}" opacity=".9"/></svg>`
          : `<svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0L5.9 3.5L9.5 4.2L6.6 6.9L7.6 10.5L5 8.5L2.4 10.5L3.4 6.9L0.5 4.2L4.1 3.5Z" fill="${color}" opacity=".95"/></svg>`;
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), dur * 1000 + 60);
      }
    }
  }

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - trailTimer < 42) return;
    if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) < 5) return;
    trailTimer = now; lastX = e.clientX; lastY = e.clientY;
    spawnParticles(e.clientX, e.clientY, 1 + (Math.random() < .35 ? 1 : 0));
  });

  // Click: ripple + burst
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'click-ripple';
    r.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:22px;height:22px;`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 680);
    for (let i = 0; i < 7; i++) {
      const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      const angle = (i / 7) * Math.PI * 2;
      const dist  = 18 + Math.random() * 20;
      const sp    = document.createElement('div');
      sp.className = 'sparkle';
      const dur = (.3 + Math.random() * .25).toFixed(2);
      sp.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--dur:${dur}s;--tx:${(Math.cos(angle)*dist).toFixed(1)}px;--ty:${(Math.sin(angle)*dist).toFixed(1)}px;--rot:${Math.floor(Math.random()*360)}deg;`;
      sp.innerHTML = `<svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 0L5.9 3.5L9.5 4.2L6.6 6.9L7.6 10.5L5 8.5L2.4 10.5L3.4 6.9L0.5 4.2L4.1 3.5Z" fill="${color}" opacity=".95"/></svg>`;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), dur * 1000 + 60);
    }
  });

  // Hover / text states
  document.querySelectorAll('a, button, .gallery-card, .service-block, .contact-card, .blog-card, .service-pick-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
  });
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-text'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-text'));
  });
}

/* ================================================================
   HERO PARTICLES
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count  = 55;
  const colors = ['#C8A96E', '#C4909A', '#E2CC9C', '#F0D5D9'];
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + 0.8,
    dx: (Math.random() - .5) * .35,
    dy: (Math.random() - .5) * .35,
    a: Math.random() * .55 + .1,
    color: colors[Math.floor(Math.random() * colors.length)],
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: .02 + Math.random() * .02
  }));

  function drawStar(ctx, x, y, n, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) {
      const angle = (i * Math.PI) / n - Math.PI / 2;
      const r = i % 2 === 0 ? outer : inner;
      i === 0 ? ctx.moveTo(x + r * Math.cos(angle), y + r * Math.sin(angle))
               : ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
    }
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.twinkle += p.twinkleSpeed;
      const alpha = p.a * (.6 + .4 * Math.sin(p.twinkle));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      drawStar(ctx, p.x, p.y, 4, p.r * 2.2, p.r * .7);
      ctx.fill();
      ctx.restore();
      p.x += p.dx; p.y += p.dy;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();

  /* Mouse parallax */
  const heroRight = document.querySelector('.hero-right img');
  if (heroRight) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - .5) * 12;
      const y = (e.clientY / window.innerHeight - .5) * 8;
      heroRight.style.transform = `scale(1) translate(${x}px, ${y}px)`;
    }, { passive: true });
  }
}

/* ================================================================
   HERO PHOTO
   ================================================================ */
function initHeroPhoto() {
  const img = document.getElementById('heroPhoto');
  if (!img) return;
  const urls = [
    'https://images.pexels.com/photos/17280274/pexels-photo-17280274.jpeg?auto=compress&cs=tinysrgb&w=1400',
    'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=1400',
    'https://images.pexels.com/photos/1244635/pexels-photo-1244635.jpeg?auto=compress&cs=tinysrgb&w=1400',
  ];
  let i = 0;
  img.onerror = () => { if (++i < urls.length) img.src = urls[i]; else img.style.display = 'none'; };
  img.src = urls[0];
}

/* ================================================================
   NAV
   ================================================================ */
function initNav() {
  const nav = document.getElementById('nav');
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  if (!nav) return;

  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      mob.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('open'); mob.classList.remove('open'); document.body.style.overflow = '';
    }));
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - nav.offsetHeight, behavior: 'smooth' });
    });
  });
}

/* ================================================================
   SCROLL REVEAL
   ================================================================ */
function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
  }, { threshold: .07, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => ro.observe(el));
}

/* ================================================================
   GALLERY DRAG
   ================================================================ */
function initGallery() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  track.addEventListener('mouseleave', () => isDown = false);
  track.addEventListener('mouseup', () => isDown = false);
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.4;
  });
}

/* ================================================================
   TESTIMONIALS CAROUSEL
   ================================================================ */
const TESTIMONIALS = [
  { name: 'Sophie V.', loc: 'Brussel', service: 'Babyboom', text: '"Absoluut fantastisch! Mijn babyboom nagels zijn perfect — precies zoals ik ze in gedachten had. Sam is echt een vakvrouw met oog voor detail."' },
  { name: 'Emma D.',   loc: 'Leuven',  service: 'Pedicure + Massage', text: '"De pedicure was heerlijk en de voetmassage was een verademing. Ik vertrok volledig ontspannen. Zeker terugkomen!"' },
  { name: 'Marie B.',  loc: 'Leuven',  service: 'Nail Art', text: '"De nail art die Sam heeft gedaan is adembenemend. Ze werkt heel precies en luistert perfect naar je wensen. Super tevreden!"' },
  { name: 'Lena K.',   loc: 'Mechelen',service: 'French', text: '"Ik kom al maanden bij Sam en elke keer ben ik weer verrast door de kwaliteit. Professioneel, netjes en heel gezellig."' },
  { name: 'Noor A.',   loc: 'Leuven',  service: 'Gelnagels', text: '"Mijn gelnagels gaan al weken mee zonder chipping. De service is top en de sfeer is super aangenaam. Absolute aanrader!"' },
];

function initTestimonials() {
  const slider = document.getElementById('testimonialsSlider');
  const dotsWrap = document.getElementById('testimonialsDots');
  const prev = document.getElementById('tPrev');
  const next = document.getElementById('tNext');
  if (!slider) return;

  let current = 0, timer;

  TESTIMONIALS.forEach((t, i) => {
    /* slide */
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
    const initials = t.name.split(' ').map(w => w[0]).join('');
    slide.innerHTML = `
      <div class="t-stars">${'<span class="t-star">★</span>'.repeat(5)}</div>
      <p class="t-text">${t.text}</p>
      <div class="t-author">
        <div class="t-avatar">${initials}</div>
        <div>
          <div class="t-name">${t.name} <span style="color:rgba(255,255,255,.3);font-weight:300">· ${t.loc}</span></div>
          <div class="t-service">${t.service}</div>
        </div>
      </div>`;
    slider.appendChild(slide);

    /* dot */
    const dot = document.createElement('div');
    dot.className = 'tdot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(n) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots   = dotsWrap.querySelectorAll('.tdot');
    slides[current].classList.remove('active');
    slides[current].classList.add('leaving');
    setTimeout(() => slides[current].classList.remove('leaving'), 650);
    dots[current].classList.remove('active');
    current = (n + TESTIMONIALS.length) % TESTIMONIALS.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  prev?.addEventListener('click', () => goTo(current - 1));
  next?.addEventListener('click', () => goTo(current + 1));
  resetTimer();
}

/* ================================================================
   LOYALTY DOTS
   ================================================================ */
function initLoyaltyDots() {
  const el = document.getElementById('lcDots');
  if (!el) return;
  for (let i = 1; i <= 9; i++) {
    const d = document.createElement('div');
    d.className = 'lc-dot' + (i <= 5 ? ' filled' : '');
    d.setAttribute('data-n', i);
    el.appendChild(d);
  }
}

/* ================================================================
   BOOKING WIZARD
   ================================================================ */
const SERVICES_DATA = [
  { icon: '💅', name: 'Eigen nagel',           price: '€30',      value: 'eigennagel' },
  { icon: '✨', name: 'French / Babyboom',      price: '€35',      value: 'french' },
  { icon: '🌸', name: 'Pedicure',               price: 'v.a. €35', value: 'pedicure' },
  { icon: '🦶', name: 'Voet massage (30min)',   price: '€45',      value: 'voetmassage' },
  { icon: '💎', name: 'Nail Art',               price: '€10/nagel',value: 'nailart' },
  { icon: '🆕', name: 'Nieuwe set',             price: 'v.a. €30', value: 'nieuweset' },
  { icon: '💄', name: 'Nagel lakken',           price: '€25',      value: 'lakken' },
  { icon: '✂️', name: 'Manicure',               price: '€15',      value: 'manicure' },
];
const SLOT_TIMES  = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
const SLOT_FULL   = [2, 6];

function initWizard() {
  const wizard = document.getElementById('bookingWizard');
  if (!wizard) return;

  let step = 1, selectedService = null, selectedDate = null, selectedTime = null;

  /* Build step 1 — service cards */
  const grid = document.getElementById('servicePickGrid');
  SERVICES_DATA.forEach(s => {
    const card = document.createElement('div');
    card.className = 'service-pick-card';
    card.innerHTML = `<div class="spc-icon">${s.icon}</div><div class="spc-name">${s.name}</div><div class="spc-price">${s.price}</div>`;
    card.addEventListener('click', () => {
      grid.querySelectorAll('.service-pick-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedService = s;
      document.getElementById('wiz-next-1')?.removeAttribute('disabled');
    });
    grid.appendChild(card);
  });

  /* Build step 2 — slots */
  const slotsEl = document.getElementById('wizSlots');
  SLOT_TIMES.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'slot-btn'; btn.textContent = t;
    if (SLOT_FULL.includes(i)) btn.disabled = true;
    btn.addEventListener('click', () => {
      slotsEl.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = t;
    });
    slotsEl.appendChild(btn);
  });

  /* Date picker */
  const dateEl = document.getElementById('wizDate');
  if (dateEl) {
    dateEl.min = new Date().toISOString().split('T')[0];
    dateEl.addEventListener('change', () => {
      const d = new Date(dateEl.value + 'T00:00:00');
      if (d.getDay() === 1) {
        dateEl.value = '';
        alert(t('book.closed'));
      } else {
        selectedDate = dateEl.value;
      }
    });
  }

  function showStep(n) {
    step = n;
    wizard.querySelectorAll('.wizard-panel').forEach((p, i) => {
      p.classList.toggle('active', i + 1 === n);
    });
    wizard.querySelectorAll('.wizard-step-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i + 1 === n);
      tab.classList.toggle('done', i + 1 < n);
    });
    if (n === 3) buildSummary();
  }

  function buildSummary() {
    const el = document.getElementById('wizSummary');
    if (!el) return;
    const dateStr = selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('nl-BE', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : '—';
    el.innerHTML = `<strong>${selectedService?.name || '—'}</strong><br>${dateStr} &nbsp;·&nbsp; ${selectedTime || '—'}`;
  }

  /* Nav buttons */
  document.getElementById('wiz-next-1')?.addEventListener('click', () => {
    if (!selectedService) return;
    showStep(2);
  });
  document.getElementById('wiz-prev-2')?.addEventListener('click', () => showStep(1));
  document.getElementById('wiz-next-2')?.addEventListener('click', () => {
    if (!selectedDate || !selectedTime) { alert('Kies een datum en tijdslot.'); return; }
    showStep(3);
  });
  document.getElementById('wiz-prev-3')?.addEventListener('click', () => showStep(2));

  /* Final submit */
  document.getElementById('wiz-submit')?.addEventListener('click', () => {
    const nameEl  = document.getElementById('wizName');
    const phoneEl = document.getElementById('wizPhone');
    let ok = true;

    [nameEl, phoneEl].forEach(el => {
      const fg = el.closest('.wiz-field');
      const valid = el.value.trim().length > 1;
      fg.classList.toggle('err', !valid);
      if (!valid) ok = false;
    });

    if (!ok) return;
    document.getElementById('bookingWizard').style.display = 'none';
    document.getElementById('bookSuccess').classList.add('show');
    document.getElementById('bookSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('bookAgain')?.addEventListener('click', () => {
    selectedService = selectedDate = selectedTime = null;
    grid.querySelectorAll('.service-pick-card').forEach(c => c.classList.remove('selected'));
    slotsEl.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
    if (dateEl) dateEl.value = '';
    document.getElementById('wizName').value = '';
    document.getElementById('wizPhone').value = '';
    document.querySelectorAll('.wiz-field').forEach(f => f.classList.remove('err'));
    document.getElementById('bookingWizard').style.display = '';
    document.getElementById('bookSuccess').classList.remove('show');
    showStep(1);
  });
}

/* ================================================================
   BLOG CARDS — dynamic i18n update (only when blog cards use data-i18n)
   ================================================================ */

/* ================================================================
   INIT ALL
   ================================================================ */
function initAll() {
  initCursor();
  initParticles();
  initHeroPhoto();
  initNav();
  initReveal();
  initGallery();
  initTestimonials();
  initLoyaltyDots();
  initWizard();
}
