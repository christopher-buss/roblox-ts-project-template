import React, { useEffect, useState } from "@rbxts/react";
import { setTimeout } from "@rbxts/set-timeout";

interface DelayRenderProps extends React.PropsWithChildren {
	/** The delay (in seconds) before rendering the children component. */
	MountDelay?: number;
	/**
	 * Indicates whether the children component should be rendered. If true, the
	 * children component will be rendered after the MountDelay. If false, the
	 * children component will be unmounted after the UnmountDelay.
	 */
	ShouldRender: boolean;
	/** The delay (in seconds) before unmounting the children component. */
	UnmountDelay?: number;
}

/**
 * Renders the children component with a delay based on the provided MountDelay
 * and UnmountDelay values.
 *
 * This component can be useful for creating transitions or animations when
 * rendering or unmounting components, e.g, playing a fade-out animation before
 * unmounting a component.
 *
 * @example
 *
 * ```tsx
 * <DelayRender ShouldRender={true} UnmountDelay={1}>
 * 	<Text Text={"Hello World!"} />
 * </DelayRender>;
 * ```
 *
 * @param delayRenderProps - The properties of delay-render props.
 * @returns - The rendered children component.
 * @component
 */
export function DelayRender({
	MountDelay = 0,
	ShouldRender,
	UnmountDelay = 0,
	children,
}: Readonly<DelayRenderProps>): React.ReactNode {
	const [render, setRender] = useState(false);

	useEffect(() => {
		const delay = ShouldRender ? MountDelay : UnmountDelay;
		return setTimeout(() => {
			setRender(ShouldRender);
		}, delay);
	}, [MountDelay, ShouldRender, UnmountDelay]);

	return <>{render ? children : undefined}</>;
}
