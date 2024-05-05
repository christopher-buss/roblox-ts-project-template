import React, { forwardRef } from "@rbxts/react";

import type { FrameProps } from "./frame";

export type CanvasGroupProps = FrameProps<CanvasGroup>;

/**
 * A wrapper around the `CanvasGroup` component, a GuiObject that renders
 * descendants as a group with color and transparency applied to the render
 * result.
 *
 * @example
 *
 * ```tsx
 * <CanvasGroup Native={{ Size: new UDim2(0, 100, 0, 100) }}>
 * ```
 *
 * @component
 *
 * @see https://developer.roblox.com/en-us/api-reference/class/CanvasGroup
 */
const CanvasGroup = forwardRef((props: CanvasGroupProps, ref: React.Ref<CanvasGroup>) => {
	return (
		<canvasgroup ref={ref} {...props.Native} BorderSizePixel={0}>
			{props.children}
			{props.CornerRadius ? (
				<uicorner key="corner" CornerRadius={props.CornerRadius} />
			) : undefined}
		</canvasgroup>
	);
});

export default CanvasGroup;
