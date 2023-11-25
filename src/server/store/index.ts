import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/store";

import { broadcasterMiddleware } from "./middleware/broadcaster";

export type RootState = InferState<typeof store>;

export const store = combineProducers({
	...slices,
});

store.applyMiddleware(broadcasterMiddleware());
