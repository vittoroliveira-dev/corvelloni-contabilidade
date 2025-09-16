// assets/js/app-calculadoras.js
// ÚNICO SCRIPT (ESM) PARA TODAS AS CALCULADORAS

// ---------- CONSTANTES ----------
const FGTS_RATE = 0.08;                 // Depósito mensal de FGTS
const INSS_PJ_RATE = 0.11;              // INSS sobre pró-labore (lim. teto)
const SUG_PROLABORE_FATOR_R = 0.28;     // Sugestão de pró-labore (placeholder)
const MULTA_FGTS = {                    // Multa sobre saldo de FGTS por motivo
    semJusta: 0.40,
    acordo: 0.20,
    pedido: 0.00
};

// ---------- UTIL ----------
const BASE = new URL(document.baseURI || ".", location.href);
const _jsonCache = new Map();

async function loadJSON(path) {
    const url = new URL(path, BASE).href;
    if (_jsonCache.has(url)) return _jsonCache.get(url);
    const p = fetch(url).then(r => {
        if (!r.ok) throw new Error(`Falha ao carregar ${url}`);
        return r.json();
    });
    _jsonCache.set(url, p);
    return p;
}

const fmtBRL = v => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtPct = v => Number(v || 0).toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 2 });

function calcINSSProgressivo(base, tabelaINSS) {
    let inss = 0, acumulado = 0;
    for (const faixa of tabelaINSS) {
        const nesta = Math.min(base, faixa.ceiling) - acumulado;
        if (nesta > 0) { inss += nesta * faixa.rate; acumulado = faixa.ceiling; } else break;
    }
    return inss;
}

function calcIRRFBase(base, tabelaIR, dedDep = 0, dependentes = 0) {
    const b = Math.max(0, base - dependentes * dedDep);
    for (let i = tabelaIR.length - 1; i >= 0; i--) {
        const f = tabelaIR[i];
        if (b >= f.min) return Math.max(0, b * f.rate - f.deduction);
    }
    return 0;
}

function avisoPrevioDias(anos) {
    return Math.min(90, 30 + Math.floor(Math.max(0, anos)) * 3);
}

