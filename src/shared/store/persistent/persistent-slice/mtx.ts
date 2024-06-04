import { createProducer } from "@rbxts/reflex";

import type { GamePass, Product } from "types/enum/mtx";

import type { PlayerData, PlayerMtx } from "./default-data";

export type MtxState = Readonly<Record<string, PlayerMtx | undefined>>;

const initialState: MtxState = {};

export const mtxSlice = createProducer(initialState, {
	/** @ignore */
	closePlayerData: (state, player: string) => {
		return {
			...state,
			[player]: undefined,
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData) => {
		return {
			...state,
			[player]: data.mtx,
		};
	},

	purchaseDeveloperProduct: (state, player: string, productId: Product) => {
		const mtx = state[player];

		return {
			...state,
			[player]: mtx && {
				...mtx,
				developerProducts: new Map([...mtx.products]).set(productId, {
					timesPurchased: (mtx.products.get(productId)?.timesPurchased ?? 0) + 1,
				}),
			},
		};
	},

	purchaseGamePass: (state, player: string, gamePassId: GamePass) => {
		const mtx = state[player];

		return {
			...state,
			[player]: mtx && {
				...mtx,
				gamePasses: new Map([...mtx.gamePasses]).set(gamePassId, {
					active: true,
				}),
			},
		};
	},
});
