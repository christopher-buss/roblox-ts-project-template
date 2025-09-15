import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"header-max-length": [RuleConfigSeverity.Error, "always", 72],
		"scope-enum": [
			RuleConfigSeverity.Error,
			"always",
			["core", "deps", "dev", "lint", "ui", "audio", "assets", "mtx"],
		],
	},
} satisfies UserConfig;
