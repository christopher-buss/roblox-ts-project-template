import type { CombineStates } from "@rbxts/reflex";

import { persistentSlice } from "./persistent/persistent-slice";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	persistent: persistentSlice,
};
