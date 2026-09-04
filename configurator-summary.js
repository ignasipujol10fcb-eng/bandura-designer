/* Lightweight, dependency-free design summary: mirrors the choices a visitor makes without relying on app.js internals. */
(() => {
  const config = document.querySelector('.config');
  const content = document.getElementById('configContent');
  const counter = document.getElementById('stepCounter');
  if (!config || !content || !counter) return;

  const KEY = 'bandura-atelier-config-v1';
  const labels = {en:'Your design',es:'Tu diseño',uk:'Ваш дизайн',it:'Il tuo design',fr:'Votre design',de:'Ihr Design',zh:'您的设计',ja:'あなたのデザイン',he:'העיצוב שלך'};
  const hint = {en:'Selections are saved on this device.',es:'Las elecciones se guardan en este dispositivo.',uk:'Вибір зберігається на цьому пристрої.',it:'Le scelte vengono salvate su questo dispositivo.',fr:'Vos choix sont enregistrés sur cet appareil.',de:'Ihre Auswahl wird auf diesem Gerät gespeichert.',zh:'选择会保存在此设备上。',ja:'選択内容はこのデバイスに保存されます。',he:'הבחירות נשמרות במכשיר הזה.'};
  const reset = {en:'Start over',es:'Empezar de nuevo',uk:'Почати спочатку',it:'Ricomincia',fr:'Recommencer',de:'Neu beginnen',zh:'重新开始',ja:'最初から',he:'להתחיל מחדש'};
  const empty = {en:'Choose an option to build your design.',es:'Elige una opción para crear tu diseño.',uk:'Оберіть параметр, щоб створити дизайн.',it:'Scegli un’opzione per creare il tuo design.',fr:'Choisissez une option pour créer votre design.',de:'Wählen Sie eine Option, um Ihr Design zu erstellen.',zh:'选择一个选项来创建您的设计。',ja:'項目を選んでデザインを作成してください。',he:'בחרו אפשרות כדי ליצור את העיצוב שלכם.'};
  const summary = document.createElement('section');
  summary.className = 'config-summary';
  summary.setAttribute('aria-labelledby','configSummaryTitle');
  config.appendChild(summary);

  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (_) { return {}; } };
  const write = (patch) => { try { localStorage.setItem(KEY, JSON.stringify({...read(), ...patch})); } catch (_) {} };
  const stepName = (index) => {
    const step = document.querySelectorAll('#steps > *')[index];
    return step?.querySelector('strong,h3,.step-title,[data-step-title]')?.textContent?.trim() || step?.textContent?.replace(/\d+/,'').trim() || `Step ${index + 1}`;
  };
  const currentSelection = () => {
    const step = Number.parseInt(counter.textContent || '',10) - 1;
    const selected = content.querySelector('.choice.selected');
    if (!Number.isInteger(step) || step < 0 || !selected) return null;
    const strong = selected.querySelector('strong');
    return {step, name:(strong?.textContent || selected.textContent || '').trim()};
  };
  const capture = () => {
    const current = currentSelection();
    if (!current?.name) return;
    const saved = read();
    const names = {...(saved.choiceNames || {})};
    names[current.step] = current.name;
    write({choiceNames:names, choiceNameLang:document.documentElement.lang || 'en'});
  };
  const render = () => {
    const lang = document.documentElement.lang || 'en';
    const saved = read(), names = saved.choiceNames || {};
    const rows = Object.keys(names).map(Number).filter(Number.isInteger).sort((a,b)=>a-b).map(i => {
      const name = String(names[i] || '').trim();
      return name ? `<div class="config-summary-row"><span>${escapeHtml(stepName(i))}</span><strong>${escapeHtml(name)}</strong></div>` : '';
    }).join('');
    summary.innerHTML = `<h3 id="configSummaryTitle">${escapeHtml(labels[lang] || labels.en)}</h3><p>${escapeHtml(hint[lang] || hint.en)}</p>${rows || `<span class="config-summary-empty">${escapeHtml(empty[lang] || empty.en)}</span>`}<button class="config-summary-reset" type="button">${escapeHtml(reset[lang] || reset.en)}</button>`;
    summary.querySelector('.config-summary-reset').addEventListener('click', () => {
      try { localStorage.removeItem(KEY); } catch (_) {}
      document.dispatchEvent(new CustomEvent('bandura:configchange'));
      window.location.reload();
    });
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  content.addEventListener('click', event => {
    if (event.target.closest('.choice')) requestAnimationFrame(() => { capture(); render(); });
  });
  content.addEventListener('input', () => requestAnimationFrame(render));
  document.addEventListener('bandura:languagechange', render);
  document.addEventListener('bandura:configchange', render);
  const observer = new MutationObserver(() => requestAnimationFrame(() => { capture(); render(); }));
  observer.observe(content,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  render();

  const style = document.createElement('style');
  style.textContent = `.config-summary{margin-top:18px;padding:14px 0;border-top:1px solid rgba(195,154,96,.22)}.config-summary h3{margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase}.config-summary p{margin:0 0 10px;font-size:11px;opacity:.62}.config-summary-row{display:flex;justify-content:space-between;gap:14px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:11px}.config-summary-row span{opacity:.62}.config-summary-row strong{text-align:end;font-weight:600}.config-summary-empty{display:block;font-size:11px;opacity:.5}.config-summary-reset{margin-top:12px;padding:8px 0;border:0;background:none;color:inherit;font:inherit;font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.6;cursor:pointer;text-decoration:underline;text-underline-offset:3px}.config-summary-reset:hover,.config-summary-reset:focus-visible{opacity:1;color:#c39a60}.config-summary-reset:focus-visible{outline:2px solid #c39a60;outline-offset:3px}@media(max-width:700px){.config-summary{margin-top:12px;padding-top:12px}.config-summary-row{font-size:10px}}`;
  document.head.appendChild(style);
})();
