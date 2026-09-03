/* Keep keyboard focus with the active configurator step without changing its visual behavior. */
(() => {
  const content = document.getElementById('configContent');
  const next = document.getElementById('nextBtn');
  const back = document.getElementById('backBtn');
  const counter = document.getElementById('stepCounter');
  if (!content || !counter) return;

  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');
  content.setAttribute('aria-live', 'polite');
  content.setAttribute('aria-atomic', 'true');

  let lastStep = counter.textContent;
  let moving = false;

  const moveFocusToStep = () => {
    if (!moving) return;
    moving = false;
    const firstChoice = content.querySelector('.choice');
    if (firstChoice) {
      firstChoice.setAttribute('tabindex', '0');
      firstChoice.focus({preventScroll: true});
    }
  };

  const requestStepFocus = () => {
    moving = true;
    requestAnimationFrame(moveFocusToStep);
  };

  next?.addEventListener('click', requestStepFocus);
  back?.addEventListener('click', requestStepFocus);

  const observer = new MutationObserver(() => {
    const currentStep = counter.textContent;
    if (currentStep !== lastStep) {
      lastStep = currentStep;
      moveFocusToStep();
    }
  });
  observer.observe(counter, {childList: true, characterData: true, subtree: true});
})();
