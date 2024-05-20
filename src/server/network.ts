import Log from "@rbxts/log";

import { $NODE_ENV } from "rbxts-transform-env";
import { GlobalEvents, GlobalFunctions } from "shared/network";

export const Events = GlobalEvents.createServer({
	warnOnInvalidGuards: $NODE_ENV === "development",
});
export const Functions = GlobalFunctions.createServer({
	warnOnInvalidGuards: $NODE_ENV === "development",
});

if ($NODE_ENV === "development") {
	GlobalEvents.registerHandler("onBadRequest", (player, message) => {
		Log.Warn(`Bad request from ${player.UserId}: ${message}`);
	});

	GlobalFunctions.registerHandler("onBadResponse", (player, message) => {
		Log.Warn(`Bad response from ${player.UserId}: ${message}`);
	});
}
