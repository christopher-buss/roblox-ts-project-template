/* eslint-disable eslint-comments/no-unlimited-disable -- See below. */
/* eslint-disable -- Taken directly from https://www.npmjs.com/package/@rbxts/make due to compiler type mismatch. */
type WritablePropertyNames<T> = {
	readonly [K in keyof T]-?: T[K] extends Callback
		? never
		: (<F>() => F extends { [Q in K]: T[K] } ? 1 : 2) extends <F>() => F extends {
					-readonly [Q in K]: T[K];
			  }
					? 1
					: 2
			? K
			: never;
}[keyof T];

type GetBindableToRBXScriptSignal<T> = {
	[key in {
		[K in keyof T]-?: T[K] extends RBXScriptSignal ? K : never;
	}[keyof T]]: T[key] extends RBXScriptSignal<infer R> ? R : never;
};

type GetPartialObjectWithBindableConnectSlots<T extends Instance> = Partial<
	GetBindableToRBXScriptSignal<T> & Pick<T, WritablePropertyNames<T>>
>;

function Make<
	T extends keyof CreatableInstances,
	Q extends {
		/** The Children to place inside of this Instance. */
		Children?: ReadonlyArray<Instance>;
		Parent?: Instance | undefined;
	} & GetPartialObjectWithBindableConnectSlots<CreatableInstances[T]>,
>(className: T, settings: Q) {
	const { Children: children, Parent: parent } = settings;
	const instance = new Instance(className);

	for (const [setting, value] of pairs(settings as unknown as Map<never, never>)) {
		if (setting !== "Children" && setting !== "Parent") {
			const { [setting]: property } = instance;

			if (typeIs(property, "RBXScriptSignal")) {
				(property as RBXScriptSignal).Connect(value);
			} else {
				instance[setting] = value;
			}
		}
	}

	if (children) {
		for (const child of children) {
			child.Parent = instance;
		}
	}

	instance.Parent = parent;
	return instance as CreatableInstances[T] &
		Reconstruct<
			{
				[G in "ClassName"]: T;
			} & { [O in Extract<"Name", keyof Q>]: Q[O] } & (Q["Children"] extends never
					? never
					: {
								[K in Exclude<
									keyof Q["Children"],
									"length" | keyof ReadonlyArray<any>
								>]: Q["Children"][K] extends infer A
									? A extends { Name: string }
										? string extends A["Name"]
											? never
											: (k: { [P in A["Name"]]: A }) => void
										: never
									: never;
						  }[Exclude<
								keyof Q["Children"],
								"length" | keyof ReadonlyArray<any>
						  >] extends (k: infer U) => void
						? U
						: never)
		>;
}

export = Make;
