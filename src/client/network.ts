import Log from "@rbxts/log";

import { $NODE_ENV } from "rbxts-transform-env";
import { GlobalEvents, GlobalFunctions } from "shared/network";

export const Events = GlobalEvents.createClient({
	warnOnInvalidGuards: $NODE_ENV === "development",
});
export const Functions = GlobalFunctions.createClient({
	warnOnInvalidGuards: $NODE_ENV === "development",
});

// Log warnings for bad requests and responses in development
if ($NODE_ENV === "development") {
	GlobalEvents.registerHandler("onBadRequest", (player, message) => {
		Log.Warn(`Bad request from ${player.UserId}: ${message}`);
	});

	GlobalFunctions.registerHandler("onBadResponse", (player, message) => {
		Log.Warn(`Bad response from ${player.UserId}: ${message}`);
	});
}
