import { GameId, getConfigValueForGame } from "shared/functions/game-config";

export const GamePass = {
	Example: getConfigValueForGame({
		[GameId.Development]: "6031475575",
		[GameId.Production]: "6110424408",
	}),
} as const;

export type GamePass = ValueOf<typeof GamePass>;

export interface GamePassData {
	active: boolean;
}

export const Product = {
	Example: getConfigValueForGame({
		[GameId.Development]: "6031475575",
		[GameId.Production]: "6110424408",
	}),
} as const;

export type Product = ValueOf<typeof Product>;

export interface ProductData {
	timesPurchased: number;
}
