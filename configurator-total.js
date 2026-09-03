/* Live configurator total: derives the estimate from the currently selected options, with local storage only as a reload fallback. */
(() => {
  const content = document.getElementById('configContent');
  const caption = document.querySelector('.finish-caption');
  if (!content || !caption) return;

  const prices = [
    [1900, 2650, 3900],
    [0, 180, 260],
    [0, 0, 0, 0, 120],
    [0, 90, 120, 140],
    [0, 120, 180, 220, 350],
    [0, 220, 420],
    [0, 120, 320],
    [0, 90, 160]
  ];
  const labels = {
    en: 'Estimated total', es: 'Total estimado', uk: 'Орієнтовна сума', it: 'Totale stimato',
    fr: 'Total estimé', de: 'Geschätzter Gesamtpreis', zh: '预计总价', ja: '概算合計', he: 'סה״כ משוער'
  };
  const total = document.createElement('span');
  total.className = 'config-total';
  total.setAttribute('role', 'status');
  total.setAttribute('aria-live', 'polite');
  total.setAttribute('aria-atomic', 'true');
  caption.appendChild(total);

  const localeFor = (lang) => ({
    en: 'en-US', es: 'es-ES', uk: 'uk-UA', it: 'it-IT', fr: 'fr-FR',
    de: 'de-DE', zh: 'zh-CN', ja: 'ja-JP', he: 'he-IL'
  }[lang] || 'en-US');

  const readSaved = () => {
    try { return JSON.parse(localStorage.getItem('bandura-atelier-config-v1') || '{}'); }
    catch (_) { return {}; }
  };

  const currentChoices = () => {
    const step = Number.parseInt(document.getElementById('stepCounter')?.textContent || '', 10) - 1;
    const selected = content.querySelector('.choice.selected');
    if (!Number.isInteger(step) || step < 0 || !selected) return null;
    const index = [...content.querySelectorAll('.choice')].indexOf(selected);
    return {step, index};
  };

  const read = () => {
    const saved = readSaved();
    const choices = {...(saved.choices || {})};
    const current = currentChoices();
    if (current && current.index >= 0) choices[current.step] = current.index;

    let amount = 0;
    Object.keys(choices).forEach(step => {
      const s = Number(step), i = Number(choices[step]);
      if (prices[s] && Number.isInteger(i) && prices[s][i] != null) amount += prices[s][i];
    });

    const lang = document.documentElement.lang || 'en';
    const formatted = new Intl.NumberFormat(localeFor(lang), {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(amount);
    const label = labels[lang] || labels.en;
    total.textContent = `${label} · ${formatted}`;
    total.setAttribute('aria-label', `${label}: ${formatted}`);
  };

  const style = document.createElement('style');
  style.textContent = '.config-total{display:block;flex-basis:100%;margin-top:6px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#c39a60;font-weight:600}.finish-caption{flex-wrap:wrap}@media(max-width:600px){.config-total{font-size:9px;margin-top:4px}}';
  document.head.appendChild(style);

  read();
  document.addEventListener('bandura:languagechange', read);
  content.addEventListener('click', () => requestAnimationFrame(read));
  content.addEventListener('input', () => requestAnimationFrame(read));
  const observer = new MutationObserver(() => requestAnimationFrame(read));
  observer.observe(content, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
})();
