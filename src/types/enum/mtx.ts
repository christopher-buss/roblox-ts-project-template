import { GameId, getConfigValueForGame } from "shared/functions/game-config";

export const GamePass = {
	Example: getConfigValueForGame({
		[GameId.Development]: "1",
		[GameId.Production]: "1",
	} as const),
} as const;

export type GamePass = ValueOf<typeof GamePass>;

export interface GamePassData {
	active: boolean;
	id: GamePass;
}

export const Product = {
	Example: getConfigValueForGame({
		[GameId.Development]: "1",
		[GameId.Production]: "1",
	} as const),
} as const;

export type Product = ValueOf<typeof Product>;

export interface ProductData {
	id: number;
	timesPurchased: number;
}
