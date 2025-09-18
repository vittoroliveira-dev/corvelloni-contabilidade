# AGENTS.md · Corvelloni Contabilidade — Visual Overhaul Runbook (Codex-ready)

PURPOSE
- You are a deterministic code agent. Improve the site’s **visual structure, aesthetics, responsiveness, accessibility, and SEO** to approach **Contabilizei.com.br**.
- **Do not run commands. Do not browse. Do not change tools or add frameworks.**
- All **UI and SEO copy must be in Brazilian Portuguese (PT-BR)**.

EXECUTION POLICY
- Single focused task per run. Produce one cohesive patch.
- Edit only source files. Keep existing architecture (**ITCSS + BEM**, external CSS, **state via classes**).
- No dependency, build, or config changes.

SCOPE (FILES YOU MAY EDIT)
- HTML pages at repo root and under: `ajuda/`, `duvidas/`, `calc/<slug>/`.
- CSS: `assets/css/{tokens, base, utilities, objects,components,responsive and accessibility}`, `assets/css/main.css`.
- JS (ES MODULES): `assets/js/app.js`, `assets/js/modules/**`.
- Assets: `assets/img/**`, `assets/svg/**`, `assets/icons/**`, plus `site.webmanifest`, `robots.txt`, `sitemap.xml`.

BRAZIL MANDATE
- PT-BR for all user-facing and SEO text: titles, descriptions, JSON-LD fields, OG/Twitter.
- Brazilian patterns: `R$` currency, dates, phones, addresses. Clear privacy wording.

PALETTE TOKENS (AUTHORITATIVE)
```css
:root{
  --color-primary-050: #e9f1ff;
  --color-primary-500: #a63238;
  --color-primary-600: #8b2c37;
  --color-neutral-900: #111827;
}
```
Rules: use tokens only; no hard-coded hex in components; derive surfaces/accent via `color-mix()`; ensure AA contrast.

LAYOUT & RESPONSIVENESS
- **Mobile-first**, fluid layout, **no horizontal scroll**.
- Breakpoints (min-width): **360, 375, 414, 768, 1024, 1280+ px**.
- Apply readable max-widths and consistent vertical rhythm (section spacing via tokens).

LANDING SECTIONS (PATTERN TO APPROXIMATE)
1) Header with compact nav + primary CTA.
2) Hero: concise H1 + benefit subcopy + single strong CTA.
3) Trust bar: logos/value props.
4) Benefits grid: **3–6** concise cards.
5) Calculators hub: cards/links to key calculators.
6) Social proof: testimonials/ratings (optional).
7) FAQ accordion.
8) Footer: contact, legal, social.

SEO (PT-BR)
- `<html lang="pt-BR">`.
- Unique `<title>` and page-specific `<meta name="description">` (PT-BR).
- Absolute canonical `<link rel="canonical" href="…">`.
- Complete OG/Twitter tags (PT-BR). Favicon set present.
- Valid JSON-LD (`Organization`, `Website`, `LocalBusiness`/`JobPosting` when applicable) with PT-BR text and BR address fields where relevant.
- `robots.txt` must not block CSS/JS and should reference `sitemap.xml`.

ACCESSIBILITY
- Semantic landmarks (`header`, `nav`, `main`, `footer`).
- Visible focus (`:focus-visible`), keyboard-operable menus, functional skip link.
- Touch targets ≥ **44px**, contrast AA, respect `prefers-reduced-motion`.
- Dropdown pattern: `button.c-nav__link[aria-expanded]` + panel `.c-dropdown[hidden]`; JS toggles `aria-expanded` and `[hidden]`.

PERFORMANCE TARGETS (NO TOOLING)
- **LCP ≤ 2.5 s**, **INP < 200 ms**, **CLS < 0.1** on key pages.
- Minimal critical CSS; load main CSS early.
- Lean JS modules; remove dead code.
- Images: `srcset/sizes`, explicit `width/height`, `loading="lazy"` and `decoding="async"` outside heroes; prefer AVIF/WebP.
- Fonts: `font-display: swap`; limit weights; define fallbacks.

