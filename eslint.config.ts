import isentinel, { GLOB_SRC } from "@isentinel/eslint-config";

export default isentinel(
	{
		name: "project/base",
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
		type: "game",
	},
	{
		name: "project/sort",
		files: [GLOB_SRC],
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
					groups: ["id", "name", "reflex", "unknown", "reactProps", "callbacks"],
					order: "asc",
					partitionByComment: "^Part:\\*\\*(.*)$",
					type: "natural",
				},
			],
		},
	},
);
