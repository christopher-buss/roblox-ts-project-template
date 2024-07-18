import { useViewport } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";

type Orientation = "landscape" | "portrait";

export function useOrientation(): Orientation {
	const viewportBinding = useViewport(viewport => {
		setOrientation(viewport.Y > viewport.X ? "portrait" : "landscape");
	});

	const [orientation, setOrientation] = useState<Orientation>(
		viewportBinding
			.map(viewport => (viewport.Y > viewport.X ? "portrait" : "landscape"))
			.getValue(),
	);

	return orientation;
}
