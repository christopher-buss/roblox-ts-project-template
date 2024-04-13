type NestedKeyOf<T extends object> = {
	[Key in keyof T & (string | number)]: T[Key] extends object
		? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
		: `${Key}`;
}[keyof T & (string | number)];
