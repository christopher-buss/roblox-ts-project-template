import { useLatestCallback } from "@rbxts/pretty-react-hooks";
import type { Binding } from "@rbxts/react";
import { useBinding, useEffect, useMemo } from "@rbxts/react";
import type { Motion, MotionGoal } from "@rbxts/ripple";
import { createMotion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";

export function useMotion<T = number>(
	goal: number,
	mapper?: (value: number) => T,
): LuaTuple<[Binding<T>, Motion]>;

export function useMotion<T extends MotionGoal, U = T>(
	goal: T,
	mapper?: (value: T) => U,
): LuaTuple<[Binding<U>, Motion<T>]>;

/**
 * Creates a memoized Motion object set to the given initial value. Returns a
 * binding that updates with the Motion, along with the Motion object.
 *
 * @param goal - The initial value of the Motion.
 * @param mapper - A function to map the Motion value to a different type.
 * @returns A tuple containing the binding and the Motion object.
 * @see https://github.com/littensy/slither/blob/6540d0fa974c2bc8945a3969968b9a4d267388a6/src/client/hooks/use-motion.ts
 */
export function useMotion<T extends MotionGoal, U = T>(
	goal: T,
	mapper?: (value: T) => U,
): LuaTuple<[Binding<T>, Motion]> | LuaTuple<[Binding<U>, Motion<T>]> {
	const motion = useMemo(() => createMotion(goal), [goal]);

	const get = useLatestCallback(() => {
		const value = motion.get();
		return mapper ? mapper(value) : (value as unknown as U);
	});

	const [binding, setValue] = useBinding(get());

	useEffect(() => {
		setValue(get());
	}, [get, mapper, setValue]);

	useEffect(() => {
		const connection = RunService.Heartbeat.Connect(delta => {
			motion.step(delta);
			setValue(get());
		});

		return () => {
			connection.Disconnect();
			motion.destroy();
		};
	}, [get, motion, setValue]);

	return $tuple(binding, motion);
}
