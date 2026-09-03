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

  /* Add one additional real, freely licensed bandura photograph to the material story.
     It is lazy-loaded and layered behind the existing Ukrainian geometry treatment. */
  const addPerformancePhoto = () => {
    const card = document.querySelector('.gallery-card.detail');
    if (!card || card.querySelector('.gallery-performance-photo')) return;
    const image = document.createElement('img');
    image.className = 'gallery-performance-photo';
    image.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Vyriy_ethno_festival_Kyiv_26_badura_players.jpg?width=1200';
    image.alt = copy.en.gallery;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.setAttribute('fetchpriority', 'low');
    card.prepend(image);
    const credit = document.createElement('small');
    credit.className = 'gallery-photo-credit';
    credit.textContent = 'Photo: Dmytro Noir / Wikimedia Commons · CC BY-SA 4.0';
    card.appendChild(credit);

    const style = document.createElement('style');
    style.textContent = `.gallery-card.detail{isolation:isolate}.gallery-performance-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.72;filter:saturate(.78) contrast(1.06);transition:opacity .45s,transform .7s;z-index:0}.gallery-card.detail:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#17130f2b 0%,#17130f66 55%,#17130fd9 100%);z-index:1;pointer-events:none}.gallery-card.detail .ornament{z-index:2;color:#e2bd82;text-shadow:0 2px 18px #17130f}.gallery-card.detail:hover .gallery-performance-photo{opacity:.84;transform:scale(1.025)}.gallery-photo-credit{position:absolute;right:20px;bottom:20px;max-width:58%;color:#f5eee1b8;font-size:7px;line-height:1.4;letter-spacing:.08em;text-align:right;z-index:3}@media(max-width:900px){.gallery-photo-credit{right:14px;bottom:14px;max-width:68%;font-size:6px}}@media(prefers-reduced-motion:reduce){.gallery-performance-photo{transition:none}}`;
    document.head.appendChild(style);
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

  addPerformancePhoto();
  update(document.documentElement.lang || 'en');
  document.addEventListener('bandura:languagechange', (event) => update(event.detail?.lang || document.documentElement.lang || 'en'));
})();
