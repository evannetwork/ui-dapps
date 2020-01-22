module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
    // 'prettier/vue',
    // 'prettier/@typescript-eslint',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    // project: ['./tsconfig.json', './**/tsconfig.json'],
    // tsconfigRootDir: '.'
  },
  plugins: [
    'vue',
    // 'prettier',
    '@typescript-eslint',
  ],
  rules: {
    /**
     * Misc
     */
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    /**
     * Vue related rules
     * https://vuejs.github.io/eslint-plugin-vue/rules/#priority-a-essential-error-prevention
     */
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],

    /**
     * ESLint and Airbnb related rules
     * https://eslint.org/docs/rules/
     */
    'class-methods-use-this': 'off', // be able to define functions, that no using this, that can be used by vue templates
    'import/extensions': 'off', // disabled to avoid collision with TS
    'import/no-extraneous-dependencies': 'off', // disabled to avoid collision with TS
    'import/no-unresolved': 'off', // disabled to avoid collision with TS
    'import/prefer-default-export': 'off', // too restrictive
    'max-len': ['warn', { code: 120 }],
    'multiline-comment-style': ['warn', 'bare-block'], // fix formatting license
  },
};
