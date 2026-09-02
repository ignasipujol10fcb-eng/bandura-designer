/* Non-destructive visual layer for the configurator. It mirrors selected options on the live preview while keeping the real photograph intact. */
(() => {
  const card=document.querySelector('.instrument-card'),image=document.getElementById('previewImage'),content=document.getElementById('configContent');
  if(!card||!image||!content)return;
  const labels=['model','strings','wood','finish','ornament','electronics','case','engraving'],state=Object.create(null);
  let layer=card.querySelector('.config-visual-layer');
  if(!layer){layer=document.createElement('div');layer.className='config-visual-layer';layer.setAttribute('aria-hidden','true');card.appendChild(layer)}
  const clean=v=>(v||'').trim(),slug=v=>clean(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  function refresh(){
    const selected=content.querySelector('.choice.selected'),stepText=document.getElementById('stepCounter')?.textContent||'',index=Math.max(0,parseInt(stepText,10)-1);
    if(selected&&labels[index])state[labels[index]]=clean(selected.querySelector('strong')?.textContent);
    Object.entries(state).forEach(([k,v])=>{if(v)card.dataset[k]=slug(v)});
    const chips=Object.entries(state).filter(([,v])=>v).map(([k,v])=>`<span class="preview-badge preview-badge-${k}">${v}</span>`).join('');
    const ornament=state.ornament&&!/^minimal$/i.test(state.ornament)&&!/^none$/i.test(state.ornament)?'<span class="preview-ornament">✦</span>':'';
    const electronics=state.electronics&&!/^none$/i.test(state.electronics)?'<span class="preview-pickup">●</span>':'';
    const engraving=state.engraving&&!/^none$/i.test(state.engraving)?`<span class="preview-engraving">${/^name$/i.test(state.engraving)?'A':'✧'}</span>`:'';
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
  const observer=new MutationObserver(refresh);observer.observe(content,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  content.addEventListener('click',()=>requestAnimationFrame(refresh));
  document.getElementById('nextBtn')?.addEventListener('click',()=>requestAnimationFrame(refresh));
  document.getElementById('backBtn')?.addEventListener('click',()=>requestAnimationFrame(refresh));
  refresh();
})();
