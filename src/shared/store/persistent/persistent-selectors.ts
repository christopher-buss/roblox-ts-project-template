import { createSelector } from "@rbxts/reflex";

import type { SharedState } from "..";
import type { PlayerData } from "./persistent-slice";

export function selectPlayerAchievements(playerId: string) {
	return (state: SharedState) => state.persistent.achievements[playerId];
}

export function selectPlayerBalance(playerId: string) {
	return (state: SharedState) => state.persistent.balance[playerId];
}

export function selectPlayerMtx(playerId: string) {
	return (state: SharedState) => state.persistent.mtx[playerId];
}

export function selectPlayerSettings(playerId: string) {
	return (state: SharedState) => state.persistent.settings[playerId];
}

export function selectPlayerData(playerId: string): (state: SharedState) => PlayerData | undefined {
	return createSelector(
		selectPlayerAchievements(playerId),
		selectPlayerBalance(playerId),
		selectPlayerMtx(playerId),
		selectPlayerSettings(playerId),
		(achievements, balance, mtx, settings): PlayerData | undefined => {
			if (!achievements || !balance || !mtx || !settings) {
				return undefined;
			}

			return {
				achievements,
				balance,
				mtx,
				settings,
			};
		},
	);
}
