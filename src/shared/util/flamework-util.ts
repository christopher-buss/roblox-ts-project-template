import type { Controller, Service } from "@flamework/core";
import { Flamework, Modding, Reflect } from "@flamework/core";

export const FLAMEWORK_DEFAULT_LOAD_ORDER = 1;

export const FLAMEWORK_DECORATOR_PREFIX = `flamework:decorators.`;

/**
 * Checks if the given object is decorated with a specific identifier.
 *
 * @param id - The identifier to check for.
 * @param object - The object to check.
 * @returns True if the object is decorated with the specified identifier, false
 *   otherwise.
 */
export function isDecoratorOf(id: string, object: object): boolean {
	return Reflect.hasMetadata(object, FLAMEWORK_DECORATOR_PREFIX + id);
}

/**
 * Checks if the given object is a Flamework controller.
 *
 * @param object - The object to check.
 * @returns `true` if the object is a controller, `false` otherwise.
 */
export function isController(object: object): boolean {
	return isDecoratorOf(Flamework.id<typeof Controller>(), object);
}

/**
 * Checks if the given object is a Flamework service.
 *
 * @param object - The object to check.
 * @returns `true` if the object is a service, `false` otherwise.
 */
export function isService(object: object): boolean {
	return isDecoratorOf(Flamework.id<typeof Service>(), object);
}

/**
 * Returns if an `object` is a Flamework singleton (Service or Controller).
 * Useful for shared Flamework modules.
 *
 * @param object - The object to check.
 * @returns `true` if the object is a singleton, `false` otherwise.
 */
export function isSingleton(object: object): boolean {
	return isController(object) || isService(object);
}

export interface ListenerData<T> {
	event: T;
	id: string;
	loadOrder: number;
}

/**
 * Sets up the lifecycle for a given array of listener data.
 *
 * @param lifecycle - The array of listener data.
 * @param specifier - The specifier for the listener. This can be passed through
 *   as a generic.
 * @metadata macro
 */
export function setupLifecycle<T extends defined>(
	lifecycle: Array<ListenerData<T>>,
	specifier?: Modding.Generic<T, "id">,
): void {
	assert(specifier, "[setupLifecycle] Specifier is required");

	Modding.onListenerAdded<T>(object => {
		lifecycle.push({
			id: Reflect.getMetadata(object, "identifier") ?? "flamework:unknown",
			event: object,
			loadOrder:
				Reflect.getMetadata(object, "flamework:loadOrder") ?? FLAMEWORK_DEFAULT_LOAD_ORDER,
		});
	}, specifier);

	lifecycle.sort((a, b) => a.loadOrder > b.loadOrder);
}
