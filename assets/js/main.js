/* ============================================================
   MAIN.JS  –  Shared / Global Interactivity
   Athlete Management System
   ============================================================ */
'use strict';

/* ── Navbar scroll effect ─────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Active nav-link highlighting on scroll ──────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const navHeight = 80;

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - navHeight - 10) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ── Hamburger / Mobile Menu ─────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const close = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      close();
    }
  });

  // Close on Escape key — accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ── Smooth Scroll for anchor links ──────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── IntersectionObserver: fade-up animations ────────────── *
 *  ROBUSTNESS: If IO is not supported, or browser paint is
 *  instant (file:// protocol, fast devices), we apply a
 *  DOMContentLoaded fallback that reveals all elements already
 *  in the viewport immediately so nothing stays hidden.
 * ─────────────────────────────────────────────────────────── */
(function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  // Fallback: reveal elements already in view on page load
  const revealInView = () => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 20) {
        el.classList.add('visible');
      }
    });
  };

  if (!('IntersectionObserver' in window)) {
    // No IO support — reveal everything immediately
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,             // Lower threshold — fires earlier
      rootMargin: '0px 0px -20px 0px'  // Reduced negative margin
    }
  );

  elements.forEach(el => observer.observe(el));

  // Also run immediately in case elements start in view (e.g., hero)
  revealInView();

  // And once more after a short tick to handle layout-shift edge cases
  requestAnimationFrame(() => requestAnimationFrame(revealInView));
})();
