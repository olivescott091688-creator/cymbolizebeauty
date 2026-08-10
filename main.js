/* =====================================================
   CymbolizeBeauty — main.js
   Handles: Nav, Scroll Reveal, Before/After Slider,
            FAQ Accordion, Contact Form (Web3Forms)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll behaviour ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile hamburger ----
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---- Before/After Slider ----
  initBeforeAfterSliders();

  // ---- Contact Form (Web3Forms) ----
  initContactForm();

});

/* =====================
   Before/After Slider
   ===================== */
function initBeforeAfterSliders() {
  document.querySelectorAll('.before-after-wrapper').forEach(wrapper => {
    const after    = wrapper.querySelector('.ba-after');
    const divider  = wrapper.querySelector('.ba-divider');
    const handle   = wrapper.querySelector('.ba-handle');
    let isDragging = false;

    function setPosition(x) {
      const rect  = wrapper.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.min(Math.max(pct, 2), 98);
      after.style.clipPath    = `inset(0 ${100 - pct}% 0 0)`;
      divider.style.left      = `${pct}%`;
      if (handle) handle.style.left = `${pct}%`;
    }

    wrapper.addEventListener('mousedown',  e => { isDragging = true; setPosition(e.clientX); });
    document.addEventListener('mousemove', e => { if (isDragging) setPosition(e.clientX); });
    document.addEventListener('mouseup',   ()  => { isDragging = false; });

    wrapper.addEventListener('touchstart', e => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('touchmove', e => { if (isDragging) setPosition(e.touches[0].clientX); },   { passive: true });
    document.addEventListener('touchend',  ()  => { isDragging = false; });
  });
}

/* =====================
   Contact Form
   ===================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '06f7fff6-8d06-4ba7-9eff-544606cf446a',
          subject:    'CymbolizeBeauty — New Inquiry',
          from_name:  data.name || 'Website Visitor',
          ...data,
        }),
      });
      const result = await res.json();

      if (result.success) {
        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      alert('Something went wrong — please email us directly at Support@cymbolizebeauty.com');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }
  });
}

/* =====================
   Smooth scroll for #book
   ===================== */
document.querySelectorAll('a[href="#book"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = 'contact.html';
  });
});
