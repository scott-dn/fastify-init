import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', '__tests__/**/*.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['clover', 'json', 'lcov', 'text'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/*.ts', // ignore boostrap programs
        'src/**/*.test.ts'
      ],
      thresholds: {
        branches: 5,
        functions: 5,
        lines: 5,
        statements: 5
      }
    }
  }
});
