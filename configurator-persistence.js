/* Non-destructive configurator memory: keeps a visitor's selections on this device and restores them after reload. */
(() => {
  const content = document.getElementById('configContent');
  const next = document.getElementById('nextBtn');
  const counter = document.getElementById('stepCounter');
  const KEY = 'bandura-atelier-config-v1';
  if (!content || !next || !counter) return;

  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  };

  const write = (patch) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({...read(), ...patch}));
    } catch (_) {}
  };

  const saveCurrentChoice = () => {
    const step = Number.parseInt(counter.textContent, 10) - 1;
    if (!Number.isInteger(step) || step < 0) return;
    const choices = [...content.querySelectorAll('.choice')];
    const selected = content.querySelector('.choice.selected');
    if (selected) write({choices: {...read().choices, [step]: choices.indexOf(selected)}});
  };

  const saveInscription = () => {
    const input = document.getElementById('customInscription');
    if (input) write({inscription: input.value.slice(0, 30)});
  };

  content.addEventListener('click', (event) => {
    if (event.target.closest('.choice')) requestAnimationFrame(saveCurrentChoice);
  });
  content.addEventListener('input', (event) => {
    if (event.target.id === 'customInscription') saveInscription();
  });
  next.addEventListener('click', () => requestAnimationFrame(() => {
    saveCurrentChoice();
    saveInscription();
  }));

  const restore = () => {
    const saved = read();
    const choices = saved.choices || {};
    const steps = Object.keys(choices).map(Number).filter(Number.isInteger).sort((a, b) => a - b);
    if (!steps.length) return;

    let step = 0;
    const advance = () => {
      const targetStep = steps[step];
      const currentStep = Number.parseInt(counter.textContent, 10) - 1;
      if (currentStep !== targetStep) return;
      const options = [...content.querySelectorAll('.choice')];
      const index = Number(choices[targetStep]);
      if (options[index]) {
        options[index].click();
        requestAnimationFrame(() => {
          if (targetStep < steps[steps.length - 1]) next.click();
          else {
            const input = document.getElementById('customInscription');
            if (input && saved.inscription) {
              input.value = saved.inscription.slice(0, 30);
              input.dispatchEvent(new Event('input', {bubbles: true}));
            }
          }
          step += 1;
          if (step < steps.length) setTimeout(advance, 40);
        });
      }
    };
    setTimeout(advance, 80);
  };

  restore();
})();
