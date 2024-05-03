import { map, useCamera, useDebounceState, useEventListener } from "@rbxts/pretty-react-hooks";
import React, { createContext, useCallback, useEffect } from "@rbxts/react";

export interface RemProviderProps extends React.PropsWithChildren {
	baseRem?: number;
	maximumRem?: number;
	minimumRem?: number;
	remOverride?: number;
}

export const DEFAULT_REM = 16;
export const MIN_REM = 8;

const BASE_RESOLUTION_WIDTH = 1920;
const BASE_RESOLUTION_HEIGHT = 1020;
const BASE_RESOLUTION = new Vector2(BASE_RESOLUTION_WIDTH, BASE_RESOLUTION_HEIGHT);

const ASPECT_RATIO_WIDTH = 19;
const ASPECT_RATIO_HEIGHT = 9;
const MAX_ASPECT_RATIO = ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT;

// Wide screens should not scale beyond iPhone aspect ratio
const SLOW_DOWN_SCALE = 0.25;

export const RemContext = createContext<number>(DEFAULT_REM);

export function RemProvider({
	baseRem = DEFAULT_REM,
	maximumRem = math.huge,
	minimumRem = MIN_REM,
	remOverride,
	children,
}: Readonly<RemProviderProps>): React.Element {
	const camera = useCamera();
	const [rem, setRem] = useDebounceState(baseRem, { leading: true, wait: 0.2 });

	const update = useCallback((): number | void => {
		const viewport = camera.ViewportSize;

		if (remOverride !== undefined) {
			return remOverride;
		}

		const resolution = new Vector2(
			math.min(viewport.X, viewport.Y * MAX_ASPECT_RATIO),
			viewport.Y,
		);
		const scale = resolution.Magnitude / BASE_RESOLUTION.Magnitude;
		const desktop = resolution.X > resolution.Y || scale >= 1;

		// Portrait mode should downscale slower than landscape
		const factor = desktop ? scale : map(scale, 0, 1, SLOW_DOWN_SCALE, 1);

		setRem(math.clamp(math.round(baseRem * factor), minimumRem, maximumRem));
	}, [baseRem, camera, maximumRem, minimumRem, remOverride, setRem]);

	useEventListener(camera.GetPropertyChangedSignal("ViewportSize"), update);

	useEffect(() => {
		update();
	}, [baseRem, minimumRem, maximumRem, remOverride, update]);

	return <RemContext.Provider value={rem}>{children}</RemContext.Provider>;
}
