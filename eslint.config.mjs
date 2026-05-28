import pluginJs from '@eslint/js';
import pluginVitest from '@vitest/eslint-plugin';
import pluginPrettier from 'eslint-config-prettier/flat';
import pluginImport from 'eslint-plugin-import-x';
import pluginPromise from 'eslint-plugin-promise';
import pluginSonarjs from 'eslint-plugin-sonarjs';
import pluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import pluginTs from 'typescript-eslint';

export default [
  { ignores: ['dist', 'coverage', 'src/storage/drizzle'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs']
        },
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
        node: true
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginTs.configs.strictTypeChecked,
  ...pluginTs.configs.stylisticTypeChecked,
  pluginPrettier,
  pluginImport.flatConfigs.recommended,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  pluginPromise.configs['flat/recommended'],
  pluginSonarjs.configs.recommended,
  pluginUnicorn.configs.recommended,
  {
    rules: {
      // acceptable
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { destructuredArrayIgnorePattern: '^_', argsIgnorePattern: '^_' }
      ],
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-array-reduce': 'off',
      'promise/always-return': ['error', { ignoreLastCallback: true }],
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/todo-tag': 'warn',

      // turn off rules that are covered already by others
      'unicorn/prevent-abbreviations': 'off',
      'sonarjs/no-unused-vars': 'off',

      // comment
      'spaced-comment': ['error', 'always', { exceptions: ['-'], markers: ['/'] }],

      // arrow style functions
      'arrow-parens': ['error', 'as-needed'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-restricted-syntax': [
        'error',
        'FunctionExpression',
        'FunctionDeclaration',
        'ExportDefaultDeclaration'
      ],

      // line
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'linebreak-style': ['error', 'unix'],
      'eol-last': ['error', 'always'],

      // general
      'prefer-destructuring': ['error'],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'comma-dangle': ['error', 'never'],
      'no-console': ['error'],

      // import
      'import-x/newline-after-import': ['error', { count: 1 }],
      'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: false }
        }
      ],
      'no-restricted-imports': ['error', { patterns: ['..*', './*/'] }]
    }
  },

  // vitest test files
  {
    files: ['__tests__/**/*.{js,ts}', '**/*.test.{js,ts}'],
    ...pluginVitest.configs.recommended,
    languageOptions: {
      globals: { ...globals.node, ...pluginVitest.environments.env.globals }
    },
    rules: {
      ...pluginVitest.configs.recommended.rules,
      'sonarjs/no-duplicate-string': 'off'
    }
  },

  // skip export default rules for config files
  {
    files: ['eslint.config.mjs', 'vitest.config.ts'],
    rules: {
      'no-restricted-syntax': ['error', 'FunctionExpression', 'FunctionDeclaration']
    }
  }
];
