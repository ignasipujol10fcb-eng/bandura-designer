/* Keyboard support for configurator choices. Keeps the existing click behavior and works across all languages. */
(() => {
  const content = document.getElementById('configContent');
  if (!content) return;

  const enhance = () => {
    content.querySelectorAll('.choice').forEach(choice => {
      if (!choice.hasAttribute('tabindex')) choice.tabIndex = 0;
      if (!choice.hasAttribute('role')) choice.setAttribute('role', 'button');
      choice.setAttribute('aria-pressed', choice.classList.contains('selected') ? 'true' : 'false');
    });
  };

  content.addEventListener('keydown', event => {
    const choice = event.target.closest('.choice');
    if (!choice || !content.contains(choice)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    choice.click();
    requestAnimationFrame(enhance);
  });

  content.addEventListener('click', event => {
    if (event.target.closest('.choice')) requestAnimationFrame(enhance);
  });

  new MutationObserver(enhance).observe(content, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class']
  });

  enhance();
})();
