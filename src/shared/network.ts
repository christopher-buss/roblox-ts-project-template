import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";

import type { SharedState } from "./store";

/** Fired by client to server. */
interface ClientToServerEvents {
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
		hydrate: (state: SharedState) => void;
	};
}

// eslint-disable-next-line ts/no-empty-interface -- This is a placeholder for future functions.
interface ClientToServerFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<
	ClientToServerFunctions,
	NonNullable<unknown>
>();
