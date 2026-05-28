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
        branches: 75,
        functions: 75,
        lines: 75,
        statements: 75
      }
    }
  }
});
