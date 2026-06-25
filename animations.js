/* BGW Trucking — motion layer.
   Adds a scroll shadow to the nav, reveals content blocks on scroll, and
   marks bordered cards for a hover lift. No-ops gracefully when the browser
   prefers reduced motion or lacks IntersectionObserver. */
(function () {
  // Sticky nav shadow — runs even under reduced motion (it's not animation).
  var header = document.querySelector('header');
  if (header) {
    var sync = function () { header.classList.toggle('scrolled', window.scrollY > 6); };
    sync();
    window.addEventListener('scroll', sync, { passive: true });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

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

    // Some sections wrap their content in a single padding/max-width div;
    // others place the heading row and card grid directly in the section.
    var container = (sec.children.length === 1 && sec.firstElementChild.children.length > 1)
      ? sec.firstElementChild
      : sec;

    Array.prototype.forEach.call(container.children, function (child, ci) {
      if (child.style && child.style.display === 'grid') {
        // Stagger the cards inside a grid, and lift the bordered ones.
        Array.prototype.forEach.call(child.children, function (card, k) {
          reveal(card, Math.min(k, 7) * 75);
          if (hasBorder.test(card.getAttribute('style') || '')) card.classList.add('lift');
        });
      } else {
        reveal(child, Math.min(ci, 4) * 70);
      }
    });
  });
})();
