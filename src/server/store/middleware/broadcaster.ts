import type { BroadcastAction, ProducerMiddleware } from "@rbxts/reflex";
import { createBroadcaster } from "@rbxts/reflex";
import { Players } from "@rbxts/services";

import { $NODE_ENV } from "rbxts-transform-env";
import { Events } from "server/network";
import { IS_EDIT } from "shared/constants";
import type { SerializedSharedState, SharedState } from "shared/store";
import { slices, stateSerDes } from "shared/store";

export const ONCE_PER_MINUTE = 60;

export function broadcasterMiddleware(): ProducerMiddleware {
	// Storybook support
	if ($NODE_ENV === "development" && IS_EDIT) {
		return () => innerDispatch => innerDispatch;
	}

	const hydrated = new Set<number>();

	const broadcaster = createBroadcaster({
		beforeHydrate: beforeHydrate(hydrated),
		dispatch,
		hydrate,
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

function beforeHydrate(hydrated: Set<number>): (player: Player, state: SharedState) => SharedState {
	return (player: Player, state: SharedState) => {
		// The cast is necessary due to the typings of the reflex library.
		const serialized = stateSerDes.serialize(state) as unknown as SharedState;

		const isInitialHydrate = !hydrated.has(player.UserId);
		if (!isInitialHydrate) {
			return serialized;
		}

		hydrated.add(player.UserId);
		return serialized;
	};
}

function dispatch(player: Player, actions: Array<BroadcastAction>): void {
	Events.store.dispatch.fire(player, actions);
}

function hydrate(player: Player, state: SharedState): void {
	// The cast is necessary due to the typings of the reflex library.
	Events.store.hydrate.fire(player, state as unknown as SerializedSharedState);
}
