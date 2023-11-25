import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";

/** Fired by client to server. */
interface ServerEvents {
	/**
	 * Called by the client when they are ready to receive data from the
	 * server.
	 */
	start: () => void;
}

/** Fired by server to client. */
interface ClientEvents {
	/**
	 * Sends state updates to the client.
	 * @param actions The actions to send to the client.
	 */
	broadcast: (actions: Array<BroadcastAction>) => void;
}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
