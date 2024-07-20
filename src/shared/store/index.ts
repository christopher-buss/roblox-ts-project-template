import { createBinarySerializer } from "@rbxts/flamework-binary-serializer";
import type { CombineStates } from "@rbxts/reflex";

import { persistentSlice } from "./persistent/persistent-slice";

export type SharedState = CombineStates<typeof slices>;
export type SerializedSharedState = ReturnType<typeof stateSerDes.serialize>;

export const stateSerDes = createBinarySerializer<SharedState>();

export const slices = {
	persistent: persistentSlice,
};
