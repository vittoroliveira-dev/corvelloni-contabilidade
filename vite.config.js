// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  base: '/', // em GH Pages use o script build:gh para sobrescrever
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        ajuda: 'ajuda/index.html',
        duvidas: 'duvidas/index.html',
        duvidasComoAbrir: 'duvidas/como-abrir-empresa/index.html',
        duvidasSimples: 'duvidas/como-funciona-simples/index.html',
        calcCltVsPj: 'calc/clt-vs-pj/index.html',
        calcCustoCnpj: 'calc/custo-abrir-cnpj/index.html',
        calcFatorR: 'calc/fator-r/index.html',
        calcImpostosPj: 'calc/impostos-pj/index.html',
        calcRescisao: 'calc/rescisao/index.html',
        calcSalario: 'calc/salario-liquido/index.html',
      },
    },
  },
});
