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
  initEditorialMotion();
});

/* ── Editorial Motion (v9) ─────────────────────────── */
function initEditorialMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('motion');

  /* markers: fade in + letter-spacing settles */
  const markers = document.querySelectorAll('.mx-marker');
  if (markers.length) {
    markers.forEach(m => { m.classList.remove('reveal'); m.classList.add('mk-wait'); });
    const mkObs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('mk-in'); mkObs.unobserve(e.target); }
    }), { threshold: 0.5 });
    markers.forEach(m => mkObs.observe(m));
  }

  /* staggered editorial groups */
  const groups = [
    ['.sv-group', '.sv-row'],
    ['.mx-who-list', '.mx-who-item'],
    ['.mx-edu-lines', '.mx-edu-line'],
    ['.fa-links', '.fa-row'],
    ['.rv-inner', '.rv-strip'],
    ['.mx-steps', '.mx-step'],
    ['.faq-list', '.faq-item'],
    ['.footer-top', ':scope > div']
  ];
  const gObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('ed-in'); gObs.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  groups.forEach(([pSel, cSel]) => {
    document.querySelectorAll(pSel).forEach(parent => {
      const kids = parent.querySelectorAll(cSel);
      if (!kids.length) return;
      kids.forEach((k, i) => {
        k.classList.remove('reveal');
        k.classList.add('ed-item');
        k.style.transitionDelay = Math.min(i * 90, 540) + 'ms';
      });
      gObs.observe(parent);
    });
  });

  /* stars arrive one by one */
  const starEls = document.querySelectorAll('.rv-stars, .rv-score-stars, .ct-rating-stars');
  if (starEls.length) {
    const stObs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('ed-in'); stObs.unobserve(e.target); }
    }), { threshold: 0.6 });
    starEls.forEach(el => {
      const chars = [...el.textContent];
      let si = 0;
      el.innerHTML = chars.map(ch => ch === '★'
        ? `<span class="st-star" style="transition-delay:${(si++) * 110}ms">★</span>`
        : ch).join('');
      el.classList.add('st-host');
      stObs.observe(el);
    });
  }

  /* 5.0 counts up */
  const score = document.querySelector('.rv-score-num');
  if (score) {
    const target = parseFloat(score.textContent) || 5;
    const cObs = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      cObs.unobserve(e.target);
      const t0 = performance.now(), dur = 1300;
      const step = t => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        score.textContent = (target * eased).toFixed(1);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.8 });
    cObs.observe(score);
  }

  /* gold scroll progress hairline */
  const prog = document.createElement('div');
  prog.className = 'scroll-progress';
  prog.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prog);
  let progTick = false;
  const progUpd = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0).toFixed(4) + ')';
    progTick = false;
  };
  window.addEventListener('scroll', () => {
    if (!progTick) { progTick = true; requestAnimationFrame(progUpd); }
  }, { passive: true });
  progUpd();

  /* ghost numerals drift with scroll */
  const ghosts = document.querySelectorAll('.mx-step-ghost');
  if (ghosts.length) {
    let ticking = false;
    const drift = () => {
      const vh = window.innerHeight;
      ghosts.forEach(g => {
        const r = g.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const off = (r.top + r.height / 2 - vh / 2) * 0.08;
        g.style.transform = 'translateY(' + off.toFixed(1) + 'px)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(drift); }
    }, { passive: true });
    drift();
  }
}

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