// ---------- CALCULADORA: CLT vs PJ ----------
async function initCltPjCalculator() {
    const form = document.querySelector('[data-calc="clt-pj"]');
    if (!form) return;

    let faixasSimples, tribCLT;
    try {
        [faixasSimples, tribCLT] = await Promise.all([
            loadJSON("data/simples-faixas.json"),
            loadJSON("data/br-tributos.json")
        ]);
    } catch (e) {
        console.error("CLT vs PJ: erro ao carregar dados", e);
        return;
    }

    const resultCLTEl = form.querySelector("[data-result-clt]");
    const resultPJEl = form.querySelector("[data-result-pj]");
    const resultCLTDetalheEl = form.querySelector("[data-detail-clt]");
    const resultPJDetalheEl = form.querySelector("[data-detail-pj]");
    const resultCLTPacoteEl = form.querySelector("[data-result-clt-pack]");
    if (!resultCLTEl || !resultPJEl) return;

    function resolveCppRate(regime, anexo) {
        const isAnexoIV = String(anexo || "").toLowerCase().includes("iv");
        if (regime === "simples_iv" || regime === "presumido" || regime === "real" || isAnexoIV) return 0.20;
        return 0;
    }

    const calcCLT = (salarioBruto) => {
        const decimoMensal = salarioBruto / 12;
        const feriasMensal = salarioBruto / 12;
        const tercoFeriasMensal = feriasMensal / 3;
        const totalBrutoMensalizado = salarioBruto + decimoMensal + tercoFeriasMensal;

        const inss = calcINSSProgressivo(totalBrutoMensalizado, tribCLT.inss);
        const baseIR = totalBrutoMensalizado - inss;
        const irrf = calcIRRFBase(baseIR, tribCLT.irrf.tabela, tribCLT.irrf.dependente, 0);

        // FGTS incide sobre salário + 13º + férias + 1/3
        const fgtsMensal = totalBrutoMensalizado * FGTS_RATE;

        return { liquido: totalBrutoMensalizado - inss - irrf, inss, irrf, fgtsMensal };
    };

    const calcPJ = (faturamentoMensal, anexo, rbt12, proLabore, regime) => {
        if (!faturamentoMensal || !anexo || !rbt12 || !proLabore) {
            return { liquido: 0, das: 0, inssProLabore: 0, irpfProLabore: 0, cpp: 0, aliqEfet: 0 };
        }
        const faixas = faixasSimples?.[anexo];
        if (!faixas) return { liquido: 0, das: 0, inssProLabore: 0, irpfProLabore: 0, cpp: 0, aliqEfet: 0 };

        const faixa = faixas.find(f => rbt12 <= f.max);
        if (!faixa) return { liquido: 0, das: 0, inssProLabore: 0, irpfProLabore: 0, cpp: 0, aliqEfet: 0 };

        const aliqEfet = ((rbt12 * faixa.aliq) - faixa.pd) / rbt12;
        const das = faturamentoMensal * aliqEfet;

        const tetoINSS = tribCLT.inss.at(-1).ceiling;
        const inssProLabore = Math.min(proLabore, tetoINSS) * INSS_PJ_RATE;

        const irpfProLabore = calcIRRFBase(
            Math.max(0, proLabore - inssProLabore),
            tribCLT.irrf.tabela,
            tribCLT.irrf.dependente,
            0
        );

        const cpp = proLabore * resolveCppRate(form.regime?.value || "simples_i_ii_iii_v", anexo);
        const liquido = faturamentoMensal - das - inssProLabore - irpfProLabore - cpp;

        return { liquido, das, inssProLabore, irpfProLabore, cpp, aliqEfet };
    };

    const update = () => {
        const salarioCLT = parseFloat(form.salario?.value) || 0;
        const faturamento = parseFloat(form.faturamento?.value) || 0;
        const anexo = form.anexo?.value;
        const rbt12 = parseFloat(form.rbt12?.value) || 0;
        const regime = form.regime?.value || "simples_i_ii_iii_v";
        const proLaboreIn = parseFloat(form.prolabore?.value);
        const proLabore = Number.isFinite(proLaboreIn) ? proLaboreIn : faturamento * SUG_PROLABORE_FATOR_R;

        if (!salarioCLT) {
            resultCLTEl.textContent = "Informe o salário bruto.";
        } else {
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
        }

        if (!faturamento || !anexo || !rbt12) {
            resultPJEl.textContent = "Informe faturamento, RBT12 e anexo.";
        } else {
            const { liquido, das, inssProLabore, irpfProLabore, cpp, aliqEfet } =
                calcPJ(faturamento, anexo, rbt12, proLabore, regime);

            resultPJEl.textContent = fmtBRL(liquido);
            if (resultPJDetalheEl) {
                resultPJDetalheEl.textContent =
                    `DAS: ${fmtBRL(das)} | INSS pró-labore: ${fmtBRL(inssProLabore)} | IRPF pró-labore: ${fmtBRL(irpfProLabore)} | CPP: ${fmtBRL(cpp)} | Alíquota efetiva: ${fmtPct(aliqEfet)}`;
            }
        }
    };

    update();
    form.addEventListener("input", update);
}

// ---------- CALCULADORA: Custo Abertura CNPJ ----------
async function initCustoCnpjCalculator() {
    const form = document.querySelector('[data-calc="custo-cnpj"]');
    if (!form) return;

    const resultEl = form.querySelector("[data-result]");
    const selects = form.querySelectorAll("select");
    if (!resultEl) return;

    resultEl.textContent = "Carregando dados...";
    let data = [];
    try {
        data = await loadJSON("data/custos-abertura.json");
        resultEl.textContent = "Selecione as opções para ver o custo.";
    } catch (e) {
        console.error("Custo CNPJ: erro ao carregar", e);
        resultEl.textContent = "Erro ao carregar. Tente novamente.";
        return;
    }

    const update = () => {
        const uf = form.uf?.value;
        const natureza = form.natureza?.value;
        if (!uf || !natureza) {
            resultEl.textContent = "Por favor, selecione todas as opções.";
            return;
        }
        const item = data.find(i => i.uf === uf && i.natureza === natureza);
        if (item) {
            const total = (item.taxas + item.servicos);
            resultEl.textContent = `Custo estimado: ${fmtBRL(total)} | Prazo médio: ${item.prazo} dias úteis`;
        } else {
            resultEl.textContent = "Sem dados para a combinação. Solicite orçamento.";
        }
    };

    selects.forEach(s => s.addEventListener("change", update));
}

