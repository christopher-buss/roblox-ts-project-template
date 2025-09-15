declare namespace SoundSystem {
	export function Attach(soundObject: Sound): void;

	export function Create(
		id: string,
		target: CFrame | Instance | Vector3,
		looped?: boolean,
	): Attachment & { Sound: Sound };
}

export = SoundSystem;
