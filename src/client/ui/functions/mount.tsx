import React, { StrictMode } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import type { Root } from "@rbxts/react-roblox";
import { createPortal, createRoot } from "@rbxts/react-roblox";

import { PLAYER_GUI } from "client/constants";
import { store } from "client/store";

import type { RemProviderProps } from "../providers/rem-provider";
import { RemProvider } from "../providers/rem-provider";

interface MountProps extends RemProviderProps {
	/** The key for the UI component. */
	key: string;
}

/**
 * Mounts the UI component to the Roblox game client.
 *
 * @param props - The options for mounting the UI component.
 * @param props.baseRem - The base rem value for the UI component.
 * @param props.key - The key for the UI component.
 * @param props.remOverride - The rem override value for the UI component.
 * @param props.children - The children elements of the UI component.
 * @returns The root object representing the mounted UI component.
 */
export function mount({ baseRem, key, remOverride, children }: MountProps): Root {
	const root = createRoot(new Instance("Folder"));
	root.render(
		<StrictMode>
			<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
				<ReflexProvider key="reflex-provider" producer={store}>
					{createPortal(children, PLAYER_GUI, key)}
				</ReflexProvider>
			</RemProvider>
		</StrictMode>,
	);

	return root;
}
