(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero entrance
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('loaded'); });
  });

  // scroll reveals
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv, .rv-line').forEach(function (el) { io.observe(el); });

  // tæller: 0 -> 10
  var tal = document.getElementById('ti-tal');
  if (tal) {
    var talIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        talIo.unobserve(tal);
        if (reduced) { tal.textContent = '10'; return; }
        var target = 10, dur = 1100, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          tal.textContent = String(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    talIo.observe(tal);
  }

  // blob parallax
  var blobs = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function parallax() {
    ticking = false;
    if (reduced) {
      blobs.forEach(function (b) { b.style.transform = ''; });
      return;
    }
    var vh = window.innerHeight;
    blobs.forEach(function (b) {
      var r = b.getBoundingClientRect();
      var mid = r.top + r.height / 2 - vh / 2;
      var f = parseFloat(b.getAttribute('data-parallax')) || 0;
      var extra = b.classList.contains('blob-kidney-2') ? ' scaleX(-1)' : '';
      b.style.transform = 'translateY(' + (-mid * f).toFixed(1) + 'px)' + extra;
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });
  parallax();
})();
