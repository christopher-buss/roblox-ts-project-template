import type { PropsWithChildren } from "@rbxts/react";
import React, { forwardRef } from "@rbxts/react";

interface PaddingProps extends PropsWithChildren {
	readonly Padding: number;
}

/**
 * A component for adding consistent padding around an element.
 *
 * @example
 *
 * ```tsx
 * <Padding Padding={10}>
 * ```
 *
 * @component
 *
 * @see https://developer.roblox.com/en-us/api-reference/class/UIPadding
 */
const PaddingComponent = forwardRef(
	({ Padding, children }: PaddingProps, ref: React.Ref<UIPadding>) => {
		return (
			<uipadding
				key="Padding"
				ref={ref}
				PaddingBottom={new UDim(0, Padding)}
				PaddingLeft={new UDim(0, Padding)}
				PaddingRight={new UDim(0, Padding)}
				PaddingTop={new UDim(0, Padding)}
			>
				{children}
			</uipadding>
		);
	},
);

export default PaddingComponent;
