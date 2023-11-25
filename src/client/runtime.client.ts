import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { $NODE_ENV } from "rbxts-transform-env";
import { GAME_NAME } from "shared/constants";
import { Environment } from "shared/environments";
import { setupLogger } from "shared/functions/setup-logger";

if ($NODE_ENV === Environment.Dev) {
	_G.__DEV__ = true;
	_G.__PROFILE__ = true;
}

setupLogger();
Log.Info(`${GAME_NAME} client version: ${game.PlaceVersion}`);

Modding.registerDependency<Logger>(ctor => {
	return Log.ForContext(ctor);
});

Flamework.addPaths("src/client");

Log.Info(`Flamework ignite!`);
Flamework.ignite();
