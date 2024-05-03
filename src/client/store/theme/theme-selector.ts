import type { Theme } from "client/ui/themes";
import { defaultTheme } from "client/ui/themes";
import type { SharedState } from "shared/store";

export function selectPlayerTheme(_state: SharedState): Theme {
	return defaultTheme;
}
