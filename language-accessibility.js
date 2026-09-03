/* Keep the document language and reading direction aligned with the selected UI language. */
(() => {
  const select = document.getElementById('language');
  if (!select) return;
  const rtl = new Set(['he']);
  const apply = (value) => {
    const lang = value || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl.has(lang) ? 'rtl' : 'ltr';
    try { localStorage.setItem('bandura-language', lang); } catch (_) {}
  };
  let saved = '';
  try { saved = localStorage.getItem('bandura-language') || ''; } catch (_) {}
  if (saved && [...select.options].some(option => option.value === saved)) {
    select.value = saved;
  }
  apply(select.value);
  select.addEventListener('change', () => apply(select.value));
})();
