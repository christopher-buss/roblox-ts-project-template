import React, { forwardRef } from "@rbxts/react";

interface GroupProps extends React.PropsWithChildren {
	/** All the default properties of a `Frame` component. */
	Native?: Partial<Omit<React.InstanceProps<Frame>, "BackgroundTransparency">>;
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
const Group = forwardRef(({ Native, children }: Readonly<GroupProps>, ref: React.Ref<Frame>) => {
	return (
		<frame
			ref={ref}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Size={new UDim2(1, 0, 1, 0)}
			{...Native}
		>
			{children}
		</frame>
	);
});

export default Group;
