/* Keep below-the-fold bandura imagery from competing with the hero for the first network slot. */
(() => {
  const preview = document.getElementById('previewImage');
  if (!preview) return;

  // The configurator sits below the hero, so its large photographic preview does
  // not need to be fetched during the initial page load. Once it approaches the
  // viewport, the browser will load it normally.
  preview.loading = 'lazy';
  preview.decoding = 'async';
  preview.removeAttribute('fetchpriority');
})();
