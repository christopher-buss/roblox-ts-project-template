import type { OnInit, OnStart } from "@flamework/core";
import { Controller } from "@flamework/core";
import inspect from "@rbxts/inspect";
import type { Logger } from "@rbxts/log";
import Make from "@rbxts/make";
import { SoundService, TweenService } from "@rbxts/services";

import { USER_ID } from "client/constants";
import { store } from "client/store";
import SoundSystem from "shared/modules/3d-sound-system";
import type { PlayerSettings } from "shared/store/persistent";
import { selectPlayerSettings } from "shared/store/persistent";

export const enum SoundType {
	Music = "Music",
	SoundEffect = "SoundEffect",
}

interface PlaySoundOptions {
	attachToPoint?: BasePart;
	debugName?: string;
	sound: number;
	soundProperties?: Omit<Partial<InstanceProperties<Sound>>, "Parent">;
	soundType: SoundType;
}

/**
 * A controller for managing sound effects and music in the game. This
 * controller provides a way to play sounds and music with the ability to fade
 * in and out the volume of the sound.
 *
 * ```
 * const sound = soundController.createSound({ ... });.
 * soundController.play(sound);.
 *
 * sound:Destroy(); -- Destroy the sound when you're done with it
 * ```
 */
@Controller({})
export default class SoundController implements OnInit, OnStart {
	private readonly soundGroups = new Map<SoundType, SoundGroup>();

	constructor(private readonly logger: Logger) {}

	/** @ignore */
	public onInit(): void {
		this.soundGroups.set(SoundType.Music, this.makeSoundGroup(SoundType.Music));
		this.soundGroups.set(SoundType.SoundEffect, this.makeSoundGroup(SoundType.SoundEffect));

		this.logger.Info(`Setup SoundGroup instances`);
	}

	/** @ignore */
	public onStart(): void {
		store.subscribe(selectPlayerSettings(USER_ID), current => {
			if (!current) {
				return;
			}

			this.onSettingsChanged(current);
		});
	}

	public createSound({
		attachToPoint,
		debugName,
		sound,
		soundProperties = {},
		soundType,
	}: PlaySoundOptions): Sound {
		const soundGroup = this.soundGroups.get(soundType);
		assert(soundGroup, `SoundGroup not found for SoundType ${soundType}`);

		const soundParent = attachToPoint ?? soundGroup;
		const soundObject = Make("Sound", {
			...soundProperties,
			Name: debugName ?? inspect(sound),
			Parent: soundParent,
			SoundGroup: soundGroup,
			SoundId: `rbxassetid://${sound}`,
		});

		// Make it a 3D spatial sound if a point was declared
		if (attachToPoint) {
			SoundSystem.Attach(soundObject);
		}

		this.logger.Info(`Playing sound ${sound} of type ${soundType}`);

		return soundObject;
	}

	public play(soundObject: Sound, fadeInTime?: number): void {
		soundObject.Play();

		if (fadeInTime !== undefined) {
			this.fadeInSound(soundObject, fadeInTime);
		}
	}

	public fadeInSound(soundObject: Sound, fadeInTime: number): void {
		const desiredVolume = soundObject.Volume;
		soundObject.Volume = 0;

		const tweenInfo = new TweenInfo(
			fadeInTime,
			Enum.EasingStyle.Quad,
			Enum.EasingDirection.Out,
		);

		TweenService.Create(soundObject, tweenInfo, { Volume: desiredVolume }).Play();
	}

	private makeSoundGroup(soundType: SoundType): SoundGroup {
		// Make sure this SoundGroup doesn't already exist
		const existing = SoundService.FindFirstChild(soundType);
		if (existing?.IsA("SoundGroup") === true) {
			return existing;
		}

		return Make("SoundGroup", {
			Name: soundType,
			Parent: SoundService,
			Volume: 1,
		});
	}

	private onSettingsChanged(current: PlayerSettings): void {
		const musicGroup = this.soundGroups.get(SoundType.Music);
		assert(musicGroup, `Music SoundGroup not found`);
		musicGroup.Volume = current.musicVolume;

		const sfxGroup = this.soundGroups.get(SoundType.SoundEffect);
		assert(sfxGroup, `SoundEffect SoundGroup not found`);
		sfxGroup.Volume = current.sfxVolume;
	}
}
