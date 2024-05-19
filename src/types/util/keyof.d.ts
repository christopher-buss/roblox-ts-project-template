type NestedKeyOf<T extends object> = {
	[Key in keyof T & (number | string)]: T[Key] extends object
		? `${Key}.${NestedKeyOf<T[Key]>}` | `${Key}`
		: `${Key}`;
}[keyof T & (number | string)];
