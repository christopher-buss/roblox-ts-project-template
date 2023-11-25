// Move this somewhere else.

import { AnyEntity } from "@rbxts/matter";

export interface ClientState {
	debugEnabled: boolean;
	entityIdMap: Map<string, AnyEntity>;
}
