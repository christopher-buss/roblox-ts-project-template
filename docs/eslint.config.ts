import style, { GLOB_JS } from "@isentinel/eslint-config";

export default style(
	{
		formatters: {
			css: true,
			markdown: true,
			prettierOptions: {
				arrowParens: "avoid",
				printWidth: 100,
				semi: true,
				singleQuote: false,
				tabWidth: 4,
				trailingComma: "all",
				useTabs: true,
			},
		},
		gitignore: true,
		react: true,
		roblox: false,
		toml: true,
		typescript: {
			parserOptions: {
				ecmaVersion: 2020,
				jsx: true,
				project: "./tsconfig.json",
				sourceType: "module",
				useJSXTextNode: true,
			},
			tsconfigPath: "./tsconfig.json",
		},
	},
	{
		ignores: [GLOB_JS],
	},
);
