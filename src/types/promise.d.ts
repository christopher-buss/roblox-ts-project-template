interface PromiseLike<T> {
	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 *
	 * @param onfulfilled - The callback to execute when the Promise is
	 *   resolved.
	 * @param onrejected - The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then(
		onfulfilled?: undefined,
		onrejected?: (reason: unknown) => PromiseLike<T> | T,
	): PromiseLike<T>;

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 *
	 * @param onfulfilled - The callback to execute when the Promise is
	 *   resolved.
	 * @param onrejected - The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then<U>(
		onfulfilled: (value: T) => PromiseLike<U> | U,
		onrejected?: (reason: unknown) => PromiseLike<U> | U,
	): PromiseLike<U>;
}

interface Promise<T> extends PromiseLike<T> {
	/**
	 * Attaches a callback for only the rejection of the Promise.
	 *
	 * @param onrejected - The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of the callback.
	 */
	catch(onrejected?: (reason: unknown) => PromiseLike<T> | T): Promise<T>;

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 *
	 * @param onfulfilled - The callback to execute when the Promise is
	 *   resolved.
	 * @param onrejected - The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then(onfulfilled?: undefined, onrejected?: (reason: unknown) => PromiseLike<T> | T): Promise<T>;

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 *
	 * @param onfulfilled - The callback to execute when the Promise is
	 *   resolved.
	 * @param onrejected - The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then<U>(
		onfulfilled: (value: T) => PromiseLike<U> | U,
		onrejected?: (reason: unknown) => PromiseLike<U> | U,
	): Promise<U>;
}
