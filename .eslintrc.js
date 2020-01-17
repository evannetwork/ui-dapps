module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    // 'airbnb-base',
    'plugin:vue/recommended',
    // 'prettier/vue',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
    // 'plugin:prettier/recommended',
    // 'prettier/@typescript-eslint'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
    // project: ['./tsconfig.json', './**/tsconfig.json'],
    // tsconfigRootDir: '.'
  },
  plugins: [
    'vue',
    //   'prettier',
    '@typescript-eslint'
  ],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
};
