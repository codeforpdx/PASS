import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'bundleStats.html'
    })
  ],
  resolve:{
    alias:{
      "@hooks": resolve(__dirname, "src/hooks"),
      "@contexts": resolve(__dirname, "src/contexts"),
      "@pages": resolve(__dirname, "src/pages"),
      "@utils": resolve(__dirname, "src/utils"),
      "@components": resolve(__dirname,"src/components")
    }
  },
  test: {
    environment: 'jsdom'
  }
});
