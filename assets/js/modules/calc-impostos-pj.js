/**
 * Módulo da Calculadora de Impostos PJ (Simples Nacional)
 *
 * Responsável por:
 * 1. Carregar as faixas do Simples Nacional de um JSON.
 * 2. Encontrar a faixa de faturamento correta do usuário.
 * 3. Calcular a alíquota efetiva e o valor do DAS em tempo real.
 * 4. Apresentar os resultados de forma clara e profissional.
 */
async function initImpostosPjCalculator() {
  const form = document.querySelector('[data-calc="impostos-pj"]');
  if (!form) return;

  // --- 1. Carregamento de Dados e Seleção de Elementos ---
  const resultEl = form.querySelector('[data-result]');
  const allInputs = form.querySelectorAll('select, input');

  resultEl.textContent = 'Carregando tabelas...';

  try {
    const response = await fetch('/data/simples-faixas.json');
    if (!response.ok) throw new Error('Falha ao carregar dados');
    const faixasSimples = await response.json();
    resultEl.textContent = 'Preencha todos os campos para calcular.';

    // --- 2. Função Principal de Cálculo e Renderização ---
    const updateImpostos = () => {
      // Coleta os valores do formulário
      const anexo = form.anexo.value;
      const rbt12 = parseFloat(form.rbt12.value) || 0;
      const faturamentoMensal = parseFloat(form.faturamento.value) || 0;

      // Se algum campo essencial não foi preenchido, exibe mensagem inicial
      if (!anexo || rbt12 <= 0 || faturamentoMensal <= 0) {
        resultEl.textContent = 'Preencha todos os campos para calcular.';
        return;
      }

      // **Correção Lógica:** Encontra a faixa correta baseada no RBT12
      const faixa = faixasSimples[anexo].find(f => rbt12 <= f.max);

      // Se não encontrar a faixa (faturamento muito alto) ou outros dados estiverem faltando
      if (!faixa) {
        resultEl.textContent = 'Faturamento anual (RBT12) excede o limite do Simples Nacional.';
        return;
      }

      // Calcula a alíquota efetiva e o DAS
      const aliquotaEfetiva = ((rbt12 * faixa.aliq) - faixa.pd) / rbt12;
      const impostoDas = faturamentoMensal * aliquotaEfetiva;

      // Formata os resultados para uma apresentação profissional
      const formattedAliquota = aliquotaEfetiva.toLocaleString('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      });
      const formattedDas = impostoDas.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      // Atualiza a interface com a mensagem completa
      resultEl.innerHTML = `Alíquota Efetiva: <strong>${formattedAliquota}</strong> | DAS Mensal: <strong>${formattedDas}</strong>`;
    };

    // --- 3. Adiciona os Eventos ---
    allInputs.forEach(input => input.addEventListener('input', updateImpostos));
    updateImpostos(); // Executa uma vez para mostrar a mensagem inicial

  } catch (error) {
    console.error("Erro na calculadora de impostos:", error);
    resultEl.textContent = 'Ocorreu um erro ao carregar a calculadora. Tente novamente.';
  }
}

// Inicia o módulo
initImpostosPjCalculator();