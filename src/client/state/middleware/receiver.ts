import { createBroadcastReceiver } from "@rbxts/reflex";
import { Events } from "client/network";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function receiverMiddleware() {
	const receiver = createBroadcastReceiver({
		start: () => {
			Events.start.fire();
		},
	});

	Events.broadcast.connect(actions => {
		receiver.dispatch(actions);
	});

	return receiver.middleware;
}
