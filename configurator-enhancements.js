/* Non-destructive visual layer for the configurator. It mirrors selected options on the live preview while keeping the real photograph intact. */
(() => {
  const card=document.querySelector('.instrument-card'),image=document.getElementById('previewImage'),content=document.getElementById('configContent');
  if(!card||!image||!content)return;
  const labels=['model','strings','wood','finish','ornament','electronics','case','engraving'],state=Object.create(null);
  let layer=card.querySelector('.config-visual-layer');
  if(!layer){layer=document.createElement('div');layer.className='config-visual-layer';layer.setAttribute('aria-hidden','true');card.appendChild(layer)}
  let live=document.getElementById('configPreviewStatus');
  if(!live){live=document.createElement('p');live.id='configPreviewStatus';live.className='sr-only';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');card.parentElement?.appendChild(live)}
  const clean=v=>(v||'').trim(),slug=v=>clean(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const inscriptionCopy={en:['Personal inscription','Up to 30 characters','Your text will appear on the live preview.'],es:['Inscripción personal','Hasta 30 caracteres','Tu texto aparecerá en la vista previa.'],uk:['Особистий напис','До 30 символів','Ваш текст з’явиться у попередньому перегляді.'],it:['Incisione personale','Fino a 30 caratteri','Il testo apparirà nell’anteprima.'],fr:['Inscription personnelle','30 caractères maximum','Votre texte apparaîtra dans l’aperçu.'],de:['Persönliche Gravur','Bis zu 30 Zeichen','Ihr Text erscheint in der Live-Vorschau.'],zh:['个性刻字','最多30个字符','文字会显示在实时预览中。'],ja:['パーソナル刻印','30文字まで','入力した文字がプレビューに表示されます。'],he:['חריטה אישית','עד 30 תווים','הטקסט יופיע בתצוגה המקדימה.']};
  const statusCopy={en:['Preview updated','Your live bandura preview now reflects','choices.'],es:['Vista previa actualizada','La vista previa de tu bandura ahora refleja','decisiones.'],uk:['Попередній перегляд оновлено','Попередній перегляд бандури враховує','виборів.'],it:['Anteprima aggiornata','L’anteprima della tua bandura ora riflette','scelte.'],fr:['Aperçu mis à jour','L’aperçu de votre bandura reflète maintenant','choix.'],de:['Vorschau aktualisiert','Die Live-Vorschau Ihrer Bandura berücksichtigt jetzt','Auswahlen.'],zh:['预览已更新','实时预览现已反映您的','项选择。'],ja:['プレビューを更新しました','バンドゥーラのライブプレビューに選択した','項目が反映されました。'],he:['התצוגה המקדימה עודכנה','התצוגה המקדימה של הבנדורה משקפת כעת את','הבחירות.']};
  const previewAltCopy={en:['Live bandura preview','Selected design:'],es:['Vista previa de la bandura','Diseño seleccionado:'],uk:['Попередній перегляд бандури','Обраний дизайн:'],it:['Anteprima della bandura','Design selezionato:'],fr:['Aperçu de la bandura','Design sélectionné :'],de:['Live-Vorschau der Bandura','Ausgewähltes Design:'],zh:['实时班杜拉预览','已选设计：'],ja:['バンドゥーラのライブプレビュー','選択したデザイン：'],he:['תצוגה מקדימה של הבנדורה','עיצוב שנבחר:']};
  function localizeInscriptionField(){
    const wrap=document.getElementById('customInscriptionField');
    if(!wrap)return;
    const lang=document.documentElement.lang||'en',copy=inscriptionCopy[lang]||inscriptionCopy.en,input=wrap.querySelector('input');
    const label=wrap.querySelector('label'),help=wrap.querySelector('small');
    if(label)label.textContent=copy[0];
    if(input){input.placeholder=copy[1];input.setAttribute('aria-label',copy[0]);}
    if(help)help.textContent=copy[2];
  }
  function announcePreview(){
    if(!live)return;
    const lang=document.documentElement.lang||'en',copy=statusCopy[lang]||statusCopy.en;
    const chosen=labels.map(k=>state[k]).filter(Boolean).join(', ');
    live.textContent=`${copy[0]}. ${copy[1]} ${chosen} ${copy[2]}`;
  }
  function ensureInscriptionField(){
    const custom=labels[7]&&state[labels[7]]==='Custom inscription';
    const existing=document.getElementById('customInscriptionField');
    if(!custom){if(existing)existing.remove();return}
    if(existing){localizeInscriptionField();return}
    const lang=document.documentElement.lang||'en',copy=inscriptionCopy[lang]||inscriptionCopy.en;
    const wrap=document.createElement('div');wrap.className='custom-inscription-field';wrap.id='customInscriptionField';
    wrap.innerHTML=`<label for="customInscription">${copy[0]}</label><input id="customInscription" name="customInscription" type="text" maxlength="30" autocomplete="off" placeholder="${copy[1]}" aria-describedby="customInscriptionHelp"><small id="customInscriptionHelp">${copy[2]}</small>`;
    const selected=content.querySelector('.choice.selected');
    (selected?.parentElement||content).appendChild(wrap);
    const input=wrap.querySelector('input');
    input.value=state.inscriptionText||'';
    input.addEventListener('input',()=>{state.inscriptionText=input.value.slice(0,30);refreshPreview();announcePreview()});
  }
  function refreshPreview(){
    Object.entries(state).forEach(([k,v])=>{if(v&&k!=='inscriptionText')card.dataset[k]=slug(v)});
    const chips=Object.entries(state).filter(([k,v])=>v&&k!=='inscriptionText').map(([k,v])=>`<span class="preview-badge preview-badge-${k}">${escapeHtml(v)}</span>`).join('');
    const ornamentKey=slug(state.ornament);
    const ornamentSymbols={tryzub:'△',vyshyvanka:'◇',petrykivka:'✿',custom:'✧'};
    const ornament=state.ornament&&!/^minimal$/i.test(state.ornament)&&!/^none$/i.test(state.ornament)?`<span class="preview-ornament preview-ornament-${ornamentKey}">${ornamentSymbols[ornamentKey]||'✦'}</span>`:'';
    const electronicsKey=slug(state.electronics);
    const electronics=state.electronics&&!/^none$/i.test(state.electronics)?`<span class="preview-pickup preview-pickup-${electronicsKey}" aria-hidden="true"><i></i></span>`:'';
    const engravingKey=slug(state.engraving);
    const engravingText=state.engraving==='Custom inscription'?(state.inscriptionText||'Aa'):(/^name$/i.test(state.engraving)?'A':'✧');
    const engraving=state.engraving&&!/^none$/i.test(state.engraving)?`<span class="preview-engraving preview-engraving-${engravingKey}">${escapeHtml(engravingText)}</span>`:'';
    const strings=state.strings&&!/^none$/i.test(state.strings)?'<span class="preview-string-field"></span>':'';
    const caseOverlay=state.case&&!/^none$/i.test(state.case)?`<span class="preview-case preview-case-${slug(state.case)}"></span>`:'';
    const modelFrame=state.model?`<span class="preview-model-marker preview-model-${slug(state.model)}"></span>`:'';
    layer.innerHTML=`${caseOverlay}${modelFrame}${strings}${ornament}${electronics}${engraving}<span class="preview-badges">${chips}</span>`;
    const woodFilters={walnut:'sepia(.18) saturate(1.15) brightness(.92)',maple:'sepia(.05) saturate(.72) brightness(1.12)',cherry:'sepia(.35) saturate(1.55) hue-rotate(-12deg) brightness(.92)',ash:'sepia(.08) saturate(.55) brightness(1.08)',wenge:'sepia(.25) saturate(.8) brightness(.62)'};
    const finishFilters={natural:'',honey:'brightness(1.02) saturate(1.12)','dark-walnut':'brightness(.76) contrast(1.06)',black:'grayscale(.65) brightness(.58) contrast(1.12)'};
    const filter=`${woodFilters[slug(state.wood)]||''} ${finishFilters[slug(state.finish)]||''}`.trim();
    image.style.filter=filter||'';
    const lang=document.documentElement.lang||'en',altCopy=previewAltCopy[lang]||previewAltCopy.en;
    const selectedDesign=[state.model,state.strings,state.wood,state.finish].filter(Boolean).join(', ');
    image.alt=selectedDesign?`${altCopy[0]} — ${altCopy[1]} ${selectedDesign}`:altCopy[0];
  }
  function refresh(){
    const selected=content.querySelector('.choice.selected'),stepText=document.getElementById('stepCounter')?.textContent||'',index=Math.max(0,parseInt(stepText,10)-1);
    if(selected&&labels[index])state[labels[index]]=clean(selected.querySelector('strong')?.textContent);
    refreshPreview();
    ensureInscriptionField();
  }
  const observer=new MutationObserver(refresh);observer.observe(content,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  content.addEventListener('click',()=>requestAnimationFrame(()=>{refresh();announcePreview()}));
  document.getElementById('nextBtn')?.addEventListener('click',()=>requestAnimationFrame(()=>{refresh();announcePreview()}));
  document.getElementById('backBtn')?.addEventListener('click',()=>requestAnimationFrame(()=>{refresh();announcePreview()}));
  document.addEventListener('bandura:languagechange',()=>{localizeInscriptionField();refreshPreview();announcePreview()});
  refresh();
  const persistence=document.createElement('script');
  persistence.src='configurator-persistence.js';
  persistence.defer=true;
  document.body.appendChild(persistence);
  const total=document.createElement('script');
  total.src='configurator-total.js';
  total.defer=true;
  document.body.appendChild(total);
  const keyboard=document.createElement('script');
  keyboard.src='configurator-keyboard.js';
  keyboard.defer=true;
  document.body.appendChild(keyboard);
  const performance=document.createElement('script');
  performance.src='image-performance.js';
  performance.defer=true;
  document.body.appendChild(performance);

  // Keep the Hebrew (RTL) configurator visually directional while leaving all other locales untouched.
  const rtlStyle=document.createElement('style');
  rtlStyle.textContent='[dir="rtl"] .designer-grid{grid-template-columns:380px 1fr 205px}[dir="rtl"] .steps{border-right:0;border-left:1px solid #ffffff18}[dir="rtl"] .choice:hover,[dir="rtl"] .choice.selected{transform:translateX(-2px)}[dir="rtl"] .preview-badges{left:auto;right:18px}[dir="rtl"] .config-footer{flex-direction:row-reverse}[dir="rtl"] .config-footer .next span:last-child{transform:scaleX(-1)}[dir="rtl"] .config-footer .back{transform:scaleX(-1)}@media(max-width:900px){[dir="rtl"] .steps{border-left:0}[dir="rtl"] .config-footer{flex-direction:row!important}[dir="rtl"] .preview-badges{right:12px}}';
  document.head.appendChild(rtlStyle);
})();
