import { useLatest } from "@rbxts/pretty-react-hooks";

function isEqualOrUndefined(previousValue: unknown, value: unknown): boolean {
	return previousValue === value || value === undefined;
}

/**
 * Returns the latest defined value.
 *
 * @param value - The value to use.
 * @param initialValue - The initial value to use if `value` is `undefined`.
 * @returns A non-nullable value.
 */
export function useDefined<T>(value: T | undefined, initialValue: T): T;
export function useDefined<T>(value: T, initialValue?: T): T;
export function useDefined<T>(value: T, initialValue?: T): T | undefined {
	return useLatest(value, isEqualOrUndefined).current ?? initialValue;
}