// ── QUOTE BANNER — line-by-line L→R reveal ────────────────────
(function () {
  var sec = document.getElementById('quote-banner');
  if (!sec) return;

  var lines   = Array.from(sec.querySelectorAll('.qb-line'));
  var overlay = sec.querySelector('.qb-overlay');
  var eyebrow = sec.querySelector('.qb-eyebrow');
  var attr    = sec.querySelector('.qb-attr');
  var ticking = false;

  // cache words per line once at init
  var lineWords = lines.map(function (l) {
    return Array.from(l.querySelectorAll('.qb-word'));
  });

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function update() {
    var rect = sec.getBoundingClientRect();
    var winH = window.innerHeight;
    // animation runs while section is actively on screen
    var p = clamp((winH * 0.88 - rect.top) / (winH * 0.76), 0, 1);

    // overlay lifts: GPU opacity only, no repaint
    if (overlay) overlay.style.opacity = (0.94 - p * 0.30).toFixed(3);

    // eyebrow + rules
    if (eyebrow) eyebrow.style.opacity = clamp(p * 5, 0, 1).toFixed(3);
    sec.querySelectorAll('.qb-rule-top,.qb-rule-bottom').forEach(function (r) {
      r.style.opacity = clamp(p * 6, 0, 1).toFixed(3);
    });

    // Line-by-line L→R reveal
    // Each line gets an equal band of scroll progress.
    // Within each band, words stagger left→right so the last word of
    // line N finishes exactly when the first word of line N+1 starts.
    var WINDOW   = 0.08;   // scroll range for one word to go dim→full
    var P_START  = 0.06;   // when line 1 word 1 begins
    var P_TOTAL  = 0.84;   // total scroll range for all lines
    var nLines   = lineWords.length;
    var bandPer  = P_TOTAL / nLines;

    lineWords.forEach(function (words, li) {
      var ls  = P_START + li * bandPer;
      var nW  = words.length;
      var stagger = nW > 1 ? (bandPer - WINDOW) / (nW - 1) : 0;
      words.forEach(function (w, wi) {
        var wStart = ls + wi * stagger;
        var wp = clamp((p - wStart) / WINDOW, 0, 1);
        w.style.opacity = (0.12 + wp * 0.88).toFixed(3);
      });
    });

    // attribution appears after all lines done
    if (attr) attr.style.opacity = clamp((p - 0.92) / 0.07, 0, 1).toFixed(3) * 0.55;

    ticking = false;
  }

  function onScroll() {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

/* ── v13: reel playback resilience ─────────────────────
   iOS Low Power Mode / data saver blocks autoplay, which left
   some reels frozen on their poster. Play when visible, retry
   on first touch, and pause offscreen to save battery. */
document.addEventListener('DOMContentLoaded', () => {
  const reels = document.querySelectorAll('video[autoplay]');
  if (!reels.length) return;
  const tryPlay = v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const vObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) tryPlay(e.target);
    else e.target.pause();
  }), { threshold: 0.15 });
  reels.forEach(v => {
    v.muted = true;
    v.setAttribute('muted', '');
    v.playsInline = true;
    vObs.observe(v);
    v.addEventListener('click', () => tryPlay(v));
  });
  const kick = () => reels.forEach(v => {
    const r = v.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) tryPlay(v);
  });
  window.addEventListener('touchstart', kick, { once: true, passive: true });
  window.addEventListener('scroll', kick, { once: true, passive: true });
});

/* ── v17: site intro (Atelier Title Card — layered, ~2.9s), page frame, editorial numerals ── */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* full-screen intro — cream band + monogram unveil + seal, holds then lifts */
  const intro = document.getElementById('siteIntro');
  if (intro && !intro.classList.contains('si-skip') && !reduceMotion) {
    document.body.classList.add('si-lock');
    setTimeout(() => intro.classList.add('si-exit'), 4700);
    setTimeout(() => {
      intro.classList.add('si-done');
      document.body.classList.remove('si-lock');
    }, 5300);
  } else if (intro) {
    intro.classList.add('si-done');
  }

  /* fixed luxury page frame */
  const pf = document.createElement('div');
  pf.className = 'page-frame';
  pf.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pf);

  /* giant outlined index numerals: "02/08" → 02 + "of 08" */
  document.querySelectorAll('.sec-head-num').forEach(el => {
    const m = el.textContent.replace(/\s+/g, '').match(/^(\d+)\/(\d+)$/);
    if (m) el.innerHTML = '<span class="shn-big">' + m[1] + '</span><span class="shn-of">of ' + m[2] + '</span>';
  });
});

