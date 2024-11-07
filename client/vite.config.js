import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: "/",
  build: {
    emptyOutDir: true,
    outDir: './dist',
    rollupOptions: {
      input: {
        mainsite: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'landing.html'),
      },
      external: [
      ],
    },
  },
})