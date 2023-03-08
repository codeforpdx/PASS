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
		'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
		'arrow-body-style': ['error', 'always'],
		'react/jsx-no-target-blank': 0,
		'no-console': 0,
		'label-has-associated-control': 0,
		'no-nested-ternary': 'error'
	}
};
