import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import { resolve } from "path";
import { nodeResolve } from '@rollup/plugin-node-resolve'; 

// Workaround for this open solid-client-authn bug:
// https://github.com/inrupt/solid-client-authn-js/issues/3001
// Once that issue is fixed and the solid-client-authn-js version is bumped
// We can delete this function and all related code
function withCustomResolver(
  { find, exportConditions, mainFields }
) {
  const customResolver = nodeResolve({exportConditions, mainFields })
  return { find, replacement: find, customResolver }
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        clientAppId: resolve(__dirname, 'clientAppId.json')
      }
    }
  },
  plugins: [
    react(),
    visualizer({
      filename: 'bundleStats.html'
    })
  ],
  resolve:{
    alias:[
      {find: "@hooks", replacement:  resolve(__dirname, "src/hooks")},
      {find: "@contexts", replacement: resolve(__dirname, "src/contexts")},
      {find: "@pages", replacement: resolve(__dirname, "src/pages")},
      {find: "@utils", replacement: resolve(__dirname, "src/utils")},
      {find: "@components", replacement: resolve(__dirname,"src/components")},
      {find: "@constants", replacement: resolve(__dirname,"src/constants")},
      withCustomResolver({find: '@inrupt/solid-client', exportConditions: ['import']}),
      withCustomResolver({find: '@inrupt/solid-client-authn-core', exportConditions: ['import']})
    ]
  },
  test: {
    environment: 'jsdom'
  }
});

