import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory } from "@rbxts/ui-labs";
import type { ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import type { StoryCreation } from "@rbxts/ui-labs/src/Typing";

export function CreateStory<C extends ReturnControls>(
	render: StoryCreation<{ controls: C }, (typeof React)["createElement"]>,
	controls: C = {} as C,
): ReturnType<typeof CreateReactStory> {
	return CreateReactStory({ controls, react: React, reactRoblox: ReactRoblox }, render);
}
