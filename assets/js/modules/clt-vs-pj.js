// ---------- CALCULADORA: CLT vs PJ (versão corrigida) ----------
export async function initCltPjCalculator() {
    const form = document.querySelector('[data-calc="clt-pj"]');
    if (!form) return;

    // Fallbacks locais
    const FGTS_RATE_ = typeof FGTS_RATE === "number" ? FGTS_RATE : 0.08;
    const INSS_PJ_RATE_ = typeof INSS_PJ_RATE === "number" ? INSS_PJ_RATE : 0.11;
    const SUG_PROLABORE_FATOR_R_ = typeof SUG_PROLABORE_FATOR_R === "number" ? SUG_PROLABORE_FATOR_R : 0.28;


    // Tabelas tributárias
    const TRIBUTOS_CLT = {
        inss: [
            { ceiling: 1320.00, rate: 0.075 },
            { ceiling: 2571.29, rate: 0.09 },
            { ceiling: 3856.94, rate: 0.12 },
            { ceiling: 7507.49, rate: 0.14 }
        ],
        irrf: {
            dependente: 189.59,
            tabela: [
                { min: 0, rate: 0.00, deduction: 0 },
                { min: 2259.21, rate: 0.075, deduction: 169.44 },
                { min: 2826.66, rate: 0.15, deduction: 381.44 },
                { min: 3751.06, rate: 0.225, deduction: 662.77 },
                { min: 4664.69, rate: 0.275, deduction: 896.00 }
            ]
        }
    };

    const SIMPLES_FAIXAS = {
        III: [
            { faixa: 1, max: 180000, aliq: 0.06, pd: 0 },
            { faixa: 2, max: 360000, aliq: 0.112, pd: 9360 },
            { faixa: 3, max: 720000, aliq: 0.135, pd: 17640 },
            { faixa: 4, max: 1800000, aliq: 0.16, pd: 35640 },
            { faixa: 5, max: 3600000, aliq: 0.21, pd: 125640 },
            { faixa: 6, max: 4800000, aliq: 0.33, pd: 648000 }
        ],
        V: [
            { faixa: 1, max: 180000, aliq: 0.155, pd: 0 },
            { faixa: 2, max: 360000, aliq: 0.18, pd: 4500 },
            { faixa: 3, max: 720000, aliq: 0.195, pd: 9900 },
            { faixa: 4, max: 1800000, aliq: 0.205, pd: 17100 },
            { faixa: 5, max: 3600000, aliq: 0.23, pd: 62100 },
            { faixa: 6, max: 4800000, aliq: 0.305, pd: 540000 }
        ],
        IV: [
            { faixa: 1, max: 180000, aliq: 0.045, pd: 0 },
            { faixa: 2, max: 360000, aliq: 0.09, pd: 8100 },
            { faixa: 3, max: 720000, aliq: 0.102, pd: 12420 },
            { faixa: 4, max: 1800000, aliq: 0.14, pd: 39780 },
            { faixa: 5, max: 3600000, aliq: 0.22, pd: 183780 },
            { faixa: 6, max: 4800000, aliq: 0.33, pd: 828000 }
        ]
    };

    const toNumber = (el) => {
        const value = el?.value ?? el ?? '';
        const s = String(value)
            .replace(/[^\d.,-]/g, '')   // remove R$, letras etc.
            .replace(/\./g, '')         // milhares
            .replace(',', '.');         // decimal
        const n = parseFloat(s);
        return Number.isFinite(n) ? n : 0;
    };

    const clampPos = (v) => (v > 0 && Number.isFinite(v) ? v : 0);

    const normalizeAnexo = (v) => {
        const s = String(v || '').toLowerCase().replace(/\s/g, '');
        if (/(^|_)iii$|anexo_?iii|[^a-z]3[^a-z]?/.test(s)) return 'III';
        if (/(^|_)v$|anexo_?v|[^a-z]5[^a-z]?/.test(s)) return 'V';
        if (/(^|_)iv$|anexo_?iv|[^a-z]4[^a-z]?/.test(s)) return 'IV';
        return '';
    };

    const resolveCppRate = (regime, anexoKey) => {
        const isAnexoIV = anexoKey === 'IV';
        if (regime === 'simples_iv' || regime === 'presumido' || regime === 'real' || isAnexoIV) return 0.20;
        return 0;
    };

    // Função para calcular INSS progressivo
    const calcINSSProgressivo = (base, tabelaINSS) => {
        let inss = 0;
        let baseAnterior = 0;

        for (const faixa of tabelaINSS) {
            const baseCalcular = Math.min(base, faixa.ceiling);
            if (baseCalcular > baseAnterior) {
                inss += (baseCalcular - baseAnterior) * faixa.rate;
            }
            baseAnterior = faixa.ceiling;
            if (base <= faixa.ceiling) break;
        }

        return inss;
    };

    // Função para calcular IRRF
    const calcIRRFBase = (base, tabelaIRRF, valorDependente, numDependentes) => {
        if (base <= 0) return 0;

        const baseComDependentes = Math.max(0, base - (valorDependente * numDependentes));

        const faixa = tabelaIRRF
            .slice()
            .reverse()
            .find(f => baseComDependentes >= f.min);

        if (!faixa || faixa.rate === 0) return 0;

        return Math.max(0, (baseComDependentes * faixa.rate) - faixa.deduction);
    };

    // Funções de formatação
    const fmtBRL = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    const fmtPct = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor || 0);
    };

    // Seleção consistente de elementos
    const getFieldValue = (fieldName) => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) {
            console.warn(`Field not found: ${fieldName}`);
            return '';
        }
        return field.value || '';
    };

    // Elementos de resultado
    const resultCLTEl = form.querySelector("[data-result-clt]");
    const resultPJEl = form.querySelector("[data-result-pj]");
    const resultCLTDetalheEl = form.querySelector("[data-detail-clt]");
    const resultPJDetalheEl = form.querySelector("[data-detail-pj]");
    const resultCLTPacoteEl = form.querySelector("[data-result-clt-pack]");

    if (!resultCLTEl || !resultPJEl) {
        console.error("Elementos de resultado não encontrados");
        return;
    }

    // Cálculos CLT
    const calcCLT = (salarioBruto) => {
        const decimoMensal = salarioBruto / 12;
        const feriasMensal = salarioBruto / 12;
        const tercoFeriasMensal = feriasMensal / 3;
        const totalBrutoMensalizado = salarioBruto + decimoMensal + tercoFeriasMensal;

        const inss = calcINSSProgressivo(totalBrutoMensalizado, TRIBUTOS_CLT.inss);
        const baseIR = Math.max(0, totalBrutoMensalizado - inss);
        const irrf = calcIRRFBase(baseIR, TRIBUTOS_CLT.irrf.tabela, TRIBUTOS_CLT.irrf.dependente, 0);

        const fgtsMensal = totalBrutoMensalizado * FGTS_RATE_;
        const liquido = Math.max(0, totalBrutoMensalizado - inss - irrf);

        return { liquido, inss, irrf, fgtsMensal };
    };

    // Cálculos PJ
    const calcPJ = (faturamentoMensal, anexoVal, rbt12, proLabore, regime) => {
        const fat = clampPos(faturamentoMensal);
        const rb = clampPos(rbt12);
        const pl = clampPos(proLabore);
        const anexoKey = normalizeAnexo(anexoVal);

        if (!fat || !rb || !pl || !anexoKey) {
            return { liquido: 0, das: 0, inssProLabore: 0, irpfProLabore: 0, cpp: 0, aliqEfet: 0, anexoKey };
        }

        const faixas = SIMPLES_FAIXAS[anexoKey];
        if (!faixas) {
            return { liquido: 0, das: 0, inssProLabore: 0, irpfProLabore: 0, cpp: 0, aliqEfet: 0, anexoKey };
        }

        const faixa = faixas.find(f => rb <= f.max) || faixas[faixas.length - 1];
        const aliqEfet = rb ? Math.max(0, ((rb * faixa.aliq) - faixa.pd) / rb) : 0;
        const das = fat * aliqEfet;

        const tetoINSS = TRIBUTOS_CLT.inss.at(-1)?.ceiling ?? pl;
        const inssProLabore = Math.min(pl, tetoINSS) * INSS_PJ_RATE_;

        const irpfProLabore = calcIRRFBase(
            Math.max(0, pl - inssProLabore),
            TRIBUTOS_CLT.irrf.tabela,
            TRIBUTOS_CLT.irrf.dependente,
            0
        );

        const cpp = pl * resolveCppRate(regime, anexoKey);
        const liquido = Math.max(0, fat - das - inssProLabore - irpfProLabore - cpp);

        return { liquido, das, inssProLabore, irpfProLabore, cpp, aliqEfet, anexoKey };
    };

    // Renderização
    const renderCLT = (salarioCLT) => {
        if (!salarioCLT) {
            resultCLTEl.textContent = "Informe o salário bruto.";
            if (resultCLTDetalheEl) resultCLTDetalheEl.textContent = "";
            if (resultCLTPacoteEl) resultCLTPacoteEl.textContent = "";
            return;
        }

        const { liquido, inss, irrf, fgtsMensal } = calcCLT(salarioCLT);
        resultCLTEl.textContent = fmtBRL(liquido);

        if (resultCLTDetalheEl) {
            resultCLTDetalheEl.textContent =
                `INSS: ${fmtBRL(inss)} | IRRF: ${fmtBRL(irrf)} | FGTS (depósito): ${fmtBRL(fgtsMensal)}`;
        }

        if (resultCLTPacoteEl) {
            resultCLTPacoteEl.textContent =
                `No bolso: ${fmtBRL(liquido)} | Pacote total: ${fmtBRL(liquido + fgtsMensal)}`;
        }
    };

    const renderPJ = (faturamento, anexo, rbt12, proLabore, regime) => {
        const r = calcPJ(faturamento, anexo, rbt12, proLabore, regime);

        if (!faturamento || !anexo || !rbt12) {
            resultPJEl.textContent = "Informe faturamento, RBT12 e anexo.";
            if (resultPJDetalheEl) resultPJDetalheEl.textContent = "";
            return;
        }

        if (!r.anexoKey || !SIMPLES_FAIXAS[r.anexoKey]) {
            resultPJEl.textContent = "Use Anexo III, IV ou V para cálculo.";
            if (resultPJDetalheEl) resultPJDetalheEl.textContent = "";
            return;
        }

        resultPJEl.textContent = fmtBRL(r.liquido);

        if (resultPJDetalheEl) {
            resultPJDetalheEl.textContent =
                `DAS: ${fmtBRL(r.das)} | INSS pró-labore: ${fmtBRL(r.inssProLabore)} | IRPF pró-labore: ${fmtBRL(r.irpfProLabore)} | CPP: ${fmtBRL(r.cpp)} | Alíquota efetiva: ${fmtPct(r.aliqEfet)}`;
        }
    };

    // Loop principal com seleção melhorada
    const update = () => {
        try {
            const salarioCLT = toNumber(getFieldValue('salario'));
            const faturamento = toNumber(getFieldValue('faturamento'));
            const anexo = getFieldValue('anexo');
            const rbt12 = toNumber(getFieldValue('rbt12'));
            const regime = getFieldValue('regime') || "simples_i_ii_iii_v";
            const proLaboreIn = toNumber(getFieldValue('prolabore'));
            const proLabore = proLaboreIn > 0 ? proLaboreIn : faturamento * SUG_PROLABORE_FATOR_R_;

            renderCLT(salarioCLT);
            renderPJ(faturamento, anexo, rbt12, proLabore, regime);
        } catch (error) {
            console.error("Erro no cálculo:", error);
        }
    };

    // Inicialização
    update();
    form.addEventListener("input", update);
    form.addEventListener("change", update);
}
export default initCltPjCalculator;
