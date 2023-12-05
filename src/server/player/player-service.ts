import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";
import KickCode from "types/enum/kick-reason";

import PlayerDataService from "./data/player-data-service";
import PlayerRemovalService from "./player-removal-service";

@Service({})
export default class PlayerService implements OnStart {
	constructor(
		private readonly logger: Logger,
		private readonly playerDataService: PlayerDataService,
		private readonly playerRemovalService: PlayerRemovalService,
	) {}
	private async onPlayerJoin(player: Player): Promise<void> {
		const playerDocument = await this.playerDataService.loadPlayerData(player);
		if (!playerDocument) {
			this.playerRemovalService.removeForBug(player, KickCode.PlayerInstantiationError);
			return;
		}

		// Call all connected lifecycle events
		// Debug.profilebegin("Lifecycle_Player_Join");
		// {
		// 	For (const event of this.playerJoinEvents) {
		// 		Debug.profilebegin(event.id);
		// 		{
		// Promise.defer(() => event.event.onPlayerJoin(playerEntity)).catch(err =>
		// { this.logger.Error(err); }); }

		// 		Debug.profileend();
		// 	}
		// }

		// Debug.profileend();

		// This.onEntityFullyLoaded.Fire(playerEntity);
	}

	/** @hidden */
	public onStart(): void {
		Players.PlayerAdded.Connect(player => {
			this.onPlayerJoin(player).catch(err => {
				this.logger.Error(`Failed to load player ${player.Name}: ${err}`);
			});
		});

		for (const player of Players.GetPlayers()) {
			task.spawn(() => {
				this.onPlayerJoin(player).catch(err => {
					this.logger.Error(`Failed to load player ${player.Name}: ${err}`);
				});
			});
		}
	}
}
