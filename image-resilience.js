/* Keep the real bandura photography resilient if an external image request fails. */
(() => {
  const fallbacks = [
    'https://commons.wikimedia.org/wiki/Special:FilePath/Chernihiv-style_bandura.jpg?width=1200',
    'https://commons.wikimedia.org/wiki/Special:FilePath/Chernihiv_Bandura3.jpg?width=1600'
  ];
  const failed = new WeakSet();
  document.querySelectorAll('img[src*="commons.wikimedia.org"]').forEach(img => {
    img.addEventListener('error', () => {
      if (failed.has(img)) return;
      failed.add(img);
      const current = img.currentSrc || img.src;
      const next = fallbacks.find(src => src !== current);
      if (next) img.src = next;
    }, { once: true });
  });
})();
