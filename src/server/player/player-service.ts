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
		debug.profilebegin("Lifecycle_Player_Join");
		{
			for (const event of this.playerJoinEvents) {
				debug.profilebegin(event.id);
				{
					Promise.defer(() => event.event.onPlayerJoin(playerEntity)).catch(err => {
						this.logger.Error(err);
					});
				}

				debug.profileend();
			}
		}

		debug.profileend();

		this.onEntityFullyLoaded.Fire(playerEntity);
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
