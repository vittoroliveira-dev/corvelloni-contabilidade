/**
 * Módulo da Calculadora CLT vs PJ
 *
 * Responsável por:
 * 1. Carregar as faixas do Simples Nacional.
 * 2. Calcular de forma detalhada e realista a renda líquida em ambos os regimes.
 * 3. Atualizar os resultados em tempo real.
 */
async function initCltPjCalculator() {
  const form = document.querySelector('[data-calc="clt-pj"]');
  if (!form) return;

  // --- 1. Carregamento de Dados e Seleção de Elementos ---
  const response = await fetch('/data/simples-faixas.json');
  const faixasSimples = await response.json();

  // Vamos buscar os tributos de CLT que já usamos na outra calculadora
  const tribResponse = await fetch('/data/br-tributos.json');
  const tribCLT = await tribResponse.json();

  const resultCLTEl = form.querySelector('[data-result-clt]');
  const resultPJEl = form.querySelector('[data-result-pj]');
  const inputs = form.querySelectorAll('input, select');

  // --- 2. Funções de Cálculo Modulares ---

  // Função para formatar valores em BRL
  const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Calcula o salário líquido mensal CLT, incluindo benefícios
  const calculateCLTNet = (salarioBruto) => {
    // Benefícios anuais diluídos mensalmente
    const feriasMensal = salarioBruto / 12;
    const tercoFeriasMensal = feriasMensal / 3;
    const decimoTerceiroMensal = salarioBruto / 12;

    const totalBrutoMensalizado = salarioBruto + tercoFeriasMensal; // 13º e Férias não têm INSS/IRRF sobre eles mesmos nesta conta simplificada

    let inss = 0;
    let baseCalculada = 0;
    for (const faixa of tribCLT.inss) {
      const baseNestaFaixa = Math.min(totalBrutoMensalizado, faixa.ceiling) - baseCalculada;
      if (baseNestaFaixa > 0) {
        inss += baseNestaFaixa * faixa.rate;
        baseCalculada = faixa.ceiling;
      } else {
        break;
      }
    }

    const baseCalculoIR = totalBrutoMensalizado - inss;
    let irrf = 0;
    for (const faixa of tribCLT.irrf.tabela) {
      if (baseCalculoIR > faixa.min) {
        irrf = baseCalculoIR * faixa.rate - faixa.deduction;
      }
    }

    // O valor que realmente "sobra" para a pessoa, incluindo benefícios
    const liquidoTotal = totalBrutoMensalizado - inss - irrf;
    return liquidoTotal;
  };

  // Calcula o valor líquido PJ após impostos e custos
  const calculatePJNet = (faturamentoMensal, anexo, rbt12, proLabore) => {
    if (!faturamentoMensal || !anexo || !rbt12 || !proLabore) return 0;

    // Encontra a faixa correta do Simples Nacional
    const faixa = faixasSimples[anexo].find(f => rbt12 <= f.max);
    if (!faixa) return 0; // Retorna 0 se o faturamento for muito alto

    // Calcula a alíquota efetiva
    const aliquotaEfetiva = ((rbt12 * faixa.aliq) - faixa.pd) / rbt12;
    const impostoSimples = faturamentoMensal * aliquotaEfetiva;

    // Calcula o INSS sobre o pró-labore (11%)
    const inssProLabore = proLabore * 0.11;

    // O líquido PJ é o faturamento menos o imposto e os custos do "salário" do dono
    const liquido = faturamentoMensal - impostoSimples - inssProLabore;
    return liquido;
  };

  // --- 3. Função Principal de Atualização ---

  const updateComparison = () => {
    // Coleta de valores do formulário
    const salarioCLT = parseFloat(form.salario.value) || 0;
    const faturamentoPJ = parseFloat(form.faturamento.value) || 0;
    const anexoPJ = form.anexo.value;
    const rbt12PJ = parseFloat(form.rbt12.value) || 0;
    // Assume-se um pró-labore de 28% do faturamento, um valor comum. 
    // Para uma calculadora mais avançada, este poderia ser um campo.
    const proLaborePJ = faturamentoPJ * 0.28;

    // Calcula os líquidos de cada modalidade
    const liquidoCLT = calculateCLTNet(salarioCLT);
    const liquidoPJ = calculatePJNet(faturamentoPJ, anexoPJ, rbt12PJ, proLaborePJ);

    // Atualiza a interface
    resultCLTEl.textContent = formatCurrency(liquidoCLT);
    resultPJEl.textContent = formatCurrency(liquidoPJ);
  };

  // --- 4. Adiciona os Eventos ---
  updateComparison(); // Cálculo inicial
  inputs.forEach(input => input.addEventListener('input', updateComparison));
}

// Inicia o módulo
initCltPjCalculator();