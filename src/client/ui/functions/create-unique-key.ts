/**
 * A function that returns a unique key based on the name passed.
 *
 * @example
 *
 * ```ts
 * const uniqueKey = createUniqueKey();
 * uniqueKey("Dog"); // Returns "Dog"
 * uniqueKey("Cat"); // Returns "Cat"
 * uniqueKey("Dog"); // Returns "Dog_2"
 * ```
 *
 * @returns A function that returns a unique key based on the name passed.
 * @see https://blog.boyned.com/articles/things-i-learned-using-react/
 */
export function createUniqueKey(): (name: string) => string {
	const names = new Map<string, number>();

	return (name: string) => {
		const nameCount = names.get(name);
		if (nameCount === undefined) {
			names.set(name, 1);
			return name;
		}

		// Edge case in case of:
		// uniqueKey("foo") // foo
		// uniqueKey("foo_2") // foo_2
		// uniqueKey("foo") // foo_2 (clash)
		while (true) {
			const count = nameCount + 1;
			names.set(name, count);
			const finalName = `${name}_${count}`;

			if (!names.has(finalName)) {
				return finalName;
			}
		}
	};
}
