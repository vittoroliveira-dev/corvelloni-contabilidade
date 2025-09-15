// Navegação compatível com o HTML atual
(() => {
  const nav = document.querySelector('.c-nav');
  if (!nav) return;

  // --- Mobile toggle (opcional: só funciona se existir .c-nav__toggle)
  const toggle = nav.querySelector('.c-nav__toggle');
  const menu = nav.querySelector('.c-nav__list');
  const mq = window.matchMedia('(min-width: 60em)');

  const setMenuState = open => {
    if (!toggle || !menu) return;
    nav.classList.toggle('is-mobile-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('data-state', open ? 'open' : 'closed');
    menu.setAttribute('aria-hidden', String(!open));
  };

  if (toggle && menu) {
    setMenuState(false);

    if (mq.matches) {
      menu.removeAttribute('aria-hidden');
      menu.removeAttribute('data-state');
    }

    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-mobile-menu-open');
      setMenuState(!isOpen);
    });

    menu.addEventListener('click', event => {
      const link = event.target.closest('.c-nav__link');
      if (!link) return;
      if (link.closest('.c-nav__item--has-dropdown')) return;
      setMenuState(false);
    });

    mq.addEventListener('change', e => {
      if (e.matches) {
        setMenuState(false);
        menu.removeAttribute('aria-hidden');
        menu.removeAttribute('data-state');
      } else {
        menu.setAttribute('data-state', 'closed');
        menu.setAttribute('aria-hidden', 'true');
      }
    });

    nav.addEventListener('keyup', event => {
      if (event.key === 'Escape') {
        setMenuState(false);
        toggle.focus();
      }
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
