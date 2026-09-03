/* Accessible mobile navigation plus a keyboard skip link for the primary content. */
(() => {
  const header = document.querySelector('.topbar');
  const button = document.getElementById('menuBtn');
  const desktopNav = header?.querySelector('nav');
  const main = document.querySelector('main#top');
  if (!header || !button || !desktopNav) return;

  const style = document.createElement('style');
  style.textContent = `.skip-link{position:fixed;top:8px;left:8px;z-index:100;padding:10px 14px;background:#151512;color:#f5f1e9;border:2px solid #b58a4a;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transform:translateY(-150%);transition:transform .18s ease}.skip-link:focus{transform:translateY(0);outline:none}.mobile-nav{display:none}.mobile-nav.open{display:grid}.mobile-nav a{padding:15px 6vw;border-bottom:1px solid #d0c7b8;font-size:10px;text-transform:uppercase;letter-spacing:.16em;background:#f5f1e9;text-decoration:none;color:#151512}.mobile-nav a:focus-visible{outline:2px solid #b58a4a;outline-offset:-3px}.mobile-nav{position:fixed;top:80px;left:0;right:0;z-index:19;background:#f5f1e9ee;box-shadow:0 18px 35px #0002;backdrop-filter:blur(18px)}.mobile-nav-backdrop{display:none}@media(min-width:901px){.mobile-nav{display:none!important}}@media(prefers-reduced-motion:reduce){.skip-link{transition:none}.mobile-nav{backdrop-filter:none}}`;
  document.head.appendChild(style);

  if (main) {
    main.tabIndex = -1;
    if (!document.querySelector('.skip-link')) {
      const skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#top';
      skip.textContent = 'Skip to main content';
      skip.addEventListener('click', () => requestAnimationFrame(() => main.focus({preventScroll:true})));
      document.body.insertBefore(skip, document.body.firstChild);
    }
  }

  const mobile = document.createElement('nav');
  mobile.className = 'mobile-nav';
  mobile.id = 'mobileNav';
  mobile.setAttribute('aria-label', 'Mobile navigation');
  header.insertAdjacentElement('afterend', mobile);
  button.type = 'button';
  button.setAttribute('aria-controls', 'mobileNav');
  button.setAttribute('aria-expanded', 'false');

  function render() {
    mobile.innerHTML = '';
    desktopNav.querySelectorAll('a').forEach(link => {
      const clone = link.cloneNode(true);
      clone.addEventListener('click', close);
      mobile.appendChild(clone);
    });
  }
  function open() {
    render();
    mobile.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Close menu');
  }
  function close() {
    mobile.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open menu');
  }
  button.addEventListener('click', () => mobile.classList.contains('open') ? close() : open());
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && mobile.classList.contains('open')) { close(); button.focus(); } });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
  window.addEventListener('bandura-language-change', () => { if (mobile.classList.contains('open')) render(); });
  render();
})();
