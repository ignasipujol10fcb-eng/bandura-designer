/* Lightweight design summary: keeps the full configuration visible while a visitor moves through the eight-step builder. */
(() => {
  const config = document.querySelector('.config');
  const content = document.getElementById('configContent');
  const counter = document.getElementById('stepCounter');
  if (!config || !content || !counter) return;

  const KEY = 'bandura-atelier-config-v1';
  const labels = {en:'Your design',es:'Tu diseño',uk:'Ваш дизайн',it:'Il tuo design',fr:'Votre design',de:'Ihr Design',zh:'您的设计',ja:'あなたのデザイン',he:'העיצוב שלך'};
  const hint = {en:'Selections are saved on this device.',es:'Las elecciones se guardan en este dispositivo.',uk:'Вибір зберігається на цьому пристрої.',it:'Le scelte vengono salvate su questo dispositivo.',fr:'Vos choix sont enregistrés sur cet appareil.',de:'Ihre Auswahl wird auf diesem Gerät gespeichert.',zh:'选择会保存在此设备上。',ja:'選択内容はこのデバイスに保存されます。',he:'הבחירות נשמרות במכשיר הזה.'};
  const summary = document.createElement('section');
  summary.className = 'config-summary';
  summary.setAttribute('aria-labelledby','configSummaryTitle');
  config.appendChild(summary);
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } };
  const optionName = (step,index,lang) => {
    const row = window.__banduraData?.[step];
    const raw = row?.[3]?.[index]?.split('|')[0] || '';
    return T?.[lang]?.opts?.[raw]?.[0] || T?.en?.opts?.[raw]?.[0] || raw;
  };
  const render = () => {
    const lang = document.documentElement.lang || 'en';
    const saved = read(), choices = saved.choices || {};
    const rows = (window.__banduraData || []).map((row,i) => {
      const index = Number(choices[i]);
      if (!Number.isInteger(index) || !row?.[3]?.[index]) return '';
      return `<div class="config-summary-row"><span>${(T?.[lang]?.steps?.[i] || T?.en?.steps?.[i] || row[1])}</span><strong>${optionName(i,index,lang)}</strong></div>`;
    }).filter(Boolean).join('');
    summary.innerHTML = `<h3 id="configSummaryTitle">${labels[lang] || labels.en}</h3><p>${hint[lang] || hint.en}</p>${rows || `<span class="config-summary-empty">${T?.[lang]?.designerText || T?.en?.designerText || ''}</span>`}`;
  };
  try { window.__banduraData = data; } catch (_) { window.__banduraData = []; }
  const observer = new MutationObserver(() => requestAnimationFrame(render));
  observer.observe(content,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  content.addEventListener('click',() => requestAnimationFrame(render));
  document.addEventListener('bandura:languagechange',render);
  document.addEventListener('bandura:configchange',render);
  render();
  const style = document.createElement('style');
  style.textContent = `.config-summary{margin-top:18px;padding:14px 0;border-top:1px solid rgba(195,154,96,.22)}.config-summary h3{margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase}.config-summary p{margin:0 0 10px;font-size:11px;opacity:.62}.config-summary-row{display:flex;justify-content:space-between;gap:14px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:11px}.config-summary-row span{opacity:.62}.config-summary-row strong{text-align:end;font-weight:600}.config-summary-empty{display:block;font-size:11px;opacity:.5}@media(max-width:700px){.config-summary{margin-top:12px;padding-top:12px}.config-summary-row{font-size:10px}}`;
  document.head.appendChild(style);
})();