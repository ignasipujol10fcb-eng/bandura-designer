/* Keep photographic alternative text meaningful in every supported language. */
(() => {
  const copy = {
    en: {
      hero: 'Real Ukrainian bandura photographed for reference',
      detail: 'Close-up of a real Ukrainian bandura',
      preview: 'Live preview of the configured bandura',
      gallery: 'Real Ukrainian bandura reference'
    },
    uk: {
      hero: 'Справжня українська бандура, сфотографована для довідки',
      detail: 'Крупний план справжньої української бандури',
      preview: 'Перегляд налаштованої бандури в реальному часі',
      gallery: 'Справжня українська бандура для прикладу'
    },
    es: {
      hero: 'Bandura ucraniana real fotografiada como referencia',
      detail: 'Primer plano de una bandura ucraniana real',
      preview: 'Vista previa en directo de la bandura configurada',
      gallery: 'Bandura ucraniana real como referencia'
    },
    it: {
      hero: 'Vera bandura ucraina fotografata come riferimento',
      detail: 'Dettaglio di una vera bandura ucraina',
      preview: 'Anteprima dal vivo della bandura configurata',
      gallery: 'Vera bandura ucraina come riferimento'
    },
    fr: {
      hero: 'Véritable bandoura ukrainienne photographiée comme référence',
      detail: 'Gros plan sur une véritable bandoura ukrainienne',
      preview: 'Aperçu en direct de la bandoura configurée',
      gallery: 'Véritable bandoura ukrainienne de référence'
    },
    de: {
      hero: 'Echte ukrainische Bandura als fotografische Referenz',
      detail: 'Nahaufnahme einer echten ukrainischen Bandura',
      preview: 'Live-Vorschau der konfigurierten Bandura',
      gallery: 'Echte ukrainische Bandura als Referenz'
    },
    zh: {
      hero: '作为参考的真实乌克兰班杜拉琴照片',
      detail: '真实乌克兰班杜拉琴的局部特写',
      preview: '已配置班杜拉琴的实时预览',
      gallery: '真实乌克兰班杜拉琴参考照片'
    },
    ja: {
      hero: '参考用に撮影された本物のウクライナのバンドゥーラ',
      detail: '本物のウクライナのバンドゥーラのクローズアップ',
      preview: '設定したバンドゥーラのライブプレビュー',
      gallery: '本物のウクライナのバンドゥーラ参考写真'
    },
    he: {
      hero: 'בנדורה אוקראינית אמיתית שצולמה לצורך המחשה',
      detail: 'תקריב של בנדורה אוקראינית אמיתית',
      preview: 'תצוגה מקדימה חיה של הבנדורה שהוגדרה',
      gallery: 'בנדורה אוקראינית אמיתית לעיון'
    }
  };

  const update = (lang) => {
    const t = copy[lang] || copy.en;
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (img.id === 'previewImage') img.alt = t.preview;
      else if (img.closest('.hero-art')) img.alt = t.hero;
      else if (img.closest('.editorial-photo')) img.alt = t.detail;
      else if (img.closest('.gallery-card')) img.alt = t.gallery;
    });
  };

  update(document.documentElement.lang || 'en');
  document.addEventListener('bandura:languagechange', (event) => update(event.detail?.lang || document.documentElement.lang || 'en'));
})();
