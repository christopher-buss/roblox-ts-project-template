import type { OnStart } from "@flamework/core";
import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import { PhysicsService } from "@rbxts/services";
import { promiseTree } from "@rbxts/validate-tree";

import type PlayerEntity from "server/player/player-entity";
import type { ListenerData } from "shared/util/flamework-util";
import { setupLifecycle } from "shared/util/flamework-util";
import { addToCollisionGroup } from "shared/util/physics-util";
import {
	CHARACTER_LOAD_TIMEOUT,
	type CharacterRig,
	characterSchema,
	loadCharacter,
	onCharacterAdded,
} from "shared/util/player-util";
import CollisionGroup from "types/enum/collision-group";
import Tag from "types/enum/tag";

import type { OnPlayerJoin } from "../player-service";

PhysicsService.RegisterCollisionGroup(CollisionGroup.Character);

export interface OnCharacterAdded {
	/** Fires when a character is added to the game. */
	onCharacterAdded(character: CharacterRig, playerEntity: PlayerEntity): void;
}

/**
 * A service for managing character rigs in the game. This service listens for
 * when a player's character is added to the game and ensures that the character
 * rig is loaded and fully exists according to the schema before allowing any
 * other systems to interact with it. We also handle retries for loading the
 * character rig in case it fails to load.
 */
@Service({})
export default class CharacterService implements OnStart, OnPlayerJoin {
	private readonly characterAddedEvents = new Array<ListenerData<OnCharacterAdded>>();
	private readonly characterRigs = new Map<Player, CharacterRig>();

	constructor(private readonly logger: Logger) {}

	/** @ignore */
	public onStart(): void {
		setupLifecycle<OnCharacterAdded>(this.characterAddedEvents);
	}

	/** @ignore */
	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { janitor, player } = playerEntity;

		janitor.Add(
			onCharacterAdded(player, character => {
				this.characterAdded(playerEntity, character).catch(err => {
					this.logger.Fatal(`Could not get character rig because:\n${err}`);
				});
			}),
		);
	}

	/**
	 * Returns the character rig associated with the given player, if it exists.
	 *
	 * @param player - The player whose character rig to retrieve.
	 * @returns The character rig associated with the player, or undefined if it
	 *   does not exist.
	 */
	public getCharacterRig(player: Player): CharacterRig | undefined {
		return this.characterRigs.get(player);
	}

	/**
	 * This method wraps a callback and replaces the first argument (that must
	 * be of type `Player`) with that players `character rig`.
	 *
	 * @param func - The callback to wrap.
	 * @returns A new callback that replaces the first argument with the
	 *   player's character rig.
	 */
	public withPlayerRig<T extends Array<unknown>, R = void>(
		func: (playerRig: CharacterRig, ...args: T) => R,
	) {
		return (player: Player, ...args: T): R | undefined => {
			const playerRig = this.getCharacterRig(player);
			if (!playerRig) {
				this.logger.Info(`Could not get character rig for ${player.UserId}`);
				return;
			}

			return func(playerRig, ...args);
		};
	}

	private async characterAdded(playerEntity: PlayerEntity, model: Model): Promise<void> {
		const promise = promiseTree(model, characterSchema);

		const { player } = playerEntity;

		// If our character fails to load, we want to cancel the promise and
		// attempt to load it again.
		const timeout = Promise.delay(CHARACTER_LOAD_TIMEOUT).then(async () => {
			promise.cancel();
			return this.retryCharacterLoad(player);
		});

		// If our character is removed before it loads, we want to cancel.
		const connection = model.AncestryChanged.Connect(() => {
			if (model.IsDescendantOf(game)) {
				return;
			}

			promise.cancel();
		});

		const [success, rig] = promise.await();
		timeout.cancel();
		connection.Disconnect();

		if (!success) {
			throw `Could not get character rig for ${player.UserId}`;
		}

		this.listenForCharacterRemoving(player, model);
		this.onRigLoaded(playerEntity, rig);
	}

	private listenForCharacterRemoving(player: Player, character: Model): void {
		const connection = character.AncestryChanged.Connect(() => {
			if (character.IsDescendantOf(game)) {
				return;
			}

			this.logger.Verbose(`Character ${character.GetFullName()} has been removed.`);

			connection.Disconnect();
			this.characterRemoving(player);
		});
	}

	private onRigLoaded(playerEntity: PlayerEntity, rig: CharacterRig): void {
		const { name, player } = playerEntity;

		addToCollisionGroup(rig, CollisionGroup.Character);
		rig.AddTag(Tag.PlayerCharacter);
		this.characterRigs.set(player, rig);

		this.logger.Debug(`Loaded character rig for ${name}`);

		debug.profilebegin("Lifecycle_Character_Added");
		{
			for (const { id, event } of this.characterAddedEvents) {
				Promise.defer(() => {
					debug.profilebegin(id);
					event.onCharacterAdded(rig, playerEntity);
				}).catch(err => {
					this.logger.Error(`Error in character lifecycle ${id}: ${err}`);
				});
			}
		}

		debug.profileend();

		this.characterAppearanceLoaded(player, rig).catch(err => {
			this.logger.Info(`Character appearance did not load for`, player, err);
		});
	}

	private async characterAppearanceLoaded(player: Player, rig: CharacterRig): Promise<void> {
		if (!player.HasAppearanceLoaded()) {
			await Promise.fromEvent(player.CharacterAppearanceLoaded).timeout(
				CHARACTER_LOAD_TIMEOUT,
			);
		}

		rig.Head.AddTag(Tag.PlayerHead);
	}

	private characterRemoving(player: Player): void {
		this.characterRigs.delete(player);
	}

	private async retryCharacterLoad(player: Player): Promise<void> {
		this.logger.Warn(`Getting full rig for ${player.UserId} timed out. Retrying...`);
		return loadCharacter(player);
	}
}
