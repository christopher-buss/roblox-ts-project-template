import style, { GLOB_JS, GLOB_TSX } from "@isentinel/eslint-config";

export default style(
	{
		react: true,
		rules: {
			"perfectionist/sort-objects": [
				"warn",
				{
					"custom-groups": {
						id: "id",
						name: "name",
						reactProps: ["children", "ref"],
						reflex: ["loadPlayerData", "closePlayerData"],
					},
					groups: ["id", "name", "reflex", "unknown", "reactProps"],
					order: "asc",
					"partition-by-comment": "Part:**",
					type: "natural",
				},
			],
			"ts/no-magic-numbers": [
				"error",
				{
					ignore: [0, 1],
					ignoreEnums: true,
					ignoreReadonlyClassProperties: true,
					ignoreTypeIndexes: true,
				},
			],
		},
		typescript: {
			parserOptions: {
				project: "tsconfig.build.json",
			},
			tsconfigPath: "tsconfig.build.json",
		},
	},
	{
		ignores: [GLOB_JS],
	},
	{
		files: [GLOB_TSX],
		rules: {
			"ts/no-magic-numbers": "off",
		},
	},
);
