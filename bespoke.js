/* Bespoke enquiry flow: lets visitors prepare a photo + description for sharing without a paid backend. */
(function(){
  const copy={
    en:{title:'Tell us about your bandura',photo:'Reference photo',choose:'Choose a photo',desc:'Description',placeholder:'Tell us about the wood, shape, colours, ornament, electronics or anything else you imagine.',send:'Send enquiry',cancel:'Cancel',note:'On supported devices, your photo and description can be shared together. Otherwise your email app will open and you can attach the photo.',name:'Your name',email:'Your email'},
    uk:{title:'Розкажіть про свою бандуру',photo:'Фото-референс',choose:'Обрати фото',desc:'Опис',placeholder:'Розкажіть про деревину, форму, кольори, орнамент, електроніку чи інші побажання.',send:'Надіслати запит',cancel:'Скасувати',note:'На сумісних пристроях фото й опис можна надіслати разом. В іншому разі відкриється пошта, де ви зможете додати фото.',name:'Ваше ім’я',email:'Ваш email'},
    es:{title:'Cuéntanos cómo imaginas tu bandura',photo:'Foto de referencia',choose:'Elegir foto',desc:'Descripción',placeholder:'Cuéntanos la madera, forma, colores, ornamento, electrónica o cualquier otro detalle que imagines.',send:'Enviar consulta',cancel:'Cancelar',note:'En dispositivos compatibles puedes compartir la foto y la descripción juntas. Si no, se abrirá tu correo para que adjuntes la foto.',name:'Tu nombre',email:'Tu email'},
    it:{title:'Raccontaci la tua bandura',photo:'Foto di riferimento',choose:'Scegli una foto',desc:'Descrizione',placeholder:'Raccontaci legno, forma, colori, ornamenti, elettronica o qualsiasi altro dettaglio immagini.',send:'Invia richiesta',cancel:'Annulla',note:'Sui dispositivi compatibili puoi condividere insieme foto e descrizione. Altrimenti si aprirà la tua email per allegare la foto.',name:'Il tuo nome',email:'La tua email'},
    fr:{title:'Parlez-nous de votre bandoura',photo:'Photo de référence',choose:'Choisir une photo',desc:'Description',placeholder:'Décrivez le bois, la forme, les couleurs, les ornements, l’électronique ou tout autre détail imaginé.',send:'Envoyer la demande',cancel:'Annuler',note:'Sur les appareils compatibles, vous pouvez partager la photo et la description ensemble. Sinon, votre messagerie s’ouvrira pour ajouter la photo.',name:'Votre nom',email:'Votre email'},
    de:{title:'Erzählen Sie uns von Ihrer Bandura',photo:'Referenzfoto',choose:'Foto auswählen',desc:'Beschreibung',placeholder:'Beschreiben Sie Holz, Form, Farben, Ornamentik, Elektronik oder andere Details Ihrer Vorstellung.',send:'Anfrage senden',cancel:'Abbrechen',note:'Auf unterstützten Geräten können Foto und Beschreibung gemeinsam geteilt werden. Andernfalls öffnet sich Ihr E-Mail-Programm zum Anhängen des Fotos.',name:'Ihr Name',email:'Ihre E-Mail'},
    zh:{title:'告诉我们你想要的班杜拉',photo:'参考照片',choose:'选择照片',desc:'描述',placeholder:'告诉我们你想要的木材、形状、颜色、纹样、电子系统或其他细节。',send:'发送咨询',cancel:'取消',note:'在支持的设备上，可以同时分享照片和描述。否则会打开邮件应用，请手动添加照片。',name:'姓名',email:'邮箱'},
    ja:{title:'あなたのバンドゥーラについて',photo:'参考写真',choose:'写真を選ぶ',desc:'説明',placeholder:'木材、形、色、装飾、電子機器など、思い描いていることをお聞かせください。',send:'問い合わせを送る',cancel:'キャンセル',note:'対応デバイスでは写真と説明を一緒に共有できます。それ以外ではメールを開き、写真を添付してください。',name:'お名前',email:'メール'},
    he:{title:'ספרו לנו על הבנדורה שלכם',photo:'תמונת השראה',choose:'בחירת תמונה',desc:'תיאור',placeholder:'ספרו לנו על העץ, הצורה, הצבעים, העיטור, האלקטרוניקה או כל פרט אחר שאתם מדמיינים.',send:'שליחת בקשה',cancel:'ביטול',note:'במכשירים נתמכים אפשר לשתף את התמונה והתיאור יחד. אחרת תיפתח אפליקציית הדוא״ל כדי לצרף את התמונה.',name:'השם שלכם',email:'הדוא״ל שלכם'}
  };
  let modal;
  function t(){return copy[document.documentElement.lang]||copy.en}
  function build(){
    if(modal)return;
    modal=document.createElement('div');modal.className='bespoke-modal';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
    modal.innerHTML='<div class="bespoke-dialog"><button class="bespoke-close" type="button" aria-label="Close">×</button><span class="section-no bespoke-modal-label"></span><h2 class="bespoke-modal-title"></h2><label class="bespoke-field"><span class="bespoke-photo-label"></span><input id="bespokePhoto" type="file" accept="image/*"><small class="bespoke-file-name"></small></label><label class="bespoke-field"><span class="bespoke-name-label"></span><input id="bespokeName" type="text" autocomplete="name"></label><label class="bespoke-field"><span class="bespoke-email-label"></span><input id="bespokeEmail" type="email" autocomplete="email"></label><label class="bespoke-field"><span class="bespoke-desc-label"></span><textarea id="bespokeDescription" rows="6"></textarea></label><p class="bespoke-note"></p><div class="bespoke-actions"><button class="btn bespoke-cancel" type="button"></button><button class="btn primary bespoke-send" type="button"></button></div></div>';
    document.body.appendChild(modal);
    const file=modal.querySelector('#bespokePhoto');
    file.addEventListener('change',()=>{modal.querySelector('.bespoke-file-name').textContent=file.files[0]?.name||''});
    modal.querySelector('.bespoke-close').onclick=close;modal.querySelector('.bespoke-cancel').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});
    modal.querySelector('.bespoke-send').onclick=send;
  }
  function paint(){const x=t();modal.querySelector('.bespoke-modal-label').textContent='BESPOKE SERVICE';modal.querySelector('.bespoke-modal-title').textContent=x.title;modal.querySelector('.bespoke-photo-label').textContent=x.photo;modal.querySelector('.bespokePhoto').nextElementSibling.textContent='';modal.querySelector('.bespoke-name-label').textContent=x.name;modal.querySelector('.bespoke-email-label').textContent=x.email;modal.querySelector('.bespoke-desc-label').textContent=x.desc;modal.querySelector('#bespokeDescription').placeholder=x.placeholder;modal.querySelector('.bespoke-note').textContent=x.note;modal.querySelector('.bespoke-cancel').textContent=x.cancel;modal.querySelector('.bespoke-send').textContent=x.send}
  function open(e){if(e)e.preventDefault();build();paint();modal.hidden=false;document.body.classList.add('modal-open');setTimeout(()=>modal.querySelector('#bespokeDescription').focus(),20)}
  function close(){if(!modal)return;modal.hidden=true;document.body.classList.remove('modal-open')}
  async function send(){
    const x=t(),file=modal.querySelector('#bespokePhoto').files[0],name=modal.querySelector('#bespokeName').value.trim(),email=modal.querySelector('#bespokeEmail').value.trim(),desc=modal.querySelector('#bespokeDescription').value.trim();
    if(!desc&&!file){modal.querySelector('#bespokeDescription').focus();return}
    const subject=encodeURIComponent('Bespoke Bandura Design');const body=encodeURIComponent(`${name?name+'\n':''}${email?'Email: '+email+'\n':''}\n${desc||'Reference photo attached.'}\n\nReference photo: ${file?file.name:'None'}`);
    if(file&&navigator.canShare){try{if(navigator.canShare({files:[file]})){await navigator.share({title:'Bandura Atelier — Bespoke Design',text:desc||'Bespoke bandura design enquiry',files:[file]});close();return}}catch(err){if(err&&err.name==='AbortError')return}}
    window.location.href=`mailto:atelier@bandura-atelier.com?subject=${subject}&body=${body}`;
    close();
  }
  build();
  document.addEventListener('click',e=>{const target=e.target.closest('.bespoke-copy .btn, .contact .btn, .hero-buttons .text-link');if(target)open(e)});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden)close()});
  window.addEventListener('bandura-language-change',paint);
})();
