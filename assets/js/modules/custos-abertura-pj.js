// /assets/js/modules/custos-abertura-pj.js
const custosData = [
    { uf: "SP", natureza: "SLU", taxas: 1000, servicos: 500, prazo: 10 },
    { uf: "SP", natureza: "LTDA", taxas: 1000, servicos: 500, prazo: 10 },
    { uf: "SP", natureza: "EI", taxas: 1000, servicos: 500, prazo: 10 },
    { uf: "RJ", natureza: "SLU", taxas: 1200, servicos: 600, prazo: 15 },
    { uf: "RJ", natureza: "LTDA", taxas: 1200, servicos: 600, prazo: 15 },
    { uf: "RJ", natureza: "EI", taxas: 1200, servicos: 600, prazo: 15 },
    { uf: "MG", natureza: "SLU", taxas: 950, servicos: 550, prazo: 12 },
    { uf: "MG", natureza: "LTDA", taxas: 950, servicos: 550, prazo: 12 },
    { uf: "MG", natureza: "EI", taxas: 950, servicos: 550, prazo: 12 },
    { uf: "PR", natureza: "SLU", taxas: 850, servicos: 450, prazo: 8 },
    { uf: "PR", natureza: "LTDA", taxas: 850, servicos: 450, prazo: 8 },
    { uf: "PR", natureza: "EI", taxas: 850, servicos: 450, prazo: 8 },
    { uf: "RS", natureza: "SLU", taxas: 900, servicos: 500, prazo: 10 },
    { uf: "RS", natureza: "LTDA", taxas: 900, servicos: 500, prazo: 10 },
    { uf: "RS", natureza: "EI", taxas: 900, servicos: 500, prazo: 10 },
    { uf: "SC", natureza: "SLU", taxas: 880, servicos: 480, prazo: 7 },
    { uf: "SC", natureza: "LTDA", taxas: 880, servicos: 480, prazo: 7 },
    { uf: "SC", natureza: "EI", taxas: 880, servicos: 480, prazo: 7 },
    { uf: "BA", natureza: "SLU", taxas: 1100, servicos: 580, prazo: 18 },
    { uf: "BA", natureza: "LTDA", taxas: 1100, servicos: 580, prazo: 18 },
    { uf: "BA", natureza: "EI", taxas: 1100, servicos: 580, prazo: 18 },
    { uf: "ES", natureza: "SLU", taxas: 920, servicos: 520, prazo: 11 },
    { uf: "ES", natureza: "LTDA", taxas: 920, servicos: 520, prazo: 11 },
    { uf: "ES", natureza: "EI", taxas: 920, servicos: 520, prazo: 11 },
    { uf: "DF", natureza: "SLU", taxas: 1050, servicos: 550, prazo: 14 },
    { uf: "DF", natureza: "LTDA", taxas: 1050, servicos: 550, prazo: 14 },
    { uf: "DF", natureza: "EI", taxas: 1050, servicos: 550, prazo: 14 },
    { uf: "PE", natureza: "SLU", taxas: 980, servicos: 530, prazo: 16 },
    { uf: "PE", natureza: "LTDA", taxas: 980, servicos: 530, prazo: 16 },
    { uf: "PE", natureza: "EI", taxas: 980, servicos: 530, prazo: 16 },
    { uf: "GO", natureza: "SLU", taxas: 960, servicos: 540, prazo: 13 },
    { uf: "GO", natureza: "LTDA", taxas: 960, servicos: 540, prazo: 13 },
    { uf: "GO", natureza: "EI", taxas: 960, servicos: 540, prazo: 13 }
];

const fmtBRL = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
const normalizaNatureza = (n) => {
    const x = String(n || '').trim().toUpperCase();
    const map = { ME: 'SLU', EIRELI: 'SLU', 'SOCIEDADE LIMITADA': 'LTDA' };
    return map[x] || x;
};

