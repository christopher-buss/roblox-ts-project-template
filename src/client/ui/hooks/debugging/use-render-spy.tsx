import { useEffect, useRef } from "@rbxts/react";

/**
 * A simple function that checks how many times the component has been rendered.
 *
 * @returns The render count.
 * @see https://github.com/cool-organization/rbx-hooks/blob/main/src/debugging/use-renders-spy.ts
 */
export function useRendersSpy(): number {
	const count = useRef(0);
	useEffect(() => {
		count.current += 1;
	});

	return count.current;
}
