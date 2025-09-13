// Skip Husky install in production and CI
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
	process.exit(0);
}

const { default: husky } = await import("husky");
console.log(husky());
