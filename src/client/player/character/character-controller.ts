import type { OnStart } from "@flamework/core";
import { Controller } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import Signal from "@rbxts/signal";
import { promiseTree } from "@rbxts/validate-tree";

import { LocalPlayer } from "client/constants";
import {
	CHARACTER_LOAD_TIMEOUT,
	type CharacterRig,
	characterSchema,
	onCharacterAdded,
} from "shared/util/player-util";

/**
 * A controller for managing the current character rig in the game. We verify
 * that the character rig is loaded and fully exists according to the schema
 * before we allow any other systems to interact with it. It is advised to use
 * this controller when interacting with specific parts of the character rig,
 * rather than directly accessing the character model through
 * `player.Character`.
 */
@Controller({})
export default class CharacterController implements OnStart {
	private currentCharacter?: CharacterRig;

	public readonly onCharacterAdded = new Signal<(character: CharacterRig) => void>();
	public readonly onCharacterRemoving = new Signal();

	constructor(private readonly logger: Logger) {}

	/** @ignore */
	public onStart(): void {
		onCharacterAdded(LocalPlayer, character => {
			this.characterAdded(character).catch(err => {
				this.logger.Fatal(`Could not get character rig because:\n${err}`);
			});
		});
	}

	/**
	 * Gets the current character for the local player. This is the character
	 * that has been loaded and exists according to the character schema.
	 *
	 * @returns The current character rig if it exists.
	 */
	public getCurrentCharacter(): CharacterRig | undefined {
		return this.currentCharacter;
	}

	/**
	 * Ensures that a character model is loaded and exists according to the
	 * schema. If the character model is removed before it loads, or if it fails
	 * to load within the timeout, the promise will reject.
	 *
	 * @param model - The model to load the character rig from.
	 * @returns A promise that resolves when the character rig is loaded.
	 */
	private async characterAdded(model: Model): Promise<void> {
		const promise = promiseTree(model, characterSchema);

		// If our character fails to load, we want to cancel the promise
		const timeout = task.delay(CHARACTER_LOAD_TIMEOUT, () => {
			promise.cancel();
		});

		// If our character is removed before it loads, we want to cancel.
		const connection = model.AncestryChanged.Connect(() => {
			if (model.IsDescendantOf(game)) {
				return;
			}

			promise.cancel();
		});

		const [success, rig] = promise.await();
		coroutine.close(timeout);
		connection.Disconnect();

		if (!success) {
			throw "Character failed to load.";
		}

		this.listenForCharacterRemoving(model);
		this.onRigLoaded(rig);
	}

	/**
	 * Listens for the character model to be removed from the game.
	 *
	 * @param character - The character model to listen for removal on.
	 */
	private listenForCharacterRemoving(character: Model): void {
		const connection = character.AncestryChanged.Connect(() => {
			if (character.IsDescendantOf(game)) {
				return;
			}

			this.logger.Verbose(`Character has been removed.`);

			connection.Disconnect();
			this.currentCharacter = undefined;
			this.onCharacterRemoving.Fire();
		});
	}

	/**
	 * Called when the character rig has been fully loaded.
	 *
	 * @param rig - The character rig that was loaded.
	 */
	private onRigLoaded(rig: CharacterRig): void {
		this.logger.Debug(`Loaded character rig.`);
		this.currentCharacter = rig;
		this.onCharacterAdded.Fire(rig);
	}
}
