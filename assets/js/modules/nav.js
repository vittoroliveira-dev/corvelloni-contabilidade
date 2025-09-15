/**
 * Módulo de Navegação
 *
 * Responsável pela interatividade do header, incluindo:
 * 1. Toggle do menu mobile.
 * 2. Funcionalidade dos dropdowns.
 * 3. Lógica de "clicar fora" para fechar os menus.
 */
function initNavigation() {
  const nav = document.querySelector('.c-nav');
  if (!nav) return; // Se não houver navegação na página, não faz nada.

  const toggleButton = nav.querySelector('.c-nav__toggle');
  const menu = nav.querySelector('.c-nav__menu');
  const dropdowns = nav.querySelectorAll('.c-dropdown');

  // --- 1. Lógica do Menu Mobile ---
  if (toggleButton && menu) {
    toggleButton.addEventListener('click', () => {
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

      // Adiciona/remove uma classe no container da navegação
      nav.classList.toggle('is-mobile-menu-open');

      // Atualiza o atributo ARIA para acessibilidade
      toggleButton.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- 2. Lógica dos Dropdowns ---
  dropdowns.forEach(dropdown => {
    const dropdownButton = dropdown.querySelector('button.c-nav__link');
    const dropdownMenu = dropdown.querySelector('.c-dropdown__menu');

    if (!dropdownButton || !dropdownMenu) return;

    dropdownButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Impede que o clique se propague para o document
      const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros dropdowns antes de abrir o novo
      closeAllDropdowns(dropdown);

      // Abre/fecha o dropdown atual
      dropdownButton.setAttribute('aria-expanded', !isExpanded);
      dropdownMenu.hidden = isExpanded;
    });
  });

  // --- 3. Lógica de "Clicar Fora" e "ESC" para Fechar ---

  // Função para fechar todos os dropdowns
  const closeAllDropdowns = (currentDropdown = null) => {
    dropdowns.forEach(dropdown => {
      // Não fecha o dropdown que acabamos de clicar para abrir
      if (dropdown === currentDropdown) return;

      const button = dropdown.querySelector('button.c-nav__link');
      const menu = dropdown.querySelector('.c-dropdown__menu');

      if (button && menu) {
        button.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  };

  // Fecha os dropdowns se o usuário clicar em qualquer outro lugar da página
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  // Fecha os dropdowns se o usuário pressionar a tecla "Escape"
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

// Inicia o módulo de navegação
initNavigation();