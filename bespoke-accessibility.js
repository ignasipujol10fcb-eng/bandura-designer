/* Accessible enhancements for the bespoke enquiry dialog: localized close control, focus trap, and focus restoration. */
(() => {
  const closeLabels={en:'Close',uk:'Закрити',es:'Cerrar',it:'Chiudi',fr:'Fermer',de:'Schließen',zh:'关闭',ja:'閉じる',he:'סגירה'};
  let lastTrigger=null;
  const getModal=()=>document.querySelector('.bespoke-modal');
  const getFocusable=(modal)=>[...modal.querySelectorAll('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled&&el.offsetParent!==null);
  const apply=()=>{
    const modal=getModal();
    if(!modal)return;
    const close=modal.querySelector('.bespoke-close');
    if(close){const lang=document.documentElement.lang||'en';close.setAttribute('aria-label',closeLabels[lang]||closeLabels.en);}
    if(modal.hidden){if(lastTrigger&&document.contains(lastTrigger)){lastTrigger.focus();lastTrigger=null;}return;}
    modal.setAttribute('aria-label',modal.querySelector('.bespoke-modal-title')?.textContent||'Bespoke service');
  };
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('.bespoke-copy .btn, .contact .btn, .hero-buttons .text-link');
    if(trigger)lastTrigger=trigger;
  },true);
  document.addEventListener('keydown',e=>{
    const modal=getModal();
    if(!modal||modal.hidden||e.key!=='Tab')return;
    const items=getFocusable(modal);if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  new MutationObserver(apply).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  document.addEventListener('bandura:languagechange',apply);
  apply();
})();
