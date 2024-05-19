import { GameId, getConfigValueForGame } from "shared/functions/game-config";

export const Badge = {
	Welcome: getConfigValueForGame({
		[GameId.Development]: "0",
		[GameId.Production]: "1",
	} as const),
} as const;

export type Badge = ValueOf<typeof Badge>;
