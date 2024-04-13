import type { Gamepass, GamepassData, Product, ProductData } from "types/enum/mtx";

export interface PlayerData {
	readonly balance: PlayerBalance;
	readonly mtx: PlayerMtx;
	readonly settings: PlayerSettings;
}

export interface PlayerBalance {
	readonly currency: number;
}

export interface PlayerMtx {
	readonly gamepasses: Map<Gamepass, GamepassData>;
	readonly products: Map<Product, ProductData>;
	readonly receiptHistory: Array<string>;
}

export interface PlayerSettings {
	readonly musicVolume: number;
	readonly sfxVolume: number;
}

export type PlayerBalanceType = keyof PlayerBalance;
export type PlayerMtxType = keyof PlayerMtx;
export type PlayerSettingsType = keyof PlayerSettings;

export const defaultPlayerData: PlayerData = {
	balance: {
		currency: 0,
	},
	mtx: {
		gamepasses: new Map<Gamepass, GamepassData>(),
		products: new Map<Product, ProductData>(),
		receiptHistory: [],
	},
	settings: {
		musicVolume: 0.5,
		sfxVolume: 0.5,
	},
};
