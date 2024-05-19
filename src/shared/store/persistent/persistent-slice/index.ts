import { combineProducers } from "@rbxts/reflex";

import { achievementsSlice } from "./achievements";
import { balanceSlice } from "./balance";
import { mtxSlice } from "./mtx";
import { settingsSlice } from "./settings";

export * from "./achievements";
export * from "./balance";
export * from "./default-data";
export * from "./mtx";
export * from "./settings";

export const persistentSlice = combineProducers({
	achievements: achievementsSlice,
	balance: balanceSlice,
	mtx: mtxSlice,
	settings: settingsSlice,
});
