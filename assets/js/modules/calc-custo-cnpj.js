/**
 * Módulo da Calculadora de Custo para Abertura de CNPJ
 *
 * Responsável por:
 * 1. Carregar os dados de custos e prazos de um JSON.
 * 2. Atualizar o resultado instantaneamente quando o usuário muda as seleções.
 * 3. Lidar com casos onde a combinação selecionada não tem dados.
 */
async function initCustoCnpjCalculator() {
  const form = document.querySelector('[data-calc="custo-cnpj"]');
  if (!form) return;

  // --- 1. Carregamento de Dados e Seleção de Elementos ---

  const resultEl = form.querySelector('[data-result]');
  const selects = form.querySelectorAll('select');

  // Exibe uma mensagem de "carregando" enquanto busca os dados
  resultEl.textContent = 'Carregando dados...';

  try {
    const response = await fetch('/data/custos-abertura.json');
    if (!response.ok) throw new Error('Falha ao carregar dados');
    const data = await response.json();

    // Limpa a mensagem de "carregando" após sucesso
    resultEl.textContent = 'Selecione as opções para ver o custo.';

    // --- 2. Função Principal de Cálculo e Renderização ---

    const updateCusto = () => {
      // Coleta os valores dos selects
      const uf = form.uf.value;
      const natureza = form.natureza.value;

      // Se alguma opção ainda não foi selecionada, não faz nada
      if (!uf || !natureza) {
        resultEl.textContent = 'Por favor, selecione todas as opções.';
        return;
      }

      // Procura a combinação correspondente nos dados carregados
      const item = data.find(i => i.uf === uf && i.natureza === natureza);

      // Atualiza a interface com o resultado
      if (item) {
        const total = (item.taxas + item.servicos).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
        resultEl.textContent = `Custo estimado: ${total} | Prazo médio: ${item.prazo} dias úteis`;
      } else {
        // Melhoria: Feedback claro se a combinação não for encontrada
        resultEl.textContent = 'Não há dados para a combinação selecionada. Consulte-nos para um orçamento personalizado.';
      }
    };

    // --- 3. Adiciona os Eventos ---

    // Adiciona um evento de 'change' a todos os <select> do formulário
    selects.forEach(select => select.addEventListener('change', updateCusto));

  } catch (error) {
    console.error("Erro ao carregar calculadora de custo:", error);
    // Exibe uma mensagem de erro amigável na interface
    resultEl.textContent = 'Ocorreu um erro ao carregar a calculadora. Tente novamente mais tarde.';
  }
}

// Inicia o módulo
initCustoCnpjCalculator();