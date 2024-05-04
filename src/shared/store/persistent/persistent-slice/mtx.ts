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

	purchaseDeveloperProduct: (state, player: string, productId: number) => {
		const mtx = state[player];

		const id = tostring(productId) as Product;

		return {
			...state,
			[player]: mtx && {
				...mtx,
				developerProducts: mtx.products.set(id, {
					id: productId,
					timesPurchased: (mtx.products.get(id)?.timesPurchased ?? 0) + 1,
				}),
			},
		};
	},

	setGamePassOwned: (state, player: string, gamePassId: GamePass) => {
		const mtx = state[player];

		return {
			...state,
			[player]: mtx && {
				...mtx,
				gamePasses: mtx.gamePasses.set(gamePassId, {
					id: gamePassId,
					active: true,
				}),
			},
		};
	},
});
