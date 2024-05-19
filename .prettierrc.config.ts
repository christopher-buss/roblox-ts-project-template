import type { Options } from "prettier";

export default {
	arrowParens: "avoid",
	jsdocPreferCodeFences: true,
	jsdocPrintWidth: 80,
	plugins: ["prettier-plugin-jsdoc"],
	printWidth: 100,
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	trailingComma: "all",
	tsdoc: true,
	useTabs: true,
} satisfies Options;
