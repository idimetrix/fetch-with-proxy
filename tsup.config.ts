import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'es2020',
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  minify: process.env.NODE_ENV === 'production',
  exclude: ['**/__tests__/**', '**/*.test.*', '**/*.spec.*'],
})
