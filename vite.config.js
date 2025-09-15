// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',          // opcional; remova se não usar /public
  base: '/',                    // dev e preview locais
  build: {
    outDir: 'docs',             // GitHub Pages lê de /docs
    emptyOutDir: true
  },
  server: { port: 5173 }
});
