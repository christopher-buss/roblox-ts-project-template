type UndefinedToOptional<T> = {
	[K in keyof T]-?: (
		x: undefined extends T[K] ? Partial<Record<K, T[K]>> : Record<K, T[K]>,
	) => void;
}[keyof T] extends (x: infer I) => void
	? I extends infer U
		? { [K in keyof U]: U[K] }
		: never
	: never;
