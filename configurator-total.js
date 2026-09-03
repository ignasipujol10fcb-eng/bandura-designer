/* Live configurator total: derives the estimate from the existing option order without changing the source pricing or adding a checkout service. */
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
  total.setAttribute('aria-live', 'polite');
  caption.appendChild(total);

  const read = () => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('bandura-atelier-config-v1') || '{}'); } catch (_) {}
    const choices = saved.choices || {};
    let amount = 0;
    Object.keys(choices).forEach(step => {
      const s = Number(step), i = Number(choices[step]);
      if (prices[s] && Number.isInteger(i) && prices[s][i] != null) amount += prices[s][i];
    });
    const lang = document.documentElement.lang || 'en';
    total.textContent = `${labels[lang] || labels.en} · €${amount.toLocaleString('en-US')}`;
    total.setAttribute('aria-label', `${labels[lang] || labels.en}: €${amount.toLocaleString('en-US')}`);
  };

  const style = document.createElement('style');
  style.textContent = '.config-total{display:block;flex-basis:100%;margin-top:6px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#c39a60;font-weight:600}.finish-caption{flex-wrap:wrap}@media(max-width:600px){.config-total{font-size:9px;margin-top:4px}}';
  document.head.appendChild(style);
  read();
  document.addEventListener('bandura:languagechange', read);
  content.addEventListener('click', () => setTimeout(read, 80));
  content.addEventListener('input', () => setTimeout(read, 80));
  const observer = new MutationObserver(read);
  observer.observe(content, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
  let ticks = 0;
  const sync = setInterval(() => { read(); if (++ticks > 30) clearInterval(sync); }, 100);
})();
