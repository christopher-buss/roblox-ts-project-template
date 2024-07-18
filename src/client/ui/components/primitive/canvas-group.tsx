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
	const { CornerRadius, Native, children } = props;

	return (
		<canvasgroup
			ref={ref}
			{...Native}
			AnchorPoint={Native?.AnchorPoint ?? new Vector2(0.5, 0.5)}
			BackgroundTransparency={Native?.BackgroundTransparency ?? 1}
			BorderSizePixel={0}
			Position={Native?.Position ?? new UDim2(0.5, 0, 0.5, 0)}
		>
			{CornerRadius ? <uicorner key="corner" CornerRadius={CornerRadius} /> : undefined}
			{children}
		</canvasgroup>
	);
});

export default CanvasGroup;
