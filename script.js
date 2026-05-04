/* ATX BackFlow - script.js
   Handles: hamburger nav, active page state, scroll reveal, year stamp
*/

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initActiveNav();
    initHamburger();
    initScrollReveal();
    initYearStamp();
    initSmoothScroll();
  });

  /* Active nav state based on body[data-page] */
  function initActiveNav() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    var links = document.querySelectorAll('[data-nav]');
    links.forEach(function (link) {
      if (link.getAttribute('data-nav') === page) {
        link.classList.add('is-active');
      }
    });
  }

  /* Mobile hamburger toggle */
  function initHamburger() {
    var nav = document.querySelector('.nav');
    var btn = document.querySelector('.nav__hamburger');
    if (!nav || !btn) return;

    btn.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      var expanded = nav.classList.contains('is-open');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    /* Close menu when a link is clicked (mobile UX) */
    document.querySelectorAll('.nav__link, .nav__cta').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 900) nav.classList.remove('is-open');
      });
    });

    /* Close on resize up to desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) nav.classList.remove('is-open');
    });
  }

  /* Scroll-triggered reveal for elements with .reveal */
  function initScrollReveal() {
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
  }

  /* Auto-update copyright year in footer */
  function initYearStamp() {
    var year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });
  }

  /* Smooth-scroll for in-page anchors */
  function initSmoothScroll() {
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
  }
})();