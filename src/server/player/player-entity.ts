import type { Janitor } from "@rbxts/janitor";
import type { Document } from "@rbxts/lapis";

import type { PlayerData } from "shared/store/persistent";

export default class PlayerEntity {
	/** The player's username. */
	public readonly name: string;
	/** A string representation of the player's UserId. */
	public readonly userId: string;

	constructor(
		public readonly player: Player,
		public readonly janitor: Janitor,
		public readonly document: Document<PlayerData>,
	) {
		this.name = player.Name;
		this.userId = tostring(player.UserId);
	}
}
