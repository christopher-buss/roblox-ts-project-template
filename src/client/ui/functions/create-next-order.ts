/**
 * Creates a function that returns the next layout order value.
 *
 * @returns A function that returns the next layout order value.
 * @see https://blog.boyned.com/articles/things-i-learned-using-react/
 */
export function createNextOrder(): () => number {
	let layoutOrder = 0;

	return () => {
		layoutOrder += 1;
		return layoutOrder;
	};
}
