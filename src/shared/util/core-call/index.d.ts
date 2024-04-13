/**
 * Safely call core methods because they could be called before registered
 * https://devforum.roblox.com/t/resetbuttoncallback-has-not-been-registered-by-the-corescripts/78470/8.
 *
 * @param method - The core call method to call.
 * @param args - The arguments to pass to the core.
 */
declare function coreCall<T extends InstanceMethodNames<StarterGui>>(
	method: T,
	...args: Parameters<StarterGui[T]>
): void;

export = coreCall;
