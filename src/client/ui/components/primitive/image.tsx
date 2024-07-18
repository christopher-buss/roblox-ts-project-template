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
 * <ImageLabel
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
const ImageLabel = forwardRef((props: ImageProps, ref: React.Ref<ImageLabel>) => {
	const { CornerRadius, Image, Native, children } = props;

	return (
		<imagelabel
			ref={ref}
			{...Native}
			AnchorPoint={Native?.AnchorPoint ?? new Vector2(0.5, 0.5)}
			BackgroundTransparency={Native?.BackgroundTransparency ?? 1}
			Image={Image}
			Position={Native?.Position ?? new UDim2(0.5, 0, 0.5, 0)}
		>
			{CornerRadius ? <uicorner CornerRadius={CornerRadius} /> : undefined}
			{children}
		</imagelabel>
	);
});

export default ImageLabel;