### Structure (high level)


/index.html
/ajuda/
/calc/
/calc/salario-liquido/
/calc/rescisao/
/calc/impostos-pj/
/calc/fator-r/
/calc/custo-abrir-cnpj/
/calc/clt-vs-pj/
/data/
/data/custos-abertura.json
/data/br-tributos.json
/data/simples-faixas.json
/duvidas/
/duvidas/index.html
/duvidas/como-abrir-empresa/
/duvidas/como-funciona-simples/
/assets/
/assets/css/
/assets/css/main.css
/assets/css/tokens/
/assets/css/tokens/_settings.css
/assets/css/base/
/assets/css/base/_generic2.css
/assets/css/utilities/
/assets/css/utilities/_utilities2.css
/assets/css/objects/
/assets/css/objects/_o-container.css
/assets/css/components/
/assets/css/components/_c-components.css
/assets/css/components/_c-formsandcalc.css
/assets/css/pages/
/assets/css/pages/_calculator.css
/assets/css/responsive/
/assets/css/responsive/_c-responsive.css
/assets/css/responsive/_mobile-nav.css
/assets/css/accessibility/
/assets/css/accessibility/_c-accessibility.css
/assets/img/ 
/assets/img/logo-white.png
/assets/img/avatar.png
/assets/img/svg/
/assets/img/svg/logo.svg
/assets/img/svg/logo-white.svg
/assets/img/svg/hero.svg
/assets/icons/
/assets/icons/icon-512-maskable.png
/assets/icons/icon-192-maskable.png
/assets/icons/android-chrome-512.png
/assets/icons/android-chrome-192.png
/assets/icons/apple-touch-icon.png
/assets/icons/favicon-32.png
/assets/icons/favicon-16.png
/assets/js/
/assets/js/app.js
/assets/js/modules/navigation.js
/assets/js/modules/cookie-consent.js
/assets/js/modules/custos-abertura-pj.js
/assets/js/modules/help-dialog.js
/assets/js/modules/clt-vs-pj.js

## CSS ARCHITECTURE RULES (ITCSS via assets/css/main.css)

1. `/asset/tokens/_settings.css`
2. `/asset/base/_generic2.css`
3. `/asset/objects/_o-container.css`
4. `/asset/components/_c-components.css`
5. `/asset/components/_c-formsandcalc.css`
6. `/asset/utilities/_utilities2.css`
7. `/accessibility/_c-accessibility.css"`
8. `/responsive/_c-responsive.css.css"`
9. `/responsive/_mobile-nav.css"`
10. `/pages/_calculator.css"`
- **No inline styles. No JS-injected CSS.**
- Z-index via tokens; annotate stacking contexts; avoid magic numbers.

JS GUIDELINES (ES MODULES)
- Entry: `assets/js/app.js`.
- Global features: static imports in `app.js`.
- Page-specific features: conditional `import()`; prefer small pure functions; state via classes.

HTML RULES
- Relative asset paths (`assets/...`) work across pages.
- Consistent header/footer across pages.
- Reserve media space with `width`/`height` or CSS `aspect-ratio`.

REVIEW WORKFLOW (WHAT TO PRODUCE)
- **Findings** grouped by: SEO · A11y · Performance · CSS Architecture · JS · Content.
- **Fix plan** with exact file paths and **unified diffs or full code blocks**.
- **Rationale** per change (goal, impact, risk).
- **Manual test plan** per page/component: keyboard flow, focus states, breakpoints.

ACCEPTANCE CRITERIA
- No horizontal scroll at **360/375/414/768/1024/1280+**.
- Clear header/hero with a primary CTA; keyboard-friendly navigation.
- Unique titles/descriptions; valid PT-BR JSON-LD; correct canonical.
- Low CLS (media reserved space); fonts swap; minimal JS.
- ITCSS order enforced; components consume tokens; z-index map respected.

NON-GOALS
- Do not add frameworks.
- Do not modify build tools or configs.
- Do not introduce inline styles or JS-injected CSS.

