import type { UseProducerHook } from "@rbxts/react-reflex";
import { useProducer } from "@rbxts/react-reflex";

import type { RootStore } from "client/store";

export const useStore: UseProducerHook<RootStore> = useProducer;
