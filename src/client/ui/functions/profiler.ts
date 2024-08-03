import type { FunctionComponent } from "@rbxts/react";
import React, { createElement } from "@rbxts/react";

export function profiler<P extends object>(
	name: string,
	render: FunctionComponent<P>,
): FunctionComponent<P> {
	return (props: P) => {
		debug.profilebegin(name);
		const result = render(props);
		debug.profileend();
		return result;
	};
}

function getName(callback: Callback): string {
	const [name = "Component"] = debug.info(callback, "n");
	return name;
}

/**
 * Profiles all components created using React.createElement. This function
 * wraps each component with a profiler to measure its performance. Typically,
 * this function is used for debugging and performance optimization, and should
 * not be used in production.
 */
export function profileAllComponents(): void {
	if (!_G.__PROFILE__) {
		return;
	}

	const profiledComponents = new Map<FunctionComponent, FunctionComponent>();

	// eslint-disable-next-line react/prefer-read-only-props -- We need to modify the props
	React.createElement = ((...args: Parameters<typeof React.createElement>) => {
		const [component] = args;

		if (!typeIs(component, "function")) {
			return createElement(...args);
		}

		let profiledComponent = profiledComponents.get(component);

		if (!profiledComponent) {
			profiledComponent = profiler(getName(component), component);
			profiledComponents.set(component, profiledComponent);
		}

		args[0] = profiledComponent as never;

		return createElement(...args);
	}) as Callback;
}
