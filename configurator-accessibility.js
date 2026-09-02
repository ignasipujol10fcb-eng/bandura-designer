/* Accessible status layer for the configurator. Announces step and selection changes without changing its visual behavior. */
(() => {
  const content = document.getElementById('configContent');
  const counter = document.getElementById('stepCounter');
  if (!content) return;
  let live = document.getElementById('configLiveStatus');
  if (!live) {
    live = document.createElement('p');
    live.id = 'configLiveStatus';
    live.className = 'sr-only';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    content.parentElement?.appendChild(live);
  }
  let last = '';
  const announce = () => {
    const selected = content.querySelector('.choice.selected');
    if (!selected) return;
    const value = selected.querySelector('strong')?.textContent?.trim() || selected.textContent.trim();
    const step = counter?.textContent?.trim();
    const message = [step, value].filter(Boolean).join(' — ');
    if (message && message !== last) {
      last = message;
      live.textContent = '';
      requestAnimationFrame(() => { live.textContent = message; });
    }
  };
  const observer = new MutationObserver(() => requestAnimationFrame(announce));
  observer.observe(content, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  content.addEventListener('click', () => requestAnimationFrame(announce));
  document.getElementById('nextBtn')?.addEventListener('click', () => requestAnimationFrame(announce));
  document.getElementById('backBtn')?.addEventListener('click', () => requestAnimationFrame(announce));
  announce();
})();
