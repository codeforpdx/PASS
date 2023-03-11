module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 14
	},
	plugins: ['prettier'],
	rules: {
		'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
		'arrow-body-style': ['error', 'always'],
		'react/jsx-no-target-blank': 'off',
		'no-console': 'off',
		'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }]
	}
};
