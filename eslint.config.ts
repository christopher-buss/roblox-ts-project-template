import style from "@isentinel/eslint-config";

import prettierrc from "./.prettierrc.config.ts";

export default style(
	{
		formatters: {
			markdown: true,
			prettierOptions: prettierrc,
		},
		gitignore: true,
		markdown: true,
		react: true,

		rules: {
			"jsdoc/check-param-names": ["warn", { checkDestructured: false }],

			"jsdoc/require-param": ["warn", { checkDestructured: false }],
			"perfectionist/sort-objects": [
				"warn",
				{
					"custom-groups": {
						id: "id",
						name: "name",
						ga: "progressionStatus",
						"react-props": ["children", "ref"],
						reflex: ["loadPlayerData", "closePlayerData"],
					},
					groups: ["id", "name", "reflex", "ga", "unknown", "react-props"],
					order: "asc",
					"partition-by-comment": "Part:**",
					type: "natural",
				},
			],

			"ts/no-magic-numbers": [
				"error",
				{
					ignore: [0, 1],
					ignoreReadonlyClassProperties: true,
					ignoreTypeIndexes: true,
				},
			],
		},
		toml: true,
		typescript: {
			parserOptions: {
				ecmaVersion: 2018,
				jsx: true,
				project: "tsconfig.build.json",
				sourceType: "module",
				useJSXTextNode: true,
			},
			tsconfigPath: "tsconfig.build.json",
		},
	},
	{
		ignores: ["*.js"],
	},
	{
		files: ["**/*.tsx"],
		rules: {
			"ts/no-magic-numbers": "off",
		},
	},
);
