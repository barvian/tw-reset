/** @type {import('prettier').Config} */
module.exports = {
	useTabs: true,
	singleQuote: true,
	semi: false,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: ['README.md'],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		}
	]
}
