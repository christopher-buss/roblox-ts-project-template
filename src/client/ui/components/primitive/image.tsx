import React, { forwardRef } from "@rbxts/react";

import type { BindingValue } from "types/util/react";
import type { AssetId } from "types/util/roblox";

import type { FrameProps } from "./frame";

export interface ImageProps extends FrameProps<ImageLabel> {
	/** The image to display. */
	readonly Image: BindingValue<AssetId>;
}

/**
 * A component for displaying an image.
 *
 * @example
 *
 * ```tsx
 * <Image
 * 	Image="rbxassetid://1234567890"
 * 	Native={{
 * 		Size={new UDim2(0, 100, 0, 100)}
 * 	}}
 * />;
 * ```
 *
 * @component
 *
 * @see https://developer.roblox.com/en-us/api-reference/class/ImageLabel
 */
const Image = forwardRef((props: ImageProps, ref: React.Ref<ImageLabel>) => {
	const { CornerRadius, Native } = props;

	return (
		<imagelabel ref={ref} {...Native} BackgroundTransparency={1} Image={props.Image}>
			{CornerRadius ? <uicorner CornerRadius={CornerRadius} /> : undefined}
		</imagelabel>
	);
});

export default Image;
