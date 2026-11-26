/* KNOWLEDGE VALLEY — homepage interactions (hero slider, testimonial carousel, mobile menu) */
document.addEventListener('DOMContentLoaded', function () {
  /* Mobile menu */
  var burger = document.querySelector('.h-burger'), menu = document.querySelector('.h-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    menu.querySelectorAll('a:not(.h-trig)').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
  }
  /* Hero slider */
  var slider = document.querySelector('.h-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.h-slide'), dots = slider.querySelectorAll('.h-dots button'), i = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }
    function play() { if (reduce) return; stop(); timer = setInterval(function () { show(i + 1); }, 9000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); play(); }); });
    var prev = slider.querySelector('.h-prev'), next = slider.querySelector('.h-next');
    if (prev) prev.addEventListener('click', function () { show(i - 1); play(); });
    if (next) next.addEventListener('click', function () { show(i + 1); play(); });
    slider.addEventListener('mouseenter', stop); slider.addEventListener('mouseleave', play);
    slider.addEventListener('focusin', stop); slider.addEventListener('focusout', play);
    show(0); play();
  }
});

/* v3: roadmap tabs, quick check, placeholder links */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-ph]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
  var tabs = document.querySelectorAll('.h-tabs button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.toggle('on', x === b); });
      document.querySelectorAll('.h-tabpane').forEach(function (p) { p.classList.toggle('on', p.id === b.getAttribute('data-tab')); });
    });
  });
  var box = document.getElementById('hQuiz'); if (!box) return;
  var Q = [
    { q: 'What best describes you?', o: ['Working accountant or finance professional', 'Internal or external auditor', 'MBA or finance graduate', 'Started ACCA, CA or ICMAP'] },
    { q: 'What do you want most from CMA?', o: ['A promotion or senior finance role', 'A better job in the Gulf', 'A path towards CFO or finance leadership', 'A globally recognised credential'] },
    { q: 'How much time can you give each week?', o: ['Less than 6 hours', '6 to 10 hours', 'More than 10 hours'] },
    { q: 'Where are you based?', o: ['Saudi Arabia', 'UAE', 'Other GCC country', 'Outside the GCC'] }
  ];
  var A = [], n = 0;
  var body = document.getElementById('hQBody'), step = document.getElementById('hQStep'), prog = document.getElementById('hQProg'), res = document.getElementById('hQResult');
  function render() {
    var q = Q[n]; body.innerHTML = '';
    var h = document.createElement('h3'); h.textContent = q.q; body.appendChild(h);
    var w = document.createElement('div'); w.className = 'h-q-opts';
    q.o.forEach(function (t) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.addEventListener('click', function () { A[n] = t; n++; n < Q.length ? render() : done(); }); w.appendChild(b); });
    body.appendChild(w);
    if (n > 0) { var bk = document.createElement('button'); bk.type = 'button'; bk.className = 'h-q-back'; bk.textContent = '← Back'; bk.addEventListener('click', function () { n--; render(); }); body.appendChild(bk); }
    step.textContent = 'Question ' + (n + 1) + ' of ' + Q.length; prog.style.width = ((n + 1) / Q.length * 100) + '%';
  }
  function done() {
    body.innerHTML = ''; res.hidden = false; step.textContent = 'Your result'; prog.style.width = '100%';
    var lines = {
      0: 'CMA builds on the finance work you already do, and our evening classes are designed for professionals who work full days.',
      1: 'CMA adds management accounting, controls and strategic finance to your audit background, and it is a natural next step for auditors.',
      2: 'CMA gives you a globally recognised credential with only two parts, and live mentoring helps you connect theory with real work.',
      3: 'You can start from where you are. In the free orientation we will look at your progress and show how CMA fits with it.'
    };
    var i = Q[0].o.indexOf(A[0]);
    var t = A[2] === 'Less than 6 hours' ? ' With less than 6 hours a week, we will suggest starting with one part at a time, at a pace that suits you.' : (A[2] === 'More than 10 hours' ? ' With more than 10 hours a week, you may be able to move faster, and we will plan that with you.' : ' Around 6 to 10 hours a week is a realistic pace for most working professionals.');
    res.innerHTML = '<h3>CMA (US) looks like a good fit to explore</h3><p>' + lines[i] + t + ' The best next step is a free orientation, with no payment and no obligation.</p><div class="acts"><a class="hb hb-gold" href="#enroll">Book Free Orientation</a><a class="hb hb-wa" target="_blank" rel="noopener" href="https://wa.me/' + box.getAttribute('data-wa') + '?text=' + encodeURIComponent('Hello Knowledge Valley, I took the quick check. I am: ' + A[0] + '. My goal: ' + A[1] + '. Weekly study time: ' + A[2] + '. Based in: ' + A[3] + '. I would like to talk to a mentor.') + '">Talk to a mentor on WhatsApp</a></div><button type="button" class="h-q-back" id="hQRe">Start again</button>';
    document.getElementById('hQRe').addEventListener('click', function () { n = 0; A = []; res.hidden = true; render(); });
  }
  render();
});

