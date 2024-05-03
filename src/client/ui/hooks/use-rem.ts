import { useCallback, useContext } from "@rbxts/react";

import { DEFAULT_REM, RemContext } from "../providers/rem-provider";

export interface RemOptions {
	maximum?: number;
	minimum?: number;
}

interface RemFunction {
	(value: number, mode?: RemScaleMode): number;
	(value: UDim2, mode?: RemScaleMode): UDim2;
	(value: UDim, mode?: RemScaleMode): UDim;
	(value: Vector2, mode?: RemScaleMode): Vector2;
}

type RemScaleMode = "pixel" | "unit";

const scaleFunctions = {
	UDim: (value: UDim, rem: number): UDim => new UDim(value.Scale, value.Offset * rem),

	UDim2: (value: UDim2, rem: number): UDim2 => {
		return new UDim2(value.X.Scale, value.X.Offset * rem, value.Y.Scale, value.Y.Offset * rem);
	},

	Vector2: (value: Vector2, rem: number): Vector2 => new Vector2(value.X * rem, value.Y * rem),

	number: (value: number, rem: number): number => value * rem,
};

function useRemContext({ maximum = math.huge, minimum = 0 }: RemOptions = {}): number {
	const rem = useContext(RemContext);
	return math.clamp(rem, minimum, maximum);
}

/**
 * Custom hook that provides a function for scaling values based on the rem
 * unit.
 *
 * @param options - Optional configuration options for the rem function.
 * @returns A function that can be used to scale values based on the rem unit.
 */
export function useRem(options?: RemOptions): RemFunction {
	const rem = useRemContext(options);

	const remFunction: RemFunction = <T>(value: T, mode: RemScaleMode = "unit"): T => {
		const scale = scaleFunctions[typeOf(value) as never] as
			| ((value: T, rem: number) => T)
			| undefined;
		if (scale) {
			return mode === "unit" ? scale(value, rem) : scale(value, rem / DEFAULT_REM);
		}

		return value;
	};

	return useCallback(remFunction, [rem]);
}