// ---------- CALCULADORA: Fator R ----------
function initFatorRCalculator() {
    const form = document.querySelector('[data-calc="fator-r"]');
    if (!form) return;

    const folhaInput = form.querySelector('[name="folha12"]');
    const receitaInput = form.querySelector('[name="receita12"]');
    const resultEl = form.querySelector("[data-result]");
    if (!folhaInput || !receitaInput || !resultEl) return;

    const update = () => {
        const folha = parseFloat(folhaInput.value) || 0;
        const receita = parseFloat(receitaInput.value) || 0;
        if (folha <= 0 || receita <= 0) {
            resultEl.textContent = "Preencha os valores para calcular.";
            resultEl.classList.remove("is-anexo-iii", "is-anexo-v");
            return;
        }
        const fatorR = folha / receita;
        const anexo = fatorR >= 0.28 ? "Anexo III" : "Anexo V";
        resultEl.textContent = `Fator R: ${fmtPct(fatorR)}. Sua empresa se enquadra no ${anexo}.`;
        resultEl.classList.toggle("is-anexo-iii", anexo === "Anexo III");
        resultEl.classList.toggle("is-anexo-v", anexo === "Anexo V");
    };

    update();
    form.addEventListener("input", update);
}

// ---------- CALCULADORA: Impostos PJ (Simples) ----------
async function initImpostosPjCalculator() {
    const form = document.querySelector('[data-calc="impostos-pj"]');
    if (!form) return;

    const resultEl = form.querySelector("[data-result]");
    const allInputs = form.querySelectorAll("select, input");
    if (!resultEl) return;

    resultEl.textContent = "Carregando tabelas...";
    let faixasSimples;
    try {
        faixasSimples = await loadJSON("data/simples-faixas.json");
        resultEl.textContent = "Preencha todos os campos para calcular.";
    } catch (e) {
        console.error("Impostos PJ: erro ao carregar", e);
        resultEl.textContent = "Erro ao carregar. Tente novamente.";
        return;
    }

    const update = () => {
        const anexo = form.anexo?.value;
        const rbt12 = parseFloat(form.rbt12?.value) || 0;
        const faturamento = parseFloat(form.faturamento?.value) || 0;
        if (!anexo || rbt12 <= 0 || faturamento <= 0) {
            resultEl.textContent = "Preencha todos os campos para calcular.";
            return;
        }
        const faixa = faixasSimples[anexo]?.find(f => rbt12 <= f.max);
        if (!faixa) {
            resultEl.textContent = "RBT12 excede o limite do Simples Nacional.";
            return;
        }
        const aliqEfet = ((rbt12 * faixa.aliq) - faixa.pd) / rbt12;
        const das = faturamento * aliqEfet;
        resultEl.innerHTML = `Alíquota Efetiva: <strong>${fmtPct(aliqEfet)}</strong> | DAS Mensal: <strong>${fmtBRL(das)}</strong>`;
    };

    allInputs.forEach(i => i.addEventListener("input", update));
    update();
}

