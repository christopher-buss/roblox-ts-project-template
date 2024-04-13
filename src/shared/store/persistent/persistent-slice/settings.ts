import { createProducer } from "@rbxts/reflex";

import type { PlayerData, PlayerSettings } from "./default-data";

export type SettingsState = Readonly<Record<string, PlayerSettings | undefined>>;

const initialState: SettingsState = {};

export const settingsSlice = createProducer(initialState, {
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
			[player]: data.settings,
		};
	},

	changeSetting: (
		state,
		player: string,
		settingType: keyof PlayerSettings,
		value: PlayerSettings[keyof PlayerSettings],
	) => {
		const setting = state[player];

		return {
			...state,
			[player]: setting && {
				...setting,
				[settingType]: value,
			},
		};
	},
});
