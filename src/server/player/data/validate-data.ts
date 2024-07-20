import { Flamework } from "@flamework/core";

import type { PlayerData } from "shared/store/persistent";

export const validate = Flamework.createGuard<PlayerData>();
