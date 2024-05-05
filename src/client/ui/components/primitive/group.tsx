import React, { forwardRef } from "@rbxts/react";

interface GroupProps extends React.PropsWithChildren {
	/**
	 * The background transparency property exists purely for debugging
	 * purposes. If you need a visible background, use a `Frame` instead.
	 *
	 * @ignore
	 * @deprecated
	 */
	readonly BackgroundTransparency?: number;
	/** All the default properties of a `Frame` component. */
	readonly Native?: Partial<Omit<React.InstanceProps<Frame>, "BackgroundTransparency">>;
}

/**
 * A container for grouping multiple components together.
 *
 * @example
 *
 * ```tsx
 * <Group Native={{ Position: new UDim2(0, 0, 0, 0) }}>
 * 	<TextButton Text="Button 1" />
 * 	<TextButton Text="Button 2" />
 * </Group>;
 * ```
 *
 * @note A group defaults to being centered in the parent container (anchor point and
 * position are set to 0.5).
 *
 * @component
 */
const Group = forwardRef(
	({ BackgroundTransparency, Native, children }: GroupProps, ref: React.Ref<Frame>) => {
		const { AnchorPoint, Position, Size } = Native ?? {};

		return (
			<frame
				ref={ref}
				{...Native}
				AnchorPoint={AnchorPoint ?? new Vector2(0.5, 0.5)}
				BackgroundTransparency={BackgroundTransparency ?? 1}
				Position={Position ?? new UDim2(0.5, 0, 0.5, 0)}
				Size={Size ?? new UDim2(1, 0, 1, 0)}
			>
				{children}
			</frame>
		);
	},
);

export default Group;
