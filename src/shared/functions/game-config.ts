export enum GameId {
	Development = 0,
	Production = 1,
}

function IsGameId(value: number): value is GameId {
	return value in GameId;
}

export function getConfigValueForGame<T>(gameIdToValueTable: Record<GameId, T>): T {
	assert(IsGameId(game.GameId), `Invalid game id for place: ${game.GameId}`);
	return gameIdToValueTable[game.GameId];
}
