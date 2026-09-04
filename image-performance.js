/* Keep below-the-fold bandura imagery and editorial sections from competing with the hero for the first render. */
(() => {
  const preview = document.getElementById('previewImage');
  if (!preview) return;

  // The configurator sits below the hero, so its large photographic preview does
  // not need to be fetched during the initial page load. Once it approaches the
  // viewport, the browser will load it normally.
  preview.loading = 'lazy';
  preview.decoding = 'async';
  preview.removeAttribute('fetchpriority');

  // Defer layout/paint work for sections that are initially far below the fold.
  // Intrinsic sizes preserve the page geometry and prevent layout jumps while
  // the browser skips rendering work until each section approaches the viewport.
  const deferred = document.querySelectorAll('.editorial-image,.features,.bespoke,.quote-band,.gallery,.contact,footer');
  deferred.forEach(section => {
    section.style.contentVisibility = 'auto';
    if (!section.style.containIntrinsicSize) section.style.containIntrinsicSize = '650px';
  });

  // Warm the second real bandura photograph only when the browser is idle. This
  // keeps the hero fast while making the editorial/gallery image feel immediate
  // when a visitor scrolls to it.
  const galleryImage = document.querySelector('.editorial-photo img');
  if (galleryImage && galleryImage.src) {
    const warm = () => {
      const img = new Image();
      img.decoding = 'async';
      img.src = galleryImage.currentSrc || galleryImage.src;
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(warm, { timeout: 2500 });
    else window.setTimeout(warm, 1800);
  }
})();