/* ── v17: sitewide graphic detail — wax seal, gold contrast band, edge spines ── */
document.addEventListener('DOMContentLoaded', () => {
  const NS = 'http://www.w3.org/2000/svg';

  /* reusable gold wax seal (unique textPath id per instance) */
  let sealSeq = 0;
  function waxSeal(ringText) {
    const id = 'wsPath' + (++sealSeq);
    const wrap = document.createElement('div');
    wrap.className = 'wax-seal';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML =
      '<svg viewBox="0 0 100 100">' +
        '<defs><path id="' + id + '" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"></path></defs>' +
        '<circle class="ws-ring" cx="50" cy="50" r="47"></circle>' +
        '<circle class="ws-ring-2" cx="50" cy="50" r="29"></circle>' +
        '<g class="ws-spin">' +
          '<text class="ws-text"><textPath href="#' + id + '" startOffset="0">' + ringText + '</textPath></text>' +
        '</g>' +
        '<text class="ws-mark" x="50" y="60" text-anchor="middle">CB</text>' +
      '</svg>';
    return wrap;
  }

  /* gold contrast colophon band — injected before the footer */
  const footer = document.getElementById('footer');
  if (footer && !document.querySelector('.cb-colophon')) {
    const col = document.createElement('section');
    col.className = 'cb-colophon';
    col.setAttribute('aria-hidden', 'true');
    const sealWrap = document.createElement('div');
    sealWrap.className = 'cb-seal-wrap';
    sealWrap.appendChild(waxSeal('· CYMBOLIZE BEAUTY · LAS VEGAS · NEVADA '));
    col.appendChild(sealWrap);
    const band = document.createElement('div');
    band.className = 'cb-goldband';
    band.innerHTML =
      '<div class="cb-goldband-inner">' +
        '<span>Hair Loss Specialist</span><i>&#9670;</i>' +
        '<span>Mesh Integration</span><i>&#9670;</i>' +
        '<span>Extensions</span><i>&#9670;</i>' +
        '<span>Las Vegas &middot; Nevada</span>' +
      '</div>';
    col.appendChild(band);
    footer.parentNode.insertBefore(col, footer);
  }

  /* editorial magazine spines on the screen edges (desktop only via CSS) */
  if (!document.querySelector('.edge-spine')) {
    const l = document.createElement('div');
    l.className = 'edge-spine edge-spine-l';
    l.setAttribute('aria-hidden', 'true');
    l.textContent = 'Cymbolize Beauty';
    const r = document.createElement('div');
    r.className = 'edge-spine edge-spine-r';
    r.setAttribute('aria-hidden', 'true');
    r.textContent = 'Las Vegas · Hair Loss Specialist';
    document.body.appendChild(l);
    document.body.appendChild(r);
  }
});

/* ── v18: circular action rail (book / contact / review / accessibility) ── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.fab-rail')) return;
  const rail = document.createElement('div');
  rail.className = 'fab-rail';
  const items = [
    { label: 'Book Now', href: 'https://cymbolizebeauty.glossgenius.com/services', ext: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/></svg>' },
    { label: 'Contact', href: 'contact.html', ext: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>' },
    { label: 'Leave a Review', href: 'https://www.google.com/search?q=CymbolizeBeauty+Las+Vegas+reviews', ext: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
    { label: 'Accessibility', href: 'accessibility.html', ext: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="M4 9.5h16"/><path d="M12 9.5v5"/><path d="M12 14.5L8.5 21"/><path d="M12 14.5l3.5 6.5"/></svg>' }
  ];
  items.forEach(it => {
    const a = document.createElement('a');
    a.className = 'fab-btn';
    a.href = it.href;
    a.setAttribute('data-label', it.label);
    a.setAttribute('aria-label', it.label);
    if (it.ext) { a.target = '_blank'; a.rel = 'noopener'; }
    a.innerHTML = it.icon;
    rail.appendChild(a);
  });
  document.body.appendChild(rail);
});
