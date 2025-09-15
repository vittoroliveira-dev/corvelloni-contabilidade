# AGENTS.md  Corvelloni Contabilidade

## Escopo
- Guia para agentes (Codex) editarem este repositório.
- Válido para **todo o repo**. **Não** criar branches. **Commit único** por tarefa. Worktree **limpa** ao final.

## Ambiente
- Node.js ≥ 18, npm ≥ 9.
- SO do agente pode ser Linux; o usuário local usa Windows.
- Shells: Linux/macOS = `bash`, Windows = `powershell`.

## Layout do projeto (alto nível)
```txt
/
├─ index.html
├─ ajuda/
├─ calc/
│  ├─ clt-vs-pj/
│  ├─ custo-abrir-cnpj/
│  ├─ fator-r/
│  ├─ impostos-pj/
│  ├─ rescisao/
│  └─ salario-liquido/
├─ duvidas/
│  ├─ index.html
│  ├─ como-abrir-empresa/
│  └─ como-funciona-simples/
├─ assets/ {css, js, img, icons}
├─ data/
├─ docs/   # saída do build
├─ site.webmanifest, robots.txt, sitemap.xml, 404.html
├─ vite.config.js
├─ .eslintrc.json, .stylelintrc.json, .htmlhintrc, .nojekyll, .gitignore, .gitattributes
├─ README.md
└─ AGENTS.md


## Comandos obrigatórios
Executar nesta ordem antes de concluir qualquer tarefa.

### Linux/macOS
npm ci
npm run check     # eslint + stylelint + html-validate + build
npm run preview -s || true
git status


### Windows
npm ci
npm run check
npm run preview
git status


###Regras de Git
Não criar branches. Não alterar commits existentes.
Se pre-commit existir e falhar, corrigir e tentar novamente.
Commitar apenas arquivos editados + artefatos de docs/ gerados pelo build.
Deixar git status clean no final.

###Mensagem de commit
feat: adiciona página X
fix: corrige dropdown no header
chore: atualiza configuração do vite
docs: atualiza README/AGENTS


###Build e dev
Dev: npm run dev → http://localhost:5173
Build: npm run build → escreve em /docs
Preview: npm run preview
Não editar manualmente arquivos em /docs. Eles são gerados.

###CSS (ITCSS)
Estrutura: assets/css/{tokens, base, objects, components, utilities} + assets/css/main.css.
Ordem de import em main.css:
base/_settings.css layer(tokens)
base/_normalize.css
base/_typography.css
base/_print.css layer(base) print;
objects/_o-container.css
objects/_o-grid.css
components/_c-header.css
components/_c-brand.css
components/_c-nav.css
components/_c-dropdown.css
components/_c-hero.css
components/_c-card.css
components/_c-help.css
components/_c-article.css
components/_c-search.css
components/_c-form.css
components/_c-calc.css
components/_c-footer.css
components/_c-table.css
components/_c-breadcrumb.css
components/_c-alert.css
components/_c-button.css
utilities/_u-sr-only.css
utilities/_u-flow.css
utilities/_u-hide.css
utilities/_u-stretched-link.css
utilities/_u-animations.css
Prefixos: .c- componentes, .o- objetos, .u- utilitários.

Ao criar um novo CSS, salve no subdiretório correto e adicione @import correspondente em main.css respeitando a ordem.

###JS (ES Modules)

Entrada: assets/js/app.js com type="module".
Módulos em assets/js/modules/.
Não usar return no topo de arquivo. Use IIFE quando necessário.
Padrão:
módulos globais importados diretamente no app.js;
módulos por página carregados condicionalmente (ex.: via data-* no HTML e import() dinâmico).

Estrutura:

assets/js/app.js
assets/js/modules/nav.js
assets/js/modules/enhance.js
assets/js/modules/year.js
assets/js/modules/calc-rescisao.js
assets/js/modules/calc-impostos-pj.js
assets/js/modules/calc-fator-r.js
assets/js/modules/calc-custo-cnpj.js
assets/js/modules/calc-clt-pj.js
assets/js/modules/calc-salario.js
assets/js/modules/help-search.js
assets/js/modules/header-over-hero.js

###HTML

Usar caminhos relativos para assets: assets/... (funciona em dev e no docs/).
Header e footer consistentes entre páginas.
Dropdown: gatilho button.c-nav__link[aria-expanded] + painel .c-dropdown[hidden].

###Acessibilidade

Focus visível (:focus-visible) já configurado.
Alvos mínimos de toque: 44px.
aria-expanded atualizado via JS; mostrar/ocultar com [hidden].
Evitar movimento excessivo; respeitar prefers-reduced-motion.

###Imagens e ícones

Logo principal: assets/img/svg/logo.svg (com viewBox).
PWA: assets/icons/{android-chrome-192.png, android-chrome-512.png, icon-192-maskable.png, icon-512-maskable.png, apple-touch-icon.png, favicon-16.png, favicon-32.png}.
Imagens de conteúdo em assets/img/{webp,avif}. Preferir loading="lazy" fora do hero.

###Como adicionar uma nova página
Criar pasta/index.html sob ajuda/, duvidas/ ou calc/<slug>/.
Incluir no HTML:

<link rel="stylesheet" href="assets/css/main.css">
<script type="module" src="assets/js/app.js"></script>

Atualizar navegação se necessário.
Se a página precisa de JS dedicado, criar em assets/js/modules/ e fazer import() condicional a partir de app.js.
Rodar npm run check.
Se o HTML não estiver listado como entrada no vite.config.js e falhar a navegação pós-build, adicione em rollupOptions.input.

###Critérios de aceite para tarefas

npm run check passa.
Navegação funciona em dev e no preview.
docs/ gerado e commitado.
A11y básica cumprida (tab navega, focus visível, dropdown operável por teclado).
Sem paths absolutos quebrados.

###Tarefas comuns
Corrigir header/nav/dropdown
CSS apenas em assets/css/components/_c-header.css, _c-nav.css, _c-dropdown.css.
JS apenas em assets/js/modules/nav.js.
Não introduzir frameworks.

###Ajustar tamanho do logo

Editar .c-brand__logo (altura via block-size) sem alterar --header-height.

PR / Mensagem final (se aplicável)

###Inclua no resumo:

O que mudou e por quê.
Páginas afetadas.
Saída de npm run check OK.