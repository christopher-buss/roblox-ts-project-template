import { bundleRequire } from "bundle-require";

export default bundleRequire({
	filepath: "./eslint.config.ts",
}).then(require => require.mod.default);
