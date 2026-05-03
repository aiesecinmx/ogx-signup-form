import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  resolve: {
    alias: {
      'react': fileURLToPath(new URL(require.resolve('preact/compat'), import.meta.url)),
      'react-dom': fileURLToPath(new URL(require.resolve('preact/compat'), import.meta.url)),
      'react/jsx-runtime': fileURLToPath(new URL(require.resolve('preact/jsx-runtime'), import.meta.url)),
    },
    dedupe: ['preact'],
  },
  base: "./",
  build: {
    assetsInlineLimit: 0,
  },
});
