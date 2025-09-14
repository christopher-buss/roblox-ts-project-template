import isentinel, { GLOB_SRC, GLOB_YAML } from "@isentinel/eslint-config";

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
					groups: ["id", "name", "reflex", "unknown", "reactProps"],
					order: "asc",
					partitionByComment: "^Part:\\*\\*(.*)$",
					type: "natural",
				},
			],
		},
	},
	{
		name: "isentinel/sort/github-composite-actions",
		files: [`.github/actions/${GLOB_YAML}`],
		rules: {
			"yaml/sort-keys": [
				"error",
				// Composite action root
				{
					order: ["name", "description", "inputs", "outputs", "runs"],
					pathPattern: "^$",
				},
				// Composite inputs
				{
					order: ["description", "required", "default"],
					pathPattern: "^inputs\\.[^.]+$",
				},
				// Composite outputs
				{
					order: ["description", "value"],
					pathPattern: "^outputs\\.[^.]+$",
				},
				// Composite runs
				{
					order: ["using", "steps"],
					pathPattern: "^runs$",
				},
				// Composite steps
				{
					order: [
						"id",
						"if",
						"name",
						"uses",
						"run",
						"working-directory",
						"with",
						"env",
						"shell",
						"continue-on-error",
						"timeout-minutes",
					],
					pathPattern: "^runs\\.steps\\[\\d+\\]$",
				},
				// General nested key sorting for everything else
				{
					order: { type: "asc" },
					pathPattern:
						"^(?!^$|inputs\\.[^.]+$|outputs\\.[^.]+$|runs$|runs\\.steps\\[\\d+\\]$).*$",
				},
			],
		},
	},
);
