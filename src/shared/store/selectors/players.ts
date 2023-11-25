import { createSelector } from "@rbxts/reflex";

import { SharedState } from "../slices";
import { PlayerData } from "../slices/players";

export const selectPlayerBalance = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.balance[playerId];
	};
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPlayerData = (playerId: string) => {
	return createSelector(selectPlayerBalance(playerId), (balance): PlayerData | undefined => {
		if (!balance) {
			return undefined;
		}

		return {
			balance,
		};
	});
};
