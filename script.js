/* ATX BackFlow - script.js
   Modules (each in its own IIFE):
   - Premium hamburger menu (slide-in panel from right)
   - Active nav state
   - Scroll reveal
   - Year stamp
   - Smooth scroll
*/

/* ============================================
   PREMIUM HAMBURGER MENU
   ============================================ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.nav__hamburger');
    var panel = document.querySelector('.nav-panel');
    var backdrop = document.querySelector('.nav-backdrop');
    if (!btn || !panel) return;

    function open() {
      document.body.classList.add('nav-open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (document.body.classList.contains('nav-open')) close();
      else open();
    }

    btn.addEventListener('click', toggle);

    if (backdrop) backdrop.addEventListener('click', close);

    /* Close on any link click inside the panel */
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    /* ESC to close */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) close();
    });

    /* Close on resize past desktop breakpoint */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && document.body.classList.contains('nav-open')) close();
    });
  });
})();

/* ============================================
   ACTIVE NAV STATE
   ============================================ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.getAttribute('data-nav') === page) {
        link.classList.add('is-active');
      }
    });
  });
})();

/* ============================================
   SCROLL REVEAL
   ============================================ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
  });
})();

/* ============================================
   YEAR STAMP
   ============================================ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });
  });
})();

/* ============================================
   SMOOTH SCROLL FOR IN-PAGE ANCHORS
   ============================================ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
})();