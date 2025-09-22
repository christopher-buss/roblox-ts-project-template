import { $NODE_ENV } from "rbxts-transform-env";

export enum GameId {
	Development = 6031475575,
	Production = 6110424408,
}

function isGameId(value: number): value is GameId {
	return value in GameId;
}

export function getConfigValueForGame<const T>(gameIdToValueTable: Record<GameId, T>): T {
	if ($NODE_ENV === "development" && game.PlaceId === 0) {
		return gameIdToValueTable[GameId.Development];
	}

	assert(isGameId(game.GameId), `Invalid game id for place: ${game.GameId}`);
	return gameIdToValueTable[game.GameId];
}
