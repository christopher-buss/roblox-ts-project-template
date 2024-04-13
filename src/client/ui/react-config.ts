import { $NODE_ENV } from "rbxts-transform-env";

export function reactConfig(): void {
	if ($NODE_ENV !== "development") {
		return;
	}

	_G.__DEV__ = true;
	_G.__PROFILE__ = true;

	void import("client/ui/functions/profiler").then(({ profileAllComponents }) => {
		profileAllComponents();
	});
}
