/* ══════════════════════════════════════
   LivrExpress – script.js
══════════════════════════════════════ */

// ── Navbar scroll ──────────────────────
const navbar   = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

// ── Hamburger menu ──────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Scroll animations ───────────────────
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('animated'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.12 });

animatedEls.forEach(el => observer.observe(el));

// ── Back to top ─────────────────────────
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Smooth scroll for anchor links ──────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Counter animation (stats) ───────────
function animateCounter(el, target, suffix = '', duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased   = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
    const val     = Math.round(eased * target);
    el.textContent = val.toLocaleString('fr-FR') + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Trigger counters when hero stats enter viewport
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsEls = heroStats.querySelectorAll('.stat-value');
  const countersData = [
    { index: 0, val: 5000, prefix: '+', suffix: '', format: v => '+' + v.toLocaleString('fr-FR') },
    { index: 1, val: 98,   prefix: '',  suffix: '%', format: v => v + '%' },
  ];

  const statsObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    statsObserver.disconnect();

    countersData.forEach(({ index, val, format }) => {
      const el = statsEls[index];
      if (!el) return;
      const start = performance.now();
      const duration = 1400;
      const tick = (now) => {
        const p   = Math.min((now - start) / duration, 1);
        const e   = 1 - Math.pow(1 - p, 3);
        el.textContent = format(Math.round(e * val));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    // The "< 2h" stat stays static
  }, { threshold: 0.5 });

  statsObserver.observe(heroStats);
}

// ── Testimonials keyboard nav ───────────
const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach((card, i) => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && testimonialCards[i + 1]) testimonialCards[i + 1].focus();
    if (e.key === 'ArrowLeft'  && testimonialCards[i - 1]) testimonialCards[i - 1].focus();
  });
});

// ── Particle dots on hero (subtle) ──────
(function createParticles() {
  const heroShapes = document.querySelector('.hero-bg-shapes');
  if (!heroShapes) return;

  // Inject keyframe once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatDot {
      from { transform: translateY(0) translateX(0); opacity: .08; }
      to   { transform: translateY(-22px) translateX(12px); opacity: .15; }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 22; i++) {
    const dot = document.createElement('div');
    const size = (Math.random() * 4 + 2).toFixed(1);
    Object.assign(dot.style, {
      position:        'absolute',
      width:           size + 'px',
      height:          size + 'px',
      borderRadius:    '50%',
      background:      'rgba(255,255,255,' + (Math.random() * 0.12 + 0.04).toFixed(2) + ')',
      top:             (Math.random() * 100).toFixed(1) + '%',
      left:            (Math.random() * 100).toFixed(1) + '%',
      animation:       'floatDot ' + (Math.random() * 6 + 4).toFixed(1) + 's ease-in-out infinite alternate',
      animationDelay:  (Math.random() * 4).toFixed(1) + 's',
      pointerEvents:   'none',
    });
    heroShapes.appendChild(dot);
  }
})();
