module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    /**
     * ESLint and Airbnb related rules
     * https://eslint.org/docs/rules/
     */
    'import/extensions': 'off', // disabled to avoid collision with TS
    'import/no-extraneous-dependencies': 'off', // disabled to avoid collision with TS
    'import/no-unresolved': 'off', // disabled to avoid collision with TS
    'import/prefer-default-export': 'off', // too restrictive
    'max-len': ['warn', { code: 120 }],
    'multiline-comment-style': ['warn', 'bare-block'], // fix formatting license
    "no-param-reassign": [
      "error",
      {
        "props": true,
        "ignorePropertyModificationsFor": [
          "state",
          "dispatcherData"
        ]
      }
    ]
  },
  overrides: [
    {
      files: [ '**/*.ts', '**/*.vue', ],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: [
        '@typescript-eslint',
      ]
    },
    {
      files: [ '**/*.vue', ],
      extends: [
        'plugin:vue/recommended',
      ],
      plugins: [
        'vue',
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2018,
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
      },
      rules: {
        /**
         * Vue related rules
         * https://vuejs.github.io/eslint-plugin-vue/rules/#priority-a-essential-error-prevention
         */
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      }
    }
  ]
};
