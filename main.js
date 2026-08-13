/* =====================================================
   CymbolizeBeauty — main.js (editorial redesign v2)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar ─────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onS = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onS, { passive: true });
    onS();
  }

  /* ── Hamburger ──────────────────────────────── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ── Active nav ────────────────────────────── */
  const pg = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === pg || (pg === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ── Scroll reveal ─────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ── FAQ accordion ─────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ── Init modules ───────────────────────────── */
  initCursor();
  initContactForm();
});

/* ── Custom Cursor ─────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  if (!dot || !ring) return;
  let mx = -200, my = -200, rx = -200, ry = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a, button, .btn, .service, .condition, .faq-q').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
  });
}

/* ── Contact Form ──────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '06f7fff6-8d06-4ba7-9eff-544606cf446a',
          subject: 'CymbolizeBeauty — New Inquiry',
          from_name: data.name || 'Website Visitor',
          ...data
        }),
      });
      const result = await res.json();
      if (result.success) {
        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      } else throw new Error();
    } catch {
      alert('Something went wrong — please email Support@cymbolizebeauty.com');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
    }
  });
}

document.querySelectorAll('a[href="#book"]').forEach(l => {
  l.addEventListener('click', e => { e.preventDefault(); window.location.href = 'contact.html'; });
});
