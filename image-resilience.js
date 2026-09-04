/* Keep the real bandura photography resilient if an external image request fails. */
(() => {
  const fallbacks = [
    'https://upload.wikimedia.org/wikipedia/commons/5/59/Chernihiv-style_bandura.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Chernihiv_Bandura3.jpg/1280px-Chernihiv_Bandura3.jpg'
  ];
  const failed = new WeakSet();
  document.querySelectorAll('img[src*="wikimedia.org"]').forEach(img => {
    img.addEventListener('error', () => {
      if (failed.has(img)) return;
      failed.add(img);
      const current = img.currentSrc || img.src;
      const next = fallbacks.find(src => src !== current);
      if (next) {
        img.src = next;
        img.removeAttribute('srcset');
      }
    });
  });
})();
