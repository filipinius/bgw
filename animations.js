/* BGW Trucking — motion layer.
   Nav scroll shadow, scroll-reveal, hover-lift hooks, hero-image parallax,
   and count-up on stat numbers. Everything past the reduced-motion guard is
   skipped when the user prefers reduced motion. Pure frontend — no network. */
(function () {
  // ---- Sticky nav shadow (not animation; runs even under reduced motion) ----
  var header = document.querySelector('header');
  if (header) {
    var syncHeader = function () { header.classList.toggle('scrolled', window.scrollY > 6); };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ---- Parallax on hero / image-panel backgrounds ----
  var parallaxUpdaters = [];
  Array.prototype.forEach.call(document.querySelectorAll('[style*="cover"]'), function (el) {
    var style = el.getAttribute('style') || '';
    if (!/url\(/.test(style)) return;                       // background image only
    var gradCount = (style.match(/linear-gradient/g) || []).length;
    var m = style.match(/(\d+)%\s*\/\s*cover/);             // image layer's vertical %
    var baseV = m ? parseInt(m[1], 10) : 50;
    parallaxUpdaters.push(function () {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh; // ~ -1..1 over scroll
      var offset = Math.max(-50, Math.min(50, progress * 50)); // px, subtle + clamped
      var parts = [];
      for (var i = 0; i < gradCount; i++) parts.push('center top');
      parts.push('center calc(' + baseV + '% + ' + offset.toFixed(1) + 'px)');
      el.style.backgroundPosition = parts.join(', ');
    });
  });

  if (parallaxUpdaters.length) {
    var ticking = false;
    var runParallax = function () {
      parallaxUpdaters.forEach(function (fn) { fn(); });
      ticking = false;
    };
    var onScrollResize = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(runParallax); }
    };
    runParallax();
    window.addEventListener('scroll', onScrollResize, { passive: true });
    window.addEventListener('resize', onScrollResize);
  }

  if (!('IntersectionObserver' in window)) return;

  // ---- Scroll reveal ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  function reveal(el, delay) {
    el.classList.add('reveal');
    if (delay) el.style.transitionDelay = delay + 'ms';
    io.observe(el);
  }

  var hasBorder = /border:\s*1px solid/;
  var sections = document.querySelectorAll('body > div > section');

  Array.prototype.forEach.call(sections, function (sec, si) {
    if (si === 0) return; // hero is handled by CSS

    // Some sections wrap content in a single padding/max-width div; others
    // place the heading row and card grid directly in the section.
    var container = (sec.children.length === 1 && sec.firstElementChild.children.length > 1)
      ? sec.firstElementChild
      : sec;

    Array.prototype.forEach.call(container.children, function (child, ci) {
      if (child.style && child.style.display === 'grid') {
        Array.prototype.forEach.call(child.children, function (card, k) {
          reveal(card, Math.min(k, 7) * 75);
          if (hasBorder.test(card.getAttribute('style') || '')) card.classList.add('lift');
        });
      } else {
        reveal(child, Math.min(ci, 4) * 70);
      }
    });
  });

  // ---- Count-up on big stat numbers ----
  function countUp(el) {
    var target = parseInt(el.textContent, 10);
    if (!isFinite(target) || target === 0) return; // nothing to animate for 0
    var dur = 1100, start = null;
    el.textContent = '0';
    (function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    })(performance.now());
  }

  var counter = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { countUp(e.target); counter.unobserve(e.target); }
    });
  }, { threshold: 0.6 });

  // Big display figures only: Saira 700 with a clamp() size, pure 1–3 digit
  // integer — excludes IDs like USDOT 2779903 and labels like "0 / 0".
  Array.prototype.forEach.call(
    document.querySelectorAll('[style*="Saira Condensed"][style*="font-weight:700"][style*="font-size:clamp"]'),
    function (el) { if (/^\d{1,3}$/.test(el.textContent.trim())) counter.observe(el); }
  );
})();
