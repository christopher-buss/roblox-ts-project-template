import style from "@isentinel/eslint-config";

export default style({
	formatters: true,
	gitignore: true,
	react: true,

	rules: {
		// "jsdoc/require-jsdoc": [
		// 	"warn",
		// 	{
		// 		checkConstructors: false,
		// 		publicOnly: true,
		// 		require: {
		// 			ClassDeclaration: true,
		// 			ClassExpression: true,
		// 			MethodDefinition: true,
		// 		},
		// 	},
		// ],

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
});
