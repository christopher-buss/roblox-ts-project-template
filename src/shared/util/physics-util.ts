/**
 * Adds the specified object and its descendants to the given collision group.
 * Only objects of type BasePart will be added to the collision group.
 *
 * @param object - The instance to add to the collision group.
 * @param group - The collision group to add the object to.
 * @param trackNewDescendants - Whether to handle future descendants of the
 *   object to the collision group. Defaults to false.
 * @returns A connection that will add any new descendants to the collision
 *   group.
 */
export function addToCollisionGroup(
	object: Instance,
	group: string,
	trackNewDescendants: true,
): () => void;
export function addToCollisionGroup(
	object: Instance,
	group: string,
	trackNewDescendants?: false,
): undefined;
export function addToCollisionGroup(
	object: Instance,
	group: string,
	trackNewDescendants = false,
): (() => void) | undefined {
	if (object.IsA("BasePart")) {
		object.CollisionGroup = group;
	}

	for (const descendant of object.GetDescendants()) {
		if (descendant.IsA("BasePart")) {
			descendant.CollisionGroup = group;
		}
	}

	if (!trackNewDescendants) {
		return undefined;
	}

	const connection = object.DescendantAdded.Connect(descendant => {
		if (descendant.IsA("BasePart")) {
			descendant.CollisionGroup = group;
		}
	});

	return () => {
		connection.Disconnect();
	};
}
