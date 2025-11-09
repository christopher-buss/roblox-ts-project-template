import { useViewport } from "@rbxts/pretty-react-hooks";
import { useEffect, useState } from "@rbxts/react";

type Orientation = "landscape" | "portrait";

export function useOrientation(): Orientation {
	const [orientation, setOrientation] = useState<Orientation>("landscape");

	const viewportBinding = useViewport((viewport) => {
		setOrientation(viewport.Y > viewport.X ? "portrait" : "landscape");
	});

	useEffect(() => {
		setOrientation(
			viewportBinding
				.map((viewport) => (viewport.Y > viewport.X ? "portrait" : "landscape"))
				.getValue(),
		);
	}, [viewportBinding]);

	return orientation;
}
