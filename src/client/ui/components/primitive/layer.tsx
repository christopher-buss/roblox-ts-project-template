import React from "@rbxts/react";

import { $NODE_ENV } from "rbxts-transform-env";
import { IS_EDIT } from "shared/constants";

import UltraWideContainer from "../ultra-wide-container";
import Group from "./group";

export interface LayerProps extends React.PropsWithChildren {
	/**
	 * Whether or not to constraint ultra wide monitors to 16:9.
	 *
	 * @default true
	 */
	readonly ClampUltraWide?: boolean;
	/** The display order of the layer. */
	readonly DisplayOrder?: number;
}

/**
 * Renders a collection of components under a screengui.
 *
 * If the game is running, the components are rendered under a `screengui`
 * object, otherwise they are rendered under a `Group` object while in edit mode
 * for storybook support.
 *
 * @example
 *
 * ```tsx
 * <Layer DisplayOrder={1}>
 * 	<TextButton Text="Button 1" />
 * 	<TextButton Text="Button 2" />
 * </Layer>;
 * ```
 *
 * @param props - The component props.
 * @returns The rendered Layer component.
 * @note By default, the `ClampUltraWide` property is set to `true`. This means
 * that the layer will be constrained to a 16:9 aspect ratio on ultra wide
 * monitors. If you want to disable this behavior, set the property to `false`.
 *
 * @component
 *
 * @see https://developer.roblox.com/en-us/api-reference/class/ScreenGui
 */
export default function Layer({
	ClampUltraWide = true,
	DisplayOrder,
	children,
}: LayerProps): React.Element {
	return $NODE_ENV === "development" && IS_EDIT ? (
		<Group
			Native={{
				AnchorPoint: new Vector2(0, 0),
				Position: new UDim2(0, 0, 0, 0),
				ZIndex: DisplayOrder,
			}}
		>
			{ClampUltraWide ? <UltraWideContainer>{children}</UltraWideContainer> : children}
		</Group>
	) : (
		<screengui
			DisplayOrder={DisplayOrder}
			IgnoreGuiInset={true}
			ResetOnSpawn={false}
			ZIndexBehavior="Sibling"
		>
			{ClampUltraWide ? <UltraWideContainer>{children}</UltraWideContainer> : children}
		</screengui>
	);
}
