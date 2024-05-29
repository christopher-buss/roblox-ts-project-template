import type { InstanceProps } from "@rbxts/react";

declare namespace JSX {
	interface IntrinsicElements {
		attachment: InstanceProps<Attachment>;
		blureffect: InstanceProps<BlurEffect>;
		folder: InstanceProps<Folder>;
		highlight: InstanceProps<Highlight>;
		motor6d: InstanceProps<Motor6D>;
		part: InstanceProps<Part>;
		proximityprompt: InstanceProps<ProximityPrompt>;
		rigidconstraint: InstanceProps<RigidConstraint>;
		texture: InstanceProps<Texture>;
		worldmodel: InstanceProps<WorldModel>;
	}
}
