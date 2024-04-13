import type { ProducerMiddleware } from "@rbxts/reflex";
import { createBroadcastReceiver } from "@rbxts/reflex";
import { RunService } from "@rbxts/services";

import { Events } from "client/network";

/**
 * A middleware that listens for actions dispatched from the server and
 * dispatches them to the client store.
 *
 * @returns The middleware function.
 */
export function receiverMiddleware(): ProducerMiddleware {
	// If in edit mode (for storybook support), return a no-op middleware.
	if (RunService.IsStudio() && !RunService.IsRunning()) {
		return () => dispatch => dispatch;
	}

	const receiver = createBroadcastReceiver({
		start: () => {
			Events.store.start.fire();
		},
	});

	Events.store.dispatch.connect(actions => {
		receiver.dispatch(actions);
	});

	Events.store.hydrate.connect(state => {
		receiver.hydrate(state);
	});

	return receiver.middleware;
}