// ---------- CALCULADORA: Rescisão ----------
async function initRescisaoCalculator() {
    const form = document.querySelector('[data-calc="rescisao"]');
    if (!form) return;

    let trib;
    try {
        trib = await loadJSON("data/br-tributos.json"); // para INSS/IRRF
    } catch (e) {
        console.error("Rescisão: erro ao carregar tributos", e);
        return;
    }

    const els = {
        saldoSalario: form.querySelector("[data-result-saldo]"),
        decimoTerceiro: form.querySelector("[data-result-decimo]"),
        ferias: form.querySelector("[data-result-ferias]"),
        multaFgts: form.querySelector("[data-result-multa]"),
        aviso: form.querySelector("[data-result-aviso]"),
        descontos: form.querySelector("[data-result-descontos]"),
        total: form.querySelector("[data-result-total]")
    };
    if (!els.saldoSalario || !els.decimoTerceiro || !els.ferias || !els.multaFgts || !els.total) return;

    const update = () => {
        const salario = parseFloat(form.salario?.value) || 0;
        const dias = parseFloat(form.dias?.value) || 0;
        const meses = parseFloat(form.meses?.value) || 0;
        const feriasVencidas = !!form.ferias?.checked;
        const fgtsSaldo = parseFloat(form.fgts?.value) || 0;

        const motivo = form.motivo?.value || "semJusta";
        const tipoAviso = form.aviso?.value || "naoAplica";
        const anos = parseFloat(form.anos?.value) || 0;

        // Verbas
        const saldo = (salario / 30) * dias;
        const decimo = (salario / 12) * meses;

        let feriasBase = (salario / 12) * meses;
        if (feriasVencidas) feriasBase += salario;
        const terco = feriasBase / 3;
        const feriasTotal = feriasBase + terco;

        const diasAviso = avisoPrevioDias(anos);
        const avisoIndenizado = tipoAviso === "indenizado" ? (salario / 30) * diasAviso : 0;

        const multa = fgtsSaldo * (MULTA_FGTS[motivo] ?? 0);

        // Descontos conforme incidência legal
        // INSS: saldo + 13º
        const baseINSS = saldo + decimo;
        const inss = calcINSSProgressivo(baseINSS, trib.inss);

        // Decomposição do INSS p/ IR
        const inssSobreSaldo = calcINSSProgressivo(saldo, trib.inss);
        const inssSobreDecimo = Math.max(0, inss - inssSobreSaldo);

        // IRRF principal: saldo (deduz INSS do saldo) + férias (com 1/3)
        const baseIRRF_outros = Math.max(0, saldo - inssSobreSaldo);
        const baseIRRF_ferias = feriasTotal;
        const irrf_principal = calcIRRFBase(
            baseIRRF_outros + baseIRRF_ferias,
            trib.irrf.tabela,
            trib.irrf.dependente,
            0
        );

        // IRRF do 13º: cálculo exclusivo
        const baseIRRF_decimo = Math.max(0, decimo - inssSobreDecimo);
        const irrf_decimo = calcIRRFBase(
            baseIRRF_decimo,
            trib.irrf.tabela,
            trib.irrf.dependente,
            0
        );

        const descontos = inss + irrf_principal + irrf_decimo;

        const totalBruto = saldo + decimo + feriasTotal + avisoIndenizado + multa;
        const totalLiquido = totalBruto - descontos;

        // UI
        els.saldoSalario.textContent = fmtBRL(saldo);
        els.decimoTerceiro.textContent = fmtBRL(decimo);
        els.ferias.textContent = fmtBRL(feriasTotal);
        els.multaFgts.textContent = fmtBRL(multa);
        if (els.aviso) els.aviso.textContent = fmtBRL(avisoIndenizado);
        if (els.descontos) els.descontos.textContent = fmtBRL(descontos);
        els.total.textContent = fmtBRL(totalLiquido);
    };

    form.addEventListener("input", update);
    update();
}

// ---------- CALCULADORA: Salário Líquido ----------
async function initSalarioCalculator() {
    const form = document.querySelector('[data-calc="salario"]');
    if (!form) return;

    let trib;
    try {
        trib = await loadJSON("data/br-tributos.json");
    } catch (e) {
        console.error("Salário: erro ao carregar tributos", e);
        return;
    }

    const resultEl = form.querySelector("[data-result-value]");
    const inputs = form.querySelectorAll("input");
    if (!resultEl) return;

    const update = () => {
        const bruto = parseFloat(form.bruto?.value) || 0;
        const dependentes = parseFloat(form.dependentes?.value) || 0;
        const outros = parseFloat(form.outrosDescontos?.value) || 0;

        const inss = calcINSSProgressivo(bruto, trib.inss);
        const baseIR = bruto - inss;
        const irrf = calcIRRFBase(baseIR, trib.irrf.tabela, trib.irrf.dependente, dependentes);
        const liquido = bruto - inss - irrf - outros;

        resultEl.textContent = fmtBRL(liquido);
    };

    inputs.forEach(i => i.addEventListener("input", update));
    update();
}

// ---------- BOOT ----------
function bootCalculators() {
    initCltPjCalculator();
    initCustoCnpjCalculator();
    initFatorRCalculator();
    initImpostosPjCalculator();
    initRescisaoCalculator();
    initSalarioCalculator();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCalculators);
} else {
    bootCalculators();
}

export {
    initCltPjCalculator,
    initCustoCnpjCalculator,
    initFatorRCalculator,
    initImpostosPjCalculator,
    initRescisaoCalculator,
    initSalarioCalculator
};
