/* Give each configurator option an accessible name that includes its visible description. */
(() => {
  const content = document.getElementById('configContent');
  if (!content) return;

  const enhance = () => {
    content.querySelectorAll('.choice').forEach(choice => {
      const name = choice.querySelector('strong')?.textContent?.trim();
      const description = choice.querySelector('small')?.textContent?.trim();
      if (!name) return;
      const label = description ? `${name}. ${description}` : name;
      if (choice.getAttribute('aria-label') !== label) choice.setAttribute('aria-label', label);
    });
  };

  enhance();
  new MutationObserver(enhance).observe(content, {
    subtree: true,
    childList: true,
    characterData: true
  });
})();
