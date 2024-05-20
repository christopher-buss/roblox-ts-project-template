import { Dependency } from "@flamework/core";
import Log from "@rbxts/log";

import type PlayerService from "server/player/player-service";
import type { ServerResponse } from "types/interfaces/network";

import type PlayerEntity from "./player-entity";

let playerService: PlayerService | undefined;

/**
 * This method wraps a callback and replaces the first argument (that must be of
 * type `Player`) with that players `PlayerEntity` class. This is to be used
 * when responding to network events. If wrapping server-side events, you should
 * use `withPlayerEntity` from the `PlayerService` class.
 *
 * @param func - The callback to wrap.
 * @returns The server response.
 */
export default function withPlayerEntity<
	T extends Array<unknown>,
	R extends undefined | void = void,
>(
	func: (playerEntity: PlayerEntity, ...args: T) => R,
): (player: Player, ...args: T) => ServerResponse {
	if (!playerService) {
		playerService = Dependency<PlayerService>();
	}

	return (player: Player, ...args: T) => {
		// eslint-disable-next-line ts/no-non-null-assertion -- We check for this above.
		const entity = playerService!.getPlayerEntity(player);
		if (entity) {
			return identity<ServerResponse>({
				data: func(entity, ...args),
				success: true,
			});
		}

		Log.Error(
			`Unable to find entity for player ${player}, unable to call callback. Stacktrace: \n` +
				debug.traceback(),
		);

		return identity<ServerResponse>({
			error: "Internal error",
			success: false,
		});
	};
}
