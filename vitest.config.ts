import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 5000000,
    hookTimeout: 50000
  },
})