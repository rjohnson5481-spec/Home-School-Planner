import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],

  base: '/reward-tracker/',

  build: {
    outDir: '../../dist/reward-tracker',
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@homeschool/shared': fileURLToPath(
        new URL('../shared/src', import.meta.url)
      ),
    },
  },
});
