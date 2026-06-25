/* Google Analytics 4 (gtag.js) — loaded once, shared across all pages.
   Exposes window.gtag so pages can fire conversion events (e.g. generate_lead). */
(function () {
  var ID = 'G-GC3LWHLSQ4';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ID);
})();
