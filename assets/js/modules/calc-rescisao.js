/**
 * Módulo da Calculadora de Rescisão de Contrato
 *
 * Responsável por:
 * 1. Calcular os principais componentes de uma rescisão sem justa causa.
 * 2. Apresentar um detalhamento claro de cada valor.
 * 3. Atualizar os resultados em tempo real.
 */
function initRescisaoCalculator() {
  const form = document.querySelector('[data-calc="rescisao"]');
  if (!form) return;

  // --- 1. Seleção de Elementos ---
  const allInputs = form.querySelectorAll('input, select');
  // Seleciona os elementos específicos para exibir cada parte do resultado
  const resultElements = {
    saldoSalario: form.querySelector('[data-result-saldo]'),
    decimoTerceiro: form.querySelector('[data-result-decimo]'),
    ferias: form.querySelector('[data-result-ferias]'),
    multaFgts: form.querySelector('[data-result-multa]'),
    total: form.querySelector('[data-result-total]'),
  };

  // --- 2. Funções de Cálculo e Formatação ---

  const formatCurrency = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const updateRescisao = () => {
    // Coleta dos valores do formulário
    const salarioBruto = parseFloat(form.salario.value) || 0;
    const diasTrabalhadosMes = parseFloat(form.dias.value) || 0;
    const mesesTrabalhadosAno = parseFloat(form.meses.value) || 0;
    const feriasVencidas = form.ferias.checked;
    const saldoFgts = parseFloat(form.fgts.value) || 0;

    // --- Cálculos Detalhados ---

    // 1. Saldo de Salário
    const saldoSalario = (salarioBruto / 30) * diasTrabalhadosMes;

    // 2. 13º Proporcional
    const decimoTerceiro = (salarioBruto / 12) * mesesTrabalhadosAno;

    // 3. Férias Proporcionais + Vencidas (se houver) + 1/3 Constitucional
    let feriasBase = (salarioBruto / 12) * mesesTrabalhadosAno;
    if (feriasVencidas) {
      feriasBase += salarioBruto;
    }
    const tercoFerias = feriasBase / 3;
    const totalFerias = feriasBase + tercoFerias;

    // 4. Multa de 40% do FGTS
    const multaFgts = saldoFgts * 0.4;

    // 5. Total Bruto da Rescisão
    const totalRescisao = saldoSalario + decimoTerceiro + totalFerias + multaFgts;

    // --- Atualização da Interface ---
    // Atualiza cada campo do resultado detalhado
    resultElements.saldoSalario.textContent = formatCurrency(saldoSalario);
    resultElements.decimoTerceiro.textContent = formatCurrency(decimoTerceiro);
    resultElements.ferias.textContent = formatCurrency(totalFerias);
    resultElements.multaFgts.textContent = formatCurrency(multaFgts);
    resultElements.total.textContent = formatCurrency(totalRescisao);
  };

  // --- 3. Adiciona os Eventos ---
  allInputs.forEach(input => input.addEventListener('input', updateRescisao));
  updateRescisao(); // Executa uma vez para inicializar os valores
}

// Inicia o módulo
initRescisaoCalculator();