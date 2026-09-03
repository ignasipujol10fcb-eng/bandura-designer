/* Accessible mobile navigation: restores the hidden desktop links behind the existing menu button. */
(() => {
  const header = document.querySelector('.topbar');
  const button = document.getElementById('menuBtn');
  const desktopNav = header?.querySelector('nav');
  if (!header || !button || !desktopNav) return;

  const style = document.createElement('style');
  style.textContent = `.mobile-nav{display:none}.mobile-nav.open{display:grid}.mobile-nav a{padding:15px 6vw;border-bottom:1px solid #d0c7b8;font-size:10px;text-transform:uppercase;letter-spacing:.16em;background:#f5f1e9;text-decoration:none;color:#151512}.mobile-nav a:focus-visible{outline:2px solid #b58a4a;outline-offset:-3px}.mobile-nav{position:fixed;top:80px;left:0;right:0;z-index:19;background:#f5f1e9ee;box-shadow:0 18px 35px #0002;backdrop-filter:blur(18px)}.mobile-nav-backdrop{display:none}@media(min-width:901px){.mobile-nav{display:none!important}}@media(prefers-reduced-motion:reduce){.mobile-nav{backdrop-filter:none}}`;
  document.head.appendChild(style);

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
