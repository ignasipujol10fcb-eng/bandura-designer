/* Keep document metadata, language and reading direction aligned with the selected UI language. */
(() => {
  const select = document.getElementById('language');
  if (!select) return;
  const rtl = new Set(['he']);
  const meta = {
    en: ['Bandura Atelier — Bespoke Ukrainian Banduras', 'Bandura Atelier — bespoke handcrafted Ukrainian banduras designed around you.'],
    uk: ['Bandura Atelier — Українські бандури на замовлення', 'Bandura Atelier — українські бандури ручної роботи, створені відповідно до ваших побажань.'],
    es: ['Bandura Atelier — Banduras ucranianas a medida', 'Bandura Atelier — banduras ucranianas artesanales diseñadas a tu medida.'],
    it: ['Bandura Atelier — Bandure ucraine su misura', 'Bandura Atelier — bandure ucraine artigianali progettate intorno alle tue esigenze.'],
    fr: ['Bandura Atelier — Bandouras ukrainiennes sur mesure', 'Bandura Atelier — bandouras ukrainiennes artisanales conçues selon vos envies.'],
    de: ['Bandura Atelier — Ukrainische Banduras nach Maß', 'Bandura Atelier — handgefertigte ukrainische Banduras, nach Ihren Vorstellungen gestaltet.'],
    zh: ['Bandura Atelier — 定制乌克兰班杜拉', 'Bandura Atelier — 根据您的想法打造的手工乌克兰班杜拉。'],
    ja: ['Bandura Atelier — オーダーメイドのウクライナ・バンドゥーラ', 'Bandura Atelier — あなたの希望に合わせてデザインする、手作りのウクライナ・バンドゥーラ。'],
    he: ['Bandura Atelier — בנדורות אוקראיניות בעיצוב אישי', 'Bandura Atelier — בנדורות אוקראיניות בעבודת יד, בעיצוב המותאם להעדפות שלכם.']
  };
  const languageLabels = {
    en: 'Language', es: 'Idioma', uk: 'Мова', it: 'Lingua', fr: 'Langue', de: 'Sprache',
    zh: '语言', ja: '言語', he: 'שפה'
  };
  const apply = (value) => {
    const lang = value || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl.has(lang) ? 'rtl' : 'ltr';
    const copy = meta[lang] || meta.en;
    document.title = copy[0];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', copy[1]);
    select.setAttribute('aria-label', languageLabels[lang] || languageLabels.en);
    try { localStorage.setItem('bandura-language', lang); } catch (_) {}
    document.dispatchEvent(new CustomEvent('bandura:languagechange', { detail: { lang } }));
  };
  let saved = '';
  try { saved = localStorage.getItem('bandura-language') || ''; } catch (_) {}
  if (saved && [...select.options].some(option => option.value === saved)) {
    select.value = saved;
  }
  apply(select.value);
  select.addEventListener('change', () => apply(select.value));
})();
