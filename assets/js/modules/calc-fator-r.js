/**
 * Módulo da Calculadora de Fator R
 *
 * Responsável por:
 * 1. Calcular o Fator R em tempo real.
 * 2. Indicar se a empresa se enquadra no Anexo III ou V do Simples Nacional.
 * 3. Apresentar o resultado de forma clara e com feedback visual.
 */
function initFatorRCalculator() {
  const form = document.querySelector('[data-calc="fator-r"]');
  if (!form) return;

  // --- 1. Seleção de Elementos ---
  const folhaInput = form.querySelector('[name="folha12"]');
  const receitaInput = form.querySelector('[name="receita12"]');
  const resultEl = form.querySelector('[data-result]');

  // --- 2. Função Principal de Cálculo e Renderização ---
  const updateFatorR = () => {
    const folhaSalarial = parseFloat(folhaInput.value) || 0;
    const receitaBruta = parseFloat(receitaInput.value) || 0;

    // Se os valores não forem válidos, limpa o resultado e sai da função
    if (folhaSalarial <= 0 || receitaBruta <= 0) {
      resultEl.textContent = 'Preencha os valores para calcular.';
      resultEl.classList.remove('is-anexo-iii', 'is-anexo-v');
      return;
    }

    const fatorR = folhaSalarial / receitaBruta;
    const anexo = fatorR >= 0.28 ? 'Anexo III' : 'Anexo V';

    // Formata a porcentagem para o padrão brasileiro
    const formattedFatorR = fatorR.toLocaleString('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2
    });

    // Atualiza o conteúdo do resultado com uma mensagem mais completa
    resultEl.textContent = `Fator R: ${formattedFatorR}. Sua empresa se enquadra no ${anexo}.`;

    // Melhoria: Adiciona classes para feedback visual (cor)
    if (anexo === 'Anexo III') {
      resultEl.classList.add('is-anexo-iii');
      resultEl.classList.remove('is-anexo-v');
    } else {
      resultEl.classList.add('is-anexo-v');
      resultEl.classList.remove('is-anexo-iii');
    }
  };

  // --- 3. Adiciona os Eventos ---
  updateFatorR(); // Cálculo inicial para exibir a mensagem de "preencha os campos"
  form.addEventListener('input', updateFatorR);
}

// Inicia o módulo
initFatorRCalculator();