import type { ProducerMiddleware } from "@rbxts/reflex";
import { createBroadcaster } from "@rbxts/reflex";
import { Players, RunService } from "@rbxts/services";

import { Events } from "server/network";
import { slices } from "shared/store";

export const ONCE_PER_MINUTE = 60;

export function broadcasterMiddleware(): ProducerMiddleware {
	// If in edit mode (for storybook support), return a no-op middleware.
	if (RunService.IsStudio() && !RunService.IsRunning()) {
		return () => dispatch => dispatch;
	}

	const hydrated = new Set<number>();

	const broadcaster = createBroadcaster({
		beforeHydrate: (player, state) => {
			const isInitialHydrate = !hydrated.has(player.UserId);
			if (isInitialHydrate) {
				hydrated.add(player.UserId);
				return state;
			}

			return state;
		},
		dispatch: (player, actions) => {
			Events.store.dispatch.fire(player, actions);
		},
		hydrate: (player, state) => {
			Events.store.hydrate.fire(player, state);
		},
		hydrateRate: ONCE_PER_MINUTE,
		producers: slices,
	});

	Events.store.start.connect(player => {
		broadcaster.start(player);
	});

	Players.PlayerRemoving.Connect(player => {
		hydrated.delete(player.UserId);
	});

	return broadcaster.middleware;
}
