import type { OnStart } from "@flamework/core";
import { Service } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import type { Document } from "@rbxts/lapis";
import type { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";

import { $NODE_ENV } from "rbxts-transform-env";
import PlayerEntity from "server/player/player-entity";
import type { PlayerData } from "shared/store/persistent";
import type { ListenerData } from "shared/util/flamework-util";
import { setupLifecycle } from "shared/util/flamework-util";
import { onPlayerAdded, promisePlayerDisconnected } from "shared/util/player-util";
import KickCode from "types/enum/kick-reason";

import type PlayerDataService from "./data/player-data-service";
import type PlayerRemovalService from "./player-removal-service";

const MAX_REMOVING_TIMEOUT = 5;

export interface OnPlayerJoin {
	/**
	 * Fires when a player joins the game and is fully initialized. The player
	 * is considered "fully initialized" once all of their data is loaded and
	 * their PlayerEntity class is fully setup. At which point, anything that
	 * implements this lifecycle event will be fired with the class.
	 */
	onPlayerJoin(player: PlayerEntity): void;
}

export interface OnPlayerLeave {
	/**
	 * Fires when a player leaves the game. This is called before the player is
	 * removed from the game and their PlayerEntity class is cleaned up. This
	 * means it is still safe to access player data before it is removed.
	 */
	onPlayerLeave(player: PlayerEntity): Promise<void> | void;
}

/** A service that manages player entities in the game. */
@Service({})
export default class PlayerService implements OnStart {
	private readonly playerLeaveEvents = new Array<ListenerData<OnPlayerLeave>>();
	private readonly onEntityJoined = new Signal<(playerEntity: PlayerEntity) => void>();
	private readonly onEntityRemoving = new Signal();
	private readonly playerEntities = new Map<Player, PlayerEntity>();
	private readonly playerJoinEvents = new Array<ListenerData<OnPlayerJoin>>();

	constructor(
		private readonly logger: Logger,
		private readonly playerDataService: PlayerDataService,
		private readonly playerRemovalService: PlayerRemovalService,
	) {}

	/** @ignore */
	public onStart(): void {
		setupLifecycle<OnPlayerJoin>(this.playerJoinEvents);
		setupLifecycle<OnPlayerLeave>(this.playerLeaveEvents);

		onPlayerAdded(player => {
			this.onPlayerJoin(player).catch(err => {
				this.logger.Error(`Failed to load player ${player.UserId}: ${err}`);
			});
		});

		Players.PlayerRemoving.Connect(
			this.withPlayerEntity(playerEntity => {
				this.onPlayerRemoving(playerEntity).catch(err => {
					this.logger.Error(`Failed to close player ${playerEntity.userId}: ${err}`);
				});
			}),
		);

		this.bindHoldServerOpen();
	}

	/**
	 * Returns an array of all `PlayerEntity` instances associated with players
	 * that have joined the game.
	 *
	 * @returns An array of `PlayerEntity` instances.
	 */
	public getPlayerEntities(): Array<PlayerEntity> {
		return Object.values(this.playerEntities);
	}

	/**
	 * Gets the `PlayerEntity` object for a given player.
	 *
	 * @param player - The `Player` instance to get the `PlayerEntity` for.
	 * @returns The `PlayerEntity` instance associated with the given `Player`,
	 *   if any.
	 */
	public getPlayerEntity(player: Player): PlayerEntity | undefined {
		return this.playerEntities.get(player);
	}

	/**
	 * Retrieves the player entity asynchronously. This method will reject if
	 * the player disconnects before the entity is created.
	 *
	 * @param player - The player object.
	 * @returns A promise that resolves to the player entity, or undefined if
	 *   not found.
	 */
	public async getPlayerEntityAsync(player: Player): Promise<PlayerEntity | undefined> {
		const potentialEntity = this.getPlayerEntity(player);
		if (potentialEntity) {
			return potentialEntity;
		}

		const promise = Promise.fromEvent(
			this.onEntityJoined,
			(playerEntity: PlayerEntity) => playerEntity.player === player,
		);

		// eslint-disable-next-line promise/always-return -- This is the last callback
		const disconnect = promisePlayerDisconnected(player).then(() => {
			promise.cancel();
		});

		const [success, playerEntity] = promise.await();
		if (!success) {
			throw `Player ${player.UserId} disconnected before entity was created`;
		}

		disconnect.cancel();

		return playerEntity;
	}

	/**
	 * This method wraps a callback and replaces the first argument (that must
	 * be of type `Player`) with that players `PlayerEntity` class.
	 *
	 * @param func - The callback to wrap.
	 * @returns A new callback that replaces the first argument with the
	 *   player's `PlayerEntity` class.
	 */
	public withPlayerEntity<T extends Array<unknown>, R = void>(
		func: (playerEntity: PlayerEntity, ...args: T) => R,
	) {
		return (player: Player, ...args: T): R | undefined => {
			const playerEntity = this.getPlayerEntity(player);
			if (!playerEntity) {
				this.logger.Error(
					`No entity for player ${player.UserId}, cannot continue to callback`,
				);
				return;
			}

			return func(playerEntity, ...args);
		};
	}

	/**
	 * Called internally when a player joins the game.
	 *
	 * @param player - The player that joined the game.
	 */
	private async onPlayerJoin(player: Player): Promise<void> {
		const playerDocument = await this.playerDataService.loadPlayerData(player);
		if (!playerDocument) {
			this.playerRemovalService.removeForBug(player, KickCode.PlayerInstantiationError);
			return;
		}

		const janitor = this.setupPlayerJanitor(player, playerDocument);
		const playerEntity = new PlayerEntity(player, janitor, playerDocument);
		this.playerEntities.set(player, playerEntity);

		// Call all connected lifecycle events
		debug.profilebegin("Lifecycle_Player_Join");
		{
			for (const { id, event } of this.playerJoinEvents) {
				Promise.defer(() => {
					debug.profilebegin(id);
					event.onPlayerJoin(playerEntity);
				}).catch(err => {
					this.logger.Error(`Error in player lifecycle ${id}: ${err}`);
				});
			}
		}

		debug.profileend();

		this.logger.Info(`Player ${player.UserId} joined the game.`);

		this.onEntityJoined.Fire(playerEntity);
	}

	private setupPlayerJanitor(player: Player, playerDocument: Document<PlayerData>): Janitor {
		const janitor = new Janitor();
		janitor.Add(async () => {
			this.logger.Info(`Player ${player.UserId} leaving game, cleaning up Janitor`);

			try {
				await playerDocument.close();
			} catch (err) {
				this.logger.Error(`Failed to close player document for ${player.UserId}: ${err}`);
			}

			this.playerEntities.delete(player);
			this.onEntityRemoving.Fire();
		});

		return janitor;
	}

	/**
	 * Called internally when a player is removed from the game. We hold the
	 * PlayerEntity until all lifecycle events have been called, so that we can
	 * access player data on player leaving if required.
	 *
	 * @param playerEntity - The player entity associated with the player.
	 */
	private async onPlayerRemoving(playerEntity: PlayerEntity): Promise<void> {
		// Call all connected lifecycle events
		const promises = new Array<Promise<void>>();
		debug.profilebegin("Lifecycle_Player_Leave");
		{
			for (const { id, event } of this.playerLeaveEvents) {
				promises.push(
					Promise.defer(() => {
						debug.profilebegin(id);
						return Promise.resolve(event.onPlayerLeave(playerEntity)).await();
					}),
				);
			}
		}

		debug.profileend();

		// We ensure that all lifecycle events are called before we continue
		// since we may need to access player data in these events.
		const lifecycles = Promise.all(promises).catch(err => {
			this.logger.Error(`Error in player leave lifecycle event:\n${err}`);
		});

		// If we're in development, we want to warn if the lifecycle events take
		// too long to complete. This is to ensure that we don't have any
		// blocking code in these events.
		if ($NODE_ENV === "development") {
			lifecycles.timeout(MAX_REMOVING_TIMEOUT).catch(() => {
				this.logger.Fatal(
					`Player lifecycle events for ${playerEntity.userId} took too long. Please ` +
						`ensure that lifecycle events do not take too long to complete.`,
				);
			});
		}

		await lifecycles;
		playerEntity.janitor.Destroy();
	}

	private bindHoldServerOpen(): void {
		// We want to hold the server open until all PlayerEntities are cleaned
		// up and removed.
		game.BindToClose(() => {
			// We don't want to hold the server open in development
			if ($NODE_ENV !== "production") {
				return;
			}

			this.logger.Debug(`Game closing, holding open until all player entities are removed.`);

			while (!this.playerEntities.isEmpty()) {
				this.onEntityRemoving.Wait();
			}

			this.logger.Debug(`All player entities removed, closing game.`);
		});
	}
}
