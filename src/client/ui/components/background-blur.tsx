import { useBindingListener, useCamera } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { createPortal } from "@rbxts/react-roblox";

import type { BindingValue } from "types/util/react";

interface BackgroundBlurProps {
	/** The size of the blur effect. */
	BlurSize?: BindingValue<number>;
}

/**
 * Renders a background blur effect based on the provided `BlurSize`.
 *
 * @param props - The component props.
 * @returns The rendered background blur component.
 */
export function BackgroundBlur({ BlurSize }: Readonly<BackgroundBlurProps>): React.ReactNode {
	const camera = useCamera();
	const [isVisible, setIsVisible] = useState(false);

	useBindingListener(BlurSize, (size = 0) => {
		setIsVisible(size > 0);
	});

	return createPortal(<>{isVisible ? <blureffect Size={BlurSize ?? 0} /> : undefined}</>, camera);
}
