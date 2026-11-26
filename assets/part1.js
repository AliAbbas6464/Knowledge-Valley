/* CMA Part 1 page: sticky offsets + scrollspy */
(function () {
  var hdr = document.querySelector('.h-header');
  function setTop() { if (hdr) document.body.style.setProperty('--top', hdr.offsetHeight + 'px'); }
  setTop(); window.addEventListener('resize', setTop); window.addEventListener('scroll', function(){ requestAnimationFrame(setTop); }, {passive:true}); window.addEventListener('load', setTop);
  var blocks = document.querySelectorAll('.p1-blk');
  if (!blocks.length || !('IntersectionObserver' in window)) return;
  var links = document.querySelectorAll('.p1-sl,.p1-chip');
  function mark(L) {
    links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-s') === L); });
    var c = document.querySelector('.p1-chip.on'), bar = document.getElementById('p1chips');
    if (c && bar && bar.scrollWidth > bar.clientWidth) { bar.scrollTo({ left: c.offsetLeft - 16, behavior: 'smooth' }); }
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) mark(e.target.id.replace('section-', '').toUpperCase()); });
  }, { rootMargin: '-30% 0px -60% 0px' });
  blocks.forEach(function (b) { io.observe(b); });
})();
