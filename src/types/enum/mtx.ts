import { GameId, getConfigValueForGame } from "shared/functions/game-config";

export const GamePass = {
	Example: getConfigValueForGame({
		[GameId.Development]: "1",
		[GameId.Production]: "1",
	}),
} as const;

export type GamePass = ValueOf<typeof GamePass>;

export interface GamePassData {
	active: boolean;
}

export const Product = {
	Example: getConfigValueForGame({
		[GameId.Development]: "1",
		[GameId.Production]: "1",
	}),
} as const;

export type Product = ValueOf<typeof Product>;

export interface ProductData {
	timesPurchased: number;
}
