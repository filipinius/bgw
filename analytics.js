/* Google Analytics 4 (gtag.js) — loaded once, shared across all pages.
   Exposes window.gtag so pages can fire conversion events (e.g. generate_lead).
   gtag() calls queue in dataLayer immediately; the ~150KB library itself is
   fetched only after the page has loaded so it never competes with the hero image. */
(function () {
  var ID = 'G-GC3LWHLSQ4';
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ID);

  function load() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }
  if (document.readyState === 'complete') setTimeout(load, 1500);
  else window.addEventListener('load', function () { setTimeout(load, 1500); });
})();
