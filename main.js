/* ============================================================
   HexoraTech — main.js
   ============================================================ */

/* ---------- NAVBAR scroll ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- HAMBURGER / MOBILE MENU ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- PARTICLE CANVAS ---------- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  canvas.closest('section').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.closest('section').addEventListener('mouseleave', () => {
    mouse.x = null; mouse.y = null;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '108,99,255' : '0,212,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x -= dx * force * 0.03;
          this.y -= dy * force * 0.03;
        }
      }
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `rgb(${this.color})`;
      ctx.shadowColor = `rgba(${this.color},0.6)`;
      ctx.shadowBlur = this.size * 4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function buildParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }
  buildParticles();

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = 'rgba(108,99,255,1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }
  loop();
})();

/* ---------- TYPEWRITER ---------- */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'transforma negocios',
    'escala sin límites',
    'genera resultados',
    'supera expectativas',
    'define el futuro',
  ];
  let current = 0;
  let charIndex = 0;
  let deleting = false;
  let pauseTimer = null;

  function type() {
    const phrase = phrases[current];
    if (!deleting) {
      el.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 2200);
        return;
      }
    } else {
      el.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        current = (current + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
})();

/* ---------- SCROLL REVEAL ---------- */
(function initReveal() {
  const observers = new Map();

  function createObserver(delay = 0) {
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const cardDelay = parseInt(el.dataset.delay || 0);
          setTimeout(() => {
            el.classList.add('visible');
          }, cardDelay || delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  }

  const observer = createObserver();

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-card').forEach(el => {
    observer.observe(el);
  });
})();

/* ---------- COUNTER ANIMATION ---------- */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const startTime = performance.now();
        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

/* ---------- SERVICE CARD MOUSE GLOW ---------- */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ---------- CONTACT FORM — Web3Forms → fregosogenrique@gmail.com ----------
   Para activar el envío real:
   1. Ve a https://web3forms.com
   2. Ingresa fregosogenrique@gmail.com y confirma el correo
   3. Copia tu access_key y reemplaza el value en el input#w3f_key del HTML
   ---------------------------------------------------------------------- */
const FORM_DEST = 'https://api.web3forms.com/submit';
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.querySelector('span').textContent;
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Enviando...';

  try {
    const data = new FormData(form);
    const response = await fetch(FORM_DEST, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    });
    const result = await response.json();
    if (result.success) {
      btn.style.display = 'none';
      formSuccess.classList.add('show');
      form.reset();
    } else {
      throw new Error(result.message || 'Error al enviar');
    }
  } catch (err) {
    btn.disabled = false;
    btn.querySelector('span').textContent = originalText;
    alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo o escríbenos directamente a ventas@prechustech.com');
  }
});

/* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ---------- PARALLAX HERO GRID ---------- */
(function initParallax() {
  const grid = document.querySelector('.hero-grid-overlay');
  if (!grid) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    grid.style.transform = `translateY(${y * 0.2}px)`;
  }, { passive: true });
})();

/* ---------- PAGE LOAD ANIMATION ---------- */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});
