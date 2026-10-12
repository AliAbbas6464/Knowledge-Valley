/* ============================================================
   KNOWLEDGE VALLEY — shared interactivity
   ============================================================ */

/* ------------------------------------------------------------
   WHATSAPP DELIVERY — enquiries are handed to WhatsApp
   ------------------------------------------------------------
   On submit, the form builds a pre-filled WhatsApp message and opens
   https://wa.me/<number>. The candidate must still press Send in
   WhatsApp: the website cannot send a WhatsApp message by itself.
   Number format for wa.me: digits only, country code first, no "+".
   (+971 52 753 5393  ->  971527535393)
   WhatsApp is the only delivery method: form data is not sent to any
   other server, and the form is never cleared automatically.
   ------------------------------------------------------------ */
const KV_WHATSAPP_NUMBER = "971527535393";
const KV_WHATSAPP_MAX_CHARS = 1500; // keeps the wa.me link at a safe length

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    function openMenu() {
      navToggle.classList.add('open');
      navLinks.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // lock background scroll on real devices
    }
    function closeMenu() {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    navToggle.setAttribute('type', 'button');
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) { closeMenu(); } else { openMenu(); }
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // Close when tapping outside the open menu (common real-device expectation)
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
    // Close on Escape (keyboard users)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) { closeMenu(); }
    });
    // Safety: if window is resized past the mobile breakpoint while menu is open, reset state
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && navLinks.classList.contains('open')) { closeMenu(); }
    });
  }

  /* ---------- Course Details dropdown ---------- */
  document.querySelectorAll('.nav-item.has-dropdown').forEach(function (item) {
    var caret = item.querySelector('.caret');
    var menu = item.querySelector('.dropdown-menu');
    var header = document.querySelector('.site-header');
    if (!caret || !menu) return;

    function positionMenuMobile() {
      menu.style.top = ''; // dropdown is positioned by CSS (absolute on desktop, inline on mobile)
    }
    function openDropdown() {
      item.classList.add('open');
      caret.setAttribute('aria-expanded', 'true');
      positionMenuMobile();
    }
    function closeDropdown() {
      item.classList.remove('open');
      caret.setAttribute('aria-expanded', 'false');
    }

    caret.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (item.classList.contains('open')) { closeDropdown(); } else { openDropdown(); }
    });
    caret.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); caret.click(); }
      if (e.key === 'Escape') { closeDropdown(); }
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDropdown);
    });

    document.addEventListener('click', function (e) {
      if (item.classList.contains('open') && !item.contains(e.target)) { closeDropdown(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && item.classList.contains('open')) { closeDropdown(); }
    });
    window.addEventListener('resize', function () {
      if (item.classList.contains('open')) { positionMenuMobile(); }
    });
  });

  /* ---------- Active nav link (based on filename) ---------- */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var target = a.getAttribute('href').split('/').pop();
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 500);
    });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Toast helper (global) ---------- */
  window.kvToast = function (message) {
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = '<span class="dot"></span><span class="toast-msg"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove('show'); }, 3600);
  };

  /* ---------- Scorecard animation (hero) ---------- */
  var fill = document.querySelector('.scorecard-fill');
  if (fill) {
    requestAnimationFrame(function () {
      setTimeout(function () { fill.classList.add('filled'); }, 250);
    });
  }

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var buttons = group.querySelectorAll('.tab-btn');
    var panelsWrap = document.querySelector(group.dataset.tabs);
    if (!panelsWrap) return;
    var panels = panelsWrap.querySelectorAll('.tab-panel');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var target = panelsWrap.querySelector('[data-panel="' + btn.dataset.tab + '"]');
        if (target) target.classList.add('active');
      });
    });
  });

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var head = item.querySelector('.accordion-head');
    var body = item.querySelector('.accordion-body');
    if (!head || !body) return;
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = 0;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 40 + 'px';
      }
    });
  });

  /* ---------- Pricing toggle ---------- */
  var priceToggle = document.querySelector('.price-toggle');
  if (priceToggle) {
    var pBtns = priceToggle.querySelectorAll('button');
    pBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        pBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var mode = btn.dataset.mode;
        document.querySelectorAll('[data-price]').forEach(function (el) {
          el.textContent = el.dataset[mode];
        });
        document.querySelectorAll('[data-pricesuffix]').forEach(function (el) {
          el.textContent = mode === 'installment' ? '/ month × 3' : 'one-time';
        });
      });
    });
  }

  /* ---------- Instructor filter ---------- */
  var filterBar = document.querySelector('.filter-bar[data-filter-target]');
  if (filterBar) {
    var chips = filterBar.querySelectorAll('.filter-chip');
    var items = document.querySelectorAll(filterBar.dataset.filterTarget);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var f = chip.dataset.filter;
        items.forEach(function (item) {
          if (f === 'all' || item.dataset.tags.indexOf(f) !== -1) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---------- Instructor bio modal ---------- */
  var modal = document.getElementById('bio-modal');
  if (modal) {
    var modalBody = modal.querySelector('.modal-body');
    document.querySelectorAll('[data-bio-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = document.getElementById(btn.dataset.bioTrigger);
        if (src) {
          modalBody.innerHTML = src.innerHTML;
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.hasAttribute('data-modal-close')) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Testimonial filter ---------- */
  var tFilterBar = document.querySelector('.filter-bar[data-tfilter-target]');
  if (tFilterBar) {
    var tChips = tFilterBar.querySelectorAll('.filter-chip');
    var tItems = document.querySelectorAll(tFilterBar.dataset.tfilterTarget);
    tChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        tChips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var f = chip.dataset.filter;
        tItems.forEach(function (item) {
          if (f === 'all' || item.dataset.tags.indexOf(f) !== -1) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---------- Generic client-side form validation + real submit ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var value = input.value.trim();
        var ok = value.length > 0;
        if (input.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (input.type === 'tel') {
          ok = value.replace(/\D/g, '').length >= 7;
        }
        if (field) field.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        kvToast('Please fill in all required fields correctly.');
        return;
      }

      var successMsg = form.dataset.success || 'Opening WhatsApp \u2014 please press Send in WhatsApp to complete your enquiry.';
      var btn = form.querySelector('button[type="submit"]');

      /* ----- Build the WhatsApp message from the fields this form actually has ----- */
      function fieldLabel(el) {
        var lab = el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
        var txt = lab ? lab.textContent : (el.name === 'rating' ? 'Rating' : el.name);
        return txt.replace(/\*/g, '').replace(/\(optional\)/i, '').trim();
      }
      var lines = [form.dataset.waTitle || 'New Knowledge Valley Enquiry', ''];
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (!el.name || el.type === 'submit' || el.type === 'button') return;
        var val = (el.value || '').trim();
        if (el.tagName === 'SELECT') {
          val = el.selectedIndex > 0 ? el.options[el.selectedIndex].text.trim() : '';
        }
        if (el.name === 'rating') { val = (parseInt(val, 10) > 0) ? val + '/5' : ''; }
        if (!val) return;
        lines.push(fieldLabel(el) + ': ' + val);
      });
      var waText = lines.join('\n');
      if (waText.length > KV_WHATSAPP_MAX_CHARS) {
        waText = waText.slice(0, KV_WHATSAPP_MAX_CHARS) + '\u2026 [shortened]';
      }
      var waUrl = 'https://wa.me/' + KV_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText);

      /* ----- Open WhatsApp immediately (inside the click, so pop-up blockers allow it) ----- */
      var waWindow = window.open(waUrl, '_blank');
      var opened = !!waWindow;
      if (waWindow) { try { waWindow.opener = null; } catch (err) {} }

      /* ----- Honest on-page status: the visitor still has to press Send in WhatsApp.
         The form is NOT cleared and the button stays usable, so nothing the visitor typed is lost
         if WhatsApp is blocked or they return without sending. ----- */
      var status = form.querySelector('.form-status');
      if (!status) {
        status = document.createElement('div');
        status.className = 'form-status';
        status.setAttribute('role', 'status');
        (btn || form).insertAdjacentElement('afterend', status);
      }
      status.innerHTML = '';
      var what = form.dataset.formType === 'testimonial' ? 'your testimonial' : 'your enquiry';
      var statusText = document.createElement('span');
      statusText.textContent = (opened
        ? 'Your WhatsApp message is ready. Please press Send in WhatsApp to submit ' + what + '. It has not been sent until you do. '
        : 'Your WhatsApp message is ready, but your browser did not open WhatsApp automatically. Please use the link below, then press Send in WhatsApp. It has not been sent until you do. ');
      var statusLink = document.createElement('a');
      statusLink.href = waUrl;
      statusLink.target = '_blank';
      statusLink.rel = 'noopener';
      statusLink.textContent = opened ? 'WhatsApp didn\u2019t open? Open it here.' : 'Open WhatsApp with my message';
      status.appendChild(statusText);
      status.appendChild(statusLink);
      kvToast(opened ? successMsg : 'WhatsApp did not open automatically \u2014 please use the link below the form.');
    });
  });

  /* ---------- Star rating widget (testimonial submission) ---------- */
  document.querySelectorAll('[data-star-rating]').forEach(function (wrap) {
    var input = document.getElementById(wrap.dataset.starRating);
    var stars = wrap.querySelectorAll('span');
    stars.forEach(function (star, idx) {
      star.addEventListener('click', function () {
        if (input) input.value = idx + 1;
        stars.forEach(function (s, i) {
          s.classList.toggle('active', i <= idx);
        });
      });
    });
  });

  /* ---------- Click-to-play video thumbnails ---------- */
  document.querySelectorAll('.video-thumb').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.video-embed');
      var videoId = btn.dataset.videoId;
      var title = btn.dataset.videoTitle || 'Knowledge Valley video';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
    });
  });

  /* ---------- Enroll quick-pick (course cards -> scroll to enroll form) ---------- */
  document.querySelectorAll('[data-scroll-to]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Gulf page: GCC student testimonial slider ---------- */
  document.querySelectorAll('[data-gulf-slider]').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-gulf-slide]'));
    var prevBtn = root.querySelector('[data-gulf-prev]');
    var nextBtn = root.querySelector('[data-gulf-next]');
    var currentEl = root.querySelector('[data-gulf-current]');
    var totalEl = root.querySelector('[data-gulf-total]');
    if (!slides.length || !prevBtn || !nextBtn) return;

    var index = 0;
    var total = slides.length;
    var AUTOPLAY_MS = 6000;
    var timer = null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function show(i) {
      slides.forEach(function (slide, si) {
        slide.classList.toggle('is-active', si === i);
        slide.classList.remove('is-visible');
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { slides[i].classList.add('is-visible'); });
      });
      if (currentEl) currentEl.textContent = pad(i + 1);
      if (totalEl) totalEl.textContent = pad(total);
    }

    function goTo(i) {
      index = (i + total) % total;
      show(index);
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
      if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
    });

    // Pause on hover and on keyboard/focus interaction; resume when the user moves away
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', function () {
      if (!root.contains(document.activeElement)) startAutoplay();
    });

    show(index);
    startAutoplay();
  });

});
