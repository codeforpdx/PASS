module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react',
    'prettier',
    'jsdoc'
  ],
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
    'plugin:jsdoc/recommended'
  ],
  rules: {
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'no-param-reassign': ['error', { props: false }],
    'no-alert': 'off'
  },
  settings: {
    'jsdoc': {
      'mode': 'typescript'
    }
  }
};
