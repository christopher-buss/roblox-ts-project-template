import React from "@rbxts/react";

import { GAME_NAME } from "shared/constants";

interface Storybook {
	name: string;
	react?: typeof React;
	storyRoots: Array<Instance | undefined>;
}

export = identity<Storybook>({
	name: GAME_NAME,
	react: React,
	storyRoots: [script.Parent],
});
