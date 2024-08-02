import React from "@rbxts/react";

import Layer from "./components/primitive/layer";

export function App(): React.ReactNode {
	return (
		<>
			<Layer key="example-layer" />

			<Layer key="example-layer1" />
		</>
	);
}
