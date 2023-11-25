import { Service } from "@flamework/core";
import { Document, createCollection } from "@rbxts/lapis";
import { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { selectPlayerData } from "shared/store/selectors/players";
import { PlayerData, defaultPlayerData } from "shared/store/slices/players";
import KickCode from "types/enum/kick-reason";

import PlayerRemovalService from "../player-removal-service";
import { validate } from "./validate-data";

@Service({})
export default class PlayerDataService {
	private readonly collection = createCollection<PlayerData>("data", {
		defaultData: defaultPlayerData,
		validate: validate,
	});

	constructor(
		private readonly logger: Logger,
		private readonly playerRemovalService: PlayerRemovalService,
	) {}

	private async loadDefaultData(player: Player): Promise<void> {
		store.loadPlayerData(player.Name, defaultPlayerData);

		Promise.fromEvent(Players.PlayerRemoving, p => p === player)
			.then(() => {
				store.closePlayerData(player.Name);
			})
			.catch(err => {
				this.logger.Error(`Failed to close player data for ${player.Name}: ${err}`);
			});
	}

	public async loadPlayerData(player: Player): Promise<Document<PlayerData> | void> {
		if (player.UserId < 0) {
			return this.loadDefaultData(player);
		}

		try {
			const document = await this.collection.load(`${player.UserId}`);

			if (!player.IsDescendantOf(Players)) {
				return document.close();
			}

			const unsubscribe = store.subscribe(selectPlayerData(player.Name), data => {
				if (data) {
					document.write(data);
				}
			});

			void Promise.fromEvent(Players.PlayerRemoving, p => p === player).andThen(() => {
				void document.close();
				unsubscribe();
				store.closePlayerData(player.Name);
			});

			store.loadPlayerData(player.Name, document.read());
			return document;
		} catch (err) {
			this.logger.Warn(`Failed to load data for ${player.Name}: ${err}`);
			this.playerRemovalService.removeForBug(player, KickCode.PlayerProfileUndefined);
		}
	}
}
