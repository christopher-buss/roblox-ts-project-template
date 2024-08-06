import type { ProfilerOnRenderCallback } from "@rbxts/react";

import { $NODE_ENV } from "rbxts-transform-env";

export function reactConfig(): void {
	if ($NODE_ENV !== "development") {
		return;
	}

	_G.__DEV__ = true;
	_G.__PROFILE__ = false;

	// Avoid implicit React import before setting the __DEV__ flag
	void import("client/ui/functions/profiler").then(({ profileAllComponents }) => {
		profileAllComponents();
	});
}

export async function createApp(): Promise<void> {
	// Avoid implicit React import before setting the __DEV__ flag
	const React = await import("@rbxts/react");
	const { App } = await import("client/ui/app");
	const { mount } = await import("client/ui/functions");

	mount({ key: "app", children: <App /> });
}

export const onRenderProfiler: ProfilerOnRenderCallback = (
	...args: Parameters<ProfilerOnRenderCallback>
) => {
	const [id, phase, actualDuration, baseDuration, startTime, commitTime, interactions] = args;
	print(
		`id: ${id}, phase: ${phase}, actualDuration: ${actualDuration}, baseDuration: ${baseDuration}, startTime: ${startTime}, commitTime: ${commitTime}, interactions: ${interactions}`,
	);
};
