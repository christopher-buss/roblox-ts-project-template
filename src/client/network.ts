import Log from "@rbxts/log";

import { $NODE_ENV } from "rbxts-transform-env";
import { GLOBAL_EVENTS, GLOBAL_FUNCTIONS } from "shared/network";

export const events = GLOBAL_EVENTS.createClient({
	warnOnInvalidGuards: $NODE_ENV === "development",
});
export const functions = GLOBAL_FUNCTIONS.createClient({
	warnOnInvalidGuards: $NODE_ENV === "development",
});

// Log warnings for bad requests and responses in development
if ($NODE_ENV === "development") {
	GLOBAL_EVENTS.registerHandler("onBadRequest", (player, message) => {
		Log.Warn(`Bad request from ${player.UserId}: ${message}`);
	});

	GLOBAL_FUNCTIONS.registerHandler("onBadResponse", (player, message) => {
		Log.Warn(`Bad response from ${player.UserId}: ${message}`);
	});
}
