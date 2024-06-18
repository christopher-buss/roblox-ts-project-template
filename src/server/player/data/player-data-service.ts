import { Service } from "@flamework/core";
import type { Collection, Document } from "@rbxts/lapis";
import { createCollection, setConfig } from "@rbxts/lapis";
import DataStoreServiceMock from "@rbxts/lapis-mockdatastore";
import type { Logger } from "@rbxts/log";
import { Players, RunService } from "@rbxts/services";

import { $NODE_ENV } from "rbxts-transform-env";
import { store } from "server/store";
import { selectPlayerData } from "shared/store/persistent/persistent-selectors";
import type { PlayerData } from "shared/store/persistent/persistent-slice";
import { defaultPlayerData } from "shared/store/persistent/persistent-slice";
import KickCode from "types/enum/kick-reason";

import type PlayerRemovalService from "../player-removal-service";
import { validate } from "./validate-data";

const DATA_STORE_NAME = RunService.IsStudio() ? "Development" : "Production";

/**
 * Service for loading and saving player data. This service is responsible for
 * loading player data when a player joins the game, and hooking up reflex data
 * changes to the player's data document in the data store.
 */
@Service({})
export default class PlayerDataService {
	private readonly collection: Collection<PlayerData>;

	constructor(
		private readonly logger: Logger,
		private readonly playerRemovalService: PlayerRemovalService,
	) {
		if ($NODE_ENV === "development" && RunService.IsStudio()) {
			setConfig({
				dataStoreService: new DataStoreServiceMock(),
			});
		}

		this.collection = createCollection<PlayerData>(DATA_STORE_NAME, {
			defaultData: defaultPlayerData,
			validate,
		});
	}

	/**
	 * Loads the player data for the given player.
	 *
	 * @param player - The player to load data for.
	 * @returns The player data document if it was loaded successfully.
	 */
	public async loadPlayerData(player: Player): Promise<Document<PlayerData> | void> {
		try {
			const document = await this.collection.load(`${player.UserId}`, [player.UserId]);

			if (!player.IsDescendantOf(Players)) {
				await document.close();
				return;
			}

			const unsubscribe = store.subscribe(selectPlayerData(tostring(player.UserId)), data => {
				if (data) {
					document.write(data);
				}
			});

			document.beforeClose(() => {
				unsubscribe();
				store.closePlayerData(tostring(player.UserId));
			});

			store.loadPlayerData(tostring(player.UserId), document.read());

			return document;
		} catch (err) {
			this.logger.Warn(`Failed to load data for ${player.Name}: ${err}`);
			this.playerRemovalService.removeForBug(player, KickCode.PlayerProfileUndefined);
		}
	}
}
