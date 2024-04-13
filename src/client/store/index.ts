import { LogLevel } from "@rbxts/log";
import type { InferState } from "@rbxts/reflex";
import { combineProducers, loggerMiddleware } from "@rbxts/reflex";

import { $NODE_ENV } from "rbxts-transform-env";
import { LOG_LEVEL } from "shared/functions/setup-logger";
import { slices } from "shared/store";

import { receiverMiddleware } from "./middleware/receiver";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore(): typeof store {
	const store = combineProducers({
		...slices,
	});

	store.applyMiddleware(receiverMiddleware());

	// Log reflex actions only when verbose logging is enabled.
	if ($NODE_ENV === "development" && LOG_LEVEL === LogLevel.Verbose) {
		store.applyMiddleware(loggerMiddleware);
	}

	return store;
}

/**
 * The Reflex store for the application.
 *
 * @see https://littensy.github.io/reflex/
 */
export const store = createStore();
