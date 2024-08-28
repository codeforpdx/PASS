import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import { resolve } from "path";

export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  },
  plugins: [
    react(),
    visualizer({
      filename: 'bundleStats.html'
    }),
  ],
  resolve: {
    alias: [
      { find: "@hooks", replacement: resolve(__dirname, "src/hooks") },
      { find: "@contexts", replacement: resolve(__dirname, "src/contexts") },
      { find: "@pages", replacement: resolve(__dirname, "src/pages") },
      { find: "@utils", replacement: resolve(__dirname, "src/utils") },
      { find: "@components", replacement: resolve(__dirname, "src/components") },
      { find: "@constants", replacement: resolve(__dirname, "src/constants") },
    ]
  },
  test: {
    environment: 'jsdom'
  }
});

