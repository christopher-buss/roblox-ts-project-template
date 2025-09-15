import { useSelector } from "@rbxts/react-reflex";

import { selectPlayerTheme } from "client/store/theme";

import type { Theme } from "../themes/theme";

export function useTheme(): Theme {
	return useSelector(selectPlayerTheme);
}
