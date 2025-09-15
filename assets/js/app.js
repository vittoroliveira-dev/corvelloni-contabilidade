/**
 * ===================================================================
 * app.js: Ponto de Entrada Principal da Aplicação
 * ===================================================================
 * Este arquivo orquestra quais módulos JavaScript carregar.
 *
 * Estratégia:
 * 1. Módulos globais são importados diretamente.
 * 2. Módulos específicos de página (calculadoras) são importados
 * dinamicamente para otimizar a performance.
 */

// --- Módulos Globais (Carregados em todas as páginas) ---
import './modules/nav.js';
import './modules/year.js';
import './modules/enhance.js';
// O 'header-over-hero' e 'help-search' também podem ser dinâmicos se não
// aparecerem em todas as páginas, mas por enquanto mantemos globais.
import './modules/header-over-hero.js';
import './modules/help-search.js';


// --- Módulos de Página (Carregados sob demanda) ---

// Função que verifica a presença de um elemento e carrega o módulo correspondente
const loadModule = (selector, path) => {
    if (document.querySelector(selector)) {
        import(path).catch(err => console.error(`Falha ao carregar o módulo: ${path}`, err));
    }
};

// Mapeamento dos seletores das calculadoras para seus respectivos scripts
loadModule('[data-calc="salario"]', './modules/calc-salario.js');
loadModule('[data-calc="clt-pj"]', './modules/calc-clt-pj.js');
loadModule('[data-calc="custo-cnpj"]', './modules/calc-custo-cnpj.js');
loadModule('[data-calc="fator-r"]', './modules/calc-fator-r.js');
loadModule('[data-calc="impostos-pj"]', './modules/calc-impostos-pj.js');
loadModule('[data-calc="rescisao"]', './modules/calc-rescisao.js');