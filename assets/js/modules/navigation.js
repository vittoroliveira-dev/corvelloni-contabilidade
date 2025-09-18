// navigation.js
(() => {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navMenu = document.getElementById('menu-principal');
    const mql = window.matchMedia('(min-width:768px)');

    if (!navMenu) return;

    // estado inicial por breakpoint
    const syncToViewport = () => {
        if (mql.matches) {               // DESKTOP
            navMenu.classList.remove('is-open');
            navMenu.hidden = false;        // sempre visível
            document.body.style.removeProperty('overflow');
            // fecha submenus mobile e remove hidden para desktop hover
            document.querySelectorAll('.c-nav__item--has-dropdown.is-open')
                .forEach(i => {
                    i.classList.remove('is-open');
                    const submenu = i.querySelector('.c-nav__submenu');
                    if (submenu) submenu.removeAttribute('hidden'); // REMOVE hidden para desktop
                });
            document.querySelectorAll('.c-nav__item--has-dropdown > .c-nav__link[aria-expanded]')
                .forEach(a => a.setAttribute('aria-expanded', 'false'));
        } else {                          // MOBILE
            navMenu.hidden = !navMenu.classList.contains('is-open');
            // garante que submenus ficam hidden no mobile quando fechados
            document.querySelectorAll('.c-nav__item--has-dropdown:not(.is-open) .c-nav__submenu')
                .forEach(submenu => submenu.setAttribute('hidden', ''));
        }
    };

    // toggle mobile
    const openMobile = () => {
        navMenu.classList.add('is-open');
        navMenu.hidden = false;
        if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };
    const closeMobile = () => {
        navMenu.classList.remove('is-open');
        navMenu.hidden = true;
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.removeProperty('overflow');
        // fecha submenus
        document.querySelectorAll('.c-nav__item--has-dropdown.is-open')
            .forEach(i => {
                i.classList.remove('is-open');
                const submenu = i.querySelector('.c-nav__submenu');
                if (submenu) submenu.setAttribute('hidden', '');
            });
        document.querySelectorAll('.c-nav__item--has-dropdown > .c-nav__link[aria-expanded]')
            .forEach(a => a.setAttribute('aria-expanded', 'false'));
    };

    // botão hamburguer (só afeta mobile)
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (mql.matches) return; // ignora no desktop
            navMenu.classList.contains('is-open') ? closeMobile() : openMobile();
        });
    }

    // fechar ao clicar fora (mobile)
    document.addEventListener('click', (e) => {
        if (mql.matches) return;
        if (!navMenu.classList.contains('is-open')) return;
        const inside = e.target.closest('.c-nav') || e.target.closest('[data-nav-toggle]');
        if (!inside) closeMobile();
    });

    // fechar ao clicar em qualquer link (mobile)
    navMenu.addEventListener('click', (e) => {
        if (!mql.matches && e.target.closest('a')) closeMobile();
    });

    // ESC fecha (mobile)
    document.addEventListener('keydown', (e) => {
        if (!mql.matches && e.key === 'Escape') closeMobile();
    });

    // submenus por clique (mobile). No desktop fica por :hover via CSS.
    const dropdownLinks = document.querySelectorAll('.c-nav__item--has-dropdown > .c-nav__link');

    dropdownLinks.forEach(link => {
        link.setAttribute('aria-expanded', 'false');

        // Ensure submenu starts hidden on mobile
        const li = link.closest('.c-nav__item--has-dropdown');
        const submenu = li?.querySelector('.c-nav__submenu');
        if (submenu && !mql.matches) {
            submenu.setAttribute('hidden', '');
        }

        link.addEventListener('click', (e) => {
            if (mql.matches) return;      // desktop: CSS cuida
            e.preventDefault();
            const li = link.closest('.c-nav__item--has-dropdown');
            const open = !li.classList.contains('is-open');

            // fecha outros
            document.querySelectorAll('.c-nav__item--has-dropdown.is-open').forEach(i => {
                if (i !== li) {
                    i.classList.remove('is-open');
                    const otherSubmenu = i.querySelector('.c-nav__submenu');
                    if (otherSubmenu) otherSubmenu.setAttribute('hidden', '');
                }
            });

            li.classList.toggle('is-open', open);
            link.setAttribute('aria-expanded', String(open));

            // Handle submenu visibility via hidden attribute
            const submenu = li.querySelector('.c-nav__submenu');
            if (submenu) {
                if (open) {
                    submenu.removeAttribute('hidden');
                } else {
                    submenu.setAttribute('hidden', '');
                }
            }
        });
    });

    mql.addEventListener('change', syncToViewport);
    syncToViewport(); // estado inicial
})();
