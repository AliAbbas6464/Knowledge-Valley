/* ============================================================
   KNOWLEDGE VALLEY — shared interactivity
   ============================================================ */

/* ------------------------------------------------------------
   FORM DATA DELIVERY — Web3Forms (free, no backend needed)
   ------------------------------------------------------------
   This sends every form submission straight to your email inbox,
   so you receive enquiries the moment someone submits — no
   database server required.

   ONE-TIME SETUP (2 minutes):
   1. Go to https://web3forms.com
   2. Enter the email address where you want submissions sent.
   3. Click "Create Access Key" — you'll get a key instantly
      (looks like: a1b2c3d4-e5f6-7890-abcd-ef1234567890).
   4. Check your inbox for a confirmation email from Web3Forms
      and confirm it (only needed once).
   5. Paste that key below, replacing the placeholder text.
   6. Re-upload assets/main.js to your host.

   Until you paste a real key here, forms still validate and show
   a success message, but the data isn't sent anywhere yet — it
   will clearly say "(Demo mode)" in the confirmation toast as a
   reminder.
   ------------------------------------------------------------ */
const WEB3FORMS_ACCESS_KEY = "7a917c87-6ea1-4a87-a4bd-4bdc81357908";

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
      if (window.innerWidth > 900 && navLinks.classList.contains('open')) { closeMenu(); }
    });
  }

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

      var successMsg = form.dataset.success || 'Thanks! We\u2019ll be in touch shortly.';
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : null;

      function lockButton(label) {
        if (!btn) return;
        btn.textContent = label;
        btn.disabled = true;
      }
      function resetForm() {
        setTimeout(function () {
          form.reset();
          form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
          form.querySelectorAll('.star-picker span').forEach(function (s) { s.classList.remove('active'); });
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        }, 2200);
      }

      var keyReady = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.indexOf('PASTE_YOUR') === -1;

      if (!keyReady) {
        /* No Web3Forms key connected yet — demo mode only. */
        kvToast(successMsg + ' (Demo mode: connect Web3Forms to actually receive this.)');
        lockButton('Sent ✓');
        resetForm();
        return;
      }

      lockButton('Sending…');

      var payload = { access_key: WEB3FORMS_ACCESS_KEY };
      new FormData(form).forEach(function (value, key) { payload[key] = value; });
      payload.subject = 'New ' + (form.dataset.formType || 'form') + ' submission — Knowledge Valley website';
      payload.from_name = 'Knowledge Valley Website';
      payload.page = location.pathname.split('/').pop();

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          kvToast(successMsg);
          lockButton('Sent ✓');
        } else {
          kvToast('Something went wrong sending this. Please try again or email us directly.');
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        }
        resetForm();
      })
      .catch(function () {
        kvToast('Something went wrong sending this. Please try again or email us directly.');
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
      });
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

  /* ---------- FAQ / course syllabus download simulation ---------- */
  document.querySelectorAll('[data-download]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      kvToast('Your syllabus PDF request has been received — check your email inbox.');
    });
  });

  /* ---------- Enroll quick-pick (course cards -> scroll to enroll form) ---------- */
  document.querySelectorAll('[data-scroll-to]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});
