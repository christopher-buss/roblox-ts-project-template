import { LogLevel } from "@rbxts/log";
import { UseProducerHook, useProducer } from "@rbxts/react-reflex";
import { InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { $NODE_ENV } from "rbxts-transform-env";
import { Environment } from "shared/environments";
import { LOG_LEVEL } from "shared/functions/setup-logger";
import { slices } from "shared/store/slices";

import { receiverMiddleware } from "./middleware/receiver";

export type RootProducer = typeof store;
export type RootState = InferState<RootProducer>;
export const useRootProducer: UseProducerHook<RootProducer> = useProducer;

export const store = combineProducers({
	...slices,
});

store.applyMiddleware(receiverMiddleware());

if ($NODE_ENV === Environment.Dev && LOG_LEVEL === LogLevel.Verbose) {
	store.applyMiddleware(loggerMiddleware);
}
