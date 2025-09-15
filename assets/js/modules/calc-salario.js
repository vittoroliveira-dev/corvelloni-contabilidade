/**
 * Módulo da Calculadora de Salário Líquido
 *
 * Responsável por:
 * 1. Carregar os dados de tributos de forma assíncrona.
 * 2. Calcular o salário líquido em tempo real conforme o usuário altera os campos.
 * 3. Apresentar os resultados de forma clara e formatada.
 */
async function initSalarioCalculator() {
  const form = document.querySelector('[data-calc="salario"]');
  if (!form) return;

  // --- 1. Carregamento de Dados e Seleção de Elementos ---

  // Usando async/await para um carregamento de dados mais limpo
  const response = await fetch('/data/br-tributos.json');
  const trib = await response.json();

  const resultValueEl = form.querySelector('[data-result-value]');
  const inputs = form.querySelectorAll('input');

  // --- 2. Funções de Cálculo Modulares ---

  // Função dedicada para calcular o INSS
  const calculateINSS = (salarioBruto) => {
    let inss = 0;
    let baseCalculada = 0;
    for (const faixa of trib.inss) {
      const baseNestaFaixa = Math.min(salarioBruto, faixa.ceiling) - baseCalculada;
      if (baseNestaFaixa > 0) {
        inss += baseNestaFaixa * faixa.rate;
        baseCalculada = faixa.ceiling;
      } else {
        break; // Otimização: para de calcular se o salário já foi todo coberto
      }
    }
    return inss;
  };

  // Função dedicada para calcular o Imposto de Renda (IRRF)
  const calculateIRRF = (baseCalculoIR) => {
    for (const faixa of trib.irrf.tabela) {
      if (baseCalculoIR > faixa.min) {
        return baseCalculoIR * faixa.rate - faixa.deduction;
      }
    }
    return 0; // Retorna 0 se for isento
  };

  // --- 3. Função Principal de Cálculo e Renderização ---

  const updateSalario = () => {
    // Coleta e converte os valores dos inputs
    const bruto = parseFloat(form.bruto.value) || 0;
    const dependentes = parseFloat(form.dependentes.value) || 0;
    const outrosDescontos = parseFloat(form.outrosDescontos.value) || 0;

    // Realiza os cálculos usando as funções dedicadas
    const inss = calculateINSS(bruto);
    const baseCalculoIR = bruto - inss - (dependentes * trib.irrf.dependente);
    const irrf = calculateIRRF(baseCalculoIR);

    const liquido = bruto - inss - irrf - outrosDescontos;

    // Formata o resultado para o padrão monetário brasileiro (BRL)
    const formattedLiquido = liquido.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    // Atualiza o valor no HTML
    resultValueEl.textContent = formattedLiquido;
  };

  // --- 4. Adiciona os Eventos ---

  // Calcula pela primeira vez, caso os campos já venham preenchidos
  updateSalario();

  // Adiciona um evento de 'input' a todos os campos do formulário
  inputs.forEach(input => input.addEventListener('input', updateSalario));
}

// Inicia o módulo
initSalarioCalculator();