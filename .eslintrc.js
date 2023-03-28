module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier', 'plugin:jsdoc/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 14
  },
  plugins: ['prettier', 'jsdoc'],
  rules: {
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'no-console': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'arrow-body-style': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'jsdoc/valid-types': 'off',
    'no-alert': 'off'
  }
};
