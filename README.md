## Instalação (Windows)
```powershell
winget install OpenJS.NodeJS.LTS
cd "C:\Users\SEU_USUARIO\Downloads\corvelloni contabilidade"
npm ci
npm run dev
npm run build
npm run preview
npm run check```

Estrutura

/assets CSS, JS e imagens
/duvidas artigos com busca
/ajuda centro de ajuda
/calc calculadoras
/docs saída do build

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


Notas

docs/ é gerado por npm run build. Não edite manualmente.
Para automação, siga AGENTS.md.

::contentReference[oaicite:0]{index=0}