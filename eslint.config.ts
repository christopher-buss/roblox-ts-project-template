import style, { GLOB_TS } from "@isentinel/eslint-config";

export default style(
	{
		react: true,
		rules: {
			"perfectionist/sort-objects": [
				"warn",
				{
					customGroups: {
						id: "id",
						name: "name",
						reactProps: ["children", "ref"],
						reflex: ["loadPlayerData", "closePlayerData"],
					},
					groups: ["id", "name", "reflex", "unknown", "reactProps"],
					order: "asc",
					partitionByComment: "Part:**",
					type: "natural",
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
		files: [GLOB_TS],
		rules: {
			"no-param-reassign": "error",
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
	},
	{
		files: ["src/client/ui/hooks/**/*"],
		rules: {
			"max-lines-per-function": "off",
		},
	},
);
