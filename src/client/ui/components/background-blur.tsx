import { useBindingListener, useCamera } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";

import type { BindingValue } from "types/util/react";

interface BackgroundBlurProps {
	/** The size of the blur effect. */
	readonly BlurSize?: BindingValue<number>;
}

/**
 * Renders a background blur effect based on the provided `BlurSize`.
 *
 * @param props - The component props.
 * @returns The rendered background blur component.
 */
export function BackgroundBlur({ BlurSize }: BackgroundBlurProps): React.Element {
	const camera = useCamera();
	const [visible, setVisible] = useState(false);

	useBindingListener(BlurSize, (size = 0) => {
		setVisible(size > 0);
	});

	return createPortal(<>{visible ? <blureffect Size={BlurSize} /> : undefined}</>, camera);
}
