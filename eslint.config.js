import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier/flat';
import tailwindcss from 'eslint-plugin-better-tailwindcss';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      unicorn.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: true,
            kebabCase: true,
            pascalCase: true,
            snakeCase: false,
          },
          ignore: ['^.', '^_', '^-'],
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prefer-at': ['error', { checkAllIndexAccess: true }],
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    extends: [tailwindcss.configs.recommended],
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/index.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    },
  },
  prettierConfig,
]);