// contador suave
function countTo(el, from, to, duration = 700) {
    const start = performance.now();
    const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const val = from + (to - from) * eased;
        el.textContent = fmtBRL(val);
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function initCustoCnpjCalculator() {
    const form = document.querySelector('[data-calc="custo-cnpj"]');
    const resultEl = document.querySelector('[data-result]');
    if (!form || !resultEl) return;

    const ufEl = document.getElementById('calc-uf');
    const natEl = document.getElementById('calc-natureza');

    const index = new Map(custosData.map(d => [`${d.uf}|${d.natureza}`, d]));
    const INITIAL_MSG = 'Selecione o estado e o tipo de empresa para ver o custo estimado.';
    let prevTotal; // para animar o número apenas na troca de natureza

    const renderInitial = () => {
        const card = document.createElement('div');
        card.className = 'result-card';
        const text = document.createElement('div');
        text.className = 'result-text';
        text.textContent = INITIAL_MSG;
        card.appendChild(text);
        resultEl.replaceChildren(card);
    };

    const renderResult = (uf, natureza, fromVal) => {
        const item = index.get(`${uf}|${natureza}`);
        if (!item) {
            const card = document.createElement('div');
            card.className = 'result-card';
            const text = document.createElement('div');
            text.className = 'result-text';
            text.textContent = 'Sem dados disponíveis para esta combinação. Solicite um orçamento.';
            card.appendChild(text);
            resultEl.replaceChildren(card);
            return null;
        }
        const total = item.taxas + item.servicos;

        const card = document.createElement('div');
        card.className = 'result-card';

        const highlight = document.createElement('div');
        highlight.className = 'cost-highlight';
        const totalSpan = document.createElement('span');
        totalSpan.className = 'js-total-number';
        totalSpan.textContent = fmtBRL(fromVal ?? total);
        highlight.appendChild(totalSpan);

        const prazoDiv = document.createElement('div');
        prazoDiv.style.margin = '12px 0';
        prazoDiv.textContent = `Prazo médio: ${Number(item.prazo)} dias úteis`;

        const breakdown = document.createElement('div');
        breakdown.className = 'breakdown';

        const taxasItem = document.createElement('div');
        taxasItem.className = 'breakdown-item';
        const taxasLabel = document.createElement('div');
        taxasLabel.className = 'breakdown-label';
        taxasLabel.textContent = 'Taxas Governamentais';
        const taxasValue = document.createElement('div');
        taxasValue.className = 'breakdown-value';
        taxasValue.textContent = fmtBRL(item.taxas);
        taxasItem.appendChild(taxasLabel);
        taxasItem.appendChild(taxasValue);

        const servicosItem = document.createElement('div');
        servicosItem.className = 'breakdown-item';
        const servicosLabel = document.createElement('div');
        servicosLabel.className = 'breakdown-label';
        servicosLabel.textContent = 'Serviços';
        const servicosValue = document.createElement('div');
        servicosValue.className = 'breakdown-value';
        servicosValue.textContent = fmtBRL(item.servicos);
        servicosItem.appendChild(servicosLabel);
        servicosItem.appendChild(servicosValue);

        const prazoItem = document.createElement('div');
        prazoItem.className = 'breakdown-item';
        const prazoLabel = document.createElement('div');
        prazoLabel.className = 'breakdown-label';
        prazoLabel.textContent = 'Prazo';
        const prazoValueDiv = document.createElement('div');
        prazoValueDiv.className = 'breakdown-value';
        prazoValueDiv.textContent = `${Number(item.prazo)} dias`;
        prazoItem.appendChild(prazoLabel);
        prazoItem.appendChild(prazoValueDiv);

        breakdown.appendChild(taxasItem);
        breakdown.appendChild(servicosItem);
        breakdown.appendChild(prazoItem);

        card.appendChild(highlight);
        card.appendChild(prazoDiv);
        card.appendChild(breakdown);

        resultEl.replaceChildren(card);
        return total;
    };

    const playUpdateFX = (toTotal) => {
        const card = resultEl.querySelector('.result-card');
        const num = resultEl.querySelector('.js-total-number');
        if (!card || !num) return;
        // anima "elevação + barra"
        card.classList.remove('is-update'); void card.offsetWidth; card.classList.add('is-update');
        // contador
        countTo(num, Number.isFinite(prevTotal) ? prevTotal : toTotal, toTotal, 650);
        prevTotal = toTotal;
    };

    // troca UF -> reset tudo
    ufEl?.addEventListener('change', () => {
        if (natEl) natEl.selectedIndex = 0;
        prevTotal = undefined;
        renderInitial();
    });

    // troca Natureza -> anima atualização (se já tiver UF)
    natEl?.addEventListener('change', () => {
        const uf = (ufEl?.value || '').trim().toUpperCase();
        if (!uf) return renderInitial();
        const natureza = normalizaNatureza(natEl?.value || '');
        const total = renderResult(uf, natureza, prevTotal ?? undefined);
        if (total != null) playUpdateFX(total);
    });

    renderInitial();
}

// boot
const ready = document.readyState !== 'loading'
    ? Promise.resolve()
    : new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true }));
ready.then(() => {
    if (document.querySelector('[data-calc="custo-cnpj"]')) initCustoCnpjCalculator();
});
