/* HERO PHOTO */
(function() {
  const img = document.getElementById('heroPhoto');
  if (!img) return;
  const urls = [
    'https://images.pexels.com/photos/17280274/pexels-photo-17280274.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/3997388/pexels-photo-3997388.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ];
  let i = 0;
  img.onerror = function() {
    i++;
    if (i < urls.length) img.src = urls[i];
    else img.style.display = 'none';
  };
  img.src = urls[0];
})();

/* SPARKLES */
const sparkleData = [
  { top:'12%', left:'8%',  size:8,  dur:'3.2s', delay:'0s'   },
  { top:'20%', left:'88%', size:6,  dur:'2.8s', delay:'0.7s' },
  { top:'35%', left:'15%', size:5,  dur:'4s',   delay:'1.4s' },
  { top:'60%', left:'92%', size:7,  dur:'3.5s', delay:'0.3s' },
  { top:'75%', left:'5%',  size:5,  dur:'2.5s', delay:'1.1s' },
  { top:'50%', left:'75%', size:9,  dur:'3.8s', delay:'0.5s' },
  { top:'85%', left:'60%', size:6,  dur:'3s',   delay:'1.8s' },
  { top:'10%', left:'55%', size:4,  dur:'4.2s', delay:'0.9s' },
];
const sc = document.getElementById('sparkles');
if (sc) {
  sparkleData.forEach(d => {
    const el = document.createElement('div');
    el.className = 'sp';
    el.style.cssText = `top:${d.top};left:${d.left};width:${d.size}px;height:${d.size}px;--dur:${d.dur};--delay:${d.delay}`;
    sc.appendChild(el);
  });
}

/* LOYALTY DOTS */
const dotsEl = document.getElementById('loyaltyDots');
if (dotsEl) {
  for (let i = 1; i <= 9; i++) {
    const d = document.createElement('div');
    d.className = 'loyalty-dot' + (i <= 5 ? ' filled' : '');
    d.setAttribute('data-n', i);
    dotsEl.appendChild(d);
  }
}

/* NAV */
const nav = document.getElementById('nav');
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');

if (nav) {
  window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', scrollY > 30), { passive: true }
  );
}
if (ham && mob) {
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mob.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - (nav ? nav.offsetHeight : 0), behavior: 'smooth' });
  });
});

/* SCROLL REVEAL */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .nail-float').forEach(el => ro.observe(el));

/* TIME SLOTS */
const slotTimes = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
const slotsEl = document.getElementById('slots');
const btimeEl = document.getElementById('btime');

if (slotsEl && btimeEl) {
  slotTimes.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot-btn';
    btn.textContent = t;
    if ([2, 6].includes(i)) btn.disabled = true;
    btn.addEventListener('click', () => {
      slotsEl.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btimeEl.value = t;
      document.getElementById('fg-time').classList.remove('has-error');
    });
    slotsEl.appendChild(btn);
  });
}

/* DATE PICKER — block Mondays */
const bdateEl = document.getElementById('bdate');
if (bdateEl) {
  const today = new Date();
  bdateEl.min = today.toISOString().split('T')[0];
  bdateEl.addEventListener('change', () => {
    const d = new Date(bdateEl.value + 'T00:00:00');
    if (d.getDay() === 1) {
      bdateEl.value = '';
      alert('Maandag gesloten. Kies een andere dag.');
    }
  });
}

/* BOOKING FORM */
const form = document.getElementById('bookForm');
const bookSuccess = document.getElementById('bookSuccess');

function validate(id, check) {
  const fg = document.getElementById(id);
  const inp = fg.querySelector('input,select');
  const ok = check(inp);
  fg.classList.toggle('has-error', !ok);
  if (inp) inp.classList.toggle('error', !ok);
  return ok;
}

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = validate('fg-name',    el => el.value.trim().length > 1);
    const p = validate('fg-phone',   el => el.value.trim().length > 4);
    const s = validate('fg-service', el => el.value !== '');
    const d = validate('fg-date',    el => el.value !== '');
    const tFg = document.getElementById('fg-time');
    const t = btimeEl.value !== '';
    tFg.classList.toggle('has-error', !t);
    if (!(n && p && s && d && t)) return;
    form.style.display = 'none';
    bookSuccess.classList.add('show');
    bookSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

const bookAgain = document.getElementById('bookAgain');
if (bookAgain) {
  bookAgain.addEventListener('click', () => {
    form.reset();
    btimeEl.value = '';
    slotsEl.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.has-error').forEach(g => g.classList.remove('has-error'));
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.style.display = '';
    bookSuccess.classList.remove('show');
  });
}
