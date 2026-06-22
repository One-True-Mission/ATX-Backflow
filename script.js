/* ATX BackFlow - script.js
   Modules (each in its own IIFE):
   - Premium hamburger menu (slide-in panel from right)
   - Active nav state
   - Scroll reveal
   - Year stamp
   - Smooth scroll
   - Lightbox
   - Formspree AJAX submit (booking form -> own thank-you page)
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

/* ============================================
   LIGHTBOX (any .gallery-grid--lightbox on the page)
   Click any .gallery-item to open the full image overlay.
   Works across multiple grids on a single page (all items
   are pooled into one navigable sequence).
   Arrow keys + on-screen prev/next navigate. ESC closes.
   ============================================ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var grids = document.querySelectorAll('.gallery-grid--lightbox');
    if (!grids.length) return;

    /* Pool all items from all grids into a single sequence */
    var items = [];
    var sources = [];
    grids.forEach(function (grid) {
      grid.querySelectorAll('.gallery-item').forEach(function (item) {
        var img = item.querySelector('img');
        if (!img) return;
        items.push(item);
        sources.push({ src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' });
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.dataset.lightboxIndex = items.length - 1;
      });
    });

    if (!items.length) return;

    /* Build the lightbox overlay once and reuse */
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button>' +
      '<button class="lightbox__prev" aria-label="Previous photo">&#8249;</button>' +
      '<button class="lightbox__next" aria-label="Next photo">&#8250;</button>' +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" alt="">' +
      '<figcaption class="lightbox__counter"></figcaption>' +
      '</figure>';
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector('.lightbox__img');
    var counterEl = overlay.querySelector('.lightbox__counter');
    var closeBtn = overlay.querySelector('.lightbox__close');
    var prevBtn = overlay.querySelector('.lightbox__prev');
    var nextBtn = overlay.querySelector('.lightbox__next');

    var index = 0;

    function show(i) {
      index = (i + sources.length) % sources.length;
      imgEl.setAttribute('src', sources[index].src);
      imgEl.setAttribute('alt', sources[index].alt);
      counterEl.textContent = (index + 1) + ' / ' + sources.length;
    }

    function open(i) {
      show(i);
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    }
    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        open(parseInt(item.dataset.lightboxIndex, 10));
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(parseInt(item.dataset.lightboxIndex, 10));
        }
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });

    /* Click outside the image to close */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    /* Keyboard nav */
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
  });
})();

/* ============================================
   FORMSPREE AJAX SUBMIT
   Submits the booking form in the background via fetch so
   the visitor is sent to OUR own thank-you page instead of
   Formspree's generic confirmation screen. The form's
   data-redirect attribute holds the destination. If JS is
   unavailable, the form falls back to a normal POST and the
   hidden _next field (absolute URL) handles the redirect.
   ============================================ */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form[action*="formspree.io"]');
    if (!form) return;

    var redirect = form.getAttribute('data-redirect') || 'thank-you.html';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      function restoreButton() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }

      function fail(data) {
        restoreButton();
        var msg = 'Something went wrong sending your request. Please call us at (512) 745-7715 or try again.';
        if (data && data.errors && data.errors.length) {
          msg = data.errors.map(function (er) { return er.message; }).join(', ');
        }
        window.alert(msg);
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          window.location.href = redirect;
        } else {
          response.json().then(fail).catch(function () { fail(null); });
        }
      }).catch(function () {
        fail(null);
      });
    });
  });
})();