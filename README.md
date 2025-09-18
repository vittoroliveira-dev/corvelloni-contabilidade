### (READ-ONLY, NO COMMANDS)

- Goal: polish **visual structure, responsiveness, accessibility, and SEO** to resemble **Contabilizei.com.br**, while keeping all **UI/SEO copy in PT-BR**.

### Scope

- Sources only: root HTML pages; `assets/css/**` (ITCSS+BEM), `assets/js/**` (ES Modules), `assets/img|svg|icons/**`, `site.webmanifest`, `robots.txt`, `sitemap.xml`.
- No framework changes, no dependency/tool changes, no build config changes.

### Visual system

```css
:root{
  --color-primary-050: #e9f1ff;
  --color-primary-500: #a63238;
  --color-primary-600: #8b2c37;
  --color-neutral-900: #111827;
}
```
1. Use tokens only; no hard-coded hex in components.
- Layout: mobile-first, fluid grid, no horizontal scroll.
- Breakpoints (min-width): 360, 375, 414, 768, 1024, 1280+ px.
- Sections (landing pattern): Header+CTA · Hero (H1+benefit+CTA) · Trust bar · Benefits (3–6) · Calculators hub · Testimonials (opt) · FAQ · Footer.

## SEO RULES (PT-BR)

1. <html lang="pt-BR">; unique <title> and <meta name="description"> per page.
2. Absolute rel="canonical".
3. OG/Twitter complete; valid JSON-LD (Organization, Website, LocalBusiness/JobPosting when applicable) with PT-BR text.

## ACCESSIBILITY

- Semantic landmarks; visible focus (:focus-visible); keyboard menus with aria-expanded + [hidden]; targets ≥44px; contrast AA; skip link; respect prefers-reduced-motion.

###  PERFORMANCE TARGETS (no tooling required here)

1. LCP ≤ 2.5 s, INP < 200 ms, CLS < 0.1 on key pages.
2. Minimal critical CSS; external CSS early.
3. Lean JS; remove dead code.
4. Images with srcset/sizes, explicit width/height, loading="lazy" + decoding="async" outside heroes; fonts with font-display: swap.

### Output requirements

1. Return: findings by category: SEO, A11y, Performance, CSS Architecture, JS, Content.
2. Provide unified diffs or full code blocks with exact file paths, plus a short rationale and manual test steps (keyboard + breakpoints).
3. Keep all user-facing copy in PT-BR.

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

## JS (ES MODULES) order:

1. Single entry assets/js/app.js. Modules in `assets/js/modules/`.
2. Global features = direct import; page-specific = conditional import().
3. `/modules/cookie-consent.js`
4. `/modules/navigation.js`
5. `/modules/clt-vs-pj.js`
6. `/modules/custos-abertura-pj.js`
7. `/modules/help-dialog.js`
