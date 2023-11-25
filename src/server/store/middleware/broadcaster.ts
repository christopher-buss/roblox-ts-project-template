import { createBroadcaster } from "@rbxts/reflex";
import { Events } from "server/network";
import { slices } from "shared/store";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function broadcasterMiddleware() {
	const broadcaster = createBroadcaster({
		dispatch: (player, actions) => {
			Events.broadcast.fire(player, actions);
		},
		producers: slices,
	});

	Events.start.connect(player => {
		broadcaster.start(player);
	});

	return broadcaster.middleware;
}
