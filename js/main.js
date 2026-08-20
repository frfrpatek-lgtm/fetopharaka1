/* ==========================================================================
   Fetop Haraka Limited — main.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initImageFallbacks();
  initScrollReveal();
  initCounters();
  initProductFilter();
  initWhatsAppPopup();
  initContactForm();
});

/* --------------------------------------------------------------------
   Navbar shrink + shadow on scroll
   -------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------
   Mobile hamburger menu
   -------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

/* --------------------------------------------------------------------
   Image fallback handling (logo, hero, about, products)
   Any image that fails to load (or has no real src) reveals its
   sibling placeholder / fallback element instead.
   -------------------------------------------------------------------- */
function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const reveal = () => img.classList.add('loaded');

    if (img.complete && img.naturalWidth > 0) {
      reveal();
    }

    img.addEventListener('load', reveal);

    img.addEventListener('error', () => {
      img.style.display = 'none';
      const fallback = img.parentElement.querySelector('[data-fallback-target]');
      if (fallback) fallback.style.display = '';
    });
  });
}

/* --------------------------------------------------------------------
   Scroll reveal animations (Intersection Observer)
   -------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------
   Animated counters for stats
   -------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------
   Product category filter (products.html)
   -------------------------------------------------------------------- */
function initProductFilter() {
  window.__reinitProductFilter = initProductFilter;
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');
  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      productCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          card.classList.remove('hidden-item');
          card.classList.remove('fade-in');
          void card.offsetWidth;
          card.classList.add('fade-in');
        } else {
          card.classList.add('hidden-item');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------
   WhatsApp popup — shows 3s after load, session-based dismissal
   -------------------------------------------------------------------- */
function initWhatsAppPopup() {
  const popup = document.querySelector('.wa-popup');
  const floatBtn = document.querySelector('.wa-float-btn');
  const closeBtn = document.querySelector('.wa-close');
  if (!popup || !floatBtn) return;

  const SESSION_KEY = 'fetopWaPopupClosed';
  const alreadyClosed = sessionStorage.getItem(SESSION_KEY) === 'true';

  if (!alreadyClosed) {
    setTimeout(() => {
      popup.classList.add('show');
    }, 3000);
  } else {
    floatBtn.classList.add('show');
  }

  closeBtn?.addEventListener('click', () => {
    popup.classList.remove('show');
    floatBtn.classList.add('show');
    sessionStorage.setItem(SESSION_KEY, 'true');
  });

  floatBtn.addEventListener('click', (e) => {
    if (!popup.classList.contains('show')) return;
  });
}

/* --------------------------------------------------------------------
   Contact form validation (contact.html)
   Netlify Forms handles the actual submission; this adds client-side
   validation and an AJAX submit with a success message.
   -------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  const params = new URLSearchParams(window.location.search);
  const preselect = params.get('product');
  if (preselect) {
    const select = form.querySelector('#product-interest');
    if (select) {
      const match = Array.from(select.options).find((o) => o.value === preselect);
      if (match) select.value = preselect;
    }
  }

  const requiredFields = form.querySelectorAll('[required]');

  const showError = (field, message) => {
    field.classList.add('error');
    const errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  };

  const clearError = (field) => {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.classList.remove('show');
  };

  const validateField = (field) => {
    const value = field.value.trim();

    if (!value) {
      showError(field, 'This field is required.');
      return false;
    }

    if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field.type === 'tel') {
      const phonePattern = /^[0-9+()\s-]{7,}$/;
      if (!phonePattern.test(value)) {
        showError(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    clearError(field);
    return true;
  };

  requiredFields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(() => {
        form.reset();
        form.style.display = 'none';
        successMsg?.classList.add('show');
      })
      .catch(() => {
        alert('Something went wrong. Please try again or contact us via WhatsApp.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
  });
}
