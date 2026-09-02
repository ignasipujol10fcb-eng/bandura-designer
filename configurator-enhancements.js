/* Non-destructive visual layer for the configurator. It mirrors the selected options on the live preview without replacing the real photograph. */
(() => {
  const card = document.querySelector('.instrument-card');
  const image = document.getElementById('previewImage');
  const content = document.getElementById('configContent');
  if (!card || !image || !content) return;

  const labels = ['model','strings','wood','finish','ornament','electronics','case','engraving'];
  const state = Object.create(null);
  let visualLayer = card.querySelector('.config-visual-layer');
  if (!visualLayer) {
    visualLayer = document.createElement('div');
    visualLayer.className = 'config-visual-layer';
    visualLayer.setAttribute('aria-hidden', 'true');
    card.appendChild(visualLayer);
  }

  const normalize = value => (value || '').trim().toLowerCase();
  const currentChoice = () => {
    const selected = content.querySelector('.choice.selected');
    return selected ? selected.querySelector('strong')?.textContent.trim() : '';
  };

  function refresh() {
    const text = currentChoice();
    const step = document.getElementById('stepCounter')?.textContent || '';
    const index = Math.max(0, parseInt(step, 10) - 1);
    if (labels[index]) state[labels[index]] = text;

    card.dataset.model = normalize(state.model);
    card.dataset.strings = normalize(state.strings);
    card.dataset.wood = normalize(state.wood);
    card.dataset.finish = normalize(state.finish);
    card.dataset.ornament = normalize(state.ornament);
    card.dataset.electronics = normalize(state.electronics);
    card.dataset.case = normalize(state.case);
    card.dataset.engraving = normalize(state.engraving);

    const ornament = state.ornament && !/^minimal$/i.test(state.ornament) && !/^none$/i.test(state.ornament);
    const electronics = state.electronics && !/^none$/i.test(state.electronics);
    const engraving = state.engraving && !/^none$/i.test(state.engraving);
    visualLayer.innerHTML = `${ornament ? '<span class="preview-ornament">✦</span>' : ''}${electronics ? '<span class="preview-pickup">●</span>' : ''}${engraving ? '<span class="preview-engraving">✧</span>' : ''}`;
    image.alt = state.model ? `Bandura live preview — ${state.model}${state.wood ? ', '+state.wood : ''}${state.finish ? ', '+state.finish : ''}` : 'Live bandura preview';
  }

  const observer = new MutationObserver(refresh);
  observer.observe(content, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
  content.addEventListener('click', () => requestAnimationFrame(refresh));
  document.getElementById('nextBtn')?.addEventListener('click', () => requestAnimationFrame(refresh));
  document.getElementById('backBtn')?.addEventListener('click', () => requestAnimationFrame(refresh));
  refresh();
})();
