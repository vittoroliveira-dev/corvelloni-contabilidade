/**
 * Módulo de Busca da Central de Ajuda
 *
 * Responsável por:
 * 1. Carregar os dados de busca de um arquivo JSON.
 * 2. Filtrar os resultados em tempo real conforme o usuário digita.
 * 3. Melhoria: Aplicar "debounce" para otimizar a performance.
 * 4. Melhoria: Exibir uma mensagem quando nenhum resultado for encontrado.
 * 5. Melhoria: Destacar o termo buscado nos resultados.
 */
function initHelpSearch() {
  const input = document.querySelector('[data-search]');
  const resultsContainer = document.querySelector('[data-results]');

  if (!input || !resultsContainer) return;

  let data = [];
  let debounceTimer;

  // Carrega os dados do JSON uma única vez
  fetch('/duvidas/index.json')
    .then(response => response.json())
    .then(json => data = json);

  // Função que renderiza os resultados
  const renderResults = (query) => {
    resultsContainer.innerHTML = ''; // Limpa os resultados anteriores

    if (!query) return; // Se a busca estiver vazia, não mostra nada

    // Filtra os dados
    const filteredData = data.filter(item =>
      item.title.toLowerCase().includes(query) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
    );

    // Melhoria 2: Exibe uma mensagem se não houver resultados
    if (filteredData.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nenhum resultado encontrado.';
      li.classList.add('c-help-search__no-results');
      resultsContainer.append(li);
      return;
    }

    // Renderiza os resultados encontrados
    filteredData.forEach(item => {
      const li = document.createElement('li');
      // Melhoria 3: Destaca o termo buscado no título
      const highlightedTitle = item.title.replace(
        new RegExp(query, 'gi'),
        (match) => `<mark>${match}</mark>`
      );
      li.innerHTML = `<a href="${item.url}">${highlightedTitle}</a>`;
      resultsContainer.append(li);
    });
  };

  // Evento de input com Debounce
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.toLowerCase().trim();

    // Melhoria 1: Debounce - espera 300ms após o usuário parar de digitar
    debounceTimer = setTimeout(() => {
      renderResults(query);
    }, 300);
  });
}

// Inicia o módulo
initHelpSearch();