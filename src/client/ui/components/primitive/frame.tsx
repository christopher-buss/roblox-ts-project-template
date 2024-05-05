import type { Ref } from "@rbxts/react";
import React, { forwardRef } from "@rbxts/react";

import type { BindingValue } from "types/util/react";

export interface FrameProps<T extends Instance = Frame> extends React.PropsWithChildren {
	/** An optional helper that rounds the corners of the frame. */
	readonly CornerRadius?: BindingValue<UDim>;
	/** The default properties of the component. */
	readonly Native?: Partial<React.InstanceProps<T>>;
}

/**
 * A wrapper around the `Frame` component, a GuiObject that renders as a plain
 * rectangle with no other content. If you intend to use this component as a
 * container for other components, consider using the `Group` component
 * instead.
 *
 * @example
 *
 * ```tsx
 * <Frame CornerRadius={new UDim(0, 8)} Native={{ Size: new UDim2(0, 100, 0, 100) }}>
 * ```
 *
 * @note A frame defaults to being centered in the parent container (anchor point and
 * position are set to 0.5).
 *
 * @component
 *
 * @see https://create.roblox.com/docs/reference/engine/classes/Frame
 */
const Frame = forwardRef(({ CornerRadius, Native, children }: FrameProps, ref: Ref<Frame>) => {
	const { AnchorPoint, Position } = Native ?? {};

	return (
		<frame
			ref={ref}
			{...Native}
			AnchorPoint={AnchorPoint ?? new Vector2(0.5, 0.5)}
			Position={Position ?? new UDim2(0.5, 0, 0.5, 0)}
		>
			{children}
			{CornerRadius ? <uicorner CornerRadius={CornerRadius} /> : undefined}
		</frame>
	);
});

export default Frame;
