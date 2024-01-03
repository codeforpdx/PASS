// vitest.config.ts
/* eslint-disable import/no-extraneous-dependencies */
import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
/* eslint-enable import/no-extraneous-dependencies */
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test/helpers/test-setup.js',
      globalSetup: './test/helpers/test-globals.js'
    }
  })
);
