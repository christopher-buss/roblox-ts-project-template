import type { ProducerMiddleware } from "@rbxts/reflex";

export const profilerMiddleware: ProducerMiddleware = () => {
	return (dispatch, name) => {
		return (...args) => {
			debug.profilebegin(name);
			const result = dispatch(...args);
			debug.profileend();
			return result;
		};
	};
};
