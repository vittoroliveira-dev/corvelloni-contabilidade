const nav = document.querySelector('.c-nav');
const toggle = nav?.querySelector('.c-nav__toggle');
const menu = nav?.querySelector('.c-nav__menu');
if (nav && toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('.c-dropdown').forEach(dd => {
  const btn = dd.querySelector('.c-nav__link');
  const menu = dd.querySelector('.c-dropdown__menu');
  const links = menu?.querySelectorAll('a');
  if (btn && menu && links.length) {
    const close = () => {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };
    btn.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open);
      if (open) links[0].focus();
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        menu.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        links[0].focus();
      }
    });
    menu.addEventListener('keydown', e => {
      const index = [...links].indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[(index + 1) % links.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[(index - 1 + links.length) % links.length].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
        btn.focus();
      }
    });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
});
