import { Players } from "@rbxts/services";

export const { LocalPlayer } = Players;

export const USER_ID = tostring(LocalPlayer.UserId);
export const USER_NAME = LocalPlayer.Name;

// eslint-disable-next-line ts/no-non-null-assertion -- Should always be present during usage.
export const PLAYER_GUI = LocalPlayer.FindFirstChildWhichIsA("PlayerGui")!;
