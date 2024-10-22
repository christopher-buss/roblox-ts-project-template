import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";

import type { GamePass } from "types/enum/mtx";

import type { SerializedSharedState } from "./store";

/** Fired by client to server. */
interface ClientToServerEvents {
	mtx: {
		/**
		 * Sets the active state of a game pass, which is used to determine if a
		 * game pass is "on" for a player. E.g. If a player has a game pass for
		 * toggling increased walk speed, this would be used to turn that on or
		 * off.
		 *
		 * @param gamePass - The game pass to set the active state of.
		 * @param active - The active state to set the game pass to.
		 */
		setGamePassActive: (gamePass: GamePass, active: boolean) => void;
	};
	store: {
		/**
		 * Called by the client when they are ready to receive data from the
		 * server.
		 */
		start: () => void;
	};
}

/** Fired by server to client. */
interface ServerToClientEvents {
	store: {
		/**
		 * Sends state updates to the client.
		 *
		 * @param actions - The actions to send to the client.
		 */
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (state: SerializedSharedState) => void;
	};
}

type ClientToServerFunctions = object;

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<
	ClientToServerFunctions,
	NonNullable<unknown>
>();
