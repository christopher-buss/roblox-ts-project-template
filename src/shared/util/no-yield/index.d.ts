export function noYield<T extends (...args: never) => ReturnType<T>>(
	callback: T,
	...args: Parameters<T>
): ReturnType<T>;
