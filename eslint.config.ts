import style from "@isentinel/eslint-config";

export default style(
	{
		perfectionist: {
			customClassGroups: [
				"onInit",
				"onStart",
				"onPlayerJoin",
				"onPlayerLeave",
				"onRender",
				"onPhysics",
				"onTick",
			],
		},
		pnpm: true,
		react: true,
		rules: {
			"perfectionist/sort-objects": [
				"error",
				{
					customGroups: {
						id: "^id$",
						name: "^name$",
						callbacks: ["\b(on[A-Z][a-zA-Z]*)\b"],
						reactProps: ["^children$", "^ref$"],
						reflex: ["^loadPlayerData$", "^closePlayerData$"],
					},
					groups: ["id", "name", "reflex", "unknown", "reactProps"],
					order: "asc",
					partitionByComment: "^Part:\\*\\*(.*)$",
					type: "natural",
				},
			],
		},
		type: "game",
		typescript: {
			parserOptions: {
				project: "tsconfig.build.json",
			},
			tsconfigPath: "tsconfig.build.json",
		},
	},
	{
		files: ["src/client/ui/hooks/**/*", "src/client/ui/components/**/*"],
		rules: {
			"max-lines-per-function": "off",
		},
	},
);
