import type { InferState } from "@rbxts/reflex";
import { combineProducers } from "@rbxts/reflex";

import { $NODE_ENV } from "rbxts-transform-env";
import { slices } from "shared/store";
import { profilerMiddleware } from "shared/store/middleware/profiler";

import { broadcasterMiddleware } from "./middleware/broadcaster";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore(): typeof store {
	const store = combineProducers({
		...slices,
	});

	store.applyMiddleware(broadcasterMiddleware());

	if ($NODE_ENV === "development") {
		store.applyMiddleware(profilerMiddleware);
	}

	return store;
}

/**
 * The Reflex store for the application.
 *
 * @see https://littensy.github.io/reflex/
 */
export const store = createStore();
