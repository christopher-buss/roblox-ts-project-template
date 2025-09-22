import type { ProducerMiddleware } from "@rbxts/reflex";
import { createBroadcastReceiver } from "@rbxts/reflex";

import { events } from "client/network";
import { $NODE_ENV } from "rbxts-transform-env";
import { IS_EDIT } from "shared/constants";
import { stateSerDes } from "shared/store";

/**
 * A middleware that listens for actions dispatched from the server and
 * dispatches them to the client store.
 *
 * @returns The middleware function.
 */
export function receiverMiddleware(): ProducerMiddleware {
	// Storybook support
	if ($NODE_ENV === "development" && IS_EDIT) {
		return () => (dispatch) => dispatch;
	}

	const receiver = createBroadcastReceiver({
		start: () => {
			events.store.start.fire();
		},
	});

	events.store.dispatch.connect((actions) => {
		receiver.dispatch(actions);
	});

	events.store.hydrate.connect((state) => {
		receiver.hydrate(stateSerDes.deserialize(state.buffer, state.blobs));
	});

	return receiver.middleware;
}
