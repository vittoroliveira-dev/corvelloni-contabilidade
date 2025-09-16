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
- CSS: `assets/css/{base,objects,components,utilities}`, `assets/css/main.css`.
- JS (ES MODULES): `assets/js/app.js`, `assets/js/modules/**`.
- Assets: `assets/img/**`, `assets/svg/**`, `assets/icons/**`, plus `site.webmanifest`, `robots.txt`, `sitemap.xml`.

BRAZIL MANDATE
- PT-BR for all user-facing and SEO text: titles, descriptions, JSON-LD fields, OG/Twitter.
- Brazilian patterns: `R$` currency, dates, phones, addresses. Clear privacy wording.

PALETTE TOKENS (AUTHORITATIVE)
~~~css
:root{
  --color-primary-050:#e9f1ff;
  --color-primary-500:#a63238;
  --color-primary-600:#8b2c37;
  --color-neutral-900:#111827;
}
~~~
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

CSS ARCHITECTURE (ITCSS + BEM + `@layer`)
- Import order in `assets/css/main.css`:
  1) `base/_settings.css` (tokens, **z-index map**)
  2) `base/_normalize.css`
  3) `base/_typography.css`
  4) `base/_print.css` (if present)
  5) `objects/_o-*.css`
  6) `components/_c-*.css`
  7) `utilities/_u-*.css`
- Namespaces: `.o-*` objects, `.c-*` components, `.u-*` utilities.
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

REFERENCE SNIPPETS

Head essentials:
~~~html
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Contabilidade online para PJ | Corvelloni Contabilidade</title>
  <meta name="description" content="Abertura de empresa e contabilidade online integrada para PJ.">
  <link rel="canonical" href="https://example.com/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Contabilidade online para PJ | Corvelloni Contabilidade">
  <meta property="og:description" content="Abertura de empresa e contabilidade online integrada para PJ.">
  <meta property="og:url" content="https://example.com/">
  <link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32">
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"Organization",
    "name":"Corvelloni Contabilidade",
    "url":"https://example.com/",
    "logo":"https://example.com/assets/svg/logo.svg"
  }
  </script>
  <link rel="stylesheet" href="assets/css/main.css">
</head>
~~~

Responsive image with reserved space:
~~~html
<img
  src="assets/img/hero-800.webp"
  srcset="assets/img/hero-480.webp 480w, assets/img/hero-800.webp 800w, assets/img/hero-1200.webp 1200w"
  sizes="(min-width:1024px) 50vw, 100vw"
  width="1200" height="800"
  alt="Corvelloni Contabilidade atendendo empresas PJ"
  decoding="async" loading="eager">
~~~

Primary button and focus:
~~~css
.c-button{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
  padding:.75rem 1rem;border-radius:.5rem;font-weight:600;text-decoration:none;
  color:var(--color-neutral-900);background:var(--color-primary-050);}
.c-button--primary{color:#fff;background:var(--color-primary-600);}
.c-button:focus-visible{outline:2px solid currentColor;outline-offset:2px;}
~~~
