import { t } from "@rbxts/t";
import { PlayerData } from "shared/store/slices/players";

export const validate: t.check<PlayerData> = t.strictInterface({
	balance: t.strictInterface({
		currency: t.number,
	}),
});
