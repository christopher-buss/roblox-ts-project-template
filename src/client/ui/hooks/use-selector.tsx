import type { UseSelectorHook } from "@rbxts/react-reflex";
import { useSelector } from "@rbxts/react-reflex";

import type { RootStore } from "client/store";

export const useRootSelector: UseSelectorHook<RootStore> = useSelector;
