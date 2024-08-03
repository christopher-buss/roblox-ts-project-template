import { createProducer } from "@rbxts/reflex";

import type { Badge } from "types/enum/badge";

import type { PlayerAchievements, PlayerData } from "./default-data";

export type AchievementState = Readonly<Record<string, PlayerAchievements | undefined>>;

const initialState: AchievementState = {};

export const achievementsSlice = createProducer(initialState, {
	/** @ignore */
	closePlayerData: (state, player: string): AchievementState => {
		return {
			...state,
			[player]: undefined,
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData): AchievementState => {
		return {
			...state,
			[player]: data.achievements,
		};
	},

	/**
	 * Stores the badge status for a player.
	 *
	 * @param state - The current state.
	 * @param player - The player to award the badge to.
	 * @param badge - The badge to award.
	 * @param badgeStatus - True if the badge was successfully awarded, false if
	 *   it needs to be retried in the future.
	 * @returns The new state.
	 */
	awardBadge: (state, player: string, badge: Badge, badgeStatus: boolean): AchievementState => {
		const achievements = state[player];
		return {
			...state,
			[player]: achievements && {
				...achievements,
				badges: new Map([...achievements.badges]).set(badge, badgeStatus),
			},
		};
	},
});
