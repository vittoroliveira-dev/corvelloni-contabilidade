// Navegação compatível com o HTML atual
(() => {
  const nav = document.querySelector('.c-nav');
  if (!nav) return;

  // --- Mobile toggle (opcional: só funciona se existir .c-nav__toggle)
  const toggle = nav.querySelector('.c-nav__toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-mobile-menu-open', !open);
    });
  }

  // --- Dropdowns (botão .c-nav__link com aria-controls -> menu .c-dropdown com mesmo id)
  const triggers = nav.querySelectorAll('.c-nav__item--has-dropdown > .c-nav__link[aria-controls]');
  const menus = [];

  const closeAll = (except = null) => {
    triggers.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    menus.forEach(m => { if (m !== except) m.hidden = true; });
  };

  triggers.forEach(btn => {
    const id = btn.getAttribute('aria-controls');
    const menu = document.getElementById(id);
    if (!menu) return;
    menus.push(menu);
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = btn.getAttribute('aria-expanded') === 'true';
      closeAll(menu);
      btn.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
  });

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
})();
