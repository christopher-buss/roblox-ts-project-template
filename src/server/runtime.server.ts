import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { GAME_NAME } from "shared/constants";
import { setupLogger } from "shared/functions/setup-logger";

setupLogger();
Log.Info(`${GAME_NAME} is starting up!`);

Modding.registerDependency<Logger>(ctor => {
	return Log.ForContext(ctor);
});

Flamework.addPaths("src/server");

Log.Info(`Flamework ignite!`);
Flamework.ignite();
