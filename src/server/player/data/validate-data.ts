import { t } from "@rbxts/t";
import { $terrify } from "rbxts-transformer-t-new";
import { PlayerData } from "shared/store/slices/players";

export const validate: t.check<PlayerData> = $terrify<PlayerData>();
