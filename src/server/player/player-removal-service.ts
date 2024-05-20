import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";

import KickCode from "types/enum/kick-reason";

/** This handles removing the player from the game for various reasons. */
@Service({})
export default class PlayerRemovalService {
	constructor(private readonly logger: Logger) {}

	/**
	 * Removes a player from the server due to a bug.
	 *
	 * @param player - The player to remove.
	 * @param code - The reason the player was removed.
	 */
	public removeForBug(player: Player, code: KickCode): void {
		this.logger.Warn(`Removing ${player.UserId} due to bug: ${this.toMessage(code)}`);
		player.Kick(this.toMessage(code));
	}

	/**
	 * Returns a message corresponding to the given kick code.
	 *
	 * @param code - The kick code to generate a message for.
	 * @returns A message corresponding to the given kick code.
	 */
	public toMessage(code: KickCode): string {
		switch (code) {
			case KickCode.PlayerProfileUndefined: {
				return `Your player profile is undefined. Please rejoin the game.`;
			}
			case KickCode.PlayerProfileReleased: {
				return `Your player profile has been released. Please rejoin the game.`;
			}
			case KickCode.PlayerFullServer: {
				return `The server is full. Please try again later.`;
			}
			case KickCode.PlayerInstantiationError: {
				return `An error occurred while instantiating your player. Please rejoin the game.`;
			}
		}
	}
}
