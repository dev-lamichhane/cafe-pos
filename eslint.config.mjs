// FINAL ESLint v9 Flat Config for Next.js 16 + Prettier (Stable)

import nextConfig from 'eslint-config-next'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**'],
  },

  // Spread the Next.js config (it's an array)
  ...nextConfig,

  // Our custom rules
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'func-names': ['error', 'never'],
      'no-empty-function': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'off',

      // Allow React to be used without import (Next.js App Router)
      'no-undef': 'off',
    },
  },

  // Prettier config (it's ONE OBJECT, so we do NOT spread it)
  prettierConfig,
]
