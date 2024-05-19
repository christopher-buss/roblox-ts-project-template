import React from "@rbxts/react";

import { IS_EDIT } from "shared/constants";

import Group from "./group";

export interface LayerProps extends React.PropsWithChildren {
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
 * @component
 *
 * @see https://developer.roblox.com/en-us/api-reference/class/ScreenGui
 */
export default function Layer({ DisplayOrder, children }: LayerProps): React.Element {
	return IS_EDIT ? (
		<Group
			Native={{
				AnchorPoint: new Vector2(0, 0),
				Position: new UDim2(0, 0, 0, 0),
				ZIndex: DisplayOrder ?? 0,
			}}
		>
			{children}
		</Group>
	) : (
		<screengui
			DisplayOrder={DisplayOrder}
			IgnoreGuiInset={true}
			ResetOnSpawn={false}
			ZIndexBehavior="Sibling"
		>
			{children}
		</screengui>
	);
}
