# AGENTS.md . Corvelloni Contabilidade

## Scope
- This file tells Codex how to work in this repo.
- Applies to the **whole repo**.
- Do **not** create branches. Make **one commit** per task.
- Leave the worktree **clean** at the end.

## Environment
- Node.js ≥ 18, npm ≥ 9.
- Agent OS can be Linux. Local user is on Windows.
- Shells: Linux/macOS = bash, Windows = PowerShell.

## Project layout (high level)
~~~txt
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
├─ docs/   # build output
├─ site.webmanifest, robots.txt, sitemap.xml, 404.html
├─ vite.config.js
├─ .eslintrc.json, .stylelintrc.json, .htmlhintrc, .nojekyll, .gitignore, .gitattributes
├─ README.md
└─ AGENTS.md
~~~

## Required commands (run before finishing any task)

### Linux/macOS
~~~bash
npm ci
npm run check     # eslint + stylelint + html-validate + build
npm run preview -s || true
git status
~~~

### Windows
~~~powershell
npm ci
npm run check
npm run preview
git status
~~~

## Git rules
- Do not create branches. Do not rewrite old commits.
- If pre-commit fails, fix the issues and try again.
- Commit edited files plus generated `docs/`.
- End with `git status` clean.

## Commit message format (Conventional Commits)
~~~txt
feat: add page X
fix: fix header dropdown
chore: update vite config
docs: update README/AGENTS
~~~

## Build and dev
- Dev: `npm run dev` → http://localhost:5173
- Build: `npm run build` → writes to `/docs`
- Preview: `npm run preview`
- Do **not** edit files in `/docs` by hand.

## CSS (ITCSS)
- Folders: `assets/css/{base,objects,components,utilities}` + `assets/css/main.css`.
- Import order in `main.css`:
  1) `base/_settings.css`
  2) `base/_normalize.css`
  3) `base/_typography.css`
  4) `base/_print.css`
  5) `objects/_o-*.css`
  6) `components/_c-*.css`
  7) `utilities/_u-*.css`
- Prefixes: `.c-` components, `.o-` objects, `.u-` utilities.
- When adding CSS, put it in the right folder and import it in `main.css` in the order above.

## JS (ES Modules)
- Single entry: `assets/js/app.js` with `type="module"`.
- Modules live in `assets/js/modules/`.
- Do **not** use `return` at top level. Use an IIFE if needed.
- Pattern:
  - global modules: imported directly in `app.js`;
  - page-only modules: load with conditional `import()`.

~~~txt
assets/js/
├─ app.js
└─ modules/
   ├─ nav.js
   ├─ enhance.js
   ├─ year.js
   ├─ header-over-hero.js
   ├─ help-search.js
   └─ calc-*.js
~~~

## HTML
- Use relative paths for assets: `assets/...` (works in dev and build).
- Keep header and footer the same across pages.
- Dropdown pattern: trigger `button.c-nav__link[aria-expanded]` + panel `.c-dropdown[hidden]`.

## Accessibility
- Visible focus via `:focus-visible`.
- Touch targets ≥ 44px.
- Update `aria-expanded` with JS; show/hide using `[hidden]`.
- Respect `prefers-reduced-motion`.

## Images and icons
- Logo: `assets/img/svg/logo.svg` with a proper `viewBox`.
- PWA icons in `assets/icons/`: `android-chrome-192.png`, `android-chrome-512.png`, `icon-192-maskable.png`, `icon-512-maskable.png`, `apple-touch-icon.png`, `favicon-16.png`, `favicon-32.png`.
- Content images in `assets/img/{webp,avif}`. Use `loading="lazy"` outside the hero.

## How to add a new page
1) Create `folder/index.html` under `ajuda/`, `duvidas/`, or `calc/<slug>/`.
2) Add these tags:
   - `<link rel="stylesheet" href="assets/css/main.css">`
   - `<script type="module" src="assets/js/app.js"></script>`
3) Update the navigation if needed.
4) If the page needs custom JS, create a module in `assets/js/modules/` and load it with conditional `import()` from `app.js`.
5) Run `npm run check`.
6) If the page is missing in the build, add it to `vite.config.js` in `rollupOptions.input`.

## Acceptance criteria
- `npm run check` passes.
- Navigation works in dev and preview.
- `docs/` is generated and committed.
- Basic a11y OK (tab works, focus visible, dropdown keyboard-friendly).
- No broken absolute paths.

## Common tasks
- Header/Nav/Dropdown:
  - CSS only in `_c-header.css`, `_c-nav.css`, `_c-dropdown.css`.
  - JS only in `modules/nav.js`.
  - No frameworks.
- Change logo size:
  - Edit `.c-brand__logo` height via `block-size`.
  - Do not change `--header-height`.

  ## Language
- All human-facing output must be in **Brazilian Portuguese (PT-BR)**: error messages, PR descriptions, code comments, UI copy, and agent replies.
- Commits must follow **Conventional Commits**: types in English (`feat`, `fix`, etc.), but **titles and bodies in PT-BR**.
- Logs/commands may stay in English, but any explanations or summaries must be in **PT-BR**.
- If a tool generates text in another language, **translate to PT-BR** before finishing the task.

### Examples
- Commit: `feat: adiciona página "Como funciona" e links no header`
- PR title: `Corrige dropdown do menu no mobile`
- PR body: `Resumo, mudanças e como testar  em PT-BR.`


## Final checklist
- [ ] `npm ci`
- [ ] `npm run check`
- [ ] `docs/` updated
- [ ] `git status` clean
- [ ] Single commit using Conventional Commits
