import { Flamework } from "@flamework/core";

import type { PlayerData } from "shared/store/persistent/persistent-slice";

export const validate = Flamework.createGuard<PlayerData>();
