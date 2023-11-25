import { createProducer } from "@rbxts/reflex";

import { PlayerBalance, PlayerBalanceType, PlayerData } from "./default-data";

export interface BalanceState {
	readonly [player: string]: PlayerBalance | undefined;
}

const initialState: BalanceState = {};

export const balanceSlice = createProducer(initialState, {
	changeBalance: (state, player: string, balanceType: PlayerBalanceType, amount: number) => {
		const balance = state[player];

		return {
			...state,
			[player]: balance && {
				...balance,
				[balanceType]: balance[balanceType] + amount,
			},
		};
	},

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.balance,
	}),
});
