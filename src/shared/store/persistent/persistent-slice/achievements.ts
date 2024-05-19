import { createProducer } from "@rbxts/reflex";

import type { Badge } from "types/enum/badge";

import type { PlayerAchievements, PlayerData } from "./default-data";

export type AchievementState = Readonly<Record<string, PlayerAchievements | undefined>>;

const initialState: AchievementState = {};

export const achievementsSlice = createProducer(initialState, {
	/** @ignore */
	closePlayerData: (state, player: string) => {
		return {
			...state,
			[player]: undefined,
		};
	},

	/** @ignore */
	loadPlayerData: (state, player: string, data: PlayerData) => {
		return {
			...state,
			[player]: data.achievements,
		};
	},

	awardBadge: (state, player: string, badge: Badge, badgeStatus: boolean) => {
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
