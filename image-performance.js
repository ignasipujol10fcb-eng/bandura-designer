/* Keep below-the-fold bandura imagery and editorial sections from competing with the hero for the first render. */
(() => {
  const preview = document.getElementById('previewImage');
  if (!preview) return;

  preview.loading = 'lazy';
  preview.decoding = 'async';
  preview.removeAttribute('fetchpriority');

  const deferred = document.querySelectorAll('.editorial-image,.features,.bespoke,.quote-band,.gallery,.contact,footer');
  deferred.forEach(section => {
    section.style.contentVisibility = 'auto';
    if (!section.style.containIntrinsicSize) section.style.containIntrinsicSize = '650px';
  });

  // Warm both real bandura photographs only while the browser is idle.
  // The hero remains prioritized, while the editorial and gallery images are ready sooner after scroll.
  const urls = [
    'https://upload.wikimedia.org/wikipedia/commons/5/59/Chernihiv-style_bandura.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Chernihiv_Bandura3.jpg/1280px-Chernihiv_Bandura3.jpg'
  ];
  const warm = () => urls.forEach(src => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  });
  if ('requestIdleCallback' in window) window.requestIdleCallback(warm, { timeout: 2500 });
  else window.setTimeout(warm, 1800);
})();
