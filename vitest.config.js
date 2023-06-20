// vitest.config.ts
import {mergeConfig} from 'vite'
import {defineConfig} from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    globalSetup: './test/helpers/test-globals.js'
  },
}))