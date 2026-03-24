/* ============================================================
   HOME.JS  –  Homepage-Specific Interactivity
   Athlete Management System
   ============================================================ */
'use strict';

/* ── Typewriter Effect ───────────────────────────────────── */
(function initTypewriter() {
  const target = document.getElementById('typewriter-target');
  if (!target) return;

  const phrases = [
    'Track Your Performance',
    'Crush Every Goal',
    'Level Up Your Game',
    'Unlock Your Potential',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let timeoutId  = null;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      charIdx++;
      target.textContent = phrase.slice(0, charIdx);

      if (charIdx === phrase.length) {
        isDeleting = true;
        timeoutId = setTimeout(tick, 2200); // pause at end
        return;
      }
      timeoutId = setTimeout(tick, 70);
    } else {
      charIdx--;
      target.textContent = phrase.slice(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        timeoutId  = setTimeout(tick, 400);
        return;
      }
      timeoutId = setTimeout(tick, 35);
    }
  }

  // Start after a short intro delay
  setTimeout(tick, 1000);
})();

/* ── Animated Stat Counters ──────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = Date.now();

    const step = () => {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ── Progress Bars (dashboard preview) ───────────────────── */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();
