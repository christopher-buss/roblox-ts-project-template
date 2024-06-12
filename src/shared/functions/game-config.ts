export enum GameId {
	Development = 6031475575,
	Production = 1,
}

function IsGameId(value: number): value is GameId {
	return value in GameId;
}

export function getConfigValueForGame<const T>(gameIdToValueTable: Record<GameId, T>): T {
	if (game.PlaceId === 0) {
		return gameIdToValueTable[GameId.Development];
	}

	assert(IsGameId(game.GameId), `Invalid game id for place: ${game.GameId}`);
	return gameIdToValueTable[game.GameId];
}
