import isentinel from "@isentinel/eslint-config";

export default isentinel({
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
});
