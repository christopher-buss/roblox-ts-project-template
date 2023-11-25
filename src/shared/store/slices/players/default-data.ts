export interface PlayerData {
	readonly balance: PlayerBalance;
}

export interface PlayerBalance {
	readonly currency: number;
}

export type PlayerBalanceType = keyof PlayerBalance;

export const defaultPlayerData: PlayerData = {
	balance: {
		currency: 0,
	},
};
