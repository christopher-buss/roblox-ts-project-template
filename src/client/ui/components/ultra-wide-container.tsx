import { useViewport } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";

import Group from "./primitive/group";

const MAX_ASPECT_RATIO = 19 / 9;
const BASE_RESOLUTION = new Vector2(1920, 1020);

type UltraWideContainerProps = Readonly<React.PropsWithChildren>;

/**
 * Creates a 1920x1080 scaling container to handle ultra wide monitors and
 * screens in a reasonable way. This helps keep UI centered and available for
 * ultra wide screens.
 *
 * @param props - The component props.
 * @param props.children - The content to render inside the container.
 * @returns The rendered container component.
 * @see https://github.com/Quenty/NevermoreEngine/tree/a9256cab3584bea4bd32c327d00b9a52f2a3ec95/src/ultrawidecontainerutils
 */
export default function UltraWideContainer({ children }: UltraWideContainerProps): React.Element {
	const viewport = useViewport();

	return (
		<Group>
			<uisizeconstraint
				MaxSize={viewport.map(size => {
					const resolution = new Vector2(
						math.min(size.X, size.Y * MAX_ASPECT_RATIO),
						size.Y,
					);
					const scale = resolution.Magnitude / BASE_RESOLUTION.Magnitude;
					const desktop = resolution.X > resolution.Y || scale >= 1;
					if (!desktop) {
						return new Vector2(1920, 1080);
					}

					return new Vector2(1920 * scale, size.Y);
				})}
			/>

			{children}
		</Group>
	);
}
