module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'../.eslintrc.js'
	],
	rules: {
		"@typescript-eslint/indent": ["error", 'tab'],
		"@typescript-eslint/no-explicit-any": [0],
		"@typescript-eslint/no-use-before-define": [0]
	}
};
