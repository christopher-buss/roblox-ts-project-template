import { createProducer } from "@rbxts/reflex";

import type { PlayerBalance, PlayerData } from "./default-data";

export type BalanceState = Readonly<Record<string, PlayerBalance | undefined>>;

const initialState: BalanceState = {};

export const balanceSlice = createProducer(initialState, {
	/** @ignore */
	closePlayerData: (state, player: string): BalanceState => {
		return {
			...state,
			[player]: undefined,
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData): BalanceState => {
		return {
			...state,
			[player]: data.balance,
		};
	},

	giveCurrency: (state, player: string, amount: number): BalanceState => {
		const balance = state[player];
		return {
			...state,
			[player]: balance && {
				...balance,
				currency: balance.currency + amount,
			},
		};
	},
});
