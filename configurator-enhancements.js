/* Non-destructive visual layer for the configurator. It mirrors selected options on the live preview while keeping the real photograph intact. */
(() => {
  const card=document.querySelector('.instrument-card'),image=document.getElementById('previewImage'),content=document.getElementById('configContent');
  if(!card||!image||!content)return;
  const labels=['model','strings','wood','finish','ornament','electronics','case','engraving'],state=Object.create(null);
  let layer=card.querySelector('.config-visual-layer');
  if(!layer){layer=document.createElement('div');layer.className='config-visual-layer';layer.setAttribute('aria-hidden','true');card.appendChild(layer)}
  const clean=v=>(v||'').trim(),slug=v=>clean(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const inscriptionCopy={en:['Personal inscription','Up to 30 characters','Your text will appear on the live preview.'],es:['Inscripción personal','Hasta 30 caracteres','Tu texto aparecerá en la vista previa.'],uk:['Особистий напис','До 30 символів','Ваш текст з’явиться у попередньому перегляді.'],it:['Incisione personale','Fino a 30 caratteri','Il testo apparirà nell’anteprima.'],fr:['Inscription personnelle','30 caractères maximum','Votre texte apparaîtra dans l’aperçu.'],de:['Persönliche Gravur','Bis zu 30 Zeichen','Ihr Text erscheint in der Live-Vorschau.'],zh:['个性刻字','最多30个字符','文字会显示在实时预览中。'],ja:['パーソナル刻印','30文字まで','入力した文字がプレビューに表示されます。'],he:['חריטה אישית','עד 30 תווים','הטקסט יופיע בתצוגה המקדימה.']};
  function localizeInscriptionField(){
    const wrap=document.getElementById('customInscriptionField');
    if(!wrap)return;
    const lang=document.documentElement.lang||'en',copy=inscriptionCopy[lang]||inscriptionCopy.en,input=wrap.querySelector('input');
    const label=wrap.querySelector('label'),help=wrap.querySelector('small');
    if(label)label.textContent=copy[0];
    if(input){input.placeholder=copy[1];input.setAttribute('aria-label',copy[0]);}
    if(help)help.textContent=copy[2];
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
    input.addEventListener('input',()=>{state.inscriptionText=input.value.slice(0,30);refreshPreview()});
  }
  function refreshPreview(){
    Object.entries(state).forEach(([k,v])=>{if(v&&k!=='inscriptionText')card.dataset[k]=slug(v)});
    const chips=Object.entries(state).filter(([k,v])=>v&&k!=='inscriptionText').map(([k,v])=>`<span class="preview-badge preview-badge-${k}">${v}</span>`).join('');
    const ornamentKey=slug(state.ornament);
    const ornamentSymbols={tryzub:'△',vyshyvanka:'◇',petrykivka:'✿',custom:'✧'};
    const ornament=state.ornament&&!/^minimal$/i.test(state.ornament)&&!/^none$/i.test(state.ornament)?`<span class="preview-ornament preview-ornament-${ornamentKey}">${ornamentSymbols[ornamentKey]||'✦'}</span>`:'';
    const electronicsKey=slug(state.electronics);
    const electronics=state.electronics&&!/^none$/i.test(state.electronics)?`<span class="preview-pickup preview-pickup-${electronicsKey}" aria-hidden="true"><i></i></span>`:'';
    const engravingKey=slug(state.engraving);
    const engravingText=state.engraving==='Custom inscription'?(state.inscriptionText||'Aa'):(/^name$/i.test(state.engraving)?'A':'✧');
    const engraving=state.engraving&&!/^none$/i.test(state.engraving)?`<span class="preview-engraving preview-engraving-${engravingKey}">${engravingText}</span>`:'';
    const strings=state.strings&&!/^none$/i.test(state.strings)?'<span class="preview-string-field"></span>':'';
    const caseOverlay=state.case&&!/^none$/i.test(state.case)?`<span class="preview-case preview-case-${slug(state.case)}"></span>`:'';
    const modelFrame=state.model?`<span class="preview-model-marker preview-model-${slug(state.model)}"></span>`:'';
    layer.innerHTML=`${caseOverlay}${modelFrame}${strings}${ornament}${electronics}${engraving}<span class="preview-badges">${chips}</span>`;
    const woodFilters={walnut:'sepia(.18) saturate(1.15) brightness(.92)',maple:'sepia(.05) saturate(.72) brightness(1.12)',cherry:'sepia(.35) saturate(1.55) hue-rotate(-12deg) brightness(.92)',ash:'sepia(.08) saturate(.55) brightness(1.08)',wenge:'sepia(.25) saturate(.8) brightness(.62)'};
    const finishFilters={natural:'',honey:'brightness(1.02) saturate(1.12)','dark-walnut':'brightness(.76) contrast(1.06)',black:'grayscale(.65) brightness(.58) contrast(1.12)'};
    const filter=`${woodFilters[slug(state.wood)]||''} ${finishFilters[slug(state.finish)]||''}`.trim();
    image.style.filter=filter||'';
    image.alt=state.model?`Bandura live preview — ${[state.model,state.strings,state.wood,state.finish].filter(Boolean).join(', ')}`:'Live bandura preview';
  }
  function refresh(){
    const selected=content.querySelector('.choice.selected'),stepText=document.getElementById('stepCounter')?.textContent||'',index=Math.max(0,parseInt(stepText,10)-1);
    if(selected&&labels[index])state[labels[index]]=clean(selected.querySelector('strong')?.textContent);
    refreshPreview();
    ensureInscriptionField();
  }
  const observer=new MutationObserver(refresh);observer.observe(content,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  content.addEventListener('click',()=>requestAnimationFrame(refresh));
  document.getElementById('nextBtn')?.addEventListener('click',()=>requestAnimationFrame(refresh));
  document.getElementById('backBtn')?.addEventListener('click',()=>requestAnimationFrame(refresh));
  document.addEventListener('bandura:languagechange',localizeInscriptionField);
  refresh();
  const persistence=document.createElement('script');
  persistence.src='configurator-persistence.js';
  persistence.defer=true;
  document.body.appendChild(persistence);
  const total=document.createElement('script');
  total.src='configurator-total.js';
  total.defer=true;
  document.body.appendChild(total);
})();