/* v7: roadmap section tiles open lecture panels */
(function () {
  var tiles = document.querySelectorAll('.h-rp-tile[data-rp]');
  tiles.forEach(function (t) {
    t.addEventListener('click', function () {
      var id = t.getAttribute('data-rp'), open = t.classList.contains('on'), pane = t.closest('.h-tabpane');
      pane.querySelectorAll('.h-rp-tile[data-rp]').forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-expanded', 'false'); });
      pane.querySelectorAll('.h-rp-panel').forEach(function (p) { p.classList.remove('on'); });
      if (!open) {
        t.classList.add('on'); t.setAttribute('aria-expanded', 'true');
        var p = document.getElementById(id); if (p) { p.classList.add('on');
          if (window.innerWidth < 900) { setTimeout(function () { p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60); } }
      }
    });
  });
})();

/* v15: seamless looping carousels (videos glide continuously, stories loop without a visible restart) */
(function () {
  function loopify(track, sel) {
    var orig = [].slice.call(track.querySelectorAll(sel)); if (orig.length < 2) return null;
    function mk(c) { var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); [].forEach.call(k.querySelectorAll('a,button'), function (x) { x.setAttribute('tabindex', '-1'); }); return k; }
    var first = orig[0];
    orig.forEach(function (c) { track.insertBefore(mk(c), first); });
    orig.forEach(function (c) { track.appendChild(mk(c)); });
    var api = {
      w: function () { return track.children[orig.length * 2].offsetLeft - track.children[orig.length].offsetLeft; },
      start: function () { return track.children[orig.length].offsetLeft - track.children[0].offsetLeft; },
      wrap: function () { var w = api.w(), s0 = api.start(), p = track.scrollLeft, prev = track.style.scrollBehavior;
        if (p >= s0 + w) { track.style.scrollBehavior = 'auto'; track.scrollLeft = p - w; track.style.scrollBehavior = prev; return true; }
        if (p < s0) { track.style.scrollBehavior = 'auto'; track.scrollLeft = p + w; track.style.scrollBehavior = prev; return true; }
        return false; },
      home: function () { var prev = track.style.scrollBehavior; track.style.scrollBehavior = 'auto'; track.scrollLeft = api.start(); track.style.scrollBehavior = prev; }
    };
    var t0 = null;
    track.addEventListener('scroll', function () { clearTimeout(t0); t0 = setTimeout(api.wrap, 140); });
    window.addEventListener('resize', api.home);
    if (document.readyState === 'complete') api.home(); else window.addEventListener('load', api.home);
    setTimeout(api.home, 300);
    return api;
  }
  function stepOf(track, sel) { var c = track.querySelector(sel); return c ? c.offsetWidth + 22 : 320; }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Videos: constant, slow glide */
  var vt = document.querySelector('.h-vtrack');
  if (vt) {
    vt.style.scrollSnapType = 'none';
    var vl = loopify(vt, '.h-vc'), vp = document.querySelector('.h-vprev'), vn = document.querySelector('.h-vnext');
    if (vl) {
      if (vp) vp.addEventListener('click', function () { vt.scrollBy({ left: -stepOf(vt, '.h-vc'), behavior: 'smooth' }); });
      if (vn) vn.addEventListener('click', function () { vt.scrollBy({ left: stepOf(vt, '.h-vc'), behavior: 'smooth' }); });
      var SPEED = 26, pos = null, last = 0, hold = false, until = 0, vis = true;
      vt.addEventListener('mouseenter', function () { hold = true; });
      vt.addEventListener('mouseleave', function () { hold = false; });
      ['pointerdown', 'touchstart', 'wheel'].forEach(function (ev) { vt.addEventListener(ev, function () { until = Date.now() + 10000; pos = null; }, { passive: true }); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }, { threshold: 0.2 }).observe(vt);
      if (!reduce) requestAnimationFrame(function tick(ts) {
        var dt = last ? Math.min(ts - last, 60) : 16; last = ts;
        if (!hold && vis && Date.now() > until && !document.hidden) {
          if (pos === null) pos = vt.scrollLeft;
          pos += SPEED * dt / 1000; vt.scrollLeft = pos;
          var w = vl.w(), s0 = vl.start(); if (pos >= s0 + w) { pos -= w; vt.scrollLeft = pos; }
        } else { pos = null; }
        requestAnimationFrame(tick);
      });
    }
  }

  /* Student stories: loop without a visible restart */
  var st = document.querySelector('.h-car-track');
  if (st) {
    var sl = loopify(st, '.h-t'), sp = document.querySelector('.h-car-prev'), sn = document.querySelector('.h-car-next');
    if (sl) {
      var go = function (d) { st.scrollBy({ left: d * stepOf(st, '.h-t'), behavior: 'smooth' }); };
      if (sp) sp.addEventListener('click', function () { go(-1); });
      if (sn) sn.addEventListener('click', function () { go(1); });
      var tm = null, sv = true;
      var sched = function (ms) { clearTimeout(tm); if (reduce) return; tm = setTimeout(function () { if (sv && !document.hidden) go(1); sched(10000); }, ms); };
      ['pointerdown', 'mouseenter', 'keydown'].forEach(function (ev) { st.parentNode.addEventListener(ev, function () { sched(20000); }); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { sv = e[0].isIntersecting; }, { threshold: 0.3 }).observe(st);
      sched(10000);
    }
  }
})();

/* v21 header shrink on scroll */
(function(){var h=document.querySelector('.h-header');if(!h)return;var t=false;function u(){h.classList.toggle('scrolled',window.scrollY>40);t=false}window.addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(u)}},{passive:true});u();})();

/* Courses is a heading only: click/tap opens its list, never navigates */
document.addEventListener('DOMContentLoaded', function () {
  var trigs = document.querySelectorAll('.h-trig');
  trigs.forEach(function (t) {
    var li = t.parentNode;
    t.addEventListener('click', function (e) { e.preventDefault(); var o = li.classList.toggle('sub-open'); t.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  });
  document.addEventListener('click', function (e) { trigs.forEach(function (t) { if (!t.parentNode.contains(e.target)) { t.parentNode.classList.remove('sub-open'); t.setAttribute('aria-expanded', 'false'); } }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') trigs.forEach(function (t) { t.parentNode.classList.remove('sub-open'); t.setAttribute('aria-expanded', 'false'); }); });
});
