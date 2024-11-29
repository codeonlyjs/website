import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteStaticGenerate } from "@codeonlyjs/core";

// Vite config
export default defineConfig({
  base: "/",
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: './dist',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'public/*', dest: './public/' },
        { src: 'content/*', dest: './content/' },
        { src: ".nginx", dest: "./" }
      ],
    }),
    viteStaticGenerate({
      prebuild: "./prebuild.js",
      entryFile: "./main-ssr.js",
      entryMain: "main",
      entryHtml: "./dist/index.html",
      entryUrls: [ "/" ],
      pretty: true,
    }),
  ]
})