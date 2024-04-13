import { combineProducers } from "@rbxts/reflex";

import { balanceSlice } from "./balance";
import { mtxSlice } from "./mtx";
import { settingsSlice } from "./settings";

export * from "./balance";
export * from "./default-data";
export * from "./mtx";
export * from "./settings";

export const persistentSlice = combineProducers({
	balance: balanceSlice,
	mtx: mtxSlice,
	settings: settingsSlice,
});
