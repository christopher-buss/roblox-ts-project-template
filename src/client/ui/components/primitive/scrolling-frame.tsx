import React from "@rbxts/react";

import { useRem, useTheme } from "client/ui/hooks";

interface ScrollingFrameProps extends React.PropsWithChildren {
	/** The size of the canvas. */
	readonly CanvasSize: Vector2;
	/** All the default properties of a `ScrollingFrame` component. */
	readonly Native?: Partial<Omit<React.InstanceProps<ScrollingFrame>, "BackgroundTransparency">>;
}

/**
 * Renders a scrolling frame component.
 *
 * @example
 *
 * ```tsx
 * const [canvasSizeY, setCanvasSizeY] = useState(0);
 *
 * <ScrollingFrame
 * 	CanvasSize={canvasSize}
 * 	Native={{ Size: new UDim2(1, 0, 1, 0) }}
 * >
 * 	<uigridlayout
 * 		CellPadding={new UDim2(0, 0, 0, 5)}
 * 		CellSize={new UDim2(0, 100, 0, 100)}
 * 		Change={{
 * 			AbsoluteContentSize: (rbx): void => {
 * 				setCanvasSizeY(rbx.AbsoluteContentSize);
 * 			},
 * 		}}
 * 	/>
 * </ScrollingFrame>;
 * ```
 *
 * @param props - The props for the scrolling frame.
 * @returns The rendered scrolling frame component.
 * @component
 *
 * @see https://developer.roblox.com/en-us/api-reference/class/ScrollingFrame
 */
export default function ScrollingFrame({
	CanvasSize,
	Native,
	children,
}: ScrollingFrameProps): React.Element {
	const theme = useTheme();
	const rem = useRem();

	return (
		<scrollingframe
			{...Native}
			BackgroundTransparency={0}
			BorderSizePixel={0}
			CanvasSize={UDim2.fromOffset(
				CanvasSize.X !== 0 ? CanvasSize.X + 5 : 0,
				CanvasSize.Y !== 0 ? CanvasSize.Y + 5 : 0,
			)}
			ScrollBarImageColor3={theme.colors.secondary}
			ScrollBarThickness={rem(0.5)}
		>
			{children}
		</scrollingframe>
	);
}
