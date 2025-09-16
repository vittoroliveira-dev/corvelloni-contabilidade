/**
 * Calculadora CLT vs PJ
 * - Carrega faixas do Simples e tributos CLT
 * - Compara líquidos CLT x PJ
 */
async function initCltPjCalculator() {
  const form = document.querySelector('[data-calc="clt-pj"]');
  if (!form) return;

  // JSONs devem estar em public/data no build
  const base = import.meta.env.BASE_URL;

  // --- 1) Dados ---
  let faixasSimples, tribCLT;
  try {
    const [r1, r2] = await Promise.all([
      fetch(`${base}data/simples-faixas.json`),
      fetch(`${base}data/br-tributos.json`)
    ]);
    faixasSimples = await r1.json();
    tribCLT = await r2.json();
  } catch (err) {
    console.error('Falha ao carregar dados das faixas/tributos', err);
    return;
  }

  const resultCLTEl = form.querySelector('[data-result-clt]');
  const resultPJEl  = form.querySelector('[data-result-pj]');
  if (!resultCLTEl || !resultPJEl) return;

  const inputs = form.querySelectorAll('input, select');

  // --- 2) Util ---
  const formatCurrency = v =>
    Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // --- 3) CLT ---
   const calculateCLTNet = (salarioBruto) => {
    const feriasMensal = salarioBruto / 12;
    const tercoFeriasMensal = feriasMensal / 3;
   // const _decimoTerceiroMensal = salarioBruto / 12; // não usado na conta simplificada

    const totalBrutoMensalizado = salarioBruto + tercoFeriasMensal;

    // INSS progressivo
    let inss = 0;
    let baseAcum = 0;
    for (const faixa of tribCLT.inss) {
      const baseNesta = Math.min(totalBrutoMensalizado, faixa.ceiling) - baseAcum;
      if (baseNesta > 0) {
        inss += baseNesta * faixa.rate;
        baseAcum = faixa.ceiling;
      } else break;
    }

    // IRRF por faixa
    const baseIR = totalBrutoMensalizado - inss;
    let irrf = 0;
    for (const faixa of tribCLT.irrf.tabela) {
      if (baseIR > faixa.min) {
        irrf = baseIR * faixa.rate - faixa.deduction;
      }
    }

    return totalBrutoMensalizado - inss - irrf;
  };

  // --- 4) PJ ---
  const calculatePJNet = (faturamentoMensal, anexo, rbt12, proLabore) => {
    if (!faturamentoMensal || !anexo || !rbt12 || !proLabore) return 0;

    const faixas = faixasSimples?.[anexo];
    if (!faixas) return 0;

    const faixa = faixas.find(f => rbt12 <= f.max);
    if (!faixa) return 0;

    const aliquotaEfetiva = ((rbt12 * faixa.aliq) - faixa.pd) / rbt12;
    const impostoSimples = faturamentoMensal * aliquotaEfetiva;

    const inssProLabore = proLabore * 0.11;

    return faturamentoMensal - impostoSimples - inssProLabore;
  };

  // --- 5) Atualização ---
  const updateComparison = () => {
    const salarioCLT   = parseFloat(form.salario?.value) || 0;
    const faturamento  = parseFloat(form.faturamento?.value) || 0;
    const anexo        = form.anexo?.value;
    const rbt12        = parseFloat(form.rbt12?.value) || 0;

    // heurística simples para pró-labore
    const proLabore = faturamento * 0.28;

    const liquidoCLT = calculateCLTNet(salarioCLT);
    const liquidoPJ  = calculatePJNet(faturamento, anexo, rbt12, proLabore);

    resultCLTEl.textContent = formatCurrency(liquidoCLT);
    resultPJEl.textContent  = formatCurrency(liquidoPJ);
  };

  updateComparison();
  inputs.forEach(el => el.addEventListener('input', updateComparison));
}

initCltPjCalculator();
