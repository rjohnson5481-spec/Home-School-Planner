import { defineConfig } from 'vite'

export default defineConfig({
  // Serve at /te-extractor/ — all asset URLs get this base
  base: '/te-extractor/',

  // Entry HTML lives in public/
  root: 'public',

  // No publicDir — static assets (manifest.json, sw.js) are copied by the build script
  publicDir: false,

  build: {
    outDir: '../../../dist/te-extractor',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Preserve exact filenames — service worker depends on stable URLs
        entryFileNames: 'app.js',
        assetFileNames: (assetInfo) => {
          // SVG icon files go into icons/ to match the manifest and HTML references
          if (assetInfo.name?.endsWith('.svg')) return 'icons/[name][extname]';
          return '[name][extname]';
        },
      },
    },
  },
})
