import type { Badge } from "types/enum/badge";
import type { GamePass, GamePassData, Product, ProductData } from "types/enum/mtx";

export interface PlayerData {
	readonly achievements: PlayerAchievements;
	readonly balance: PlayerBalance;
	readonly mtx: PlayerMtx;
	readonly settings: PlayerSettings;
}

export interface PlayerAchievements {
	readonly badges: Map<Badge, boolean>;
}

export interface PlayerBalance {
	readonly currency: number;
}

export interface PlayerMtx {
	readonly gamePasses: Map<GamePass, GamePassData>;
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
	achievements: {
		badges: new Map<Badge, boolean>(),
	},
	balance: {
		currency: 0,
	},
	mtx: {
		gamePasses: new Map<GamePass, GamePassData>(),
		products: new Map<Product, ProductData>(),
		receiptHistory: [],
	},
	settings: {
		musicVolume: 0.5,
		sfxVolume: 0.5,
	},
};
